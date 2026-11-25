# Sirr — Product Requirements Document

| Field | Value |
|---|---|
| Product | Sirr (سرّ) |
| Version | 0.1.0 |
| Status | Draft for approval |
| Repository | `sirr` |
| Intended path | `docs/requirements/PRD.md` |
| Delivery | Web first, mobile later |

## 1. Product overview

Sirr is an open-source, self-hostable messaging platform offering two distinct communication modes: temporary, accountless text rooms and persistent, private conversations between an instance administrator and individually provisioned users. Its purpose is to give operators control over their software and data without mandatory proprietary backend services or subscriptions.

## 2. Goals

- Enable private, invitation-based temporary communication without permanent accounts or message storage.
- Enable persistent administrator-to-user messaging, including voice recordings, images, videos and files.
- Protect conversation content from infrastructure providers through client-side end-to-end encryption (E2EE), subject to a validated security design.
- Provide complete Arabic and English user experiences.
- Make public product pages discoverable by search engines while keeping private content inaccessible to them.
- Support a zero mandatory subscription cost deployment within available free hosting quotas.
- Support both single-server Docker Compose deployment and distributed hosting with configuration-driven endpoints.
- Keep application logic, authentication, database schema and storage under project control.

## 3. Actors

| Actor | Responsibilities |
|---|---|
| Guest | Creates or joins temporary rooms without an account. |
| Room owner | A guest with a separate secret capability to manage and terminate a room. |
| Registered user | Uses an administrator-provisioned account to communicate exclusively with the administrator. |
| Administrator | Provisions accounts, manages instance settings and participates in every persistent conversation. |
| Instance operator | Deploys, updates, backs up and maintains the software and infrastructure. May also be the administrator. |

## 4. Product scope and requirements

P0 = required for the initial public web MVP; P1 = subsequent enhancement; P2 = later expansion. Security requirements must be satisfied before any public release claiming secure messaging. IDs are stable references for future SRS and GitHub issues.

### 4.1 Temporary rooms

| ID | Requirement | Priority |
|---|---|---|
| TMP-01 | Create a private room without a permanent account. | P0 |
| TMP-02 | Generate an unpredictable invitation link and separate owner capability. | P0 |
| TMP-03 | Join via invitation and use an optional display alias. | P0 |
| TMP-04 | Exchange end-to-end encrypted text in real time, including group rooms. | P0 |
| TMP-05 | Select a room lifetime and display the remaining time. | P0 |
| TMP-06 | Allow the owner to terminate the room at any time; automatically expire rooms at their deadline. | P0 |
| TMP-07 | Reject joins and message transmission after termination or expiry. | P0 |
| TMP-08 | Never persist temporary messages, content keys or message history in application databases, files, logs, caches or backups. | P0 |
| TMP-09 | Keep room state and transient message forwarding in memory; do not provide offline delivery or historical replay. | P0 |
| TMP-10 | Clear accessible room content and key references on compliant clients when a session ends; disclose deletion limitations. | P0 |
| TMP-11 | Allow reconnects before expiry when valid capabilities remain; do not recover lost message history. | P1 |
| TMP-12 | Support owner removal of participants, admission controls and optional room passwords. | P1 |
| TMP-13 | Support typing indicators and participant presence. | P1 |

A restart of a RAM-only room service may terminate all active rooms. Loss of the owner capability may prevent manual termination; automatic expiry must remain effective. Invite secrets must not be exposed in server logs, referrers or email messages. Temporary rooms do not support media.

### 4.2 Room creation verification and abuse prevention

| ID | Requirement | Priority |
|---|---|---|
| ABU-01 | Support email ownership verification before room creation using a short-lived, single-use OTP sent through SMTP. | P0 |
| ABU-02 | Do not require an email account registration or expose email addresses to participants. | P0 |
| ABU-03 | Support optional Cloudflare Turnstile with server-side verification and configurable enablement. | P0 |
| ABU-04 | Limit HTTP requests, OTP requests and attempts, socket connections, message rates and room creation. | P0 |
| ABU-05 | Enforce bounded resource consumption, including active rooms, participants, payload sizes, queues and connection timeouts. | P0 |
| ABU-06 | Minimize verification metadata, avoid permanent email-to-room associations and document retention. | P0 |
| ABU-07 | Provide operator-configurable abuse limits and documented network-level protection guidance. | P0 |

