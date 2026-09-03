import type { Language } from '@/lib/multilingualReading';

interface BaseBlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: number;
  slug: string;
  relatedIds?: string[];
}

export interface BlogPostMeta extends BaseBlogPostMeta {
  category: string;
  categoryId: string;
  tags: string[];
  tagIds: string[];
}

export type BlogPost = BlogPostMeta & { language: Language };

interface BlogPostContent {
  en?: BaseBlogPostMeta;
  ko?: BaseBlogPostMeta;
  ja?: BaseBlogPostMeta;
}

const blogTaxonomy: Record<string, Record<Language, { category: string; tags: string[] }>> = {
  'react-reconciliation': {
    en: { category: 'Rendering', tags: ['react', 'rendering'] }, ko: { category: '렌더링', tags: ['react', '렌더링'] }, ja: { category: 'レンダリング', tags: ['react', 'レンダリング'] },
  },
  'performance-budget': {
    en: { category: 'Performance', tags: ['performance', 'web-vitals'] }, ko: { category: '성능', tags: ['performance', 'web-vitals'] }, ja: { category: 'パフォーマンス', tags: ['performance', 'web-vitals'] },
  },
  'accessible-command-palette': {
    en: { category: 'Accessibility', tags: ['accessibility', 'keyboard'] }, ko: { category: '접근성', tags: ['accessibility', 'keyboard'] }, ja: { category: 'アクセシビリティ', tags: ['accessibility', 'keyboard'] },
  },
  'container-queries': {
    en: { category: 'CSS', tags: ['css', 'layout'] }, ko: { category: 'CSS', tags: ['css', 'layout'] }, ja: { category: 'CSS', tags: ['css', 'layout'] },
  },
  'optimistic-ui': {
    en: { category: 'Product UX', tags: ['ux', 'state'] }, ko: { category: '제품 UX', tags: ['ux', 'state'] }, ja: { category: 'プロダクトUX', tags: ['ux', 'state'] },
  },
  'loading-states': {
    en: { category: 'UX', tags: ['ux', 'loading'] }, ko: { category: 'UX', tags: ['ux', 'loading'] }, ja: { category: 'UX', tags: ['ux', 'loading'] },
  },
  'testing-user-flows': {
    en: { category: 'Testing', tags: ['testing', 'quality'] }, ko: { category: '테스트', tags: ['testing', 'quality'] }, ja: { category: 'テスト', tags: ['testing', 'quality'] },
  },
  'typescript-boundaries': {
    en: { category: 'TypeScript', tags: ['typescript', 'architecture'] }, ko: { category: 'TypeScript', tags: ['typescript', 'architecture'] }, ja: { category: 'TypeScript', tags: ['typescript', 'architecture'] },
  },
  'streaming-rendering': {
    en: { category: 'Architecture', tags: ['react', 'streaming'] }, ko: { category: '아키텍처', tags: ['react', 'streaming'] }, ja: { category: 'アーキテクチャ', tags: ['react', 'streaming'] },
  },
  'layout-shift': {
    en: { category: 'Performance', tags: ['performance', 'css'] }, ko: { category: '성능', tags: ['performance', 'css'] }, ja: { category: 'パフォーマンス', tags: ['performance', 'css'] },
  },
  'component-api': {
    en: { category: 'Architecture', tags: ['react', 'api'] }, ko: { category: '아키텍처', tags: ['react', 'api'] }, ja: { category: 'アーキテクチャ', tags: ['react', 'api'] },
  },
  'frontend-observability': {
    en: { category: 'Tooling', tags: ['observability', 'quality'] }, ko: { category: '도구', tags: ['observability', 'quality'] }, ja: { category: 'ツーリング', tags: ['observability', 'quality'] },
  },
};

const blogTaxonomyIds: Record<string, { categoryId: string; tagIds: string[] }> = {
  'react-reconciliation': { categoryId: 'rendering', tagIds: ['react', 'rendering'] },
  'performance-budget': { categoryId: 'performance', tagIds: ['performance', 'web-vitals'] },
  'accessible-command-palette': { categoryId: 'accessibility', tagIds: ['accessibility', 'keyboard'] },
  'container-queries': { categoryId: 'css', tagIds: ['css', 'layout'] },
  'optimistic-ui': { categoryId: 'product-ux', tagIds: ['ux', 'state'] },
  'loading-states': { categoryId: 'ux', tagIds: ['ux', 'loading'] },
  'testing-user-flows': { categoryId: 'testing', tagIds: ['testing', 'quality'] },
  'typescript-boundaries': { categoryId: 'typescript', tagIds: ['typescript', 'architecture'] },
  'streaming-rendering': { categoryId: 'architecture', tagIds: ['react', 'streaming'] },
  'layout-shift': { categoryId: 'performance', tagIds: ['performance', 'css'] },
  'component-api': { categoryId: 'architecture', tagIds: ['react', 'api'] },
  'frontend-observability': { categoryId: 'tooling', tagIds: ['observability', 'quality'] },
};

