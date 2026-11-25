# Owner Run GitHub Project Setup

This workflow creates community planning resources without connecting the owner's GitHub account to this conversation. The owner reviews and runs the script in their own terminal. No credential or token belongs in chat, repository files or issue bodies.

## What is prepared

The [manifest](../planning/github-project.json) defines one public **Sirr — Development** Project linked to `samirajaj/sirr`, five workflow fields, 23 labels, eight milestones and 28 initial issues. These include eight epics, technical/decision tasks, two feasibility spikes and three representative future user stories. The [backlog](../planning/BACKLOG.md) is generated from that manifest; it is not a complete decomposition of all future product work.

The script creates a new board as public because the manifest contains public community work. It refuses an existing private board with the same name rather than changing its visibility. It does not create commits, push files, install software, change repository permissions or create authentication tokens.

## Preview and review

Only Node.js is needed for local preview/tests:

```text
node scripts/github/bootstrap.mjs --dry-run
node --test scripts/github/bootstrap.test.mjs
node scripts/check-repository.mjs
```

No argument also means dry-run. Dry-run does not authenticate or contact GitHub. Review issue wording, dependencies, milestone/priority and proposed effort in the manifest. After edits, run `node scripts/github/bootstrap.mjs --render-backlog` to regenerate the readable backlog.

## Authenticate locally and apply

The owner needs GitHub CLI installed and a local login for **samirajaj** with repository write and Project write permissions. Authentication happens in the owner's own terminal/browser, not through this chat. Follow the official [GitHub CLI authentication guide](https://cli.github.com/manual/gh_auth_login). For a public repository, `public_repo` plus `project` OAuth scopes are sufficient for this script's intended resource operations; actual account/repository permissions must also allow them. Do not grant unrelated admin or delete permissions.

An owner-managed classic OAuth login may use:

```text
gh auth login --hostname github.com --web --scopes public_repo,project
gh auth status --hostname github.com
gh api --hostname github.com user --jq .login
```

GitHub CLI may request its own baseline scopes in addition; inspect the browser's requested permissions before accepting. The script does not request/expand scopes itself. Existing logins can follow [gh auth refresh](https://cli.github.com/manual/gh_auth_refresh) as appropriate. Do not run `gh auth token` to paste credentials into the conversation. If you do not want agent processes to use this login, perform authentication and `--apply` yourself outside an agent-controlled session.

After reviewing the exact manifest, run:

```text
node scripts/github/bootstrap.mjs --apply
```

`--apply` makes remote writes immediately; it is not another preview. It checks the identity and repository before mutation, enumerates existing resources and refuses ambiguous issue markers/fields. The current environment has not executed this command against live GitHub. Local tests use a fake service; they do not prove current remote permissions or API compatibility.

## Reruns and interruption

Setup reuses labels/milestones by name/title, a unique matching public Project by title and owner-created issues by stable `sirr-backlog` markers. Do not remove markers or rename the configured board without reconciling the manifest. Closed owner issues are reused rather than reopened. Existing issue content, labels, milestone and existing board item values are preserved.

The script initializes Status options only on a newly created empty board. Existing boards must already include the configured options; missing options produce an actionable failure instead of overwriting community fields. A failure can leave partial remote setup because GitHub has no transaction spanning these resources. Inspect the reported error, resolve it and rerun. Lost issue-create responses are tested for duplicate prevention. Do not run multiple bootstrap processes concurrently; a read-before-create check cannot prevent every race between separate clients.

If interrupted during board visibility/status initialization, reconcile those properties manually before rerunning. If interrupted while assigning a newly added item's fields, fill missing values manually; reruns deliberately do not reset existing item fields. Permission failures or partial runs must not be reported as successful full setup. No deletion or rollback is automatic.

## Owner setup after creation

1. Open the printed Project URL; confirm the linked repository, issue count, milestones, fields and initial statuses. Verify the board is intentionally public and contains no private context.
2. Add Board, Backlog, Milestone and Security/Decisions views described in the [workflow](WORKFLOW.md). Use native milestone metadata instead of a duplicate manually synchronized field.
3. Optionally enable built-in workflows for new items or closed issues after deciding how they affect epics and security gates. These automations and UI views are not created by the script.
4. Use native sub-issue/dependency relationships if desired. Issue bodies already link dependencies and epic issues; the script does not claim to create native relationships.
5. Review/publish local files through Git separately. Issue forms, CODEOWNERS, security policy and workflows do not become active merely because issues are created. No commit/push is included in setup.
6. Configure verified private vulnerability intake and suitable `main` rules. Required CI checks should name checks that actually exist and have run; avoid impossible solo-maintainer review requirements.
7. Triage items into Ready only after dependency and design review. Do not treat all P0 work as immediately approved implementation.

References: [GitHub CLI Project scopes](https://cli.github.com/manual/gh_project), [Projects API](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects), [issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms).
