import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { applyManifest, GitHubCli, manifestUrl, marker, renderBacklog, validateManifest } from './bootstrap.mjs';

const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'));

class FakeGitHub {
  constructor() {
    this.login = manifest.owner;
    this.canWrite = true;
    this.projectList = [];
    this.fieldList = [];
    this.issueList = [];
    this.labelList = [];
    this.milestoneList = [];
    this.itemList = [];
    this.writes = [];
  }
  record(action) { this.writes.push(action); }
  identity() { return { login: this.login, node_id: 'owner' }; }
  repository() { return { full_name: manifest.repository, archived: false, node_id: 'repo', permissions: { push: this.canWrite } }; }
  projects() { return structuredClone(this.projectList); }
  issues() { return structuredClone(this.issueList); }
  labels() { return structuredClone(this.labelList); }
  milestones() { return structuredClone(this.milestoneList); }
  fields() { return structuredClone(this.fieldList); }
  items() { return structuredClone(this.itemList); }
  createProject() {
    this.record('project');
    this.projectList.push({ id: 'project', title: manifest.project.title, public: false, closed: false, url: 'https://example.invalid/project' });
    this.fieldList.push(this.field({ name: 'Status', type: 'SINGLE_SELECT', options: ['Todo', 'In Progress', 'Done'] }));
    return structuredClone(this.projectList[0]);
  }
  publishProject() { this.record('publish'); this.projectList[0].public = true; }
  field(desired) { return { id: `field:${desired.name}`, name: desired.name, dataType: desired.type, options: desired.options?.map(name => ({ id: `option:${desired.name}:${name}`, name })) }; }
  initializeStatus(id, options) { this.record('status'); this.fieldList[0] = this.field({ name: 'Status', type: 'SINGLE_SELECT', options }); }
  createField(project, desired) { this.record(`field:${desired.name}`); this.fieldList.push(this.field(desired)); }
  createLabel(repo, label) { this.record(`label:${label.name}`); this.labelList.push(structuredClone(label)); }
  createMilestone(repo, desired) {
    this.record(`milestone:${desired.title}`);
    const created = { ...desired, number: this.milestoneList.length + 1 };
    this.milestoneList.push(created);
    return created;
  }
  createIssue(repo, desired) {
    this.record(`issue:${desired.title}`);
    const number = this.issueList.length + 1;
    const issue = { ...desired, number, node_id: `issue:${number}`, html_url: `https://example.invalid/issues/${number}`, state: 'open', user: { login: manifest.owner } };
    this.issueList.push(issue);
    if (this.failAfterCreate) { this.failAfterCreate = false; throw new Error('Simulated lost response after remote issue creation'); }
    return structuredClone(issue);
  }
  addItem(project, content) {
    this.record(`item:${content}`);
    const issue = this.issueList.find(candidate => candidate.node_id === content);
    const item = { id: `item:${issue.number}`, content: { number: issue.number, repository: { nameWithOwner: manifest.repository } }, values: {} };
    this.itemList.push(item);
    return structuredClone(item);
  }
  setField(project, item, field, value) { this.record(`value:${item}:${field}`); this.itemList.find(candidate => candidate.id === item).values[field] = structuredClone(value); }
}

test('manifest has valid references, topological dependency order and acceptance criteria', () => {
  validateManifest(manifest);
  const sources = readFileSync(new URL('../../docs/requirements/PRD.md', import.meta.url), 'utf8') + readFileSync(new URL('../../docs/planning/DECISIONS.md', import.meta.url), 'utf8');
  for (const issue of manifest.issues) for (const id of issue.requirements) assert.ok(sources.includes(id), `${issue.key}: unknown ${id}`);
});

test('refuses duplicate keys and forward/cyclic dependencies', () => {
  const duplicate = structuredClone(manifest);
  duplicate.issues.push(duplicate.issues[0]);
  assert.throws(() => validateManifest(duplicate), /Duplicate/);
  const cyclic = structuredClone(manifest);
  cyclic.issues[0].dependsOn = [cyclic.issues.at(-1).key];
  assert.throws(() => validateManifest(cyclic), /must precede/);
});

test('dry-run works without gh, credentials or network and renders no remote result claims', () => {
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('bootstrap.mjs', import.meta.url)), '--dry-run'], { encoding: 'utf8', env: { ...process.env, PATH: '', GH_HOST: 'invalid.example', GH_TOKEN: '' } });
  assert.match(output, /no authentication, network requests or GitHub writes/);
  assert.match(output, /issues: 28/);
});