const blogPostsRegistry: Record<string, BlogPostContent> = {
  'react-reconciliation': {
    en: {
      id: 'react-reconciliation', title: 'React Reconciliation Algorithm', excerpt: 'Understanding how React efficiently updates the DOM using the reconciliation algorithm (diffing).', date: '2024-02-03', author: 'Frontend Team', readTime: 8, slug: 'react-reconciliation-en',
    },
    ko: {
      id: 'react-reconciliation', title: '리액트 재조정 알고리즘', excerpt: '리액트가 재조정 알고리즘(diffing)으로 DOM을 효율적으로 업데이트하는 방식을 이해합니다.', date: '2024-02-03', author: '프론트엔드 팀', readTime: 8, slug: 'react-reconciliation-ko',
    },
    ja: {
      id: 'react-reconciliation', title: 'React 調整アルゴリズム', excerpt: 'Reactが調整アルゴリズム(diffing)でDOMを効率的に更新する仕組みを解説します。', date: '2024-02-03', author: 'フロントエンドチーム', readTime: 8, slug: 'react-reconciliation-ja',
    },
  },
  'performance-budget': {
    en: {
      id: 'performance-budget', title: 'A Performance Budget That Teams Can Keep', excerpt: 'Turn page speed from a vague aspiration into a small set of reviewable limits.', date: '2024-03-14', author: 'Mina Park', readTime: 6, slug: 'performance-budget-en',
    },
    ko: {
      id: 'performance-budget', title: '팀이 지킬 수 있는 성능 예산', excerpt: '페이지 속도를 막연한 목표가 아닌 리뷰 가능한 작은 기준으로 바꾸는 방법입니다.', date: '2024-03-14', author: '박미나', readTime: 6, slug: 'performance-budget-ko',
    },
    ja: {
      id: 'performance-budget', title: 'チームが守れるパフォーマンス予算', excerpt: 'ページ速度を曖昧な願いからレビューできる小さな基準へ変える方法です。', date: '2024-03-14', author: 'パク・ミナ', readTime: 6, slug: 'performance-budget-ja',
    },
  },
  'accessible-command-palette': {
    en: {
      id: 'accessible-command-palette', title: 'An Accessible Command Palette', excerpt: 'Keyboard shortcuts are only useful when focus, announcements, and escape routes are predictable.', date: '2024-04-02', author: 'Accessibility Guild', readTime: 7, slug: 'accessible-command-palette-en',
    },
    ko: {
      id: 'accessible-command-palette', title: '접근 가능한 커맨드 팔레트', excerpt: '키보드 단축키는 포커스와 안내, 닫기 동작이 예측 가능할 때만 유용합니다.', date: '2024-04-02', author: '접근성 길드', readTime: 7, slug: 'accessible-command-palette-ko',
    },
    ja: {
      id: 'accessible-command-palette', title: 'アクセシブルなコマンドパレット', excerpt: 'キーボード操作はフォーカスと案内、閉じる動作が予測できて初めて役立ちます。', date: '2024-04-02', author: 'アクセシビリティギルド', readTime: 7, slug: 'accessible-command-palette-ja',
    },
  },
  'container-queries': {
    en: {
      id: 'container-queries', title: 'Container Queries for Honest Components', excerpt: 'Let a component respond to the space it actually gets instead of guessing from the viewport.', date: '2024-05-18', author: 'CSS Working Group', readTime: 5, slug: 'container-queries-en',
    },
    ko: {
      id: 'container-queries', title: '정직한 컴포넌트를 위한 컨테이너 쿼리', excerpt: '뷰포트를 추측하지 말고 컴포넌트가 실제로 받은 공간에 반응하게 만듭니다.', date: '2024-05-18', author: 'CSS 워킹 그룹', readTime: 5, slug: 'container-queries-ko',
    },
    ja: {
      id: 'container-queries', title: '正直なコンポーネントのためのコンテナクエリ', excerpt: 'ビューポートを推測せず、コンポーネントが実際に得た空間へ反応させます。', date: '2024-05-18', author: 'CSSワーキンググループ', readTime: 5, slug: 'container-queries-ja',
    },
  },
  'optimistic-ui': {
    en: {
      id: 'optimistic-ui', title: 'Optimistic UI Without Lying to Users', excerpt: 'Fast feedback still needs a clear path for failure, undo, and stale state.', date: '2024-06-07', author: 'Product Engineering', readTime: 6, slug: 'optimistic-ui-en',
    },
    ko: {
      id: 'optimistic-ui', title: '사용자를 속이지 않는 낙관적 UI', excerpt: '빠른 피드백에는 실패와 실행 취소, 오래된 상태를 다루는 명확한 경로가 필요합니다.', date: '2024-06-07', author: '프로덕트 엔지니어링', readTime: 6, slug: 'optimistic-ui-ko',
    },
    ja: {
      id: 'optimistic-ui', title: 'ユーザーを欺かない楽観的UI', excerpt: '速いフィードバックには失敗、取り消し、古い状態への明確な道筋が必要です。', date: '2024-06-07', author: 'プロダクトエンジニアリング', readTime: 6, slug: 'optimistic-ui-ja',
    },
  },
  'loading-states': {
    en: {
      id: 'loading-states', title: 'Designing Loading States That Explain Themselves', excerpt: 'A loading indicator should set expectations, not merely prove that JavaScript is alive.', date: '2024-07-21', author: 'Interface Studio', readTime: 5, slug: 'loading-states-en',
    },
    ko: {
      id: 'loading-states', title: '스스로 설명하는 로딩 상태 설계', excerpt: '로딩 표시는 자바스크립트가 살아 있다는 증명보다 사용자의 기대를 정해야 합니다.', date: '2024-07-21', author: '인터페이스 스튜디오', readTime: 5, slug: 'loading-states-ko',
    },
    ja: {
      id: 'loading-states', title: '自分で説明できるローディング状態', excerpt: 'ローディング表示はJavaScriptの生存確認ではなく、期待値を整えるためにあります。', date: '2024-07-21', author: 'インターフェーススタジオ', readTime: 5, slug: 'loading-states-ja',
    },
  },
  'testing-user-flows': {
    en: {
      id: 'testing-user-flows', title: 'Test the User Flow, Not the Implementation', excerpt: 'Small interaction tests become durable when they describe what a person can observe and do.', date: '2024-08-09', author: 'Quality Practice', readTime: 7, slug: 'testing-user-flows-en',
    },
    ko: {
      id: 'testing-user-flows', title: '구현이 아닌 사용자 흐름을 테스트하기', excerpt: '사람이 보고 할 수 있는 일을 설명하는 작은 상호작용 테스트는 오래 유지됩니다.', date: '2024-08-09', author: '품질 프랙티스', readTime: 7, slug: 'testing-user-flows-ko',
    },
    ja: {
      id: 'testing-user-flows', title: '実装ではなくユーザーフローをテストする', excerpt: '人が見て操作できることを説明する小さなテストは長く保てます。', date: '2024-08-09', author: 'クオリティプラクティス', readTime: 7, slug: 'testing-user-flows-ja',
    },
  },
  'typescript-boundaries': {
    en: {
      id: 'typescript-boundaries', title: 'TypeScript Boundaries That Pull Their Weight', excerpt: 'Types are most valuable at the edges where data enters, changes shape, or leaves the app.', date: '2024-09-16', author: 'Platform Team', readTime: 6, slug: 'typescript-boundaries-en',
    },
    ko: {
      id: 'typescript-boundaries', title: '역할을 다하는 타입스크립트 경계', excerpt: '타입은 데이터가 들어오고 형태가 바뀌고 앱을 나가는 경계에서 가장 큰 가치를 냅니다.', date: '2024-09-16', author: '플랫폼 팀', readTime: 6, slug: 'typescript-boundaries-ko',
    },
    ja: {
      id: 'typescript-boundaries', title: '役に立つTypeScriptの境界', excerpt: '型はデータが入り、形を変え、アプリを出る場所で最も価値を発揮します。', date: '2024-09-16', author: 'プラットフォームチーム', readTime: 6, slug: 'typescript-boundaries-ja',
    },
  },
  'streaming-rendering': {
    en: {
      id: 'streaming-rendering', title: 'Streaming Rendering in Small Pieces', excerpt: 'Reveal a useful shell early, then let slower sections arrive without blocking the whole page.', date: '2024-10-04', author: 'Web Architecture', readTime: 7, slug: 'streaming-rendering-en',
    },
    ko: {
      id: 'streaming-rendering', title: '작은 단위로 스트리밍 렌더링하기', excerpt: '유용한 뼈대를 먼저 보여주고 느린 섹션은 전체 페이지를 막지 않게 도착시킵니다.', date: '2024-10-04', author: '웹 아키텍처', readTime: 7, slug: 'streaming-rendering-ko',
    },
    ja: {
      id: 'streaming-rendering', title: '小さな単位でストリーミングする', excerpt: '役立つシェルを先に見せ、遅いセクションもページ全体を止めずに届けます。', date: '2024-10-04', author: 'ウェブアーキテクチャ', readTime: 7, slug: 'streaming-rendering-ja',
    },
  },
  'layout-shift': {
    en: {
      id: 'layout-shift', title: 'Finding the One Pixel That Moves Everything', excerpt: 'Cumulative layout shift is easier to fix when you inspect geometry instead of guessing at CSS.', date: '2024-11-11', author: 'Runtime Signals', readTime: 5, slug: 'layout-shift-en',
    },
    ko: {
      id: 'layout-shift', title: '모든 것을 움직이는 1픽셀 찾기', excerpt: 'CSS를 추측하는 대신 실제 geometry를 조사하면 누적 레이아웃 이동을 쉽게 고칠 수 있습니다.', date: '2024-11-11', author: '런타임 시그널', readTime: 5, slug: 'layout-shift-ko',
    },
    ja: {
      id: 'layout-shift', title: 'すべてを動かす1ピクセルを探す', excerpt: 'CSSを推測せず形状を調べれば、累積レイアウトシフトを直しやすくなります。', date: '2024-11-11', author: 'ランタイムシグナル', readTime: 5, slug: 'layout-shift-ja',
    },
  },
  'component-api': {
    en: {
      id: 'component-api', title: 'Component APIs With Fewer Surprises', excerpt: 'A small component surface is easier to compose, document, and remove later.', date: '2025-01-08', author: 'UI Systems', readTime: 6, slug: 'component-api-en',
    },
    ko: {
      id: 'component-api', title: '놀라움을 줄이는 컴포넌트 API', excerpt: '작은 컴포넌트 표면은 조합하고 문서화하고 나중에 제거하기 쉽습니다.', date: '2025-01-08', author: 'UI 시스템', readTime: 6, slug: 'component-api-ko',
    },
    ja: {
      id: 'component-api', title: '驚きの少ないコンポーネントAPI', excerpt: '小さなAPIなら組み合わせ、文書化し、後で削除するのも簡単です。', date: '2025-01-08', author: 'UIシステムズ', readTime: 6, slug: 'component-api-ja',
    },
  },
  'frontend-observability': {
    en: {
      id: 'frontend-observability', title: 'Frontend Observability With Useful Signals', excerpt: 'Collect the few events that explain a broken experience, then attach enough context to act on them.', date: '2025-02-19', author: 'Signals Team', readTime: 6, slug: 'frontend-observability-en',
    },
    ko: {
      id: 'frontend-observability', title: '쓸모 있는 신호를 만드는 프론트엔드 관측성', excerpt: '깨진 경험을 설명하는 이벤트만 모으고 실제로 대응할 수 있는 맥락을 연결합니다.', date: '2025-02-19', author: '시그널 팀', readTime: 6, slug: 'frontend-observability-ko',
    },
    ja: {
      id: 'frontend-observability', title: '役立つシグナルを集めるフロントエンド可観測性', excerpt: '壊れた体験を説明するイベントだけを集め、行動できる文脈を添えます。', date: '2025-02-19', author: 'シグナルチーム', readTime: 6, slug: 'frontend-observability-ja',
    },
  },
};

