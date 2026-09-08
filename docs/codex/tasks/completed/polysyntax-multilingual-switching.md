# PolySyntax Multilingual Switching

- Status: implementation merged in PR21 at `1f174d0`; tooling warning fix merged in PR22 at `506574a`; this documentation closeout is complete.
- Scope: PolySyntax rebrand, EN/KO/JA initialization, atomic article transition, 5000ms timeout/retry/latest-wins, heading ordinal and ratio position restoration.
- Excluded: URL locale, parallel comparison, prefetch/custom cache, README overhaul, repository-wide lint cleanup.

## Verification Evidence

| Check | Result |
| --- | --- |
| Dependency install | PASS — `npm ci`; 528 packages installed; 0 vulnerabilities |
| `npm test` | PASS — 32/32 after dependency installation; initial pre-install run failed because `next` was unavailable |
| `npm run lint` | PASS — exit 0 |
| `npm run typecheck` | PASS — exit 0 |
| `npm run build` | PASS — Next.js 16.3.4 production build; exit 0 |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `npm audit` | PASS — 0 vulnerabilities |
| `git diff --check` | PASS — exit 0 |
| Path/status/content checks | PASS — active file absent, completed file present, only this task rename staged, and stale PR19/remote-CI claims absent |

## Handoff

The task record is moved to `docs/codex/tasks/completed/`; no product code, package file, README, or other documentation is changed by this PR.
