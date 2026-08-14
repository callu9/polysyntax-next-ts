# Blog Mock Data Expansion Design

## Goal

Expand the blog archive from one article to twelve fully navigable mock articles, with English, Korean, and Japanese metadata and detailed bodies for every article.

## Design

- Keep the existing `BlogPostMeta` registry as the single source for archive metadata.
- Add twelve article IDs total, including the existing React reconciliation article. Each language receives its own title, excerpt, date, author, read time, and Markdown body.
- Move the article UI behind one reusable client component and expose it through `src/app/blog/[id]/page.tsx`, so every archive link resolves through the same loading, retry, language-switching, and scroll-restoration flow.
- Store mock bodies in a local content map consumed by `getBlogContent`; keep the async API and abort signal so existing article switching behavior remains intact without adding a large set of generated files.
- Return `null` for unknown IDs and render the existing error-safe empty state rather than throwing during route rendering.

## Verification

- Add a focused Node test that checks all three languages expose at least twelve posts, IDs are unique, and each post's slug resolves to non-empty Markdown content.
- Run the focused test, the existing test suite, scoped ESLint, and the production build.
