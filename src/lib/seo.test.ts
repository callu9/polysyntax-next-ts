import assert from 'node:assert/strict';
import test from 'node:test';
import { getBlogPost } from '../content/blog/metadata.ts';
import { absoluteUrl, getArticleMetadata, parseSiteOrigin } from './seo.ts';

test('article metadata keeps the verified canonical and publication date', () => {
  const post = getBlogPost('react-reconciliation', 'en');
  assert.ok(post);
  const metadata = getArticleMetadata(post, absoluteUrl('https://example.test', `/blog/${post.id}`));

  assert.equal(metadata.alternates?.canonical, 'https://example.test/blog/react-reconciliation');
  assert.equal(metadata.description, post.excerpt);
  const openGraph = metadata.openGraph;
  if (!openGraph || !('type' in openGraph) || openGraph.type !== 'article') throw new Error('expected article OpenGraph metadata');
  assert.ok(Array.isArray(openGraph.images));
  const image = openGraph.images[0];
  if (!image || typeof image !== 'object' || !('url' in image)) throw new Error('expected OpenGraph image descriptor');
  assert.equal(image.url, 'https://example.test/opengraph-image.svg');
  assert.equal(openGraph.publishedTime, post.date);
  assert.equal(openGraph.modifiedTime, undefined);
});

test('site origin accepts only an explicitly configured HTTP origin', () => {
  assert.equal(parseSiteOrigin('https://example.test/a/path'), 'https://example.test');
  assert.equal(parseSiteOrigin('http://localhost:3000'), 'http://localhost:3000');
  assert.equal(parseSiteOrigin('javascript://example.test'), null);
  assert.equal(parseSiteOrigin('not a URL'), null);
  assert.equal(parseSiteOrigin(undefined), null);
});

test('article metadata omits origin-dependent URLs when SITE_URL is unavailable', () => {
  const post = getBlogPost('react-reconciliation', 'en');
  assert.ok(post);

  const articleMetadata = getArticleMetadata(post, '/en/blog/react-reconciliation');

  assert.equal(articleMetadata.alternates, undefined);
  assert.equal(articleMetadata.openGraph?.url, undefined);
  assert.equal(articleMetadata.openGraph?.images, undefined);
});
