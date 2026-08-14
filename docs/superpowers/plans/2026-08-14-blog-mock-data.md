# Blog Mock Data Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the archive to twelve navigable articles with EN/KO/JA metadata and detailed bodies.

**Architecture:** `src/content/blog/metadata.ts` remains the registry and content lookup boundary. A reusable client article component receives an article ID, while `/blog/[id]` supplies the route ID and preserves the existing language-aware loading flow.

**Tech Stack:** Next.js App Router, React, TypeScript, Node's built-in test runner, ESLint.

## Global Constraints

- Preserve the existing EN/KO/JA language switching and article reading-position behavior.
- Do not add dependencies or modify unrelated user changes.
- Keep unknown article IDs null-safe.

---

### Task 1: Lock the metadata/content contract with a failing test

**Files:**
- Create: `src/content/blog/metadata.test.ts`
- Test: `src/content/blog/metadata.test.ts`

**Interfaces:**
- Consumes: `getAllBlogPosts(language)`, `getBlogContent(slug)`.
- Produces: a regression test proving twelve unique posts and non-empty content in all languages.

- [ ] **Step 1: Write the failing test**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { getAllBlogPosts, getBlogContent } from './metadata.ts';

test('all supported languages expose twelve posts with readable bodies', async () => {
  for (const language of ['en', 'ko', 'ja'] as const) {
    const posts = getAllBlogPosts(language);
    assert.ok(posts.length >= 12);
    assert.equal(new Set(posts.map((post) => post.id)).size, posts.length);
    for (const post of posts) assert.ok((await getBlogContent(post.slug)).trim().length > 0);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test --experimental-strip-types src/content/blog/metadata.test.ts`

Expected: FAIL because the registry currently contains one post and the new content contract is absent.

### Task 2: Add the twelve localized mock articles and content lookup

**Files:**
- Modify: `src/content/blog/metadata.ts`

**Interfaces:**
- Consumes: `Language` from `src/lib/multilingualReading.ts`.
- Produces: `getBlogPost(id, language)`, `getAllBlogPosts(language)`, and `getBlogContent(slug, signal)` for all twelve IDs and three locales.

- [ ] **Step 1: Add the twelve registry entries**

Use short, distinct frontend topics (rendering, accessibility, CSS, performance, testing, tooling, and architecture), with localized title/excerpt/body data and dates that keep the archive newest-first.

- [ ] **Step 2: Make `getBlogContent` resolve the registry body**

Resolve the matching localized body by slug, check `signal?.aborted` before returning, and throw `DOMException('The request was aborted', 'AbortError')` when cancelled. Keep the existing `fetch` fallback for any legacy slug not present in the map.

- [ ] **Step 3: Run the metadata test to verify it passes**

Run: `node --test --experimental-strip-types src/content/blog/metadata.test.ts`

Expected: PASS with twelve posts checked for EN, KO, and JA.

### Task 3: Route every article ID through the shared detail view

**Files:**
- Create: `src/components/BlogPostPage.tsx`
- Create: `src/app/blog/[id]/page.tsx`
- Delete: `src/app/blog/react-reconciliation/page.tsx`

**Interfaces:**
- Consumes: `postId`, `getBlogPost`, `getBlogContent`, language store, and the existing scroll helpers.
- Produces: `/blog/[id]` pages that load the requested article while preserving retry, timeout, latest-request-wins, and scroll restoration.

- [ ] **Step 1: Move the existing article client UI into `BlogPostPage`**

Add a required `postId: string` prop and replace the hardcoded `react-reconciliation` lookup with that prop. Keep existing Markdown components and loading/error copy.

- [ ] **Step 2: Add the dynamic route wrapper**

Read the route ID with `useParams<{ id: string }>()` and render `<BlogPostPage postId={id} />`.

- [ ] **Step 3: Remove the now-redundant static article route**

Delete the old static page so the dynamic route owns `/blog/react-reconciliation` and every new article path.

- [ ] **Step 4: Run scoped lint and the build**

Run: `npx eslint src/content/blog/metadata.ts src/content/blog/metadata.test.ts src/components/BlogPostPage.tsx src/app/blog/[id]/page.tsx`

Run: `npm run build`

Expected: both commands exit 0 and the build includes the dynamic blog route.

### Task 4: Run the complete verification set

**Files:**
- No additional files.

- [ ] **Step 1: Run all tests**

Run: `npm test && node --test --experimental-strip-types src/content/blog/metadata.test.ts`

Expected: all existing and new tests pass.

- [ ] **Step 2: Check the working tree**

Run: `git diff --check`

Expected: no whitespace errors.
