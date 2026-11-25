# Sirr Software Requirements Specification

| Field | Value |
|---|---|
| Version | 0.1.0 |
| Date | 2026-11-25 |
| Status | Draft for owner review; no implementation authorization |
| Product baseline | [PRD 0.1.0](PRD.md) |
| Reconciliation and latest decisions | [Public decision register](../planning/DECISIONS.md) |
| Next documents | [SAD](../architecture/SAD.md), [roadmap](../planning/ROADMAP.md) |

## 1 Purpose and authority

This specification defines externally observable behavior and proposed acceptance checks for Sirr. Latest explicit owner requirements govern. The original PRD remains an unapproved product draft; this SRS carries its requirement IDs and priorities forward without declaring all technical suggestions accepted. Every acceptance check below describes future evidence, not a test that has passed.

Two subsequent owner decisions are authoritative: use the AGPL v3 text already in `LICENSE`; require email verification by default for public room creation while allowing an explicit operator override. Neither decision settles encryption, hosting or retention design.

In the requirement tables, **shall** expresses the candidate specification for the cited PRD requirement. **Proposed refinement** explicitly identifies additional behavior requiring review. P0 is the initial public web MVP; P1 is later enhancement; P2 is later expansion. PRD NFRs are release constraints. No P1/P2 feature is silently promoted to P0.

## 2 Scope and vocabulary

Sirr provides temporary accountless group text and persistent administrator-to-user conversations. Its backend, authentication, PostgreSQL schema, private media storage and business logic remain project-controlled. Supabase, Firebase, mandatory BaaS, mandatory proprietary auth/media/mail APIs and mandatory paid SaaS are excluded.

| Term or actor | Meaning |
|---|---|
| Guest | A temporary-room participant without a persistent account; may verify a mailbox to create a room. |
| Room owner | Guest holding a management capability distinct from the participant invitation. |
| Registered user | Administrator-provisioned account with one persistent administrator conversation. |
| Administrator | Account provisioner and explicit participant in each persistent conversation; no implicit temporary-room membership. |
| Instance operator | Person controlling infrastructure, deployment, backups and configuration; may also be the administrator. |
| E2EE | Client encryption/decryption with authenticated participant keys under a selected protocol; TLS alone is insufficient. |
| Durable storage | Databases, files, logs, caches, browser storage, crash artifacts or backups that outlive transient processing. |
| Acceptance | Recorded checks against a defined build, environment and threat model; not a general guarantee. |

The web MVP includes public pages, guest rooms, private chat and administration in Arabic and English. It excludes public registration, persistent user-to-user chat, public channels, discovery, calls, temporary media, multi-administrator collaboration and native apps. PWA, Android and iOS remain P1/P2 as specified below.

## 3 Authorization and data boundaries

| Operation | Guest or room owner | Registered user | Administrator | Operator |
|---|---|---|---|---|
| Create a temporary room | Guest, subject to configured verification and limits | Same guest flow; account confers no bypass | Same guest flow; role confers no content access | Configures policy, not participant access |
| Join/read/send temporary text | Valid invitation and protocol membership | Same requirement | Same requirement | Same requirement |
| Terminate a room | Owner capability required | No role privilege | No role privilege | May stop service; this grants no decryption right |
| Read/send persistent content | Denied | Own administrator conversation and usable keys | Own user conversations and usable keys | No plaintext access solely from DB/storage access |
| Provision or disable accounts | Denied | Denied | Authorized administration | Bootstrap/maintenance process to be specified |
| Retrieve attachments | Denied | Own authorized conversation | Own authorized conversations | Infrastructure access yields ciphertext under the design target |

Every protected REST request, socket connection and sensitive socket event shall enforce the applicable identity, membership and account status. Hiding controls in the UI is insufficient. Compromised clients, malicious recipients and a host replacing delivered client code remain threat-model limitations.

## 4 Functional requirements and acceptance criteria

Each row retains its original PRD ID. A future test may be named `AT-<ID>` and split into multiple cases. Acceptance includes failure and unauthorized paths, not only the happy path.

### 4.1 Temporary rooms

