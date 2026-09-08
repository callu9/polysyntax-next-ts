# PolySyntax Multilingual Switching

- Status: implementation complete; final manual, release-check, and CI verification complete
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
| Browser: atomic EN → KO | PASS — loading retained the EN article snapshot until the KO title, metadata, and body committed together |
| Browser: timeout/retry fault injection | PASS — the injected timeout retained the prior snapshot and persisted language; retry completed for the requested language |
| Browser: rapid latest-wins | PASS — rapid selections committed only the latest request; stale responses did not update the article or persisted language |
| Browser: cancellation/reselection | PASS — canceling a request and reselecting the language issued a fresh request and committed the reselection |
| Browser: heading ordinal | PASS — heading ordinal 7 stayed 7 and aligned at viewport top after EN → JA via the visible language menu |
| Browser: ratio fallback | PASS — when the matching heading was unavailable, article-local reading ratio restored the clamped document position |
| Dark Systems browser pass | PASS — `/`, `/blog`, article, `/login`, and `/about` have no horizontal overflow at 375 px or 1440 px; desktop navigation and compact mobile header verified |
| Dark Systems interaction pass | PASS — article JA → EN language switch rendered one title and preserved the existing loading flow |
| Dark Systems scoped ESLint | PASS — changed TS/TSX files, exit 0 |
| Dark Systems build | PASS — `npm run build`, exit 0 |
| Release-check endpoint | PASS — corrected actual endpoint is `http://127.0.0.1:3000`, matching `BASE_URL` and CI |
| Final release-check | PASS — 13/13 checks passed via `npm run check:release` |
| Final CI | PASS — PR17 release-readiness CI passed its test, lint, typecheck, build, audit, and release-check gates |
| PR17 merge | PASS — merged to `dev` at `5bcffe001671eba93c0d9cf731adc6b0b91f346f` |

## Handoff

Implementation and Dark Systems editorial styling are committed; final manual verification, release-check, and CI evidence are recorded above. Preserve all unrelated uncommitted user changes.
