import assert from 'node:assert/strict';
import test from 'node:test';

// @ts-expect-error Node's type-stripping runner requires the .ts extension.
import { getAllBlogPosts, getBlogContent } from './metadata.ts';

test('all supported languages expose twelve posts with readable bodies', async () => {
  for (const language of ['en', 'ko', 'ja'] as const) {
    const posts = getAllBlogPosts(language);
    assert.ok(posts.length >= 12);
    assert.equal(new Set(posts.map((post) => post.id)).size, posts.length);
    for (const post of posts) assert.ok((await getBlogContent(post.slug)).trim().length > 0);
  }
});
