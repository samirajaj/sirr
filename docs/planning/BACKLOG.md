# Sirr Initial Community Backlog

Generated from [github-project.json](github-project.json). Review the manifest before running the owner-only [GitHub setup](../community/GITHUB_SETUP.md). These 28 items are prepared locally, not created or completed remotely. Stable keys are not GitHub issue numbers. This is an initial planning/feasibility backlog with representative future stories, not a complete implementation decomposition.

All items start in Backlog. Effort is provisional; no due dates or calendar estimates are assigned. Existing community issue content/status is preserved when setup is rerun.

| Key | Kind | Title | Milestone | Dependencies |
|---|---|---|---|---|
| EP-20 | epic | Documentation and community readiness | Planning | None |
| EP-00 | epic | Technical feasibility evidence | M0 — Feasibility | None |
| EP-01 | epic | Portable bilingual foundation | M1 — Foundation | None |
| EP-07 | epic | Encryption and participant key lifecycle | Planning | None |
| EP-15 | epic | Docker and self-hosting operations | M0 — Feasibility | None |
| EP-06 | epic | Temporary private text rooms | M2 — Temporary rooms | None |
| EP-09 | epic | Managed persistent messaging | M4 — Persistent messaging and media | None |
| EP-11 | epic | Voice recording and playback | M4 — Persistent messaging and media | None |
| TASK-001 | task | Review public and private repository boundaries | Planning | None |
| TASK-002 | task | Review contribution standards and GitHub templates | Planning | TASK-001 |
| TASK-003 | task | Review SRS scope and proposed refinements | Planning | TASK-002 |
| TASK-004 | task | Document the messaging threat model | Planning | TASK-003 |
| TASK-005 | decision | Evaluate established messaging protocols | Planning | TASK-004 |
| TASK-006 | decision | Specify device enrollment and historical key recovery | Planning | TASK-005 |
| TASK-007 | decision | Decide temporary runtime isolation | Planning | TASK-004 |
| TASK-008 | decision | Specify sessions, MFA and administrator bootstrap | Planning | TASK-006, TASK-007 |
| TASK-009 | decision | Define verification metadata and retention policy | Planning | TASK-004 |
| TASK-010 | task | Specify API, event and data invariants | Planning | TASK-005, TASK-006, TASK-008, TASK-009 |
| TASK-011 | task | Define browser, accessibility and workload targets | Planning | TASK-003 |
| TASK-012 | task | Review and smoke-test development Docker dependencies | M0 — Feasibility | TASK-007 |
| TASK-013 | task | Review local tooling checks and optional GitHub CI | Planning | TASK-002, TASK-012 |
| TASK-014 | task | Configure verified community and private reporting channels | Planning | TASK-002 |
| TASK-015 | decision | Define portable web runtime configuration | Planning | TASK-008 |
| SPIKE-001 | spike | Validate a portable hosting candidate | M0 — Feasibility | TASK-007, TASK-008, TASK-011, TASK-012, TASK-015 |
| SPIKE-002 | spike | Validate browser crypto and encrypted media compatibility | M0 — Feasibility | TASK-005, TASK-006, TASK-011, TASK-012 |
| US-001 | story | Create a verified temporary text room | M2 — Temporary rooms | TASK-005, TASK-007, TASK-009, TASK-010, SPIKE-001, SPIKE-002 |
| US-002 | story | Record and exchange a private voice message | M4 — Persistent messaging and media | TASK-006, TASK-008, TASK-010, SPIKE-002 |
| US-003 | story | Access only my administrator conversation | M4 — Persistent messaging and media | TASK-006, TASK-008, TASK-009, TASK-010 |

## EP-20 Documentation and community readiness

<!-- sirr-backlog:EP-20 -->
## Outcome

Establish reviewable requirements, public decisions and contribution rules before implementing the application.

## Scope and exclusions

Public documentation, traceability and community workflow; no automatic acceptance of product drafts.

## Acceptance criteria

- [ ] SRS preserves every PRD ID and distinguishes proposals from accepted decisions.
- [ ] Contribution, publication and review policies are reviewable without private handoffs.
- [ ] Initial backlog and owner-run GitHub setup are documented; remote creation is reported separately.

## Traceability and dependencies

- Requirements/decisions: DEP-01, NFR-09, NFR-10
- Epic: EP-20 (this epic)
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: Planning; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## EP-00 Technical feasibility evidence

