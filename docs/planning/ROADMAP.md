# Sirr Development Roadmap

| Field | Value |
|---|---|
| Version | 0.1.0 |
| Date | 2026-11-25 |
| Status | Proposed sequence; documentation work only is currently authorized |
| Inputs | [Public decisions](DECISIONS.md), [SRS](../requirements/SRS.md), [SAD](../architecture/SAD.md) |

## 1 Delivery rules

Keep PRD milestones M0 through M6 and existing P0/P1/P2 meanings. This roadmap adds explicit documentation/decision gates without renaming the milestones or inventing calendar commitments. No effort or calendar estimate is a delivery commitment before scope and feasibility review.

Application scaffolding, executable feasibility spikes and feature implementation require a subsequent instruction. Current product specifications are review drafts. The owner subsequently requested community workflow, Project/backlog preparation and Docker support (DEC-17). Development dependency configuration and local GitHub setup tooling are in scope; no commits, pushes or remote writes are performed. The owner will run GitHub setup using their own account without connecting it to this conversation.

Arabic and English begin in foundation work, not translation after feature completion. Direct microphone recording, private media, administrator MFA and first-login password change retain PRD P0 priority, with DEC-11 recording provisional scope differences. E2EE release claims wait for evidence; planning documents and primitive selection are insufficient.

## 2 Current documentation checkpoint

| Artifact | Current state | Next action |
|---|---|---|
| PRD | Existing product baseline preserved; PRD 0.1.0 draft | Review discrepancies and later reconcile approved changes explicitly. |
| Repository review | Written with decision register | Confirm interpretation and resolve outstanding product questions. |
| SRS | Initial draft with all PRD IDs and acceptance criteria | Review behavior, priorities and proposed refinements. |
| SAD | Initial proposal | Review runtime boundaries; decide which ADR candidates to evaluate. |
| Roadmap | Initial proposal | Confirm sequence and authorize the next documentation/feasibility step. |
| Detailed security/contracts/operations docs | Not yet written | Produce in dependency order below; do not treat them as completed by the SAD. |

Owner decisions recorded on 2026-11-25: use the existing AGPL v3 text; require email verification by default in public deployments with explicit operator disablement. License/name review DEC-05 and verification DEC-07 are partially resolved; naming, SMTP and metadata lifetime remain open.

## 3 Documentation and decision work before implementation

| Order | Work package | Required output and gate |
|---|---|---|
| 1 | Review SRS and scope | Resolve DEC-11 priority differences; identify confirmed requirements versus proposed refinements. Keep read receipts/replies, export/deletion UI and PWA P1 unless explicitly changed. |
| 2 | Threat model and key lifecycle | Draft `THREAT_MODEL.md` and `ENCRYPTION.md`; describe assets, actors, server/client trust, group membership, device enrollment, history/recovery and key-loss UX. Resolve DEC-01/02 before production crypto implementation. |
| 3 | Architecture decisions | Evaluate ADR-001 through ADR-006 from SAD, especially DEC-06 isolation and DEC-12 auth/bootstrap/origins. Record proposed/accepted/rejected status and consequences. |
| 4 | Detailed behavior and contracts | Use cases, API/event contracts, data model and media lifecycle; settle DEC-15/16, idempotency, pagination, ciphertext limits, quota consistency and failure semantics. |
| 5 | Support and operational policy | Draft UI/i18n accessibility matrix, deployment plan, verification/metadata/retention policy and testing plan. Define measured workload, byte units and RPO/RTO. |
| 6 | Feasibility authorization | Review concrete M0 experiments, environments and acceptance thresholds before writing spike/application code. No security claim follows from approving an experiment. |

These documents can be refined iteratively, but irreversible protocol/schema assumptions must not precede their decisions. Publish accurate privacy/security/support descriptions only when they match implemented behavior.

## 4 Milestones and acceptance gates

### M0 Technical feasibility

**Entry:** authorize bounded experiments after defining the relevant requirements and candidate architecture. Use synthetic data and disposable environments; no real private conversations.

