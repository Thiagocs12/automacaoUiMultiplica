# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Base Cypress E2E test scaffold for Multiplica's platform. Currently a clean slate (no specs yet) — feature branches add real test suites via PRs into `reviewAgents` (see Collaboration workflow below).

## Commands

```bash
npm test           # cypress run (headless)
npm run test:open  # cypress open (interactive runner)
```

To run a single spec: `npx cypress run --spec "cypress/e2e/<path-to-spec>"`.

## Architecture

- `cypress.config.js` — minimal `e2e` config, default spec pattern (`cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`), no custom plugins wired in yet.
- `cypress/support/e2e.js` — imports `commands.js`; add global setup here.
- `cypress/support/commands.js` — empty; add custom commands here as the suite grows.
- `cypress/fixtures/example.json` — default Cypress fixture.

## Collaboration workflow

This repo is worked on by multiple people. Full details in `CONTRIBUTING.md`, summary here:

- Never commit directly to `reviewAgents` (the shared integration branch) or `main`. Always create a new branch off `reviewAgents` for any change.
- Open pull requests **against `reviewAgents`**, not `main`.
- A project-level hook (`.claude/settings.json`, `SessionStart`) fetches `origin/reviewAgents` when a session starts and auto-pulls it only if the current branch is `reviewAgents` with a clean working tree; otherwise it just warns instead of switching branches or overwriting local work.
- Merge conflicts: use the `/resolve-conflicts` skill (`.claude/skills/resolve-conflicts/`) instead of resolving blindly.
- CI (`.github/workflows/cypress.yml`) runs `npm test` on every PR into `reviewAgents`/`main`.
- `claude-start.ps1` (git-ignored, personal) pins a given local clone of this repo to a specific Claude Code account via `CLAUDE_CONFIG_DIR` — see `CONTRIBUTING.md` if running multiple accounts in parallel clones.
