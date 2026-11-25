# Sirr Contribution and Delivery Workflow

This is the initial maintainer workflow for a growing open-source community. Start with one GitHub Project, focused issues and short-lived branches. The board records work; PRD/SRS and accepted decisions define behavior. Do not add workflow complexity merely to imitate a larger team.

## Work hierarchy

| Work kind | Purpose and required content |
|---|---|
| Epic | Coherent outcome spanning multiple stories/tasks; scope, exclusions, requirement IDs and completion gate. |
| User story | Observable user outcome: “As a …, I want …, so that …”; acceptance scenarios, failure/privacy cases and dependencies. |
| Task | Concrete technical/documentation deliverable with context, bounded scope, output and verification. Do not force infrastructure work into a fictional user story. |
| Spike | Time/budget-bounded question; experiments, evidence and decision output. A spike is not permission to ship its prototype. |
| Decision | Alternatives, constraints, consequences and decision owner/status, leading to an ADR when architectural. |
| Bug | Expected/actual behavior, reproducible steps, affected version/environment and sanitized evidence. |

PRD priority P0 means required for initial web release; it does not mean every P0 issue is immediately Ready. P1/P2 retain their product meaning. Use the `blocked` label plus explicit dependencies for impediments. Only use `good first issue` for a small approved task with sufficient guidance, not cryptographic design.

## Project layout

Use **Sirr — Development**, linked to `samirajaj/sirr`. Proposed public views: Board grouped by Status, Backlog table, Milestone table and Security/Decisions table. Views and built-in automations require owner setup; the bootstrap script does not claim to create UI views.

| Field | Values or source |
|---|---|
| Status | Backlog, Ready, In Progress, In Review, Testing, Done |
| Priority | P0, P1, P2 |
| Component | Docs, Community, Security, Infrastructure, Ephemeral, Auth, Messaging, Media, Web, Mobile |
| Effort | XS, S, M, L, XL; relative size only, not delivery promises |
| Epic | Stable epic key; use issue references for the canonical relationship |
| Milestone | Native issue milestone: Planning and PRD M0–M6 |
| Dependencies / acceptance | Canonical issue body, with real issue links after creation |

Begin all prepared items in Backlog. Move to Ready only when scope/acceptance are reviewed, blocking decisions and dependencies are resolved, and a contributor can begin without guessing critical requirements. A decision/spike can be Ready while the feature it informs is blocked.

`In Progress` means someone is actively working; `In Review` has a reviewable PR or document; `Testing` awaits applicable acceptance evidence; `Done` meets the definition below. Documentation-only items may move directly from review to Done after their checks. An epic is Done when its accepted child scope/gate is complete. Do not automatically mark a security epic Done when one PR merges.

## User stories and tasks

Illustrative story, not a claim that the feature exists:

> As a provisioned user, I want to record and preview a voice message in my administrator conversation so that I can explain something without typing.

Acceptance: a supported browser records with permission, displays duration, stops/previews/sends, and the administrator can decrypt/play/pause/seek. Permission denial has localized feedback; cancellation uploads nothing; unsupported format and size limits have defined outcomes. Trace to MED-01/02/03 and MSG-04/05. Depend on approved device keys, media format and authorized attachment storage.

Each task states the concrete deliverable and evidence. Example: compare candidate encryption protocols against DEC-01/02, record library/version/license/support findings, document unresolved questions, and produce a proposed ADR. “Implement security” is not an actionable task.

## Branch names

Use `<type>/<issue-number>-<short-kebab-case-description>` once an issue exists. Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, `spike`. Examples with illustrative numbers: `docs/42-define-key-recovery`, `build/51-add-dev-compose`, `fix/63-reject-expired-room-sends`.

Before issue numbers exist, a short description such as `docs/prepare-community-workflow` is acceptable. Do not invent issue numbers, put names/secrets into branch names, or create permanent branches per feature. Branch from current `main`; use forks for external contributors. Branch creation and commits remain actions, not consequences of merely writing this policy.

## Commit messages and pull requests

Use `<type>(<optional-scope>): <imperative description>` in English. Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `build`, `chore`, `perf`, `revert`. Example: `build(docker): add local development dependencies`.

Describe why/impact in the body when needed. Reference actual issues using `Refs #42`; use `Closes #42` only when the change satisfies that issue's acceptance criteria. Explain breaking behavior with `!` and a `BREAKING CHANGE:` footer. Do not title a documentation change `feat: implement encryption`.

Keep commits/PRs focused and reviewable. PR titles follow the same convention so squash history is useful. PR descriptions lead with the problem and resulting behavior, then relevant decisions/IDs, verification and material limitations. Draft PRs are useful while work is incomplete; do not mark checks as passed before running them.

Reference: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

## Comments and review communication

Use English for code/API/technical comments. Explain an invariant, trade-off, security boundary or surprising behavior; avoid repeating obvious code, keeping dead commented-out code or copying issue prose into every function. Link a stable issue/ADR for nontrivial TODOs instead of leaving ownerless promises.

Review comments should name the behavior and consequence. Optional prefixes clarify intent: `[blocking]`, `[question]`, `[suggestion]`, `[nit]`. Give evidence or a concrete example, and distinguish preference from a requirement. Questions and unresolved blocking comments are not approvals. Public issues/PRs never contain secrets, user messages or unredacted sensitive logs.

## Definition of ready

- The issue has one outcome, scope/exclusions, requirement/decision IDs and observable acceptance criteria.
- Dependencies and open security decisions are explicit; required decisions are resolved before affected feature work.
- Relevant UI, errors and localization are covered, with an estimated scope small enough for review.
- The milestone/priority/component are triaged, and implementation is authorized for that work item.

## Definition of done

- The agreed behavior/document is implemented, reviewed and traceable to the issue and requirements.
- Applicable automated/manual checks have actual recorded results; failure and unauthorized paths are covered where relevant.
- Documentation/config/examples match the change; Arabic/English and RTL/LTR are considered for user-facing work.
- No secrets, private context, real user data or generated bulk artifacts enter the change.
- Security limitations and unresolved work are explicit; no unsupported implementation/audit claims are introduced.

## Repository controls and community operations

Recommended owner setup: PR-based changes to `main`, prevent force pushes/deletion, require actual CI checks after they exist, and prefer squash merging. In a solo-maintainer phase, do not require an impossible second-person approval on the owner's own PRs. Add independent review requirements for sensitive changes as the reviewer pool grows. These are recommendations until configured and verified, not enforced guarantees.

`CODEOWNERS` requests owner review when GitHub can resolve the owner. It does not by itself enforce approval. Enable a verified private vulnerability-reporting route before production. Labels, milestones and project fields are created by the owner-run bootstrap; views/automations/rulesets remain explicit manual setup tasks in the guide.
