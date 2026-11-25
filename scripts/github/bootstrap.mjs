import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const manifestUrl = new URL('../../docs/planning/github-project.json', import.meta.url);
const fieldFragment = `... on ProjectV2Field { id name dataType }
  ... on ProjectV2SingleSelectField { id name dataType options { id name } }`;

export function validateManifest(manifest) {
  assert.equal(manifest.schemaVersion, 1, 'Unsupported manifest version');
  assert.equal(manifest.repository, `${manifest.owner}/sirr`, 'Unexpected repository');
  assert.equal(manifest.owner, 'samirajaj', 'Review code before changing the account boundary');
  assert.equal(manifest.project.visibility, 'PUBLIC');
  assert.ok(manifest.project.title.trim());
  for (const [items, key] of [[manifest.labels, 'name'], [manifest.milestones, 'title'], [manifest.project.fields, 'name'], [manifest.issues, 'key']]) {
    assert.equal(new Set(items.map(item => item[key])).size, items.length, `Duplicate ${key}`);
  }
  const fields = new Map(manifest.project.fields.map(field => [field.name, field]));
  for (const required of ['Status', 'Priority', 'Component', 'Effort', 'Epic']) assert.ok(fields.has(required));
  assert.equal(fields.get('Epic').type, 'TEXT');
  for (const name of ['Status', 'Priority', 'Component', 'Effort']) {
    assert.equal(fields.get(name).type, 'SINGLE_SELECT');
    const options = fields.get(name).options;
    assert.ok(options?.length);
    assert.equal(new Set(options).size, options.length, `Duplicate options in ${name}`);
  }
  for (const status of ['Backlog', 'Ready', 'In Progress', 'In Review', 'Testing', 'Done']) assert.ok(fields.get('Status').options.includes(status));
  const labels = new Set(manifest.labels.map(label => label.name));
  for (const label of manifest.labels) {
    assert.match(label.color, /^[0-9A-Fa-f]{6}$/);
    assert.ok(label.description.length <= 100);
  }
  const milestones = new Set(manifest.milestones.map(item => item.title));
  const seen = new Map();
  for (const item of manifest.issues) {
    assert.match(item.key, /^(EP|TASK|SPIKE|US)-\d+$/);
    assert.ok(['epic', 'task', 'spike', 'story', 'decision', 'bug'].includes(item.kind));
    for (const [field, value] of [['Priority', item.priority], ['Component', item.component], ['Effort', item.effort]]) assert.ok(fields.get(field).options.includes(value), `${item.key}: invalid ${field}`);
    assert.ok(milestones.has(item.milestone), `${item.key}: unknown milestone`);
    assert.ok(item.title?.trim() && item.summary?.trim() && item.scope?.trim());
    assert.ok(item.acceptance?.length >= 2, `${item.key}: missing acceptance criteria`);
    assert.ok(item.requirements?.length);
    for (const id of item.requirements) assert.match(id, /^(TMP|ABU|MSG|MED|ADM|WEB|MOB|DEP|NFR|DEC)-\d+$/);
    for (const dependency of item.dependsOn) assert.ok(seen.has(dependency), `${item.key}: dependency ${dependency} must precede it; forward links/cycles are forbidden`);
    if (item.epic) assert.equal(seen.get(item.epic)?.kind, 'epic', `${item.key}: unknown epic`);
    for (const name of issueLabels(item)) assert.ok(labels.has(name), `${item.key}: missing label ${name}`);
    seen.set(item.key, item);
  }
  return manifest;
}

export function issueLabels(item) {
  return [`type:${item.kind}`, `priority:${item.priority.toLowerCase()}`, `area:${item.component.toLowerCase()}`];
}

export function marker(key) { return `<!-- sirr-backlog:${key} -->`; }

export function issueBody(item, knownIssues = new Map()) {
  const ref = key => knownIssues.has(key) ? `#${knownIssues.get(key).number} (${key})` : key;
  return `${marker(item.key)}
## Outcome

${item.summary}

## Scope and exclusions

${item.scope}

## Acceptance criteria

${item.acceptance.map(text => `- [ ] ${text}`).join('\n')}

## Traceability and dependencies

- Requirements/decisions: ${item.requirements.join(', ')}
- Epic: ${item.epic ? ref(item.epic) : `${item.key} (this epic)`}
- Depends on: ${item.dependsOn.length ? item.dependsOn.map(ref).join(', ') : 'None recorded; review before Ready.'}
- Priority: ${item.priority}; milestone: ${item.milestone}; proposed effort: ${item.effort}
- Sources: \`docs/requirements/SRS.md\`, \`docs/planning/DECISIONS.md\`, \`docs/planning/ROADMAP.md\` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.
`;
}

