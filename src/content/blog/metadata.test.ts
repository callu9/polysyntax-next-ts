import assert from 'node:assert/strict';
import test from 'node:test';

// @ts-expect-error Node's type-stripping runner requires the .ts extension.
import { getAllBlogPosts, getBlogContent, getRelatedBlogPosts } from './metadata.ts';

test('all supported languages expose twelve posts with readable bodies', async () => {
  for (const language of ['en', 'ko', 'ja'] as const) {
    const posts = getAllBlogPosts(language);
    assert.ok(posts.length >= 12);
    assert.equal(new Set(posts.map((post) => post.id)).size, posts.length);
    for (const post of posts) assert.ok((await getBlogContent(post.slug)).trim().length > 0);
  }
});

test('every localized post has taxonomy and related posts exclude itself', () => {
  const posts = getAllBlogPosts('ko');
  assert.ok(posts.every((post) => post.category && post.tags.length > 0));
  assert.ok(getRelatedBlogPosts('react-reconciliation', 'ko').every((post) => post.id !== 'react-reconciliation'));
});
