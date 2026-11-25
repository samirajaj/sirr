# Sirr Product and Engineering Decisions

Updated: 2026-11-25. This public register accompanies the [PRD](../requirements/PRD.md), [SRS](../requirements/SRS.md) and [SAD](../architecture/SAD.md). It contains product decisions without private conversation history, local account details or environment inventories.

## Authority and status

Latest explicit owner requirements govern. PRD 0.1.0, SRS and SAD remain review drafts; recording a candidate stack or diagram does not approve every implementation detail. Use `Open`, `Proposed`, `Accepted`, `Partially resolved`, `Deferred` or `Superseded` for decisions. Accepted architecture choices receive a separate ADR with context, alternatives, consequences and requirement IDs.

Confirmed constraints: one open-source self-hostable project, project-controlled backend/auth/database/storage/logic, no Supabase/Firebase/mandatory BaaS or paid SaaS, Docker portability, Arabic/English from the beginning and web before mobile. Temporary rooms are text-only and nonpersistent; managed users communicate with the administrator only; microphone recording is P0. No application implementation is authorized by the current planning drafts.

## Decision register

| ID | Topic | Status and next evidence |
|---|---|---|
| DEC-01 | Encryption protocol and authenticated group membership | Open; compare established compatible protocols/libraries, key authentication, replay and membership changes. Blocks secure messaging implementation. |
| DEC-02 | Device enrollment, history and key recovery | Open; define new/lost devices, administrator continuity, password reset, recovery custody and irreversible loss. |
| DEC-03 | Hosting and deployment feasibility | Open; validate Compose and distributed profiles. No free host is approved; provider capability claims require current evidence. |
| DEC-04 | Locale, limits and workload | Proposed; default locale, exact byte units, ciphertext overhead and numeric budgets require review and measurements. |
| DEC-05 | License and name | Partially resolved; owner accepted the existing AGPL v3 `LICENSE` on 2026-11-25. Name/trademark availability remains open. No additional project “or later” designation is inferred. |
| DEC-06 | Temporary runtime isolation | Open; separate runtime without DB credentials/network/media access is preferred for review; combined runtime trades isolation for resource savings. |
| DEC-07 | Verification, SMTP and metadata | Partially resolved; owner requires email verification by default in public deployments, explicitly disableable by the operator. SMTP source, retention/counters and failure policy detail remain open. Never silently bypass enabled verification. |
| DEC-08 | Browser media and encrypted playback | Open; approve supported browser/device/codec matrix, low-memory behavior, encrypted seeking and client optimization limitations. |
| DEC-09 | Retention, deletion and backups | Open; publish a basic P0 retention policy; deletion/export interfaces remain P1. Define backup expiry and recovery/deletion limitations. |
| DEC-10 | iOS distribution | Deferred; signing/build/distribution feasibility precedes promises. |
| DEC-11 | Provisional scope discrepancies | Open; retain PRD P0 MFA, first-login password change and themes pending review. Read/reply/unread and advanced media stay P1 unless explicitly changed. |
| DEC-12 | Sessions, origins and administrator bootstrap | Open; settle browser credential transport, CSRF/CORS, revocation, MFA recovery and secure bootstrap together. |
| DEC-13 | Support and quality targets | Open; define browsers, workload, load duration, latency, accessibility assessment and RPO/RTO. |
| DEC-14 | Temporary non-persistence boundary | Open; include proxy logs, error capture, browser history/session restore, swap/crash dumps and backup inputs. Fragment invitations alone do not prove non-persistence. |
| DEC-15 | Canonical message command and acknowledgment | Open; define persistence, retries/idempotency and shared REST/socket behavior. |
| DEC-16 | Room lifecycle and disconnect semantics | Proposed; creation-time immutable deadline, per-operation expiry checks and no missed-history replay. Reconnect remains P1. |
| DEC-17 | Community workflow and local tooling | Accepted direction on 2026-11-25: establish public contribution standards, GitHub Project/backlog preparation and Docker support. Exact conventions in the workflow are initial maintainer policy for review. This does not authorize application feature implementation, commits or pushes. |

## Delivery and access boundary

Project/label/milestone/issue setup is prepared locally for the owner to execute through their own GitHub CLI session. Credentials stay in the owner's local authentication flow; never place tokens in chat, repository files or issues. A prepared manifest is not a created Project. Remote changes are not performed as part of the current local tooling work.

The new development Compose file contains PostgreSQL and a local mail sink only. Full application containers, production deployment, protocol validation and security testing remain later work. Development tooling does not prove any Sirr security capability.

## Recorded technical direction

TypeScript, Next.js App Router, custom NestJS, PostgreSQL and Docker Compose are the recorded direction. TypeORM/pg, detailed socket/session transport, UI libraries, Caddy, workspace tooling and the mobile framework still require specification or ADRs. Web Crypto is not a complete messaging protocol. No mandatory proprietary cloud service may be introduced to bypass unresolved choices.
