# PolySyntax Multilingual Switching

- Status: implementation complete; final manual fault-injection check pending
- PM: `.ouroboros/pm.md`
- Validated Seed: `.ouroboros/seed.yaml` (QA 0.94, iteration 2/5)
- Implementation Plan: `docs/superpowers/plans/2026-08-13-polysyntax-multilingual-switching.md`
- Scope: PolySyntax rebrand, EN/KO/JA initialization, atomic article transition, 5000ms timeout/retry/latest-wins, heading ordinal and ratio position restoration
- Excluded: URL locale, parallel comparison, prefetch/custom cache, README overhaul, repository-wide lint cleanup

## Verification Evidence

| Check | Result |
| --- | --- |
| Seed QA | PASS — 0.94 |
| Node policy test | PASS — 5/5 (`node --test --experimental-strip-types src/lib/multilingualReading.test.ts`) |
| Scoped ESLint | PASS — modified implementation files, exit 0 |
| `npm run build` | PASS — Next.js static build, exit 0 |
| Browser: brand | PASS — home shows PolySyntax and the exact hero tagline |
| Browser: language variants | PASS — EN, KO, and JA React reconciliation variants render |
| Browser: heading ordinal | PASS — heading ordinal 7 stayed 7 and aligned at viewport top after EN → JA via the visible language menu |
| Browser: timeout/retry fault injection | Not run — local browser control has no request-interception surface; the 5000 ms/latest-request boundary is covered by the Node policy test |
| Dark Systems browser pass | PASS — `/`, `/blog`, article, `/login`, and `/about` have no horizontal overflow at 375 px or 1440 px; desktop navigation and compact mobile header verified |
| Dark Systems interaction pass | PASS — article JA → EN language switch rendered one title and preserved the existing loading flow |
| Dark Systems scoped ESLint | PASS — changed TS/TSX files, exit 0 |
| Dark Systems build | PASS — `npm run build`, exit 0 |

## Handoff

Implementation and Dark Systems editorial styling are committed on `main`. Preserve all unrelated uncommitted user changes; manually verify timeout/retry, rapid latest-request-wins switching, and ratio fallback before closing the task.