| ID | Priority | Required behavior and acceptance |
|---|---|---|
| TMP-01 | P0 | Create a room without creating or requiring a persistent user record. With verification enabled, unverified requests fail and a verified guest can create a room. |
| TMP-02 | P0 | Generate an unpredictable invitation and separate owner capability using reviewed randomness and protocol rules. Invitation possession alone must fail owner-only operations; credentials must be absent from logs and mail. |
| TMP-03 | P0 | Permit invitation-based joining with an optional alias. Missing/invalid capabilities, full rooms and ended rooms fail without returning secrets. Render aliases as untrusted text. |
| TMP-04 | P0 | Exchange authenticated encrypted text among multiple participants under DEC-01. Test three participants, altered ciphertext, replay and unauthorized membership; captured server payloads must contain no message plaintext/content keys. |
| TMP-05 | P0 | Accept a lifetime within configured bounds and display remaining time from a server deadline. Test lower/upper boundaries and client clock changes. Deadline start semantics require DEC-16. |
| TMP-06 | P0 | Owner termination and deadline expiry end a room. Test a live connection and new requests at/after the deadline, including delayed cleanup scheduling. |
| TMP-07 | P0 | Reject all joins and sends once ended. Test concurrent send/terminate and deadline races; a newly created room must not revive an old invitation. |
| TMP-08 | P0 | Never intentionally persist temporary plaintext, ciphertext messages, content keys or history. Inspect application DB, files, logs, caches and backup inputs across success, errors and restart; record the OS/proxy scope under DEC-14. |
| TMP-09 | P0 | Keep room state and bounded forwarding only in RAM. A late joiner receives no history; disconnect loses missed messages; service restart cannot recover rooms or queued messages. |
| TMP-10 | P0 | On observed end, compliant clients clear displayed history and reachable key references and show a terminal state. No physical memory erasure, recipient deletion or screenshot-prevention guarantee is permitted. |
| TMP-11 | P1 | Reconnect before expiry only with valid current credentials/membership; no lost-history replay. Reject ended rooms and revoked/obsolete credentials. P0 reconnect behavior must be documented without implying this P1 feature exists. |
| TMP-12 | P1 | Add participant removal, admission controls and optional room passwords with protocol-consistent authorization/key transitions. A removed participant must fail future operations; cryptographic exclusion depends on DEC-01. |
| TMP-13 | P1 | Add presence and typing with bounded frequency and no durable room event history. Verify disconnect cleanup and absence from persistent logs. |

No temporary attachment endpoint is provided. A room ID is not sufficient authorization. Losing the owner capability loses manual management; automatic expiry remains. Clients offline during termination cannot be remotely erased; disconnected-client clearing behavior and lifecycle events must be defined in DEC-16.

### 4.2 Verification and abuse prevention

| ID | Priority | Required behavior and acceptance |
|---|---|---|
| ABU-01 | P0 | Send a short-lived single-use SMTP OTP before room creation. Public default is enforcement enabled; only explicit operator configuration may disable it. Expired, incorrect, replayed or attempt-exhausted codes fail. Mail failure must not automatically disable enforcement. |
| ABU-02 | P0 | Verification creates no permanent account and exposes no email address to room participants. Check room responses, socket events and persistent user records. |
| ABU-03 | P0 | Optional Turnstile must be verified server-side when enabled. Missing, invalid or failed verification is rejected; disabled configuration does not require that vendor. |
| ABU-04 | P0 | Independently bound HTTP, OTP send/attempt, connection, join, room-creation and message rates. Test limit boundaries, parallel requests and trusted-proxy behavior. |
| ABU-05 | P0 | Bound active rooms, participants, pending verifications, payloads, queues, connections and idle/handshake timeouts. Resource use must stay within the approved budget under slow and abusive clients. |
| ABU-06 | P0 | Do not permanently associate email with rooms. Publish verification/counter retention and test expiry cleanup. Never log OTPs, verification grants, invitations or content keys. Storage for counters remains a DEC-07 choice. |
| ABU-07 | P0 | Expose documented safe operator configuration for limits and network protection. Reject invalid configurations and document reduced protection when verification/CAPTCHA is disabled. |

Mailbox access does not establish personhood or anonymity. SMTP delivery and upstream volumetric attack protection are external operational concerns. Verification must not require emailing invitation/decryption secrets. Challenge consumption versus failed room allocation requires an atomic, bounded retry policy in the API design.

### 4.3 Persistent messaging

