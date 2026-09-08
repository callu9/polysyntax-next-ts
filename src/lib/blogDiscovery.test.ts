import assert from 'node:assert/strict';
import test from 'node:test';
import type { BlogPost } from '@/content/blog/metadata';
import { filterBlogPosts, getBlogFilterOptions, getCollapsedTagOptions, getHomeEditorial } from './blogDiscovery.ts';

const posts: BlogPost[] = [
  {
    id: 'container-queries', title: 'Container Queries', excerpt: 'CSS layout primitives', date: '2025-01-03', author: 'Team', slug: 'container-en', language: 'en', category: 'CSS', categoryId: 'css', tags: ['css', 'layout'], tagIds: ['css', 'layout'],
  },
  {
    id: 'performance-budget', title: 'Performance Budget', excerpt: 'Keep a fast web experience', date: '2025-01-02', author: 'Team', slug: 'performance-en', language: 'en', category: 'Performance', categoryId: 'performance', tags: ['performance'], tagIds: ['performance'],
  },
  {
    id: 'component-api', title: 'Component APIs', excerpt: 'Design reusable boundaries', date: '2025-01-01', author: 'Team', slug: 'component-en', language: 'en', category: 'Architecture', categoryId: 'architecture', tags: ['react', 'api'], tagIds: ['react', 'api'],
  },
  {
    id: 'css-testing', title: 'Testing CSS', excerpt: 'CSS regression checks', date: '2024-12-01', author: 'Team', slug: 'css-testing-en', language: 'en', category: 'CSS', categoryId: 'css', tags: ['css', 'testing'], tagIds: ['css', 'testing'],
  },
];

const tiedPosts: BlogPost[] = [
  {
    id: 'zulu', title: 'Zulu', excerpt: '', date: '2025-01-01', author: 'Team', slug: 'zulu-en', language: 'en', category: 'UI', categoryId: 'ui', tags: ['Same'], tagIds: ['same'],
  },
  {
    id: 'alpha', title: 'Alpha', excerpt: '', date: '2025-01-01', author: 'Team', slug: 'alpha-en', language: 'en', category: 'UI', categoryId: 'ui', tags: ['Same'], tagIds: ['same'],
  },
  {
    id: 'beta', title: 'Beta', excerpt: '', date: '2025-01-01', author: 'Team', slug: 'beta-en', language: 'en', category: 'A', categoryId: 'a', tags: ['Alpha'], tagIds: ['alpha'],
  },
];

test('matches title, excerpt, and tags and paginates results', () => {
  const result = filterBlogPosts(posts, { query: 'css', category: '', tag: '', page: 1, pageSize: 2 });
  assert.equal(result.total, 2);
  assert.equal(result.posts[0].id, 'container-queries');
});

test('invalid page and filters resolve to safe defaults', () => {
  const result = filterBlogPosts(posts, { query: '', category: '', tag: '', page: -4, pageSize: 2 });
  assert.equal(result.page, 1);
  assert.equal(result.totalPages, 2);
  assert.equal(result.posts.length, 2);
});

test('filters use stable taxonomy ids instead of localized labels', () => {
  const result = filterBlogPosts(posts, { query: '', category: 'css', tag: '', page: 1, pageSize: 6 });
  assert.deepEqual(result.posts.map((post) => post.id), ['container-queries', 'css-testing']);
});

test('home editorial selection handles empty input and removes duplicate ids', () => {
  const result = getHomeEditorial([posts[0], posts[0], posts[1]]);
  assert.equal(result.total, 2);
  assert.equal(result.featured?.id, 'container-queries');
  assert.deepEqual(result.latest.map((post) => post.id), ['performance-budget']);
  assert.deepEqual(getHomeEditorial([]), { featured: null, latest: [], total: 0 });
});

test('editorial, category, and tag sorting use deterministic tie breakers', () => {
  const input = [...tiedPosts].reverse();
  assert.deepEqual(getHomeEditorial(input).latest.map((post) => post.id), ['beta', 'zulu']);
  assert.deepEqual(filterBlogPosts(input, { query: '', category: '', tag: '', page: 1, pageSize: 6 }).posts.map((post) => post.id), ['alpha', 'beta', 'zulu']);
  assert.deepEqual(getBlogFilterOptions(input), {
    categories: [{ id: 'a', label: 'A' }, { id: 'ui', label: 'UI' }],
    tags: [{ id: 'alpha', label: 'Alpha' }, { id: 'same', label: 'Same' }],
  });
});

test('collapsed tag filters keep the active option visible', () => {
  const tags = ['one', 'two', 'three', 'four', 'five'].map((id) => ({ id, label: id }));

  assert.deepEqual(getCollapsedTagOptions(tags, '', 3), tags.slice(0, 3));
  assert.deepEqual(getCollapsedTagOptions(tags, 'five', 3), [tags[0], tags[1], tags[4]]);
});