<!-- sirr-backlog:EP-00 -->
## Outcome

Prove candidate deployment, resource and browser assumptions with bounded experiments.

## Scope and exclusions

Synthetic-data experiments after authorization; no production service or secure-release claim.

## Acceptance criteria

- [ ] Each experiment has a question, budget, environment and repeatable procedure.
- [ ] Results record limitations and determine supported profiles and draft limits.
- [ ] Failures trigger explicit decisions rather than mandatory BaaS or unsupported free-host claims.

## Traceability and dependencies

- Requirements/decisions: DEP-02, DEP-03, DEP-07, NFR-06
- Epic: EP-00 (this epic)
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: M0 — Feasibility; proposed effort: XL
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## EP-01 Portable bilingual foundation

<!-- sirr-backlog:EP-01 -->
## Outcome

Prepare an approved workspace and deployable bilingual foundation without duplicating backend logic.

## Scope and exclusions

Architecture and foundation work after decision/feasibility gates; no chat features in this epic.

## Acceptance criteria

- [ ] Accepted boundaries separate frontend and backend responsibilities.
- [ ] Clean builds, runtime public config and Docker profiles are reproducible.
- [ ] Arabic/English routing and RTL/LTR start in foundation work.

## Traceability and dependencies

- Requirements/decisions: WEB-01, WEB-02, DEP-02, DEP-03, NFR-09
- Epic: EP-01 (this epic)
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: M1 — Foundation; proposed effort: XL
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## EP-07 Encryption and participant key lifecycle

<!-- sirr-backlog:EP-07 -->
## Outcome

Resolve authenticated encryption, device/history access and recovery before secure messaging implementation.

## Scope and exclusions

Threat model, established protocol evaluation and recovery UX; no home-grown protocol or automatic audit claim.

## Acceptance criteria

- [ ] Protocol and library assessment covers temporary groups and managed history.
- [ ] Key custody, new/lost devices, resets and administrator continuity are explicit.
- [ ] Review and negative/interoperability evidence requirements are defined.

## Traceability and dependencies

- Requirements/decisions: TMP-04, MSG-05, NFR-02, DEC-01, DEC-02
- Epic: EP-07 (this epic)
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: Planning; proposed effort: XL
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## EP-15 Docker and self-hosting operations

<!-- sirr-backlog:EP-15 -->
## Outcome

Make local and future production deployment portable with explicit persistence and isolation.

## Scope and exclusions

Development dependencies now; full app/proxy/backup profiles after application runtime decisions.

## Acceptance criteria

- [ ] Local dependency configuration validates and remains separate from production claims.
- [ ] Temporary isolation and managed volume/restore boundaries have accepted decisions.
- [ ] Future clean-install and restore tests are specified and later executed.

## Traceability and dependencies

- Requirements/decisions: DEP-02, DEP-06, NFR-03, NFR-07
- Epic: EP-15 (this epic)
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: M0 — Feasibility; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## EP-06 Temporary private text rooms

<!-- sirr-backlog:EP-06 -->
## Outcome

Deliver verified accountless encrypted group text with terminal expiry and no durable history.

## Scope and exclusions

Future P0 room flow after crypto, verification and lifecycle decisions; no media or replay.

## Acceptance criteria

- [ ] Room creation, owner authority and encrypted multi-participant flows meet the SRS.
- [ ] Normal, failure and restart inspections cover temporary non-persistence.
- [ ] Abuse and deadline controls have bounded-resource evidence.

## Traceability and dependencies

- Requirements/decisions: TMP-01, TMP-04, TMP-08, ABU-01
- Epic: EP-06 (this epic)
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: M2 — Temporary rooms; proposed effort: XL
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## EP-09 Managed persistent messaging

<!-- sirr-backlog:EP-09 -->
## Outcome

Deliver authorized administrator-to-user conversations with encrypted durable history.

## Scope and exclusions

Future P0 message/history flow; read receipts, replies, search and export remain P1.

## Acceptance criteria

- [ ] Membership, uniqueness and durable acknowledgment are enforced across APIs/events.
- [ ] Authorized keys recover history through tested restart/restore behavior.
- [ ] Cross-user access and reset/key-loss cases behave as specified.

## Traceability and dependencies

