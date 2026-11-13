# Issue tracker: Local Markdown

Issues and specs for this repo live as Markdown files in `.scratch/`.
These are durable project records intended for version control.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`.
- The spec is `.scratch/<feature-slug>/spec.md`.
- Implementation tickets are individual files at
  `.scratch/<feature-slug>/issues/<NN>-<slug>.md`.
- Number tickets from `01` in dependency order, blockers first.
- Use one file per ticket, never a combined tickets file.
- Record triage state as a `Status:` line near the top of the spec
  or issue. See `triage-labels.md` for the role strings.
- Record ticket dependencies under `Blocked by`, using ticket
  numbers and titles. Use `None` when there are no blockers.
- Append comments and discussion under a `## Comments` heading.

## When a skill says "publish to the issue tracker"

Create the appropriate spec or issue file under
`.scratch/<feature-slug>/`, creating directories as needed.

## When a skill says "fetch the relevant ticket"

Read the referenced file. Resolve a ticket number within its feature
directory; numbers are not globally unique.

## Wayfinding operations

Used by `wayfinder` when that workflow is explicitly invoked.

- Map: `.scratch/<effort>/map.md`, containing Notes,
  Decisions-so-far, and Fog.
- Child ticket: `.scratch/<effort>/issues/NN-<slug>.md`.
- A `Type:` line records `research`, `prototype`, `grilling`, or `task`.
- Wayfinding tickets use their own `claimed` / `resolved` lifecycle.
- A `Blocked by: NN, NN` line records dependencies. A ticket is
  unblocked when every listed ticket is resolved.
- Frontier: open, unblocked, unclaimed tickets, ordered by number.
- Claim: set `Status: claimed` and save before starting work.
- Resolve: append the answer under `## Answer`, set `Status: resolved`,
  and add a summary and link to the map's Decisions-so-far.
