Review the current code changes for over-engineering only, not correctness.

One line per finding: `path:L..` or `path:L..-L..`

Tags:

- `delete:` dead code, unused flexibility, speculative feature. Replacement: nothing.
- `stdlib:` hand-rolled thing the standard library ships. Name the function.
- `native:` dependency or code doing what the platform already does. Name the feature.
- `yagni:` abstraction with one implementation, config nobody sets, layer with one caller.
- `shrink:` same logic, fewer lines. Show the shorter form.

Respect Kirakira carve-outs in `.cursor/rules/kirakira-monorepo.mdc` — do not recommend deleting contracts, catalog boundaries, CORS, param sanitizers, or effect dispose lifecycle.

End with: `net: -N lines possible.` If nothing to cut: `Lean already. Ship.`

Do not apply fixes; list only.