- Requirements/decisions: MSG-01, MSG-02, MSG-03, MSG-05, MSG-06
- Epic: EP-09 (this epic)
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: M4 — Persistent messaging and media; proposed effort: XL
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## EP-11 Voice recording and playback

<!-- sirr-backlog:EP-11 -->
## Outcome

Deliver direct microphone recording and authorized encrypted voice playback in managed chat.

## Scope and exclusions

Future P0 record/preview/send/play/pause/seek with localized failures; no calls or temporary media.

## Acceptance criteria

- [ ] Supported client matrix passes recording and playback scenarios.
- [ ] Cancel, permission, quota and corruption failures are handled.
- [ ] Voice content uses the same authorized private storage and key lifecycle as managed attachments.

## Traceability and dependencies

- Requirements/decisions: MED-01, MED-02, MED-03, MSG-04
- Epic: EP-11 (this epic)
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: M4 — Persistent messaging and media; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-001 Review public and private repository boundaries

<!-- sirr-backlog:TASK-001 -->
## Outcome

Review ignore rules and public decision references before publishing local documentation.

## Scope and exclusions

Secrets, private handoffs, runtime data and build contexts; keep source migrations and synthetic fixtures trackable.

## Acceptance criteria

- [ ] git check-ignore covers sensitive representative paths and permits intended public files.
- [ ] No public document links to an ignored private handoff.
- [ ] Original private files remain local and unchanged; tracked history limitations are documented.

## Traceability and dependencies

- Requirements/decisions: DEP-01, NFR-04, NFR-05
- Epic: EP-20
- Depends on: None recorded; review before Ready.
- Priority: P0; milestone: Planning; proposed effort: S
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-002 Review contribution standards and GitHub templates

<!-- sirr-backlog:TASK-002 -->
## Outcome

Adopt consistent stories/tasks, comments, branch names, commit messages and PR review expectations.

## Scope and exclusions

Contribution guide, conduct policy, issue/PR forms, field definitions and definitions of ready/done.

## Acceptance criteria

- [ ] Examples use English technical content and real requirement references.
- [ ] Templates request acceptance and failure/privacy cases without requiring private evidence.
- [ ] Policy recommendations are not described as enabled branch/CI enforcement.

## Traceability and dependencies

- Requirements/decisions: DEP-01, NFR-09
- Epic: EP-20
- Depends on: TASK-001
- Priority: P0; milestone: Planning; proposed effort: M
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-003 Review SRS scope and proposed refinements

<!-- sirr-backlog:TASK-003 -->
## Outcome

Review SRS against PRD and latest owner decisions without silently changing priority.

## Scope and exclusions

DEC-11 and SRS-D01 through SRS-D06; retain read/reply/export/PWA priorities pending explicit change.

## Acceptance criteria

- [ ] Every PRD requirement remains traceable with its priority.
- [ ] Owner decisions and provisional technical proposals are distinguished.
- [ ] Approved changes and still-open points are recorded explicitly.

## Traceability and dependencies

- Requirements/decisions: DEC-11, TMP-01, MED-01, ADM-03
- Epic: EP-20
- Depends on: TASK-002
- Priority: P0; milestone: Planning; proposed effort: M
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-004 Document the messaging threat model

<!-- sirr-backlog:TASK-004 -->
## Outcome

Describe assets, adversaries, metadata, client trust and temporary non-persistence boundaries.

## Scope and exclusions

Malicious host JS, participants, account/session compromise, proxy logs, browser history, swap and backups.

## Acceptance criteria

- [ ] Data flows and trust boundaries cover both modes.
- [ ] Threats have candidate mitigations, residual risks and validation plans.
- [ ] The model distinguishes client clearing from physical erasure and participant copies.

## Traceability and dependencies

- Requirements/decisions: NFR-01, NFR-02, NFR-04, DEC-14
- Epic: EP-07
- Depends on: TASK-003
- Priority: P0; milestone: Planning; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-005 Evaluate established messaging protocols

<!-- sirr-backlog:TASK-005 -->
## Outcome

Compare protocol/library candidates using primary documentation and the approved threat model.

## Scope and exclusions

Identity, invite/member authentication, groups, replay, key changes, versions, licenses and browser/mobile support.

## Acceptance criteria