export function getBlogPost(id: string, language: Language): BlogPost | null {
  const post = blogPostsRegistry[id]?.[language];
  const taxonomy = blogTaxonomy[id]?.[language];
  const taxonomyIds = blogTaxonomyIds[id];
  if (!post || !taxonomy || !taxonomyIds) return null;
  return { ...post, ...taxonomy, ...taxonomyIds, language };
}

export function getAllBlogPosts(language: Language): BlogPost[] {
  return Object.keys(blogPostsRegistry)
    .map((id) => getBlogPost(id, language))
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getArticleNeighbors(id: string, language: Language): {
  previous: BlogPost | null;
  next: BlogPost | null;
} {
  const posts = getAllBlogPosts(language);
  const index = posts.findIndex((post) => post.id === id);
  return {
    previous: index >= 0 ? posts[index + 1] ?? null : null,
    next: index > 0 ? posts[index - 1] ?? null : null,
  };
}

export function getRelatedBlogPosts(id: string, language: Language): BlogPost[] {
  const current = blogPostsRegistry[id]?.[language];
  const currentPost = getBlogPost(id, language);
  if (!current || !currentPost) return [];

  const explicit = (current.relatedIds ?? [])
    .map((relatedId) => getBlogPost(relatedId, language))
    .filter((post): post is BlogPost => Boolean(post));
  const sameCategory = getAllBlogPosts(language).filter(
    (post) => post.id !== id && post.categoryId === currentPost.categoryId,
  );
  return [...new Map([...explicit, ...sameCategory].map((post) => [post.id, post])).values()]
    .filter((post) => post.id !== id)
    .slice(0, 3);
}

export async function getBlogContent(slug: string, signal?: AbortSignal): Promise<string> {
  if (signal?.aborted) throw new DOMException('The request was aborted', 'AbortError');

  const contentUrl = `/blog/content/${encodeURIComponent(slug)}`;
  const response = await fetch(contentUrl, { signal });
  if (!response.ok) throw new Error(`Markdown request failed with ${response.status}`);
  return response.text();
}
