# PolySyntax Multilingual Switching

- Status: core implementation complete; local CI wait hardening verified, remote CI pending commit/push
- PM: `.ouroboros/pm.md`
- Validated Seed: `.ouroboros/seed.yaml` (QA 0.94, iteration 2/5)
- Implementation Plan: `docs/superpowers/plans/2026-08-13-polysyntax-multilingual-switching.md`
- Scope: PolySyntax rebrand, EN/KO/JA initialization, atomic article transition, 5000ms timeout/retry/latest-wins, heading ordinal and ratio position restoration
- Excluded: URL locale, parallel comparison, prefetch/custom cache, README overhaul, repository-wide lint cleanup

## Verification Evidence

| Check | Result |
| --- | --- |
| Seed QA | PASS — 0.94 |
| Node policy test | PASS — 6/6 (`node --test --experimental-strip-types src/lib/multilingualReading.test.ts`) |
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

## Post-completion CI Wait Hardening

- Acceptance: browser navigation and language selection wait for observable readiness instead of fixed delays; article timeouts report pathname, language, and title state.
- Target: `21800e0f2bf0` plus `scripts/release-check.mjs` diff SHA-256 `6699e408c0cb95db3f3abd8742ee4ff29c44e564871f8a8d58523599077d7a9e`.
- Environment: local macOS, Node 24.18.0, npm 11.16.0, Chrome headless, 2026-09-08 KST, verifier Codex.
- Limitations: remote CI was not run; existing module-type and external-lockfile warnings remain out of scope.

| Check | Result |
| --- | --- |
| TDD RED: fixed delay | EXPECTED FAIL — a 250ms delayed menu made the former fixed 100ms selection fail with `Japanese language menu item was not found`; the same run also had three canonical failures because `SITE_URL` was omitted from the server process |
| TDD RED: hydration retry | EXPECTED FAIL — the strengthened fault injection ignored the first pointerdown and started its 250ms window at that attempt; release check finished 12/13 with only `browser.375px` failing on `Timed out waiting for 日本語 language menu item` |
| Dependency alignment | PASS — `npm ci`; 528 packages installed, 0 vulnerabilities |
| Clean build setup | INITIAL FAIL / RERUN PASS — mismatched Next 16.1.6 dependencies failed before `npm ci`; stale `.next/dev/types` then failed against 16.3.4, so generated `.next` was moved aside and a clean build passed |
| Node tests | PASS — 30/30 via `npm test` |
| Scoped ESLint | PASS — `npm run lint -- scripts/release-check.mjs` |
| Typecheck | PASS AFTER RERUN — a concurrent build/typecheck run failed while `.next/types` was being regenerated; sequential `npm run typecheck` after build exited 0 |
| Production build | PASS — `SITE_URL=http://127.0.0.1:41783 npm run build` |
| Production dependency audit | PASS — `npm audit --omit=dev`; 0 vulnerabilities |
| Scoped diff check | PASS — `git diff --check -- scripts/release-check.mjs` |
| Repository-wide diff check | FAIL (pre-existing, out of scope) — `README.md` lines 143, 170, and 193 contain trailing whitespace |
| Final release check | PASS — `BASE_URL=http://127.0.0.1:41783 SITE_URL=http://127.0.0.1:41783 npm run check:release`; 13/13 passed after the production server was started with matching `SITE_URL` |
| Remote CI | UNVERIFIED — no commit or push was requested |

## Handoff

Implementation and Dark Systems editorial styling are committed. The CI wait hardening is locally verified but uncommitted; preserve all unrelated uncommitted user changes and run remote CI after commit/push.