Email verification proves mailbox access, not human identity. CAPTCHA and application throttling do not guarantee resistance to volumetric DDoS. Email verification enablement and limits require operator configuration; public deployments should use protective defaults. Verification tokens, invitation credentials and encryption keys must never be logged.

### 4.3 Persistent messaging

| ID | Requirement | Priority |
|---|---|---|
| MSG-01 | Provide exactly one private conversation per registered user with the instance administrator in the MVP. | P0 |
| MSG-02 | Send and receive persistent text messages in real time. | P0 |
| MSG-03 | Retrieve authorized conversation history after reconnecting or signing in. | P0 |
| MSG-04 | Support voice recordings, images, short videos, audio files and documents. | P0 |
| MSG-05 | Persist encrypted message and attachment content and support authorized client-side decryption. | P0 |
| MSG-06 | Prevent registered users from contacting or accessing other registered users. | P0 |
| MSG-07 | Clearly disclose that the administrator is a conversation participant and that persistent content is retained. | P0 |
| MSG-08 | Provide delivery/read status, unread indicators and replies to messages. | P1 |
| MSG-09 | Support local search of decrypted history without exposing plaintext to the server. | P1 |
| MSG-10 | Support retention, deletion and export policies, with authorized client-side export of readable content. | P1 |

Persistent history requires a usable encryption key recovery and device enrollment design. Account password reset must not silently grant access to old encrypted history or imply recovery where no recovery key exists.

### 4.4 Voice and media

| ID | Requirement | Priority |
|---|---|---|
| MED-01 | Record voice directly from the microphone in the conversation interface. | P0 |
| MED-02 | Handle permission denial and recording failures; display duration; stop, cancel, preview and send recordings. | P0 |
| MED-03 | Play, pause and seek within received recordings. | P0 |
| MED-04 | Upload, preview and view images; play supported videos and audio; download authorized files. | P0 |
| MED-05 | Display upload progress, handle failures and allow retry or cancellation. | P0 |
| MED-06 | Enforce configurable per-file, per-user and instance-wide storage limits, including concurrent uploads. | P0 |
| MED-07 | Optimize media on the client before encryption where supported; reject oversized files with actionable feedback. | P0 |
| MED-08 | Store encrypted attachments outside the public web root on persistent private storage. | P0 |
| MED-09 | Support browser-compatible recording formats and safe attachment handling. | P0 |
| MED-10 | Add waveform visualization, playback speed and improved video compression. | P1 |

The server can enforce ciphertext size and authorization, but cannot reliably inspect encrypted media content, duration or malware. Client-side validation and safe rendering are necessary; no server-side plaintext transcoding is required for E2EE conversations. Video uploads are not live video calls.

### 4.5 Authentication and administration

| ID | Requirement | Priority |
|---|---|---|
| ADM-01 | Provide administrator-only account creation; no public registration. | P0 |
| ADM-02 | Support username and temporary password provisioning with mandatory first-login password change. | P0 |
| ADM-03 | Provide secure login, logout, password hashing, session revocation and administrator MFA. | P0 |
| ADM-04 | List users, disable and re-enable accounts, and reset credentials. | P0 |
| ADM-05 | Provide an administrator inbox with a separate conversation for each user. | P0 |
| ADM-06 | Allow the administrator to exchange all supported persistent message types and review history. | P0 |
| ADM-07 | Configure resource quotas and view storage usage. | P0 |
| ADM-08 | Record security-relevant administrative actions without conversation content or credentials. | P0 |
| ADM-09 | Support optional verified email addresses and SMTP-based password reset. | P1 |
| ADM-10 | Support account deletion and documented retention controls. | P1 |

The administrator has no privileged access to temporary room content. Persistent chats are not a system for silently monitoring conversations between other users.

### 4.6 Public website, localization and distribution

| ID | Requirement | Priority |
|---|---|---|
| WEB-01 | Provide a responsive website and chat UI in Arabic and English. | P0 |
| WEB-02 | Support RTL/LTR, language switching, localized validation errors, dates and email templates. | P0 |
| WEB-03 | Provide public home, features, download, privacy, security, terms and self-hosting information. | P0 |
| WEB-04 | Provide crawlable localized public pages, metadata, sitemap, canonical URLs and hreflang. | P0 |
| WEB-05 | Exclude private routes from search indexing and enforce independent access authorization. | P0 |
| WEB-06 | Link to GitHub source and available signed application releases without hosting binaries on the messaging server. | P0 |
| WEB-07 | Support light/dark themes and accessible keyboard and screen-reader interaction. | P0 |
| WEB-08 | Provide PWA installability without caching private content. | P1 |
| MOB-01 | Provide an Android app with equivalent core messaging and secure device key storage. | P1 |
| MOB-02 | Distribute signed Android APKs through GitHub Releases with checksums and version information. | P1 |
| MOB-03 | Provide iOS support subject to signing, build and distribution feasibility. | P2 |

