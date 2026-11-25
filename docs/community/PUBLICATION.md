# Public Repository and Private Files

Sirr publishes product requirements, architecture, source code, tests, deployment definitions and contribution guidance. Private conversation context, credentials and real runtime data stay outside the public repository.

## Publication boundaries

| Publish after review | Keep private or generated |
|---|---|
| PRD, SRS, SAD, roadmap, public decisions and threat model | `docs/context/`, conversation transcripts and local environment inventories |
| `.env.example` with names and harmless placeholders | `.env`, `.env.*` containing actual configuration or credentials |
| Dockerfiles, Compose, `.dockerignore`, deployment instructions | Runtime volumes, real database/media data, `data/`, `storage/`, `uploads/`, `backups/` |
| Source migrations, synthetic test fixtures and non-sensitive examples | Database dumps, real user exports, recordings, screenshots of private chats and debug traces |
| Dependency manifests and lockfiles | `node_modules`, compiled output, caches and test reports |
| Public protocol/key formats and security documentation | TLS/private signing keys, APK signing stores, recovery material, SMTP passwords and API tokens |
| Repository contribution/configuration rules and shared `AGENTS.md` if intentionally authored | Personal `.codex/`, editor state, credential files and machine-specific overrides |

Real runtime data must never be repurposed as public fixtures. Keep migrations trackable: this repository deliberately does not ignore every `*.sql`, `*.json`, archive or media file because those extensions can contain legitimate source/test assets. Review actual content before staging.

The public [decision register](../planning/DECISIONS.md) replaces links to private handoffs. Excluding the context directory does not remove requirements; approved product decisions remain public.

## Review before staging

Run `git status --short --untracked-files=all`, inspect `git diff`, stage specific paths, then inspect `git diff --cached` and `git diff --cached --name-only`. Verify exceptions using `git check-ignore -v <path>` without printing secret contents. Never use `git add -f` to bypass an ignore rule without understanding why the file is private.

`.gitignore` affects untracked files; it does not remove files already tracked or published. `.dockerignore` is separate and prevents excluded files from entering a future Docker build context. Neither scans arbitrary source files for secrets or guarantees their absence. Review generated artifacts and build outputs too.

If a secret was published, revoke/rotate it first. Removing its current file is insufficient because history, forks, caches or logs may retain it. Plan history cleanup explicitly; do not rewrite shared history automatically. Public security design is valuable; live secrets and private vulnerability reports are not public documentation.

Reference: [Git ignore rules](https://git-scm.com/docs/gitignore), [Docker build context exclusions](https://docs.docker.com/build/concepts/context/#dockerignore-files).
