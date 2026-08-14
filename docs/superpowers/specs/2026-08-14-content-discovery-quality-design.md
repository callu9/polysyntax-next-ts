# Content Discovery and Quality Expansion Design

## Goal

Turn the current multilingual static blog demo into a more discoverable, shareable, and accessible reading experience without introducing a backend or changing the existing EN/KO/JA language model.

## Scope and success criteria

The first release is successful when a reader can find a relevant article with search and filters, share a stable filtered URL, open a detail page with correct search metadata, and navigate the core flow with a keyboard. The archive must keep working in all three supported languages and show a useful empty state when no result matches.

Out of scope for this release: CMS integration, comments, server accounts, personalized recommendations, and a new UI component library.

## Recommended approach: URL-first hybrid

Keep the language store and client-rendered localized labels. Store search, category, tag, and page state in URL query parameters so filtered views are refreshable and shareable. Derive the filtered list from the existing local registry rather than adding a search service. Keep the first page intentionally small and add pagination only when the archive grows beyond the current demo-sized set.

Split article metadata from article body content before optimizing the client bundle. The archive imports metadata only; the detail view loads the selected body through the existing async content boundary. This preserves the current language transition, timeout, retry, and scroll restoration behavior.

## Phase 1: Discovery MVP

Extend `BlogPostMeta` with localized `category`, `tags`, `featured`, and optional `relatedIds`. Add a single pure filtering function that accepts posts and `{ query, category, tag, page }`, matches title/excerpt/tags case-insensitively, and returns the visible posts plus total pages.

The archive receives its initial query from `useSearchParams` and updates the URL with `router.replace` when controls change. Search has a labelled input and a clear action. Category and tag controls expose selected state, results announce count changes through `aria-live`, and no-results output includes a one-click reset. Related posts on the detail page use `relatedIds` first and fall back to the same category, excluding the current article.

## Phase 2: Quality and search visibility

Create a server route wrapper for `/blog/[id]` that supplies `generateMetadata` from the selected localized post while the existing client article component owns interaction. Metadata includes localized title, description, canonical URL, Open Graph, and Twitter card fields. Add `sitemap.ts`, `robots.ts`, and `Article` plus `BreadcrumbList` JSON-LD to article pages.

Add a skip link, visible focus states, keyboard-safe search controls, result announcements, and `prefers-reduced-motion` handling. The article page gets a compact reading-progress indicator and a generated table of contents only when the Markdown contains headings.

## Phase 3: Return visits and bundle hygiene

Add browser-only local storage for bookmarks, recently viewed IDs, and the last reading position. All features degrade to no-op when storage is unavailable. Add copy-link/share actions using the native Web Share API with clipboard fallback.

Move body strings out of the metadata module so `/blog` does not ship every article body. Keep the existing `getBlogContent(slug, signal)` contract and add a focused bundle/content test only if a measurable regression appears.

## Error handling

- Invalid query values fall back to the first page and no filter.
- Unknown article IDs render the existing null-safe not-found state.
- Failed body loads keep the current article visible and retain retry behavior.
- Storage, clipboard, and Web Share failures never block reading.

## Verification

- Unit tests cover filtering, pagination bounds, related-post fallback, and localized metadata selection.
- Existing multilingual reading tests remain green.
- Scoped ESLint and production build pass.
- Manual checks cover EN/KO/JA archive search, shared query URLs, keyboard-only filtering, no-results reset, article metadata, and 375px/1440px layouts.

## Delivery order

1. Phase 1 discovery MVP and its pure tests.
2. Phase 2 metadata, structured data, accessibility, and reading progress.
3. Phase 3 bookmarks, sharing, and body/metadata bundle split only after the first two phases are stable.
