# Sirr (سرّ)

An open-source, self-hostable messaging project for temporary private text rooms and persistent administrator-to-user conversations.

**Status: planning and community setup.** No messaging application, released E2EE implementation or security validation exists yet. The planned direction is TypeScript, Next.js, NestJS, PostgreSQL and Docker. Protocol, key recovery and several deployment decisions remain open.

## Planned experience

- Accountless group text rooms with invitation-based access, a separate owner capability and no durable message history.
- Administrator-provisioned accounts with one private administrator conversation per user, including text, direct voice recording and media.
- Arabic and English from the beginning, with RTL/LTR support; web first and mobile later.
- Project-controlled authentication, database, storage and application logic, with no mandatory BaaS or paid SaaS.

These are requirements, not available capabilities. See the [PRD](docs/requirements/PRD.md), [SRS](docs/requirements/SRS.md), [architecture proposal](docs/architecture/SAD.md), [decisions](docs/planning/DECISIONS.md) and [roadmap](docs/planning/ROADMAP.md).

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md), the [workflow](docs/community/WORKFLOW.md), [publication boundaries](docs/community/PUBLICATION.md) and [Code of Conduct](CODE_OF_CONDUCT.md). Review the [security policy](SECURITY.md) before discussing a vulnerability publicly.

The initial [backlog](docs/planning/BACKLOG.md) and [GitHub setup guide](docs/community/GITHUB_SETUP.md) prepare a single community Project. Preparing files does not create a remote board or issues.

## Local development dependencies

The repository includes a development-only Compose file for PostgreSQL and Mailpit. Follow the [Docker development guide](docs/deployment/DOCKER_DEVELOPMENT.md). There is no application to start yet; full application/production containers are future work.

## License

The project uses the existing [GNU Affero General Public License v3 text](LICENSE).