No search engine ranking is guaranteed. Before mobile releases exist, the download page must accurately state availability. iOS cannot generally be distributed to arbitrary devices simply by uploading an IPA to GitHub.

### 4.7 Deployment and ownership

| ID | Requirement | Priority |
|---|---|---|
| DEP-01 | Maintain source code in one public monorepo. | P0 |
| DEP-02 | Provide Docker Compose deployment with PostgreSQL, persistent media volumes, web, backend and reverse proxy. | P0 |
| DEP-03 | Support independent deployment of web, API and PostgreSQL through documented environment configuration and runtime public frontend configuration. | P0 |
| DEP-04 | Avoid mandatory BaaS, proprietary authentication or managed media APIs; implement application logic in the project. | P0 |
| DEP-05 | Support standard SMTP configuration and local email testing without proprietary mail APIs. | P0 |
| DEP-06 | Document backup, restore and migration of database, media, secrets and encryption recovery material. | P0 |
| DEP-07 | Validate a free hosting configuration before claiming that it is supported. | P0 |
| DEP-08 | Allow optional CAPTCHA and email settings without binding the application to a specific hosting provider. | P0 |

A distributed deployment requires compatible networking, TLS, persistent storage, allowed outbound SMTP and suitable WebSocket support. Changing environment variables alone does not migrate data. File storage initially follows the backend; independent storage deployment is a future extension unless a supported portable interface is validated.

## 5. Proposed initial limits

These are draft defaults, not confirmed hosting capabilities or final limits. Operators must be able to configure them safely.

| Setting | Proposed value |
|---|---|
| Room lifetime | 60 minutes default; 5 minutes to 24 hours |
| Participants per room | 8 |
| Active rooms per instance | 50, subject to load testing |
| Text payload | 4 KiB plaintext target, with separate ciphertext envelope limit |
| OTP validity | 5 minutes |
| OTP attempts | 5 per challenge |
| Room creation | 3/hour/IP and 5/day/verified email |
| Voice recording | 10 minutes; 5 MB |
| Image upload | 10 MB; optimized target around 1 MB |
| Video upload | 25 MB; 120-second target; 720p where supported |
| Audio file upload | 15 MB |
| Document upload | 20 MB |
| Total and per-user media quota | Configurable; set after hosting feasibility tests |

Duration and codec targets are client-side controls; the server independently enforces actual uploaded byte counts. Rate limits must account for shared IPs, proxy trust and global resource budgets.

## 6. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | Require HTTPS/WSS in production and secure authentication and authorization on every relevant API/socket operation. |
| NFR-02 | Use reviewed cryptographic primitives and an established protocol where feasible; do not claim E2EE until protocol, key authentication and implementation have been reviewed and tested. |
| NFR-03 | Separate temporary and persistent data paths; prefer a process with no database credentials for temporary rooms. Any combined-process deployment must document its weaker isolation. |
| NFR-04 | Do not persist temporary chat content in logs, browser storage, service worker caches, database, filesystem or backups. |
| NFR-05 | Minimize metadata and avoid advertising, mandatory analytics and third-party tracking. |
| NFR-06 | Bound memory, disk and connection usage; stream uploads/downloads and avoid mandatory server-side video transcoding. |
| NFR-07 | Preserve persistent data across service restarts and verify backup/restore procedures. |
| NFR-08 | Target WCAG 2.2 AA and test both locales and directions. |
| NFR-09 | Use modular, documented TypeScript code with automated tests and reproducible builds. |
| NFR-10 | Publish accurate security, privacy, data retention and responsible disclosure policies before production use. |
| NFR-11 | Do not require paid SaaS subscriptions; document free-tier limits and optional infrastructure costs. |

### Privacy and trust boundaries

Sirr cannot guarantee that recipients will not capture messages, that all volatile memory is physically erased, or that hosting providers observe no connection metadata. A malicious web host can potentially serve altered JavaScript; E2EE assumes trusted client software and authenticated keys. Email providers may retain delivery metadata. Self-hosting increases operator control but does not remove the need for device security, backups, patching and applicable privacy compliance.

## 7. Technology constraints and proposed baseline

