# Practice labs

Each directory is a small TypeScript exercise that runs on your computer. Nothing in these labs is executed by the web app.

| Lab                 | Lesson                                             | Starting state                                 | Verify                                        |
| ------------------- | -------------------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| `01-code-detective` | Map a request path using evidence                  | Read-only catalogue service                    | `pnpm exec vitest run labs/01-code-detective` |
| `02-bug-hunter`     | Canonicalize identity before uniqueness checks     | Casing variants are incorrectly accepted       | `pnpm exec vitest run labs/02-bug-hunter`     |
| `03-safe-refactor`  | Preserve behavior while splitting responsibilities | Working but tangled order service              | `pnpm exec vitest run labs/03-safe-refactor`  |
| `04-agent-workflow` | Make retries idempotent                            | Duplicate submissions create duplicate records | `pnpm exec vitest run labs/04-agent-workflow` |
| `final-mission`     | Keep dependent location state consistent           | Parent changes can retain stale children       | `pnpm exec vitest run labs/final-mission`     |

From the repository root, install once with `pnpm install`. Run the complete starter verification with `pnpm labs:test`. Each README includes the task and expected starter observation. Tests named `*.test.ts` are intentionally arranged to pass on the seeded starter state; update the relevant assertions as you implement each challenge.