| Experiment | Required evidence |
|---|---|
| Portable deployment | Clean Compose startup and independently configurable web/API/PostgreSQL profile; public frontend config changes without a web rebuild. |
| Hosting candidate | Current official limits plus actual Node runtime, long-lived WebSocket, process recycle, memory, DB TLS/permissions/pool, upload/timeout and bandwidth observations. No provider is selected in advance. |
| Private storage | Files survive restart/redeploy on the proposed host; authorized streaming works; storage is not publicly addressable. Test full disk, cancellation, actual byte limits and backup copies. |
| SMTP/verification | Outbound SMTP and delivery tests, controlled OTP expiry/replay/attempts and failure behavior; enabled enforcement cannot silently bypass mail failure. |
| Protocol and keys | Reviewed protocol/library assessment and interoperability experiment covering identity, membership, recovery and attachment support. A successful demo is not a security audit. |
| Browser media | Recorded browser/device/codec matrix for microphone record/preview/play/seek, image handling, encrypted video/audio playback and low-memory behavior. |
| Resource bounds | Approved workload and limit matrix; measured RAM, CPU, disk, connection/queue growth and slow-client effects for the proposed deployment budget. |

**Exit:** record reproducible results, limitations and ADR outcomes. Choose supported profiles and defaults from evidence. If free hosting fails, revisit candidates or obtain an explicit scope decision; do not claim free-hosting support or introduce BaaS. Finish DEC-01/02/06/08/12 sufficiently before related feature work.

**Traceability:** DEP-02/03/05/07, NFR-02/03/06/07/11, DEC-01 through DEC-04, DEC-06 through DEC-08, DEC-12/13.

### M1 Foundation and bilingual public experience

**Entry:** accepted foundation ADRs, successful relevant M0 checks and implementation authorization.

Create only the necessary workspace/packages, strict TypeScript configuration, reproducible dependencies, CI, container profiles, secure configuration and migration tooling. Build Arabic/English routing, localized errors/mail resources and public pages with accurate planning/release availability. Enforce temporary/managed import boundaries from the start. Write contribution and responsible-disclosure guidance consistent with existing licensing.

**Exit:** clean checkout builds; Compose and public runtime config work; no secrets in frontend artifacts; both directions and keyboard navigation function; public SEO/private noindex rules are verified. Public pages do not claim unavailable secure chat or mobile releases.

**Traceability:** WEB-01 through WEB-07, DEP-01 through DEP-05/08, NFR-08/09/10/11.

### M2 Temporary secure text rooms

**Entry:** accepted temporary protocol/authentication, verification policy, expiry/disconnect contract and isolation choice. Basic logging/privacy controls must precede handling room payloads.

Implement verified accountless creation, separate capabilities, bounded in-memory rooms, encrypted group text, deadline/owner termination and independent HTTP/socket abuse controls. Optional CAPTCHA integration is configurable; default public OTP enforcement follows the owner decision. Do not add replay, durable recovery or temporary media.

**Exit:** three-client tests, unauthorized-owner/join tests, ciphertext integrity/replay tests, deadline races, restart loss, slow-client/resource tests and non-persistence inspection pass in the documented scope. Protocol review remains required before public E2EE claims; M2 completion alone is not public release authorization.

**Traceability:** TMP-01 through TMP-10, ABU-01 through ABU-07, NFR-01 through NFR-06, SRS-D01/02.

### M3 Managed accounts and administrator access

**Entry:** approved bootstrap, password/session/MFA, device enrollment and administrator recovery design. Persistent device-key preparation may occur here before M4 history handling.

Implement administrator-only provisioning, first-login password change, session lifecycle, administrator MFA, disable/reactivate/reset, quota configuration, minimal audit and an authorized inbox shell. Do not expose temporary rooms to administrator-role content access.

**Exit:** user/admin separation, cross-user denial, revocation on live sockets, refresh replay handling, disabled-account behavior and recovery/credential handoff tests pass. The inbox shell must not imply persistent media is complete before M4.

**Traceability:** ADM-01 through ADM-05/07/08, MSG-01/06, NFR-01/05/10, SRS-D03/06.