| ID | Priority | Required behavior and acceptance |
|---|---|---|
| MSG-01 | P0 | Maintain exactly one administrator conversation per registered user in the MVP. Concurrent provisioning/retries must not create duplicates; enforce a database constraint. |
| MSG-02 | P0 | Send/receive persistent text in real time. Define durable acceptance and duplicate-retry behavior under DEC-15; failed writes must not appear durably accepted. |
| MSG-03 | P0 | Retrieve only authorized history after reconnect/login and decrypt only with authorized keys. Test paging, lost-device/reset behavior and foreign conversation IDs. |
| MSG-04 | P0 | Support voice recordings, images, short video, audio files and documents with shared membership checks. Test both user-to-admin and admin-to-user flows. |
| MSG-05 | P0 | Persist encrypted message/attachment content; decrypt on authorized clients. Restart/restore retains ciphertext; infrastructure-only access must not yield content keys in the selected threat model. Recovery is gated by DEC-02. |
| MSG-06 | P0 | Reject user-to-user sends, listing, history access, socket subscriptions and attachment access, including guessed identifiers and stale sessions. |
| MSG-07 | P0 | Clearly tell users the administrator is the recipient and persistent content is retained. Test the Arabic and English disclosure before first persistent use. |
| MSG-08 | P1 | Add delivery/read states, unread counts and replies. Distinguish server acceptance, recipient receipt and actual read; authorize state updates. |
| MSG-09 | P1 | Search decrypted authorized history locally without server plaintext indexes or sending plaintext queries to the server. Document search coverage when only part of history is loaded. |
| MSG-10 | P1 | Add retention/deletion/export controls and authorized client plaintext export. Define backup and recipient-copy limitations; failed export/deletion cannot report success. |

P0 still requires an explicit published retention and backup policy under NFR-10. That requirement does not add the P1 deletion/export interface. Password resets authenticate an account; they do not inherently recover decryption keys or authorize a new device to historical content.

### 4.4 Voice and media

| ID | Priority | Required behavior and acceptance |
|---|---|---|
| MED-01 | P0 | Record microphone audio directly in the conversation UI over a supported secure context. Verify actual recording on each supported browser/device combination. |
| MED-02 | P0 | Handle denied/revoked permission, unavailable devices and recording errors; show duration; support stop, cancel, preview and send. Cancel must not upload the recording. |
| MED-03 | P0 | Play, pause and seek received voice recordings after authorized decryption. Test corruption, incomplete retrieval and unsupported formats. |
| MED-04 | P0 | Preview/view images, play supported video/audio and download authorized files. Unsupported formats receive actionable feedback or safe download according to the approved matrix. |
| MED-05 | P0 | Show upload progress and permit failure recovery, retry and cancellation. Verify interrupted transfers do not create visible broken messages or permanent quota leaks. Resumable uploads are not implied. |
| MED-06 | P0 | Enforce file, user and instance byte quotas and bounded concurrent uploads. Parallel requests and false declared sizes must not bypass actual streamed byte accounting. |
| MED-07 | P0 | Optimize locally where supported before encryption and explain oversized-file failures. Test weak-device fallback; do not require expensive video transcoding to send an otherwise supported file. |
| MED-08 | P0 | Store ciphertext outside the public web root on persistent private storage. Direct unauthenticated paths and path traversal must fail; downloads require conversation authorization. |
| MED-09 | P0 | Negotiate supported recording formats and render untrusted media safely. Test MIME/extension mismatch, malicious filenames, corrupt encrypted objects and authorization on any range requests. |
| MED-10 | P1 | Add waveform, playback speed and improved video compression on supported clients without requiring server plaintext. |

The server trusts ciphertext byte counts and authorization, not client claims about codec, duration, image dimensions or safety. Image metadata removal is a client optimization target; malicious clients can bypass it. No server malware-scanning or universal codec-conversion promise is made. Authenticated encrypted seeking/chunking remains a protocol-dependent DEC-08 design task.

### 4.5 Authentication and administration