test('wrong account and missing repository write permission cause zero mutations', () => {
  for (const property of ['login', 'canWrite']) {
    const api = new FakeGitHub();
    api[property] = property === 'login' ? 'another-account' : false;
    assert.throws(() => applyManifest(manifest, api, () => {}));
    assert.equal(api.writes.length, 0);
  }
});

test('fresh setup creates one board, links dependencies and rerun preserves community edits and statuses', () => {
  const api = new FakeGitHub();
  applyManifest(manifest, api, () => {});
  assert.equal(api.projectList.length, 1);
  assert.equal(api.issueList.length, manifest.issues.length);
  assert.equal(api.itemList.length, manifest.issues.length);
  const task = api.issueList.find(issue => issue.body.includes(marker('TASK-002')));
  const dependency = api.issueList.find(issue => issue.body.includes(marker('TASK-001')));
  assert.ok(task.body.includes(`#${dependency.number} (TASK-001)`));
  api.issueList[0].body += '\nCommunity clarification.';
  api.issueList[0].state = 'closed';
  api.itemList[0].values['field:Status'] = { singleSelectOptionId: 'custom-in-progress' };
  const before = structuredClone({ issues: api.issueList, items: api.itemList });
  api.writes = [];
  applyManifest(manifest, api, () => {});
  assert.deepEqual(api.writes, []);
  assert.deepEqual({ issues: api.issueList, items: api.itemList }, before);
});

test('retry after lost issue-create response reuses issue instead of duplicating it', () => {
  const api = new FakeGitHub();
  api.failAfterCreate = true;
  assert.throws(() => applyManifest(manifest, api, () => {}), /lost response/);
  applyManifest(manifest, api, () => {});
  assert.equal(api.issueList.length, manifest.issues.length);
  assert.equal(api.issueList.filter(issue => issue.body.includes(marker('EP-20'))).length, 1);
});

test('private existing boards, ambiguous issues and foreign markers refuse writes', () => {
  const privateApi = new FakeGitHub();
  privateApi.projectList = [{ title: manifest.project.title, public: false, closed: false }];
  assert.throws(() => applyManifest(manifest, privateApi, () => {}), /private/);
  assert.equal(privateApi.writes.length, 0);
  const duplicateApi = new FakeGitHub();
  const issue = { title: '[EP-20] Example', body: marker('EP-20'), user: { login: manifest.owner } };
  duplicateApi.issueList = [issue, structuredClone(issue)];
  assert.throws(() => applyManifest(manifest, duplicateApi, () => {}), /Duplicate issue marker/);
  assert.equal(duplicateApi.writes.length, 0);
  duplicateApi.issueList = [{ ...issue, user: { login: 'unrelated-user' } }];
  assert.throws(() => applyManifest(manifest, duplicateApi, () => {}), /owner-created/);
  assert.equal(duplicateApi.writes.length, 0);
});

test('existing incompatible field options are never overwritten', () => {
  const api = new FakeGitHub();
  applyManifest(manifest, api, () => {});
  api.fieldList.find(field => field.name === 'Priority').options = [];
  api.writes = [];
  assert.throws(() => applyManifest(manifest, api, () => {}), /lacks/);
  assert.deepEqual(api.writes, []);
});

test('rendered backlog stays synchronized with the reviewed manifest', () => {
  const expected = renderBacklog(manifest);
  assert.match(expected, /prepared locally, not created/);
  const actual = readFileSync(new URL('../../docs/planning/BACKLOG.md', import.meta.url), 'utf8');
  assert.equal(actual.replaceAll('\r\n', '\n'), expected);
});

test('field creation uses the current documented custom-field enum and structured variables', () => {
  const api = new GitHubCli();
  const requests = [];
  api.graphql = (query, variables) => { requests.push({ query, variables }); return {}; };
  api.createField('project', { name: 'Epic', type: 'TEXT' });
  api.createField('project', { name: 'Priority', type: 'SINGLE_SELECT', options: ['P0', 'P1', 'P2'] });
  assert.match(requests[0].query, /\$type:ProjectV2CustomFieldType!/);
  assert.equal(requests[0].variables.options, null);
  assert.deepEqual(requests[1].variables.options.map(option => option.name), ['P0', 'P1', 'P2']);
});