- [ ] A comparison records evidence, maintenance and interoperability assumptions.
- [ ] Recommendation includes consequences and unresolved security questions.
- [ ] No primitive-only demo or custom envelope is presented as a reviewed messaging protocol.

## Traceability and dependencies

- Requirements/decisions: DEC-01, TMP-04, MSG-05, NFR-02
- Epic: EP-07
- Depends on: TASK-004
- Priority: P0; milestone: Planning; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-006 Specify device enrollment and historical key recovery

<!-- sirr-backlog:TASK-006 -->
## Outcome

Decide who can recover old content after device loss, password reset or administrator device replacement.

## Scope and exclusions

Participant key custody, enrollment/revocation, history access, backup/recovery material and irreversible loss UX.

## Acceptance criteria

- [ ] Resetting credentials is distinguished from recovering message keys.
- [ ] Chosen recovery model does not silently add server-readable key escrow.
- [ ] Both Arabic/English loss and recovery outcomes are specified before implementation.

## Traceability and dependencies

- Requirements/decisions: DEC-02, MSG-03, MSG-05, ADM-04
- Epic: EP-07
- Depends on: TASK-005
- Priority: P0; milestone: Planning; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-007 Decide temporary runtime isolation

<!-- sirr-backlog:TASK-007 -->
## Outcome

Compare separate runtime entry points with combined hosting under a measured resource budget.

## Scope and exclusions

Import boundaries, credentials, DB network access, media mounts, logging, restart and process cost.

## Acceptance criteria

- [ ] ADR states alternatives and isolation consequences.
- [ ] Validation includes actual network/mount permissions, not container naming.
- [ ] A combined profile cannot claim the stronger separate-process isolation.

## Traceability and dependencies

- Requirements/decisions: DEC-06, NFR-03, NFR-04
- Epic: EP-15
- Depends on: TASK-004
- Priority: P0; milestone: Planning; proposed effort: M
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-008 Specify sessions, MFA and administrator bootstrap

<!-- sirr-backlog:TASK-008 -->
## Outcome

Resolve browser session transport, origins and secure bootstrap/recovery together.

## Scope and exclusions

Cookies/tokens, CSRF/CORS/socket origins, rotation/revocation, first-login restrictions and MFA recovery.

## Acceptance criteria

- [ ] Same-origin and supported split-origin behavior is explicit.
- [ ] Disabled-account and credential-reset effects cover live sockets.
- [ ] No public default administrator password or hidden MFA recovery bypass is introduced.

## Traceability and dependencies

- Requirements/decisions: DEC-12, ADM-02, ADM-03, ADM-04, NFR-01
- Epic: EP-01
- Depends on: TASK-006, TASK-007
- Priority: P0; milestone: Planning; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-009 Define verification metadata and retention policy

<!-- sirr-backlog:TASK-009 -->
## Outcome

Specify verification/counter metadata and basic managed retention before public use.

## Scope and exclusions

Enabled public OTP default, explicit override, SMTP failure, no permanent email-room mapping, audit and backups.

## Acceptance criteria

- [ ] Each retained field has purpose, lifetime, access and cleanup behavior.
- [ ] Retention disclosure does not silently promote P1 deletion/export UI to P0.
- [ ] Backup expiry and limits on recipient-copy deletion are explicit.

## Traceability and dependencies

- Requirements/decisions: DEC-07, DEC-09, ABU-06, MSG-07, NFR-10
- Epic: EP-20
- Depends on: TASK-004
- Priority: P0; milestone: Planning; proposed effort: M
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-010 Specify API, event and data invariants

<!-- sirr-backlog:TASK-010 -->
## Outcome

Define versioned contracts before creating application handlers or migrations.

## Scope and exclusions

Authorization, error codes, deadline semantics, idempotency, durable ack, paging, envelope bounds and quota/file finalization.

## Acceptance criteria

- [ ] Contracts distinguish command acceptance, persisted content and recipient delivery.
- [ ] SQL/storage invariants cover concurrency, aborts and orphan recovery.
- [ ] Temporary rooms have no durable data model or replay path.

## Traceability and dependencies

- Requirements/decisions: DEC-15, DEC-16, MSG-01, MSG-02, MED-06
- Epic: EP-20
- Depends on: TASK-005, TASK-006, TASK-008, TASK-009
- Priority: P0; milestone: Planning; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-011 Define browser, accessibility and workload targets

