# Ticket 01 implementation record

Date: 2026-11-16 (Asia/Shanghai).

Workflow: Matt Pocock `implement`, `tdd` (including tests.md/mocking.md),
then `code-review` (Standards + Spec). Skills loaded from the installed
official mattpocock-skills 1.3.2 package. The user explicitly authorized
implementation, review and commits; no new design approval is needed.

Baseline: `2be4647cc7f06007328c595b5c57c87ecae37bc3`, clean `master`.
Implementation branch: `feat/fork-v1`. User confirmed the baseline in chat.

## Scope and architecture

Implement [Ticket 01](issues/01-first-turn-persistence.md), bounded by
[Spec](spec.md), GLOSSARY and accepted ADR-0001/0002. No conflicts found.
React/Vite UI, local Fastify server, file-backed SQLite through Drizzle and
committed SQL migrations. A single local Project holds Independent
Conversations. Each Conversation references its history tip; Turns carry
parent links and separate identities, without a creating Conversation owner.
Only the first Turn is supported. Server-side Provider Adapter takes
application messages and explicitly identifies the test Provider/Model.

## Execution plan

The already-approved testing seam is the full UI flow through the real app
and isolated migrated SQLite. Observe saved identities via the app and
outbound requests at the external Provider boundary. No internal unit tests
or database-table assertions. Implementation stays in this chat, with the
two reviewer agents required by the official code-review workflow at the end.

- [x] Slice 1: `tests/first-turn.spec.ts` fails on the initial empty UI;
  implement the submission path in `src/`, `server/`, `shared/`, and
  `drizzle/` until one independent root Turn and controlled reply are visible.
  Run `npm run typecheck` and the single Playwright test.
- [x] Slice 2: add a failing recovery test; stop the server process, close
  the browser context, restart using the same SQLite file, and read the
  same Prompt/reply/identities/Provider/Model. Implement the read UI/API.
- [x] Verify independent New Chats, blank input, migration reuse and
  request isolation at the same UI seam, adding one failing case at a time
  only where behavior is missing.
- [x] Document dependency versions, Windows installation, migration,
  run/test/reproduction commands and actual evidence in README and this record.
- [ ] Run typecheck, build and full suite; pin a reviewable Git commit,
  run official two-axis code-review, fix/refactor any findings, rerun affected
  checks, and commit the final result on `feat/fork-v1`.

Review focus: exact Unicode/whitespace preservation, independent identities,
real process restart, transaction boundaries, no later-ticket features.

## Execution evidence

- Installed exact npm stable versions; `npm ls --depth=0` clean.
  Node 26.7.0 / npm 11.19.0 / win32 x64 / OS 10.0.19045.
  Native better-sqlite3 loaded, SQLite 3.54.1. No compilation fallback needed.
- Initial typecheck found optional IPC disconnect typing in the test harness;
  corrected it, then `npm run typecheck` passed. Initial Vite build passed.
- Slice 1 RED: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- tests/first-turn.spec.ts`
  (PowerShell environment assignment). 1 failure: the real page had no New Chat
  button. Google Chrome was used while bundled Chromium was downloading.
- Slice 1 GREEN: after adding submission, SQLite transaction/migration and
  Node Card, the single UI test passed (4.1s). The test now expands the visible
  record-details controls before reading IDs, matching actual user interaction.
- `npm run db:generate` produced the committed initial migration.
  `npm run db:migrate` ran twice against the same fresh file, both successful.
- Slice 2 RED: the recovery test completed the first Turn, stopped the app,
  restarted on the same SQLite file and opened a new browser context; failed
  because there was no saved-conversation navigation. Implemented read API/UI.
- Slice 2 GREEN: `npm run typecheck`, `npm run build`, then the complete
  `tests/first-turn.spec.ts` passed 2/2 (9.7s). Recovery preserved exact leading/
  trailing whitespace, newline, all identities/metadata and did not regenerate.
- Clean-install regression: plain `npm ci --no-audit --no-fund` unexpectedly
  synthesized `node-gyp rebuild` for better-sqlite3 13.2.0, despite the published
  package's `gypfile: false`; failed because the host lacks Windows SDK.
  Root cause inspected in npm Arborist rebuild logic and upstream package.
  Ruling: deny this package's install scripts using npm's project `allowScripts`
  to use its bundled native prebuild; pin npm >=11.19 <12 for that setting.
  No machine-wide toolchain changes or fake storage fallback.
- Clean-install fix verified: `npm ci --no-audit --no-fund` succeeded (119
  packages, 46s). It still reports upstream deprecated esbuild-kit packages and
  unrecorded esbuild install-script approvals; build and runtime checks pass.
- After clean install: `npm run typecheck`, `npm run db:migrate`, and `npm test`
  passed. Default bundled Chromium: 2/2 (13.9s), including two independent
  New Chats, blank input, outbound messages and real restart recovery.
  Playwright emitted only the host NO_COLOR/FORCE_COLOR warning.
- `npm start` started the production entrypoint on 127.0.0.1:3187 with an
  isolated `data/ticket01-cli-smoke.sqlite`, using the default test Provider.
  No real API Key was configured or needed. Windows 11 has not been tested;
  README distinguishes the Windows 10 local result from upstream support.
