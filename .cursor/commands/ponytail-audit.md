Audit this repository for over-engineering (whole tree, not just the diff).

Hunt: reinvented stdlib, unneeded dependencies, speculative abstractions, dead flexibility, duplicate DTOs that could merge (only if they don't violate `@kirakira/contracts` boundaries).

One line per finding with tag (`delete` / `stdlib` / `native` / `yagni` / `shrink`) and file path.

Skip: `design-plan/`, harness docs, and architecture-enforced package splits unless clearly redundant.

End with `net: -N lines possible.` or `Lean already. Ship.`

List only; do not edit files unless asked.
