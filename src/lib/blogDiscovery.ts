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
  const categories = new Set(posts.map((post) => post.categoryId.toLocaleLowerCase()));
  const tags = new Set(posts.flatMap((post) => post.tagIds).map((tag) => tag.toLocaleLowerCase()));
  const category = categories.has(filters.category.trim().toLocaleLowerCase()) ? filters.category.trim().toLocaleLowerCase() : '';
  const tag = tags.has(filters.tag.trim().toLocaleLowerCase()) ? filters.tag.trim().toLocaleLowerCase() : '';
  const pageSize = Number.isFinite(filters.pageSize) && filters.pageSize > 0 ? Math.floor(filters.pageSize) : 6;
  const matchingPosts = posts.filter((post) => {
    const searchableText = [post.title, post.excerpt, ...post.tags].join(' ').toLocaleLowerCase();
    return (!query || searchableText.includes(query))
      && (!category || post.categoryId.toLocaleLowerCase() === category)
      && (!tag || post.tagIds.some((postTag) => postTag.toLocaleLowerCase() === tag));
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

export function getBlogFilterOptions(posts: BlogPost[]): {
  categories: Array<{ id: string; label: string }>;
  tags: Array<{ id: string; label: string }>;
} {
  return {
    categories: [...new Map(posts.map((post) => [post.categoryId, { id: post.categoryId, label: post.category }])).values()]
      .sort((a, b) => a.label.localeCompare(b.label)),
    tags: [...new Map(posts.flatMap((post) => post.tagIds.map((id, index) => [id, { id, label: post.tags[index] }] as const))).values()]
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}
