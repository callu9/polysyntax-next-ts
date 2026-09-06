import { getBlogContentBySlug } from '../content/blog/content.ts';
import { getBlogPost, type BlogPost } from '../content/blog/metadata.ts';
import type { Language } from './multilingualReading';

export type InitialArticleData = { article: BlogPost; content: string };

export function getInitialArticleData(id: string, language: Language): InitialArticleData | null {
  const article = getBlogPost(id, language);
  if (!article) return null;

  const content = getBlogContentBySlug(article.slug);
  return content === null ? null : { article, content };
}