export function renderBacklog(manifest) {
  return `# Sirr Initial Community Backlog

Generated from [github-project.json](github-project.json). Review the manifest before running the owner-only [GitHub setup](../community/GITHUB_SETUP.md). These ${manifest.issues.length} items are prepared locally, not created or completed remotely. Stable keys are not GitHub issue numbers. This is an initial planning/feasibility backlog with representative future stories, not a complete implementation decomposition.

All items start in Backlog. Effort is provisional; no due dates or calendar estimates are assigned. Existing community issue content/status is preserved when setup is rerun.

| Key | Kind | Title | Milestone | Dependencies |
|---|---|---|---|---|
${manifest.issues.map(item => `| ${item.key} | ${item.kind} | ${item.title} | ${item.milestone} | ${item.dependsOn.join(', ') || 'None'} |`).join('\n')}

${manifest.issues.map(item => `## ${item.key} ${item.title}\n\n${issueBody(item)}`).join('\n')}`;
}

export function applyManifest(manifest, api, log = console.log) {
  validateManifest(manifest);
  // Read and validate identity, target and existing resources before the first mutation.
  const identity = api.identity();
  assert.equal(identity.login, manifest.owner, `Authenticate as ${manifest.owner}; no writes performed`);
  const repository = api.repository(manifest.repository);
  assert.equal(repository.full_name, manifest.repository);
  assert.equal(repository.archived, false, 'Repository is archived');
  assert.ok(repository.permissions?.push || repository.permissions?.admin, 'Repository write permission required');
  const projects = api.projects(manifest.owner).filter(project => project.title === manifest.project.title);
  assert.ok(projects.length <= 1, 'Multiple matching projects; resolve ambiguity before continuing');
  let project = projects[0];
  if (project) {
    assert.equal(project.closed, false, 'Matching project is closed');
    assert.equal(project.public, true, 'Existing project is private; visibility is never changed automatically');
  }
  const existingIssues = api.issues(manifest.repository);
  const known = new Map();
  for (const item of manifest.issues) {
    const matches = existingIssues.filter(issue => !issue.pull_request && issue.body?.includes(marker(item.key)));
    assert.ok(matches.length <= 1, `Duplicate issue marker ${item.key}; resolve before writes`);
    if (matches[0]) {
      assert.equal(matches[0].user?.login, manifest.owner, `Marker ${item.key} is not on an owner-created issue; inspect before reuse`);
      assert.ok(matches[0].title.startsWith(`[${item.key}] `), `Unexpected title for ${item.key}; inspect before reuse`);
      known.set(item.key, matches[0]);
    }
  }
  const labels = new Set(api.labels(manifest.repository).map(label => label.name));
  const milestones = new Map(api.milestones(manifest.repository).map(item => [item.title, item]));
  const wasCreated = !project;
  let fields = project ? api.fields(project.id) : [];
  validateExistingFields(manifest, fields);

  if (!project) {
    project = api.createProject(identity.node_id, repository.node_id, manifest.project.title);
    api.publishProject(project.id);
    fields = api.fields(project.id);
  }
  for (const desired of manifest.project.fields) {
    let field = fields.find(candidate => candidate.name === desired.name);
    if (field && wasCreated && desired.name === 'Status') {
      api.initializeStatus(field.id, desired.options);
    } else if (!field) {
      api.createField(project.id, desired);
    }
  }
  fields = api.fields(project.id);
  validateExistingFields(manifest, fields);
  for (const desired of manifest.project.fields) assert.ok(fields.some(field => field.name === desired.name), `Field creation not confirmed: ${desired.name}`);
  for (const desired of manifest.labels) if (!labels.has(desired.name)) api.createLabel(manifest.repository, desired);
  for (const desired of manifest.milestones) if (!milestones.has(desired.title)) milestones.set(desired.title, api.createMilestone(manifest.repository, desired));
  const items = new Map(api.items(project.id).filter(item => item.content?.repository?.nameWithOwner === manifest.repository).map(item => [item.content.number, item]));
  for (const item of manifest.issues) {
    let issue = known.get(item.key);
    if (!issue) {
      issue = api.createIssue(manifest.repository, {
        title: `[${item.key}] ${item.title}`, body: issueBody(item, known),
        labels: issueLabels(item), milestone: milestones.get(item.milestone).number,
      });
      known.set(item.key, issue);
      log(`Created ${item.key}: ${issue.html_url}`);
    } else {
      log(`Reused ${item.key}: ${issue.html_url}; body/state/labels/milestone preserved`);
    }
    if (!items.has(issue.number)) {
      const added = api.addItem(project.id, issue.node_id);
      // A new board item gets defaults. Existing board items are never reset on reruns.
      const values = { Status: issue.state === 'closed' ? 'Done' : 'Backlog', Priority: item.priority, Component: item.component, Effort: item.effort, Epic: item.epic ?? item.key };
      for (const [name, value] of Object.entries(values)) {
        const field = fields.find(candidate => candidate.name === name);
        const encoded = field.dataType === 'TEXT' ? { text: value } : { singleSelectOptionId: field.options.find(option => option.name === value).id };
        api.setField(project.id, added.id, field.id, encoded);
      }
      items.set(issue.number, added);
    }
  }
  log(`Project: ${project.url}`);
  log('Views, workflows, native sub-issue links and repository rules remain owner configuration; see the setup guide.');
  return { project, issues: known };
}

