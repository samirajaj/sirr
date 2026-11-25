# Contributing to Sirr

Sirr is in the planning phase. Current contributions should improve requirements, threat modeling, architecture decisions, community tooling and bounded feasibility plans. Discuss application implementation before starting it; an issue in Backlog is not approval of its proposed design.

## Start with the project context

Read the [PRD](docs/requirements/PRD.md), [SRS](docs/requirements/SRS.md), [public decisions](docs/planning/DECISIONS.md) and [roadmap](docs/planning/ROADMAP.md). Follow the [Code of Conduct](CODE_OF_CONDUCT.md) and [security policy](SECURITY.md).

Technical documentation, identifiers, code comments, commits and pull requests use English. Arabic discussion and translation contributions are welcome; preserve both languages in product requirements. Maintainers can add English summaries of decisions so the wider community can follow them.

## Contribution flow

1. Search existing issues before opening one. Use the bug, user-story, task or decision form; never include private chat data or secrets.
2. Agree on scope, requirement IDs, dependencies and acceptance criteria. Large protocol/auth/deployment changes require an ADR before implementation.
3. Fork the repository if needed, and create a short-lived branch using the [naming rules](docs/community/WORKFLOW.md).
4. Make one focused change. Keep requirements and evidence aligned; do not add mandatory BaaS or paid dependencies.
5. Run checks appropriate to the change. For current tooling, run `node --test scripts/github/bootstrap.test.mjs` and `node scripts/github/bootstrap.mjs --dry-run`. Validate Compose as described in its guide; application tests do not exist yet.
6. Review the complete diff and staged file list against the [publication policy](docs/community/PUBLICATION.md).
7. Open a pull request using the template. Explain the problem/result, cite issues and PRD/SRS IDs, and report checks actually performed with any limitations.

## Review and merge

Use Conventional Commits for commits and PR titles, such as `docs(security): specify lost-device recovery behavior`. Prefer squash merging focused PRs; no permanent `develop` branch is required. The maintainer retains merge authority. Rulesets and CI gates must be enabled and verified separately before claiming they enforce this policy.

Do not report proposed or untested cryptography as secure. Do not include unrelated formatting, lockfile churn or secret-bearing examples. No CLA, DCO/sign-off requirement or automatic commit-signing requirement is introduced by this contribution guide.

See the [workflow](docs/community/WORKFLOW.md) for story/task quality, status transitions, review comments, branch names and the definition of done.
