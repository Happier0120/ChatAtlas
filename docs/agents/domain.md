# Domain Docs

This repository uses a single-context domain documentation layout:

- `GLOSSARY.md` at the repository root.
- ADRs under `docs/adr/`.

## Before exploring

Read `GLOSSARY.md` and the ADRs relevant to the area being discussed
or changed.

If these documents do not exist, proceed silently. Do not create
empty placeholders. The `domain-modeling` skill, including when used
through `grill-with-docs`, creates documents as terms and decisions
are resolved.

## Use the glossary's vocabulary

Use the glossary's terms in discussions, specs, tickets, code,
and tests. Respect any synonyms the glossary explicitly avoids.

If a needed concept is missing, reconsider whether it belongs to
the domain or identify the gap for `domain-modeling`.

## Surface ADR conflicts

If a proposal contradicts an existing ADR, identify the conflict
explicitly and explain why the decision may need to be revisited.
Do not silently replace the recorded decision.