| ID | Priority | Required behavior and acceptance |
|---|---|---|
| ADM-01 | P0 | Only the administrator may provision accounts; no public registration path. Unauthenticated and ordinary-user provisioning requests fail. |
| ADM-02 | P0 | Provision username/temporary password and require first-login password change before ordinary chat access. Never return stored password hashes or retain plaintext credentials; define secure credential handoff. |
| ADM-03 | P0 | Provide login/logout, reviewed password hashing, revocable sessions and administrator MFA. Test invalid credentials, revocation, disabled accounts, refresh replay and MFA enrollment/recovery without bypass. Mechanisms remain DEC-12. |
| ADM-04 | P0 | List, disable/reactivate and reset user credentials. Disable revokes usable sessions/sockets; reactivation does not revive revoked credentials. Reset behavior must disclose historical-key effects. |
| ADM-05 | P0 | Show an administrator inbox with one conversation per user; ordinary users cannot access its listing or management functions. |
| ADM-06 | P0 | Administrator exchanges all P0 message types and reads history using its authorized keys. Administrative role alone must not reconstruct unavailable historical keys. |
| ADM-07 | P0 | Configure quotas and show reconciled committed/reserved storage usage. Verify concurrent uploads, failed uploads and quota reductions without data loss. |
| ADM-08 | P0 | Audit security-relevant admin actions with actor, event and outcome under a defined retention policy. Exclude passwords, tokens, OTPs, message content and content keys. |
| ADM-09 | P1 | Add verified optional account email and SMTP password reset. Single-use expiry and non-enumerating responses must be specified; reset is not automatic key recovery. |
| ADM-10 | P1 | Add account deletion and retention controls with explicit effects on messages, attachments, keys, audit and backups. Do not claim deletion of recipient copies. |

Administrator bootstrap, MFA recovery, session transport, credential reset session invalidation and device enrollment need explicit design before implementation. Routine credential reset is P0; self-service SMTP recovery remains P1.

### 4.6 Website localization and distribution

| ID | Priority | Required behavior and acceptance |
|---|---|---|
| WEB-01 | P0 | Deliver responsive Arabic/English public, guest, chat and admin flows. No required action may exist in only one language. |
| WEB-02 | P0 | Support RTL/LTR, language switching and localized validation, dates and email. Test mixed-script messages, filenames, aliases and locale-preserving navigation. |
| WEB-03 | P0 | Publish home, features, download, privacy, security, terms and self-hosting information. Descriptions must reflect actual release capability and retention. About/FAQ pages remain additional proposals. |
| WEB-04 | P0 | Provide localized crawlable public content, metadata, sitemap, canonical URLs and hreflang without private data. Check both locales and deployment base URLs. |
| WEB-05 | P0 | Exclude private routes from sitemap/indexing and independently protect content. Test unauthenticated crawlers; guest room shells may be public but room content still requires invitation/membership. |
| WEB-06 | P0 | Link source and available signed releases with version/checksum information. Before apps exist, show their unavailability without fabricated downloads. |
| WEB-07 | P0 | Provide light/dark themes and accessible keyboard/screen-reader operation. Priority is retained from the PRD pending DEC-11 confirmation; accessibility target is NFR-08. |
| WEB-08 | P1 | Add PWA installability while excluding private content, invitations and keys from service-worker caches. Test offline and update behavior. |
| MOB-01 | P1 | Deliver Android core messaging with secure device key storage. Self-hosted instance configuration, protocol compatibility and enrollment require a mobile specification. |
| MOB-02 | P1 | Publish signed APKs, checksums, version and release notes through GitHub Releases. Retain signing material securely and test upgrades. |
| MOB-03 | P2 | Add iOS only after signing, build and distribution feasibility is approved; do not promise GitHub-hosted IPA installation for arbitrary devices. |

Arabic and English begin in the foundation, including security errors and mail templates. Default locale and theme persistence remain proposed choices. SEO exclusion is not an authorization mechanism. PWA delivery must not weaken temporary non-persistence.

### 4.7 Deployment and ownership

| ID | Priority | Required behavior and acceptance |
|---|---|---|
| DEP-01 | P0 | Maintain one public source monorepo. Document package boundaries and licensing; no hosted service contains the sole copy of application logic. |
| DEP-02 | P0 | Provide Docker Compose web/backend/PostgreSQL/proxy deployment with persistent DB/media volumes. Verify clean installation and service restart without persistent data loss. |
| DEP-03 | P0 | Support independent web/API/PostgreSQL deployment with documented endpoints and runtime public frontend config. Test the same built web artifact against a second environment, TLS and auth origins. |
| DEP-04 | P0 | Run core functions without excluded BaaS/auth/media dependencies. Optional CAPTCHA must be disableable; audit required runtime integrations. |
| DEP-05 | P0 | Use configurable standard SMTP and a local development mail sink. Secrets must not appear in browser config, repository or logs. |
| DEP-06 | P0 | Document and test coherent DB/media migration and restore plus separately protected required key/recovery material. Restore to a clean environment and verify authorized decryption where recovery policy permits. |
| DEP-07 | P0 | Validate an identified free hosting configuration before claiming support. Record terms date, tested limits and persistence/SMTP/WebSocket results; failure changes the support claim, not the ownership constraints. |
| DEP-08 | P0 | Configure optional CAPTCHA/email independently of hosting. Default public verification remains enabled; explicit override is documented. Reject inconsistent enabled-verification/no-SMTP configuration rather than silently bypassing it. |

