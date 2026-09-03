import assert from 'node:assert/strict';
import test from 'node:test';
import { getBlogPost } from '../content/blog/metadata.ts';
import { absoluteUrl, getArticleMetadata } from './seo.ts';

test('article metadata keeps the verified canonical and publication date', () => {
  const post = getBlogPost('react-reconciliation', 'en');
  assert.ok(post);
  const metadata = getArticleMetadata(post, absoluteUrl('https://example.test', `/blog/${post.id}`));

  assert.equal(metadata.alternates?.canonical, 'https://example.test/blog/react-reconciliation');
  assert.equal(metadata.description, post.excerpt);
  assert.equal(metadata.openGraph?.type, 'article');
  assert.equal(metadata.openGraph?.publishedTime, post.date);
  assert.equal(metadata.openGraph?.modifiedTime, undefined);
});
