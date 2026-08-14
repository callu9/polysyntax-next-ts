import type { Language } from '@/lib/multilingualReading';

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: number;
  slug: string; // 마크다운 파일명 (확장자 제외)
}

export type BlogPost = BlogPostMeta & { language: Language };

interface BlogPostContent {
  en?: BlogPostMeta;
  ko?: BlogPostMeta;
  ja?: BlogPostMeta;
}

// 블로그 포스트 메타데이터 - 언어별 콘텐츠를 한곳에서 관리
const blogPostsRegistry: Record<string, BlogPostContent> = {
  'react-reconciliation': {
    en: {
      id: 'react-reconciliation',
      title: 'React Reconciliation Algorithm',
      excerpt: 'Understanding how React efficiently updates the DOM using the reconciliation algorithm (diffing).',
      date: '2024-02-03',
      author: 'Frontend Team',
      readTime: 8,
      slug: 'react-reconciliation-en',
    },
    ko: {
      id: 'react-reconciliation',
      title: '리액트 재조정 알고리즘',
      excerpt: '리액트가 어떻게 재조정 알고리즘(diffing)을 사용하여 효율적으로 DOM을 업데이트하는지 이해하세요.',
      date: '2024-02-03',
      author: '프론트엔드 팀',
      readTime: 8,
      slug: 'react-reconciliation-ko',
    },
    ja: {
      id: 'react-reconciliation',
      title: 'React 調整アルゴリズム',
      excerpt: 'Reactが調整アルゴリズム(diffing)を使用してDOMを効率的に更新する方法を理解してください。',
      date: '2024-02-03',
      author: 'フロントエンドチーム',
      readTime: 8,
      slug: 'react-reconciliation-ja',
    },
  },
};

export function getBlogPost(id: string, language: Language): BlogPost | null {
  const post = blogPostsRegistry[id]?.[language];
  if (!post) return null;
  return { ...post, language };
}

export function getAllBlogPosts(language: Language): BlogPost[] {
  return Object.entries(blogPostsRegistry)
    .map(([, content]) => content[language])
    .filter((post): post is BlogPostMeta => Boolean(post))
    .map(post => ({ ...post, language }));
}

export async function getBlogContent(slug: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch(`/blog/${slug}.md`, { signal });
  if (!response.ok) throw new Error(`Markdown request failed with ${response.status}`);
  return response.text();
}