Configuration changes do not migrate stored data. Media initially follows a private disk attached to the backend. Independent storage services and distributed coordination are not MVP requirements. No provider is currently approved.

## 5 Nonfunctional requirements

| ID | Candidate specification and acceptance evidence |
|---|---|
| NFR-01 | Production uses HTTPS/WSS; authorization covers API, connection and event paths. Test cross-user access, stale sessions, origin/proxy handling and CSRF according to the chosen session design. |
| NFR-02 | Select reviewed primitives and an established protocol/library; no home-grown cryptographic protocol. Review key authentication, integrity, replay, group membership and recovery, with interoperability/negative tests before E2EE release claims. |
| NFR-03 | Separate temporary and persistent data paths. Prefer a temporary process without DB credentials, DB network access or media volume. Test chosen runtime permissions; document weaker combined-profile isolation if approved. |
| NFR-04 | Prevent intentional temporary content/key persistence in application/server/browser caches and storage. Inspect failure and lifecycle paths, proxy/error logging and backup scope; record residual OS/device limitations. |
| NFR-05 | Collect only approved operational metadata; no advertising, mandatory analytics or trackers. Inventory network requests and stored fields, with purpose and retention for each. |
| NFR-06 | Bound RAM, disk, connections, queues and streaming buffers. Load tests include full rooms, slow receivers, concurrent uploads and disk pressure; no mandatory server video transcoding. Budgets require DEC-04/13. |
| NFR-07 | Persist managed data through restart and verify restore, consistency and authorized decryption. Temporary rooms must not survive via backups. RPO/RTO targets remain open. |
| NFR-08 | Target WCAG 2.2 AA in both locales, with automated checks and manual keyboard/screen-reader/RTL assessment. Record assessed scope; do not claim conformance based on automation alone. |
| NFR-09 | Use modular documented TypeScript, reproducible dependency/build configuration and meaningful automated tests. Future CI must run the selected checks from a clean checkout. |
| NFR-10 | Before production publish accurate security/privacy/retention/disclosure policies matching actual behavior, including admin participation, metadata, recovery loss and backup limits. |
| NFR-11 | No mandatory paid SaaS. Document infrastructure quotas, optional costs and feature degradations honestly; free hosting support requires DEP-07 evidence. |

## 6 Proposed resource defaults

These values reproduce PRD section 5 for review. They are neither measured capacity nor additional approved limits. Byte units, ciphertext overhead, message-envelope maxima and global budgets require DEC-04 before implementation acceptance.

| Setting | PRD proposal |
|---|---|
| Room lifetime | 60 minutes default; 5 minutes minimum; 24 hours maximum |
| Participants / active rooms | 8 per room / 50 per instance, subject to testing |
| Text | 4 KiB plaintext target; separate bounded ciphertext envelope required |
| OTP | 5-minute validity; 5 attempts per challenge |
| Creation | 3/hour/IP and 5/day/verified email |
| Voice | 10 minutes and 5 MB |
| Image | 10 MB input; optimization target around 1 MB |
| Video | 25 MB; 120-second target; 720p where supported |
| Other audio / documents | 15 MB / 20 MB |
| User / instance media | Configurable; numeric defaults pending feasibility |

The server cannot enforce true plaintext length or encrypted media duration from ciphertext alone. Bound ciphertext and actual stored bytes independently. Additional resend/login/join/message rate budgets remain open. Shared-IP fairness, IPv6 behavior, proxy trust and counter resets require documented tests.

## 7 State and failure contracts

### 7.1 Temporary lifecycle

Proposed refinement under DEC-16: successful creation fixes an immutable deadline; waiting for participants and sending messages never extends it. Conceptual states are `WAITING`, `ACTIVE`, `TERMINATED`, `EXPIRED`; an allocation failure creates no usable room. These names are not wire contracts.

