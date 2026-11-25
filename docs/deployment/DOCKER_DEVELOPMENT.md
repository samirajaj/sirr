# Local Docker Development Dependencies

`compose.dev.yml` starts PostgreSQL and Mailpit for development. There are no Sirr web/backend services, migrations or production deployment yet. This infrastructure setup does not implement messaging, encryption, authentication or DEP-02 in full.

## Prerequisites and startup

Install Docker Engine with Compose or a compatible Docker Desktop setup running Linux containers. From the repository root:

1. Copy `.env.example` to `.env` without overwriting an existing local file.
2. Set a fresh local `POSTGRES_PASSWORD`; the empty example deliberately fails configuration validation. Do not use production credentials.
3. Validate with `docker compose -f compose.dev.yml config --quiet`. Avoid printing the full interpolated config when real secrets are present.
4. When ready to download/start dependencies, run `docker compose -f compose.dev.yml up -d`.
5. Inspect `docker compose -f compose.dev.yml ps` and PostgreSQL health. Mailpit is at `http://localhost:8025`; its local SMTP endpoint is `localhost:1025`.

PostgreSQL uses `localhost:5432`, database/user `sirr_dev` by default and the local password you supply. Ports are configurable in `.env`; all published ports bind to `127.0.0.1`. Future application containers use service names on their own network rather than `localhost`.

## Data and lifecycle

The named `postgres_data` volume persists through ordinary `docker compose -f compose.dev.yml down` and later startup. Changing initialization variables does not modify an already-initialized database or rotate its password. Database upgrades and migrations require explicit procedures.

Mailpit is an unauthenticated development mail sink, not an outbound production mail server. It retains messages within its container lifecycle and has no durable volume in this file; use synthetic OTPs and addresses only. A future production system must not send private room invites or keys through email. Never expose the Mailpit UI publicly.

Stop services with `docker compose -f compose.dev.yml down`. Deleting named volumes destroys development database data; this guide does not make volume deletion part of routine shutdown. Do not run cleanup against shared/production volumes.

## Image policy and next work

The initial candidates are the official `postgres:17-alpine` major tag and `axllent/mailpit:v1.34.0`. These are development choices, not final production stack decisions. PostgreSQL patch tags may change under the major tag; review versions and pin verified digests for reproducible production deployment. Mailpit's release tag is versioned but also needs controlled update review.

Future work includes reviewed app Dockerfiles, minimal/non-root runtime images, a production Compose/proxy configuration, migrations, health/readiness, restricted networks/mounts, coherent DB/media backup/restore and temporary-process non-persistence checks. Do not create fake application Dockerfiles before build outputs and runtime decisions exist.

References: [PostgreSQL official image](https://hub.docker.com/_/postgres), [Mailpit Docker images](https://mailpit.axllent.org/docs/install/docker/), [Mailpit release](https://github.com/axllent/mailpit/releases/tag/v1.34.0), [Compose secret handling](https://docs.docker.com/compose/how-tos/use-secrets/).