<!-- sirr-backlog:TASK-011 -->
## Outcome

Choose testable support boundaries and exact byte/resource accounting.

## Scope and exclusions

Desktop/mobile browser matrix, RTL/LTR, recording codecs, load duration, latency and RPO/RTO targets.

## Acceptance criteria

- [ ] Targets identify environments and a reproducible workload.
- [ ] Client duration/codec targets are separated from enforceable ciphertext bytes.
- [ ] Draft PRD quotas are not advertised as measured capacity.

## Traceability and dependencies

- Requirements/decisions: DEC-04, DEC-08, DEC-13, WEB-01, NFR-06, NFR-08
- Epic: EP-00
- Depends on: TASK-003
- Priority: P0; milestone: Planning; proposed effort: M
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-012 Review and smoke-test development Docker dependencies

<!-- sirr-backlog:TASK-012 -->
## Outcome

Validate the prepared PostgreSQL/Mailpit Compose file without implying application deployment is complete.

## Scope and exclusions

Configuration validation now; explicit later container startup, health, restart persistence and local SMTP checks.

## Acceptance criteria

- [ ] Empty credentials fail and configured Compose validates with loopback-only published ports.
- [ ] Actual startup/restart/mail checks record results after the owner authorizes running containers.
- [ ] Production app/proxy/secret/backup work remains separately tracked.

## Traceability and dependencies

- Requirements/decisions: DEP-02, DEP-05, NFR-07
- Epic: EP-15
- Depends on: TASK-007
- Priority: P0; milestone: M0 — Feasibility; proposed effort: M
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-013 Review local tooling checks and optional GitHub CI

<!-- sirr-backlog:TASK-013 -->
## Outcome

Verify bootstrap safety and basic repository checks before enabling them remotely.

## Scope and exclusions

Offline tests, manifest validation, ignore/link checks and Compose config; no app test coverage claim.

## Acceptance criteria

- [ ] Dry-run performs no authentication, network or mutations.
- [ ] Tests exercise duplicate/retry behavior, state preservation and wrong-account refusal.
- [ ] CI remains least-privileged and is not described as enforced until published and run.

## Traceability and dependencies

- Requirements/decisions: NFR-09, DEP-01
- Epic: EP-01
- Depends on: TASK-002, TASK-012
- Priority: P0; milestone: Planning; proposed effort: M
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-014 Configure verified community and private reporting channels

<!-- sirr-backlog:TASK-014 -->
## Outcome

Owner verifies repository settings instead of assuming documentation enables them.

## Scope and exclusions

Private vulnerability reporting, moderation contact, issue forms, CODEOWNERS, branch rules and Project views/automation.

## Acceptance criteria

- [ ] Private intake is tested and policy links reflect availability.
- [ ] Solo-maintainer rules do not require impossible self-approval.
- [ ] Enabled checks/views/settings are recorded separately from recommendations.

## Traceability and dependencies

- Requirements/decisions: NFR-10, DEP-01
- Epic: EP-20
- Depends on: TASK-002
- Priority: P0; milestone: Planning; proposed effort: S
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## TASK-015 Define portable web runtime configuration

<!-- sirr-backlog:TASK-015 -->
## Outcome

Decide Next.js deployment and public endpoint configuration for reusable artifacts.

## Scope and exclusions

Runtime/static trade-offs, public/secret separation, same/split origins and independent PostgreSQL/backend hosting.

## Acceptance criteria

- [ ] Design supports changing public endpoints without rebuilding the same frontend artifact.
- [ ] Backend logic and credentials do not move into frontend code.
- [ ] Distributed profile validation is defined, with no provider-specific mandatory dependency.

## Traceability and dependencies

- Requirements/decisions: DEP-03, DEC-03, DEC-12
- Epic: EP-01
- Depends on: TASK-008
- Priority: P0; milestone: Planning; proposed effort: M
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## SPIKE-001 Validate a portable hosting candidate

<!-- sirr-backlog:SPIKE-001 -->
## Outcome

Run bounded synthetic-data deployment experiments only after reviewing the budget and environment.

## Scope and exclusions

WebSocket/recycle, remote DB TLS/permissions, durable disk, streaming limits, SMTP and measured resources.

## Acceptance criteria

