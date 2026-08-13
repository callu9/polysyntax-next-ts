# PolySyntax Multilingual Switching

- Status: planning complete; implementation pending
- PM: `.ouroboros/pm.md`
- Validated Seed: `.ouroboros/seed.yaml` (QA 0.94, iteration 2/5)
- Implementation Plan: `docs/superpowers/plans/2026-08-13-polysyntax-multilingual-switching.md`
- Scope: PolySyntax rebrand, EN/KO/JA initialization, atomic article transition, 5000ms timeout/retry/latest-wins, heading ordinal and ratio position restoration
- Excluded: URL locale, parallel comparison, prefetch/custom cache, README overhaul, repository-wide lint cleanup

## Verification Evidence

| Check | Result |
| --- | --- |
| Seed QA | PASS — 0.94 |
| Node policy test | Pending implementation |
| Scoped ESLint | Pending implementation |
| `npm run build` | Pending implementation |
| Browser scenarios | Pending implementation |

## Handoff

Implement the linked plan task-by-task while staging only files named by each task. Preserve all unrelated uncommitted user changes.
