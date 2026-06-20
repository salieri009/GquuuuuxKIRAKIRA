# Ponytail integration

This repo uses [ponytail](https://github.com/DietrichGebert/ponytail) for minimal, YAGNI-focused agent behavior in Cursor.

## What was added

| Path | Purpose |
|------|---------|
| [.cursor/rules/ponytail.mdc](../../.cursor/rules/ponytail.mdc) | Always-on ponytail ladder (upstream rules) |
| [.cursor/rules/kirakira-monorepo.mdc](../../.cursor/rules/kirakira-monorepo.mdc) | Monorepo carve-outs — wins over ponytail when they conflict |
| [.cursor/commands/ponytail-review.md](../../.cursor/commands/ponytail-review.md) | `/ponytail-review` — diff complexity review |
| [.cursor/commands/ponytail-audit.md](../../.cursor/commands/ponytail-audit.md) | `/ponytail-audit` — repo-wide over-engineering audit |

## Usage in Cursor

1. Rules apply automatically on every chat (ponytail + kirakira-monorepo).
2. Type `/ponytail-review` after a change set to get a delete-list.
3. Type `/ponytail-audit` for a whole-repo simplification pass.

## Updating ponytail

Refresh the rule from upstream:

```bash
curl -o .cursor/rules/ponytail.mdc https://raw.githubusercontent.com/DietrichGebert/ponytail/main/.cursor/rules/ponytail.mdc
```

Re-add the Kirakira carve-out paragraph at the bottom if the file was overwritten.

## License

Ponytail is [MIT](https://github.com/DietrichGebert/ponytail/blob/main/LICENSE). Attribution in `ponytail.mdc` header.