Owner termination and expiry are terminal. Every join/send/management operation checks the deadline and current state, even if scheduled cleanup has not run. Restart drops room state. After deletion of RAM records, callers may receive a generic unavailable result; durable tombstones are not required. Newly created rooms use new credentials.

### 7.2 Persistent lifecycle

Proposed refinements under DEC-12/15: first-login users may only complete credential/security setup until required changes are complete; disabled users cannot refresh, reconnect or keep sending on existing sockets. Messages have a client operation identifier scoped to their sender/conversation; retries yield one durable record through a shared authorized handler.

Uploads reserve bounded quota, stream ciphertext into private temporary storage and become visible only after authorized finalization. Abort/failure releases reservations and removes orphan data under a documented cleanup deadline. Staging files contain persistent-mode ciphertext only. The final transaction/filesystem recovery design belongs in the SAD/API/storage specifications.

### 7.3 Errors and outages

Use stable machine-readable error codes with localized user text. Distinguish expired/unavailable rooms, denied access, rate limits, quotas, unsupported media and transient failures without returning sensitive internals. Protect public authentication/verification responses from unnecessary account enumeration.

SMTP failure must not grant unverified creation when verification is enabled. DB/storage failure must not report durable message acceptance. Key loss must not be described as a temporary server error or solved by silently storing server-readable content keys. Disk exhaustion must stop new allocation safely while preserving existing data.

## 8 Proposed derived requirements

These refinements close specification gaps and require review; they do not replace PRD IDs or add unapproved product features.

| ID | Sources | Proposed acceptance addition |
|---|---|---|
| SRS-D01 | TMP-05/06/07/09 | Immutable creation-time deadline; validate at operation time, not only in cleanup timer. |
| SRS-D02 | ABU-01/04/05 | Single-use verification grants and atomic room-allocation/limit policy; parallel consumption cannot create excess rooms. |
| SRS-D03 | MSG-01/02, ADM-04 | Enforced conversation uniqueness, defined durable acknowledgment, duplicate-send suppression and immediate session/socket revocation. |
| SRS-D04 | MED-05/06/08 | Atomic quota reservation, bounded streaming and recoverable orphan cleanup; no quota leak after interrupted finalization. |
| SRS-D05 | DEP-03, NFR-01 | Same artifact runtime public config, validated origins, documented session transport and secret separation. |
| SRS-D06 | ADM-03, NFR-10 | Safe administrator bootstrap and MFA/key recovery documentation without public default credentials. |

## 9 Open decisions and release gates

The [public decision register](../planning/DECISIONS.md) is the decision list, including DEC-11 through DEC-16. DEC-05 license and DEC-07 default verification are resolved only in the stated respects. No protocol, provider, token transport or key-recovery model is selected by this SRS. DEC-17 records community/tooling work separately from application implementation.

Before implementation of affected components, settle protocol/authenticated membership (DEC-01), device/history recovery (DEC-02), process boundaries (DEC-06), session/bootstrap design (DEC-12) and command semantics (DEC-15/16). Before release, settle metadata/retention (DEC-07/09/14), workload/support matrix/limits (DEC-03/04/08/13) and provisional scope discrepancies (DEC-11). iOS remains deferred.

Release requires evidence for all P0 rows and NFRs, a clean Compose deployment, restart and clean-environment restore, authorized history decryption, cross-user rejection, temporary non-persistence inspection, three-person encrypted room flows, direct voice/media flows in both locales and bounded abuse tests. The PRD also requires a documented distributed configuration; support and free-hosting claims must match actual results. A failed feasibility target triggers explicit scope/deployment review rather than a silent requirement change.

Security review scope, reviewers and remediation criteria must be recorded before advertising released E2EE. Whether to require an independent external review is a separate proposed assurance decision, not an approved paid dependency. No part of the current repository implements or validates these capabilities.

## 10 Change control and traceability

Every PRD functional ID and NFR appears once in the tables above. Future issues, API/event contracts and acceptance records shall cite these IDs. Architecture decisions must refer to DEC IDs and distinguish proposed from accepted. Changes affecting P0/P1/P2, privacy, dependencies, recovery or deployment constraints require an explicit recorded decision.

| Version | Change |
|---|---|
| 0.1.0 | Initial review draft, preserving PRD IDs and recording the 2026-11-25 license and public verification decisions. |
