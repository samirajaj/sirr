# Security Policy

## Current status

Sirr has no supported application release yet. Encryption, authentication, non-persistence, key recovery and deployment security are requirements awaiting implementation and validation. Do not use planning artifacts as evidence that Sirr is suitable for sensitive conversations.

## Reporting

Do not open public issues containing credentials, private conversation content, exploit secrets or unpatched sensitive vulnerability details. GitHub private vulnerability reporting, if enabled on this repository, is the preferred future intake. Its availability has not been verified and no private reporting email is published yet.

A verified private reporting channel, supported-version policy and response process are release prerequisites. Until a private channel exists, a public issue may request a private contact without disclosing the vulnerability itself. Do not assume a response-time commitment or bounty program exists.

## Contributor responsibilities

- Keep credentials, signing/recovery material, production data and private context out of source, issues, logs and Docker build contexts.
- Cite the relevant threat model/ADR for cryptographic or authorization changes. Avoid home-grown messaging protocols.
- Report exactly what was tested and the trust assumptions involved. Never promise absolute secrecy, physical erasure or total DDoS resistance.
- Coordinate any discovered credential leak by revoking/rotating the credential; deleting the latest file alone is insufficient.

See the [publication policy](docs/community/PUBLICATION.md) and [decision register](docs/planning/DECISIONS.md). This file defines the present reporting posture; it does not claim a security review has occurred.