### M4 Persistent encrypted messaging and media

**Entry:** approved history/device/recovery design, encrypted attachment format, canonical command contract and storage/quotas model. Required browsers/codecs were validated at M0.

Implement persistent text/history, encrypted attachments and direct microphone record/cancel/preview/send/play/pause/seek. Include images, supported short video, audio/documents, progress/retry/cancel and authorization on downloads. Keep compression client-side and optional where capability varies. Enforce reserved/committed quota consistency and orphan cleanup.

**Exit:** both administrator and user exchange all P0 types; managed history survives restart and tested restore; authorized devices decrypt under recovery policy; other users cannot access content/files. Concurrent sends/retries/uploads, disk pressure, lost keys and unsupported formats behave as specified. Temporary data never enters managed storage.

**Traceability:** MSG-01 through MSG-07, MED-01 through MED-09, ADM-06/07, DEP-06, NFR-01/02/06/07, SRS-D03/04.

### M5 Web release qualification

**Entry:** P0 features complete with unresolved security blockers closed. No P1 feature is necessary merely to claim a larger feature list.

Run the approved security review, meaningful integration/end-to-end/load checks, dependency review, Arabic/English/accessibility assessment, metadata/log inspection and full deployment/restore exercise. Reconcile privacy/security/retention/support documents with actual behavior and residual risks. Validate at least one distributed profile required by the PRD; any free-hosting claim requires its own current evidence.

**Exit:** evidence for every P0 ID/NFR, remediated release-blocking findings, tested recovery/backup procedures, accurate support limits and a reviewable release candidate. Publishing, tagging and remote writes require explicit user instruction. Never equate “E2EE implemented” with “absolute secrecy.”

**Traceability:** all P0 IDs and NFRs, PRD section 10, DEC-01/02/03/04/06/07/08/09/11/12/13/14/15/16.

### M6 Mobile and later improvements

**Entry:** stable documented web protocol/API and an explicit mobile scope decision.

Prioritize Android core messaging, secure device storage/enrollment, configurable self-hosted instance selection, deep links, signing/update strategy and signed APK Releases with checksums. Evaluate PWA enhancements separately without private-content caching. iOS waits for DEC-10 feasibility.

Later P1 work also includes reconnect/admission/presence, read/reply/unread states, local search, retention/deletion/export tools, account email/reset, waveform/speed and improved compression. Order these by user value, dependencies and threat-model impact rather than treating every P1 item as a mobile prerequisite.

**Traceability:** TMP-11/12/13, MSG-08/09/10, MED-10, ADM-09/10, WEB-08, MOB-01/02/03.

## 5 Dependency order and evidence

The primary sequence is documentation/decisions → M0 → M1 → M2 → M3 → M4 → M5 → M6. Protocol/recovery work spans both messaging modes and must start before M2, rather than waiting until persistent messaging. Authentication isolation and media experiments may be designed during M0, but delivery milestones do not imply permission to run parallel implementation now.

For each future work item, record PRD/SRS IDs, dependency decisions, behavior, failure cases and required evidence. “Done” means reviewed changes, applicable checks and updated documentation, with no unsupported security claim. Never mark an experiment complete merely because it is documented here.

The GitHub Project, labels, issues and milestone board are prepared locally through the [community workflow](../community/WORKFLOW.md), [backlog](BACKLOG.md) and [setup guide](../community/GITHUB_SETUP.md). They remain uncreated remotely until the owner executes setup. Repository creation is already complete and must not be duplicated as a new implementation task.

## 6 Immediate next review

Review the SRS first, especially DEC-11 scope and the proposed derived requirements. Then prioritize the threat model and key lifecycle questions: which devices can recover old messages, who holds recovery material, and what users see after unrecoverable loss. Resolve isolation and auth/origin choices alongside those answers. Numeric limits and hosting choices follow measured feasibility, not assumptions.

| Version | Change |
|---|---|
| 0.1.0 | Initial documentation and milestone sequence preserving PRD M0–M6; no dates or unvalidated effort commitments. |