function validateExistingFields(manifest, fields) {
  for (const desired of manifest.project.fields) {
    const matches = fields.filter(field => field.name === desired.name);
    assert.ok(matches.length <= 1, `Ambiguous field ${desired.name}`);
    if (!matches.length) continue;
    const field = matches[0];
    assert.equal(field.dataType, desired.type, `Wrong field type: ${desired.name}`);
    if (desired.type === 'SINGLE_SELECT') {
      const available = new Set(field.options.map(option => option.name));
      for (const option of desired.options) assert.ok(available.has(option), `Existing ${desired.name} lacks '${option}'; edit options manually and rerun. Existing fields are never overwritten.`);
    }
  }
}

export class GitHubCli {
  run(args, input) {
    try {
      const output = execFileSync('gh', ['api', '--hostname', 'github.com', ...args], {
        input: input === undefined ? undefined : JSON.stringify(input), encoding: 'utf8',
        maxBuffer: 32 * 1024 * 1024, windowsHide: true,
        env: { ...process.env, GH_DEBUG: '', GH_PROMPT_DISABLED: '1', GH_PAGER: 'cat' },
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return JSON.parse(output);
    } catch (error) {
      if (error.code === 'ENOENT') throw new Error('GitHub CLI (gh) is not installed. Dry-run needs only Node.js.');
      throw new Error(`GitHub CLI failed for ${args[0]}. Check account, permissions/scopes and network. Setup may be partial; rerun after inspection. ${String(error.stderr ?? '').trim()}`);
    }
  }
  rest(path, method, body) { return this.run([path, '--method', method, '--input', '-'], body); }
  list(path) { return this.run([path, '--paginate', '--slurp']).flat(); }
  graphql(query, variables) {
    const result = this.rest('graphql', 'POST', { query, variables });
    assert.ok(!result.errors?.length, JSON.stringify(result.errors));
    return result.data;
  }
  page(query, variables, connection) {
    const nodes = [];
    let after = null;
    do {
      const data = connection(this.graphql(query, { ...variables, after }));
      nodes.push(...data.nodes.filter(Boolean));
      if (!data.pageInfo.hasNextPage) break;
      assert.ok(data.pageInfo.endCursor && data.pageInfo.endCursor !== after, 'Invalid pagination cursor');
      after = data.pageInfo.endCursor;
    } while (true);
    return nodes;
  }
  identity() { return this.run(['user']); }
  repository(repo) { return this.run([`repos/${repo}`]); }
  projects(owner) {
    return this.page(`query($owner:String!,$after:String){user(login:$owner){projectsV2(first:100,after:$after){nodes{id title number url public closed} pageInfo{hasNextPage endCursor}}}}`, { owner }, data => data.user.projectsV2);
  }
  issues(repo) { return this.list(`repos/${repo}/issues?state=all&per_page=100`); }
  labels(repo) { return this.list(`repos/${repo}/labels?per_page=100`); }
  milestones(repo) { return this.list(`repos/${repo}/milestones?state=all&per_page=100`); }
  fields(id) {
    return this.page(`query($id:ID!,$after:String){node(id:$id){... on ProjectV2{fields(first:100,after:$after){nodes{${fieldFragment}} pageInfo{hasNextPage endCursor}}}}}`, { id }, data => data.node.fields);
  }
  items(id) {
    return this.page(`query($id:ID!,$after:String){node(id:$id){... on ProjectV2{items(first:100,after:$after){nodes{id content{... on Issue{number repository{nameWithOwner}}}} pageInfo{hasNextPage endCursor}}}}}`, { id }, data => data.node.items);
  }
  createProject(owner, repo, title) {
    return this.graphql(`mutation($owner:ID!,$repo:ID!,$title:String!){createProjectV2(input:{ownerId:$owner,repositoryId:$repo,title:$title}){projectV2{id title number url}}}`, { owner, repo, title }).createProjectV2.projectV2;
  }
  publishProject(id) { this.graphql(`mutation($id:ID!){updateProjectV2(input:{projectId:$id,public:true}){projectV2{id}}}`, { id }); }
  initializeStatus(id, options) {
    this.graphql(`mutation($id:ID!,$options:[ProjectV2SingleSelectFieldOptionInput!]!){updateProjectV2Field(input:{fieldId:$id,singleSelectOptions:$options}){projectV2Field{${fieldFragment}}}}`, { id, options: options.map(name => ({ name, color: name === 'Done' ? 'GREEN' : 'GRAY', description: `${name} workflow state` })) });
  }
  createField(project, field) {
    const options = field.options?.map(name => ({ name, color: 'GRAY', description: `${field.name}: ${name}` }));
    this.graphql(`mutation($project:ID!,$name:String!,$type:ProjectV2CustomFieldType!,$options:[ProjectV2SingleSelectFieldOptionInput!]){createProjectV2Field(input:{projectId:$project,name:$name,dataType:$type,singleSelectOptions:$options}){projectV2Field{${fieldFragment}}}}`, { project, name: field.name, type: field.type, options: options ?? null });
  }
  createLabel(repo, label) { return this.rest(`repos/${repo}/labels`, 'POST', label); }
  createMilestone(repo, milestone) { return this.rest(`repos/${repo}/milestones`, 'POST', milestone); }
  createIssue(repo, issue) { return this.rest(`repos/${repo}/issues`, 'POST', issue); }
  addItem(project, content) { return this.graphql(`mutation($project:ID!,$content:ID!){addProjectV2ItemById(input:{projectId:$project,contentId:$content}){item{id}}}`, { project, content }).addProjectV2ItemById.item; }
  setField(project, item, field, value) {
    this.graphql(`mutation($project:ID!,$item:ID!,$field:ID!,$value:ProjectV2FieldValue!){updateProjectV2ItemFieldValue(input:{projectId:$project,itemId:$item,fieldId:$field,value:$value}){projectV2Item{id}}}`, { project, item, field, value });
  }
}

function main() {
  const options = process.argv.slice(2);
  assert.ok(options.length <= 1 && options.every(option => ['--dry-run', '--apply', '--render-backlog'].includes(option)), 'Use --dry-run (default), --render-backlog, or --apply');
  const manifest = validateManifest(JSON.parse(readFileSync(manifestUrl, 'utf8')));
  if (options.includes('--apply')) return applyManifest(manifest, new GitHubCli());
  if (options.includes('--render-backlog')) {
    writeFileSync(new URL('../../docs/planning/BACKLOG.md', import.meta.url), renderBacklog(manifest));
    console.log('Rendered docs/planning/BACKLOG.md; no network or GitHub writes.');
    return;
  }
  console.log(`DRY RUN — no authentication, network requests or GitHub writes\nRepository: ${manifest.repository}\nProject: ${manifest.project.title} (${manifest.project.visibility})\nLabels: ${manifest.labels.length}; milestones: ${manifest.milestones.length}; fields: ${manifest.project.fields.length}; issues: ${manifest.issues.length}`);
  for (const item of manifest.issues) console.log(`${item.key} [${item.kind}/${item.priority}] ${item.title} -> ${item.milestone}`);
  console.log('Review the manifest and setup guide. Only --apply performs remote mutations using your own gh login.');
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
