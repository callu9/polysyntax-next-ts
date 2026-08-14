import type { BlogPost } from '../content/blog/metadata';

export interface BlogFilterInput {
  query: string;
  category: string;
  tag: string;
  page: number;
  pageSize: number;
}

export interface BlogFilterResult {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

export function filterBlogPosts(posts: BlogPost[], filters: BlogFilterInput): BlogFilterResult {
  const query = filters.query.trim().toLocaleLowerCase();
  const categories = new Set(posts.map((post) => post.category.toLocaleLowerCase()));
  const tags = new Set(posts.flatMap((post) => post.tags).map((tag) => tag.toLocaleLowerCase()));
  const category = categories.has(filters.category.trim().toLocaleLowerCase()) ? filters.category.trim().toLocaleLowerCase() : '';
  const tag = tags.has(filters.tag.trim().toLocaleLowerCase()) ? filters.tag.trim().toLocaleLowerCase() : '';
  const pageSize = Number.isFinite(filters.pageSize) && filters.pageSize > 0 ? Math.floor(filters.pageSize) : 6;
  const matchingPosts = posts.filter((post) => {
    const searchableText = [post.title, post.excerpt, ...post.tags].join(' ').toLocaleLowerCase();
    return (!query || searchableText.includes(query))
      && (!category || post.category.toLocaleLowerCase() === category)
      && (!tag || post.tags.some((postTag) => postTag.toLocaleLowerCase() === tag));
  });
  const totalPages = Math.max(1, Math.ceil(matchingPosts.length / pageSize));
  const page = Math.min(Math.max(1, Math.floor(filters.page) || 1), totalPages);

  return {
    posts: matchingPosts.slice((page - 1) * pageSize, page * pageSize),
    total: matchingPosts.length,
    page,
    totalPages,
  };
}

export function getBlogFilterOptions(posts: BlogPost[]): { categories: string[]; tags: string[] } {
  return {
    categories: [...new Set(posts.map((post) => post.category))].sort((a, b) => a.localeCompare(b)),
    tags: [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b)),
  };
}