| Layer | Baseline |
|---|---|
| Language | TypeScript |
| Web | Next.js (React), App Router; next-intl proposed |
| Backend | Custom NestJS application, REST and Socket.IO |
| Database | PostgreSQL, TypeORM and pg driver |
| Media | Private filesystem, streamed I/O, Docker volumes |
| Browser media | MediaRecorder, Web Audio, Canvas; optional client-side video encoding |
| Mobile | React Native / Expo, later phase |
| Email | SMTP via Nodemailer; Mailpit for development |
| Abuse protection | Application rate limiting; optional Cloudflare Turnstile |
| Infrastructure | Docker Compose, Caddy |
| Workspace | pnpm, Turborepo |
| Distribution | GitHub Releases |

The detailed technical selection and cryptographic protocol belong in the Software Architecture Document and ADRs. Supabase, Firebase, mandatory external storage APIs and proprietary authentication services are excluded. No free hosting provider is approved yet.

## 8. Out of scope for the web MVP

- Public registration, user-to-user persistent chats, public channels, social feeds and contact discovery.
- Voice/video calls and temporary-room media attachments.
- Paid subscriptions, advertisements and mandatory cloud integrations.
- Native mobile applications (planned after web MVP).
- Guaranteed anonymity, guaranteed physical erasure, unlimited storage or absolute DDoS resistance.
- Advanced distributed scaling, mandatory server-side transcoding and multi-administrator collaboration.

## 9. Delivery phases

| Phase | Outcome |
|---|---|
| M0 — Feasibility | Validate hosting, SMTP, WebSockets, storage persistence, PostgreSQL, media browser support and encryption approach. |
| M1 — Foundation | Establish monorepo, Docker, CI, configuration and bilingual public site. |
| M2 — Temporary rooms | Implement verified room creation, E2EE, expiry, owner authorization and abuse controls. |
| M3 — Managed accounts | Implement administrator MFA, provisioning, authentication and authorized inbox. |
| M4 — Persistent messaging and media | Implement encrypted history, key lifecycle, text, voice, images, video and private uploads. |
| M5 — Web release | Complete security testing, privacy documentation, SEO, deployment and backup/restore validation. |
| M6 — Mobile | Deliver Android and PWA enhancements; evaluate iOS distribution. |

## 10. Release acceptance criteria

- Two independent guests can exchange encrypted text, and room expiry and owner termination prevent further delivery or joins.
- Temporary message content is absent from persistent application storage and logs in tested flows, including failures and restart scenarios.
- An administrator can provision a user, exchange text, record and exchange voice messages, and exchange supported images and videos.
- Persistent content survives restart and is decryptable only by authorized participants with appropriate keys; unauthorized cross-user access tests fail.
- Limits reject excess connections, messages, OTP requests and media uploads without unbounded resource growth.
- Arabic and English flows work on supported desktop and mobile browsers, including microphone recording and RTL layout.
- Public pages are crawlable; private content is authenticated and not indexed by design.
- A clean Docker Compose installation, backup/restore and at least one proposed distributed configuration pass documented deployment tests.
- Security review, key recovery behavior and documented threat model are completed before advertising E2EE as a released capability.

## 11. Open decisions and risks

| ID | Decision or risk | Status |
|---|---|---|
| DEC-01 | Established encryption protocol, group membership and key authentication | Open — security release blocker |
| DEC-02 | Persistent device enrollment, key recovery and historical access after password reset | Open — persistent release blocker |
| DEC-03 | Free hosting: WebSocket uptime, writable persistent disk, memory, SMTP, database access and bandwidth | Open — feasibility blocker |
| DEC-04 | Default locale and final resource limits | Proposed |
| DEC-05 | Open-source license (AGPL-3.0 proposed) and name/trademark availability | Open |
| DEC-06 | Final temporary-service isolation and combined hosting profile | Open |
| DEC-07 | Email verification policy, metadata retention and production SMTP source | Open |
| DEC-08 | Browser/codec support matrix and practical encrypted video playback | Open |
| DEC-09 | Persistent retention/deletion policy and legal requirements for deployment jurisdictions | Open |
| DEC-10 | iOS signing and distribution | Deferred |

## 12. Approval and next documents

This document is a product baseline for review, not evidence of implemented functionality. After approval, derive the SRS, System Architecture Document, threat model, ADRs, API contracts and GitHub issues from its requirement IDs. Changes to scope should be recorded and reviewed before implementation.

| Version | Change |
|---|---|
| 0.1.0 | Initial consolidated requirements draft. |
