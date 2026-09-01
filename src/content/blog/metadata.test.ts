import assert from 'node:assert/strict';
import test from 'node:test';

// @ts-expect-error Node's type-stripping runner requires the .ts extension.
import { getAllBlogPosts, getBlogContent, getBlogContentBySlug, getRelatedBlogPosts } from './metadata.ts';

test('all supported languages expose twelve posts with readable bodies', async () => {
  for (const language of ['en', 'ko', 'ja'] as const) {
    const posts = getAllBlogPosts(language);
    assert.ok(posts.length >= 12);
    assert.equal(new Set(posts.map((post) => post.id)).size, posts.length);
    for (const post of posts) assert.ok((getBlogContentBySlug(post.slug) ?? '').trim().length > 0);
  }
});

test('every localized post has taxonomy and related posts exclude itself', () => {
  const posts = getAllBlogPosts('ko');
  assert.ok(posts.every((post) => post.category && post.categoryId && post.tags.length > 0 && post.tagIds.length > 0));
  assert.ok(getRelatedBlogPosts('react-reconciliation', 'ko').every((post) => post.id !== 'react-reconciliation'));
});

test('registered content still crosses the abortable fetch boundary', async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';
  let requestedSignal: AbortSignal | undefined;
  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedSignal = init?.signal;
    return new Response('loaded through fetch');
  };

  try {
    const controller = new AbortController();
    assert.equal(await getBlogContent('performance-budget-en', controller.signal), 'loaded through fetch');
    assert.equal(requestedUrl, '/blog/content/performance-budget-en');
    assert.equal(requestedSignal, controller.signal);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
