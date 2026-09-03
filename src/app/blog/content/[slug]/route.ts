import { getBlogContentBySlug } from '@/content/blog/content';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getBlogContentBySlug(slug);
  if (!content) return new Response('Not found', { status: 404 });
  return new Response(content, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
