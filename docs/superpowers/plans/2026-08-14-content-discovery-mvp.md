# Content Discovery MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shareable search, category/tag filters, pagination, and related articles to the multilingual blog archive.

**Architecture:** Keep the existing client archive and language store. Add localized taxonomy fields to the local post registry, isolate filtering/pagination in a pure helper, and use URL query parameters as the single source of archive filter state. Reuse the same registry to derive related articles on detail pages.

**Tech Stack:** Next.js App Router, React, TypeScript, Node built-in test runner, ESLint.

## Global Constraints

- Preserve EN/KO/JA language switching and existing article loading behavior.
- Do not add dependencies or a backend.
- Invalid query values must fall back to page 1 with no active filter.
- Preserve unrelated user changes in the dirty worktree.

---

### Task 1: Add the pure discovery contract

**Files:**
- Create: `src/lib/blogDiscovery.ts`
- Create: `src/lib/blogDiscovery.test.ts`

**Interfaces:**
- Consumes: `BlogPost[]`.
- Produces: `filterBlogPosts(posts, filters): BlogFilterResult` and `getBlogFilterOptions(posts)`.

- [ ] **Step 1: Write the failing tests**

```ts
test('matches title, excerpt, and tags and paginates results', () => {
  const result = filterBlogPosts(posts, { query: 'css', category: '', tag: '', page: 1, pageSize: 2 });
  assert.equal(result.total, 2);
  assert.equal(result.posts[0].id, 'container-queries');
});

test('invalid page and filters resolve to safe defaults', () => {
  const result = filterBlogPosts(posts, { query: '', category: 'missing', tag: '', page: -4, pageSize: 2 });
  assert.equal(result.page, 1);
  assert.equal(result.totalPages, 6);
  assert.equal(result.posts.length, 2);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test --experimental-strip-types src/lib/blogDiscovery.test.ts`

Expected: FAIL because the discovery module does not exist.

- [ ] **Step 3: Implement the minimal pure helper**

Use a case-insensitive query over `title`, `excerpt`, and `tags`; require exact category/tag equality when selected; clamp page to `[1, totalPages]`; return `{ posts, total, page, totalPages }`. `getBlogFilterOptions` returns sorted unique categories and tags.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test --experimental-strip-types src/lib/blogDiscovery.test.ts`

Expected: PASS.

### Task 2: Add localized taxonomy to the post registry

**Files:**
- Modify: `src/content/blog/metadata.ts`
- Modify: `src/content/blog/metadata.test.ts`

**Interfaces:**
- Consumes: existing localized post registry.
- Produces: `BlogPostMeta.category`, `BlogPostMeta.tags`, and `getRelatedBlogPosts(id, language)`.

- [ ] **Step 1: Extend the failing metadata test**

```ts
test('every localized post has taxonomy and related posts exclude itself', () => {
  const posts = getAllBlogPosts('ko');
  assert.ok(posts.every((post) => post.category && post.tags.length > 0));
  assert.ok(getRelatedBlogPosts('react-reconciliation', 'ko').every((post) => post.id !== 'react-reconciliation'));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/content/blog/metadata.test.ts`

Expected: FAIL because taxonomy and related-post lookup are absent.

- [ ] **Step 3: Add localized categories/tags and related lookup**

Add taxonomy to the existing metadata type and registry. Return up to three related posts from explicit `relatedIds`, then same-category posts, excluding the current ID.

- [ ] **Step 4: Run metadata tests**

Run: `node --test --experimental-strip-types src/content/blog/metadata.test.ts`

Expected: PASS.

### Task 3: Add URL-backed archive controls

**Files:**
- Modify: `src/content/translations/blog.ts`
- Modify: `src/app/blog/page.tsx`

**Interfaces:**
- Consumes: `getAllBlogPosts(language)`, `getBlogFilterOptions`, `filterBlogPosts`, `useSearchParams`, and `useRouter`.
- Produces: searchable archive UI with `q`, `category`, `tag`, and `page` query parameters.

- [ ] **Step 1: Add localized control labels**

Add translations for search placeholder, category/tag labels, clear filters, previous/next, page count, and result count in EN/KO/JA.

- [ ] **Step 2: Add query parsing and update helpers**

Read query values from `useSearchParams`, normalize invalid page values to 1, and use `router.replace` with `{ scroll: false }` whenever a control changes. Preserve other active query parameters when changing one control.

- [ ] **Step 3: Render controls and filtered results**

Render a labelled search input, category and tag buttons/selects, a clear action, result count with `aria-live`, and six results per page. Keep the existing article row markup and links. Render a one-click reset when the filtered result is empty and pagination only when `totalPages > 1`.

- [ ] **Step 4: Run scoped lint and build**

Run: `npx eslint src/lib/blogDiscovery.ts src/lib/blogDiscovery.test.ts src/content/blog/metadata.ts src/content/blog/metadata.test.ts src/content/translations/blog.ts src/app/blog/page.tsx`

Run: `npm run build`

Expected: both commands exit 0.

### Task 4: Add related articles to the detail page

**Files:**
- Modify: `src/app/blog/react-reconciliation/page.tsx`

**Interfaces:**
- Consumes: `getRelatedBlogPosts(postId, language)` and existing `Link`.
- Produces: a related-articles section below the current article with no self-links.

- [ ] **Step 1: Render related article links**

Use the current `postId` and loaded article language. Render nothing when the helper returns no posts; otherwise show up to three title/excerpt links before the back-to-archive footer.

- [ ] **Step 2: Run the complete verification set**

Run: `npm test && node --test --experimental-strip-types src/lib/blogDiscovery.test.ts src/content/blog/metadata.test.ts`

Run: `npx eslint src/lib/blogDiscovery.ts src/lib/blogDiscovery.test.ts src/content/blog/metadata.ts src/content/blog/metadata.test.ts src/content/translations/blog.ts src/app/blog/page.tsx src/app/blog/react-reconciliation/page.tsx 'src/app/blog/[id]/page.tsx'`

Run: `npm run build`

Expected: all tests, lint, and build pass.
