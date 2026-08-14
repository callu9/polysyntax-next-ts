import assert from 'node:assert/strict';
import test from 'node:test';
import type { BlogPost } from '@/content/blog/metadata';
// @ts-expect-error Node's type-stripping runner requires the .ts extension.
import { filterBlogPosts } from './blogDiscovery.ts';

const posts: BlogPost[] = [
  {
    id: 'container-queries', title: 'Container Queries', excerpt: 'CSS layout primitives', date: '2025-01-03', author: 'Team', readTime: 4, slug: 'container-en', content: '', language: 'en', category: 'CSS', tags: ['css', 'layout'],
  },
  {
    id: 'performance-budget', title: 'Performance Budget', excerpt: 'Keep a fast web experience', date: '2025-01-02', author: 'Team', readTime: 4, slug: 'performance-en', content: '', language: 'en', category: 'Performance', tags: ['performance'],
  },
  {
    id: 'component-api', title: 'Component APIs', excerpt: 'Design reusable boundaries', date: '2025-01-01', author: 'Team', readTime: 4, slug: 'component-en', content: '', language: 'en', category: 'Architecture', tags: ['react', 'api'],
  },
  {
    id: 'css-testing', title: 'Testing CSS', excerpt: 'CSS regression checks', date: '2024-12-01', author: 'Team', readTime: 4, slug: 'css-testing-en', content: '', language: 'en', category: 'CSS', tags: ['css', 'testing'],
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
