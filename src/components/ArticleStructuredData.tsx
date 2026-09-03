import type { BlogPost } from '@/content/blog/metadata';

export function ArticleStructuredData({ post, canonical }: { post: BlogPost; canonical: string }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: { '@type': 'Person', name: post.author },
        inLanguage: post.language,
        mainEntityOfPage: canonical,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Blog', item: canonical.replace(/\/blog\/[^/]+$/, '/blog') },
          { '@type': 'ListItem', position: 2, name: post.category, item: canonical.replace(/\/blog\/[^/]+$/, `/blog?category=${encodeURIComponent(post.categoryId)}`) },
          { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
        ],
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}