- [ ] Owner approves explicit time/resource bounds before execution.
- [ ] Official provider claims are dated and separated from actual measurements.
- [ ] Results identify limitations and migration steps without claiming free hosting is guaranteed.

## Traceability and dependencies

- Requirements/decisions: DEP-02, DEP-03, DEP-05, DEP-07, NFR-06
- Epic: EP-00
- Depends on: TASK-007, TASK-008, TASK-011, TASK-012, TASK-015
- Priority: P0; milestone: M0 — Feasibility; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## SPIKE-002 Validate browser crypto and encrypted media compatibility

<!-- sirr-backlog:SPIKE-002 -->
## Outcome

Test the proposed protocol and supported recording/playback paths on the agreed client matrix.

## Scope and exclusions

Budget-approved disposable prototype, no production keys or real private messages.

## Acceptance criteria

- [ ] Record permission/failure handling and actual codec compatibility.
- [ ] Test authorized decryption, corruption rejection, seek strategy and low-memory behavior.
- [ ] Findings feed ADRs; the prototype is not described as an audited secure implementation.

## Traceability and dependencies

- Requirements/decisions: DEC-01, DEC-08, MED-01, MED-03, MED-09
- Epic: EP-00
- Depends on: TASK-005, TASK-006, TASK-011, TASK-012
- Priority: P0; milestone: M0 — Feasibility; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## US-001 Create a verified temporary text room

<!-- sirr-backlog:US-001 -->
## Outcome

As a guest, I want to verify my mailbox and create a time-limited room so that I can invite others without a permanent account.

## Scope and exclusions

Future P0 implementation after protocol/verification gates; no temporary attachments or saved history.

## Acceptance criteria

- [ ] With public defaults, unverified creation fails and a valid single-use OTP permits bounded creation.
- [ ] Invitation does not grant owner termination authority; secrets never enter mail or logs.
- [ ] Expiry/termination reject new joins and sends; Arabic/English errors explain failures.

## Traceability and dependencies

- Requirements/decisions: TMP-01, TMP-02, TMP-05, TMP-06, ABU-01
- Epic: EP-06
- Depends on: TASK-005, TASK-007, TASK-009, TASK-010, SPIKE-001, SPIKE-002
- Priority: P0; milestone: M2 — Temporary rooms; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## US-002 Record and exchange a private voice message

<!-- sirr-backlog:US-002 -->
## Outcome

As a provisioned user, I want to record and preview a voice message in my administrator conversation so that I can explain something without typing.

## Scope and exclusions

Future authorized encrypted storage and record/playback UI; waveform/speed remain P1.

## Acceptance criteria

- [ ] Supported browser records, shows duration, stops, previews and sends; cancellation uploads nothing.
- [ ] Permission denial, unsupported formats, quota and transfer failures have localized outcomes.
- [ ] Administrator decrypts/plays/pauses/seeks the recording; another user cannot retrieve it.

## Traceability and dependencies

- Requirements/decisions: MED-01, MED-02, MED-03, MSG-04, MSG-05
- Epic: EP-11
- Depends on: TASK-006, TASK-008, TASK-010, SPIKE-002
- Priority: P0; milestone: M4 — Persistent messaging and media; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.

## US-003 Access only my administrator conversation

<!-- sirr-backlog:US-003 -->
## Outcome

As a provisioned user, I want my retained conversation to be with the administrator only so that I understand who receives my messages.

## Scope and exclusions

Future managed history and disclosure; no user discovery or user-to-user messaging.

## Acceptance criteria

- [ ] Exactly one conversation per user is enforced under concurrent provisioning.
- [ ] Foreign conversation, socket and attachment identifiers are denied independently of the UI.
- [ ] Retention/admin participation and key-loss behavior are explained in both languages.

## Traceability and dependencies

- Requirements/decisions: MSG-01, MSG-03, MSG-06, MSG-07
- Epic: EP-09
- Depends on: TASK-006, TASK-008, TASK-009, TASK-010
- Priority: P0; milestone: M4 — Persistent messaging and media; proposed effort: L
- Sources: `docs/requirements/SRS.md`, `docs/planning/DECISIONS.md`, `docs/planning/ROADMAP.md` (local drafts may await repository publication).

## Readiness

Initial state is Backlog. Review scope, dependencies and authorization before implementation. Prepared files are not evidence of deployment or validated security. Never include secrets or real private conversation data in public evidence.
