import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const files = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean))];
for (const file of files) assert.ok(!/^docs\/context\//.test(file), `Private context is tracked: ${file}`);

let linkCount = 0;
for (const file of files.filter(file => file.endsWith('.md'))) {
  const text = readFileSync(file, 'utf8');
  assert.ok(!text.includes('\uFFFD'), `Invalid text encoding: ${file}`);
  assert.equal((text.match(/^```/gm) ?? []).length % 2, 0, `Unbalanced code fences: ${file}`);
  for (const match of text.matchAll(/\[[^\]\n]+\]\(([^)\n]+)\)/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const destination = path.resolve(path.dirname(file), decodeURIComponent(target.split('#')[0]));
    const relative = path.relative(root, destination).replaceAll('\\', '/');
    assert.ok(!relative.startsWith('../') && !path.isAbsolute(relative), `Link escapes repository: ${file}: ${target}`);
    assert.ok(!relative.startsWith('docs/context/'), `Public link targets private context: ${file}: ${target}`);
    assert.ok(existsSync(destination), `Broken link: ${file}: ${target}`);
    linkCount++;
  }
}

const prd = readFileSync('docs/requirements/PRD.md', 'utf8');
const srs = readFileSync('docs/requirements/SRS.md', 'utf8');
const idPattern = /^\|\s*((?:TMP|ABU|MSG|MED|ADM|WEB|MOB|DEP|NFR)-\d+)\s*\|/gm;
const sourceIds = [...prd.matchAll(idPattern)].map(match => match[1]);
const targetIds = [...srs.matchAll(idPattern)].map(match => match[1]);
assert.equal(new Set(targetIds).size, targetIds.length, 'Duplicate SRS requirement table row');
assert.deepEqual([...targetIds].sort(), [...sourceIds].sort(), 'PRD/SRS coverage differs');
for (const match of prd.matchAll(/^\|\s*((?:TMP|ABU|MSG|MED|ADM|WEB|MOB|DEP)-\d+)\s*\|[^\r\n]*?\|\s*(P[012])\s*\|\s*$/gm)) {
  assert.ok(new RegExp(`^\\|\\s*${match[1]}\\s*\\|\\s*${match[2]}\\s*\\|`, 'm').test(srs), `Priority changed: ${match[1]}`);
}

const ignored = ['.env', 'apps/web/.env.production', 'docs/context/SIRR_CODEX_CONTEXT.md', 'docs/context/PROJECT_REVIEW.md', 'secrets/admin.key', 'backups/prod.dump', 'data/postgres/PG_VERSION', 'uploads/user.pdf', '.codex/config.toml', '.aws/credentials', 'android/release.keystore', 'apps/web/node_modules/package/index.js', 'playwright-report/index.html', 'compose.override.yml'];
const publicFiles = ['.env.example', 'compose.dev.yml', '.dockerignore', '.github/ISSUE_TEMPLATE/story.yml', '.github/workflows/tooling.yml', 'docs/requirements/PRD.md', 'docs/architecture/SAD.md', 'docs/planning/DECISIONS.md', 'apps/server/migrations/001-init.sql', 'pnpm-lock.yaml', 'AGENTS.md', 'tests/fixtures/synthetic-message.json'];
const candidates = [...ignored, ...publicFiles];
const check = spawnSync('git', ['check-ignore', '--no-index', '--stdin', '-z'], { input: `${candidates.join('\0')}\0`, encoding: 'utf8' });
assert.ok(check.status === 0 || check.status === 1, check.stderr);
const excluded = new Set(check.stdout.split('\0').filter(Boolean));
for (const file of ignored) assert.ok(excluded.has(file), `Sensitive/generated path not ignored: ${file}`);
for (const file of publicFiles) assert.ok(!excluded.has(file), `Intended source file ignored: ${file}`);

const manifest = JSON.parse(readFileSync('docs/planning/github-project.json', 'utf8'));
const labels = new Set(manifest.labels.map(label => label.name));
for (const file of files.filter(file => /^\.github\/ISSUE_TEMPLATE\/[^/]+\.yml$/.test(file) && !file.endsWith('/config.yml'))) {
  const text = readFileSync(file, 'utf8');
  const ids = [...text.matchAll(/^\s+id:\s*(\S+)/gm)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate issue-form input ID: ${file}`);
  for (const label of text.match(/^labels:\s*\[([^\]]+)\]/m)?.[1].matchAll(/"([^"]+)"/g) ?? []) assert.ok(labels.has(label[1]), `Unconfigured issue label: ${label[1]}`);
}

console.log(`PASS: ${sourceIds.length} requirement IDs/priorities; ${linkCount} local links; ${ignored.length + publicFiles.length} ignore cases; public-context boundary and issue form references.`);
console.log('These static checks do not scan arbitrary source for secrets or validate application security, complete YAML schemas or live GitHub APIs.');
