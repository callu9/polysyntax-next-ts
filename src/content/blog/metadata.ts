import type { Language } from '@/lib/multilingualReading';

interface BaseBlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: number;
  slug: string;
  content: string;
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
      content: '# React Reconciliation Algorithm\n\nReact compares the new element tree with the previous one before it touches the DOM. This reconciliation step lets a render describe the desired UI while React chooses the smallest useful set of mutations.\n\n## Identity matters\n\nElement type and `key` form the identity of a child. Stable keys let React preserve local state when a list changes, while index keys can move state to the wrong row.\n\n## A practical rule\n\nKeep render functions pure, use stable keys for collections, and measure before optimizing. Most components already benefit from React’s diffing without manual DOM work.\n\n## In practice\n\nImagine a sortable task list where each row owns an expanded state and an input value. Keying rows by task ID lets both pieces of state follow the task after sorting. Keying by array index can leave the expanded panel attached to a different task, even though the DOM looks almost correct.\n\n## Review checklist\n\n- Use stable domain IDs for list keys.\n- Never create keys with random values or the current time.\n- Profile a slow interaction before adding memoization.\n\nWhen identity is stable and rendering stays pure, reconciliation is usually an implementation detail rather than code the feature must manage.',
    },
    ko: {
      id: 'react-reconciliation', title: '리액트 재조정 알고리즘', excerpt: '리액트가 재조정 알고리즘(diffing)으로 DOM을 효율적으로 업데이트하는 방식을 이해합니다.', date: '2024-02-03', author: '프론트엔드 팀', readTime: 8, slug: 'react-reconciliation-ko',
      content: '# 리액트 재조정 알고리즘\n\n리액트는 DOM을 바로 수정하지 않고 이전 엘리먼트 트리와 새 트리를 비교합니다. 이 재조정 단계 덕분에 렌더 함수는 원하는 UI를 설명하고 리액트는 필요한 변경만 선택합니다.\n\n## 정체성이 중요한 이유\n\n자식 엘리먼트의 타입과 `key`가 정체성을 결정합니다. 안정적인 키를 쓰면 목록이 바뀌어도 로컬 상태가 유지되지만, 인덱스를 키로 쓰면 상태가 다른 행으로 이동할 수 있습니다.\n\n## 실전 규칙\n\n렌더 함수를 순수하게 유지하고, 목록에는 안정적인 키를 사용하고, 최적화 전에는 측정하세요. 대부분의 컴포넌트는 직접 DOM을 다루지 않아도 재조정의 이점을 얻습니다.\n\n## 실무 예시\n\n정렬 가능한 할 일 목록에서 각 행이 펼침 상태와 입력값을 가진다고 해봅시다. 작업 ID를 키로 쓰면 정렬 후에도 상태가 같은 작업을 따라갑니다. 배열 인덱스를 키로 쓰면 화면은 얼핏 맞아 보여도 펼친 패널이 다른 작업에 붙을 수 있습니다.\n\n## 리뷰 체크리스트\n\n- 목록 키에는 안정적인 도메인 ID를 사용합니다.\n- 난수나 현재 시간으로 키를 만들지 않습니다.\n- 메모이제이션을 넣기 전에 느린 상호작용을 프로파일링합니다.\n\n정체성이 안정적이고 렌더가 순수하면 재조정은 기능 코드가 직접 관리할 대상이 아니라 리액트의 구현 세부 사항으로 남습니다.',
    },
    ja: {
      id: 'react-reconciliation', title: 'React 調整アルゴリズム', excerpt: 'Reactが調整アルゴリズム(diffing)でDOMを効率的に更新する仕組みを解説します。', date: '2024-02-03', author: 'フロントエンドチーム', readTime: 8, slug: 'react-reconciliation-ja',
      content: '# React 調整アルゴリズム\n\nReactはDOMをすぐに変更せず、前回の要素ツリーと新しいツリーを比較します。調整によって、レンダーはUIの意図を表し、Reactは必要な変更だけを選べます。\n\n## アイデンティティが重要\n\n子要素の型と`key`がアイデンティティになります。安定したキーならリストの変更後もローカル状態を保てますが、インデックスをキーにすると状態が別の行へ移ることがあります。\n\n## 実践的なルール\n\nレンダーを純粋に保ち、コレクションには安定したキーを使い、最適化の前に計測しましょう。多くのコンポーネントは手動のDOM操作なしで調整の恩恵を受けられます。\n\n## 実務での例\n\n並べ替え可能なタスクリストで、各行が展開状態と入力値を持つとします。タスクIDをキーにすれば、並べ替え後も状態は同じタスクに付きます。配列インデックスでは、見た目がほぼ正しくても展開パネルが別の行へ移ることがあります。\n\n## レビューチェックリスト\n\n- リストのキーには安定したドメインIDを使う。\n- 乱数や現在時刻からキーを作らない。\n- メモ化の前に遅い操作を計測する。\n\nアイデンティティと純粋なレンダーを守れば、調整は機能側で管理するコードではなくReactの実装詳細のままにできます。',
    },
  },
  'performance-budget': {
    en: {
      id: 'performance-budget', title: 'A Performance Budget That Teams Can Keep', excerpt: 'Turn page speed from a vague aspiration into a small set of reviewable limits.', date: '2024-03-14', author: 'Mina Park', readTime: 6, slug: 'performance-budget-en',
      content: '# A Performance Budget That Teams Can Keep\n\nA useful performance budget is small enough to remember during a pull request. Start with one user-visible metric, one transfer limit, and one regression rule.\n\n## Pick the bottleneck\n\nFor a content page, largest contentful paint and the initial JavaScript transfer are usually better starting points than a long dashboard of timings. Record a baseline on the slowest supported device.\n\n## Make it part of review\n\nPut the limits beside the build command and treat a breach as a conversation. A budget that nobody can check is documentation, not a guardrail.\n\n## In practice\n\nA news page might target an LCP below 2.5 seconds on a mid-range phone and keep initial JavaScript under 170 KB compressed. If a chart library adds 60 KB, the pull request must remove another cost, lazy-load the chart, or explain why the user benefit justifies a revised budget.\n\n## Review checklist\n\n- Measure on the slowest supported device and network.\n- Keep the metric and bundle thresholds beside the build command.\n- Compare every release with the same route and test data.\n\nA budget succeeds when it changes a shipping decision before users feel the regression.',
    },
    ko: {
      id: 'performance-budget', title: '팀이 지킬 수 있는 성능 예산', excerpt: '페이지 속도를 막연한 목표가 아닌 리뷰 가능한 작은 기준으로 바꾸는 방법입니다.', date: '2024-03-14', author: '박미나', readTime: 6, slug: 'performance-budget-ko',
      content: '# 팀이 지킬 수 있는 성능 예산\n\n좋은 성능 예산은 코드 리뷰 중에도 기억할 수 있을 만큼 작아야 합니다. 사용자에게 보이는 지표 하나, 전송량 제한 하나, 회귀 규칙 하나부터 시작하세요.\n\n## 병목을 고르기\n\n콘텐츠 페이지라면 긴 타이밍 대시보드보다 최대 콘텐츠 렌더링 시간과 초기 자바스크립트 전송량이 좋은 출발점입니다. 지원하는 기기 중 가장 느린 환경에서 기준값을 기록하세요.\n\n## 리뷰에 연결하기\n\n빌드 명령 옆에 제한을 적고 초과하면 대화의 시작점으로 삼으세요. 아무도 확인하지 않는 예산은 가드레일이 아니라 문서일 뿐입니다.\n\n## 실무 예시\n\n뉴스 페이지라면 중급 휴대폰에서 LCP 2.5초 이하, 초기 자바스크립트 압축 용량 170KB 이하를 목표로 잡을 수 있습니다. 차트 라이브러리가 60KB를 추가한다면 다른 비용을 줄이거나 차트를 지연 로드하거나, 사용자 가치가 예산 변경을 정당화하는지 리뷰에서 설명해야 합니다.\n\n## 리뷰 체크리스트\n\n- 가장 느린 지원 기기와 네트워크에서 측정합니다.\n- 지표와 번들 한도를 빌드 명령 가까이에 둡니다.\n- 매 배포를 같은 경로와 테스트 데이터로 비교합니다.\n\n좋은 예산은 사용자가 회귀를 느끼기 전에 배포 결정을 바꿉니다.',
    },
    ja: {
      id: 'performance-budget', title: 'チームが守れるパフォーマンス予算', excerpt: 'ページ速度を曖昧な願いからレビューできる小さな基準へ変える方法です。', date: '2024-03-14', author: 'パク・ミナ', readTime: 6, slug: 'performance-budget-ja',
      content: '# チームが守れるパフォーマンス予算\n\n役に立つ予算は、プルリクエスト中にも覚えていられるほど小さいものです。ユーザーに見える指標、転送量の上限、回帰ルールを一つずつ決めます。\n\n## ボトルネックを選ぶ\n\nコンテンツページなら、長いダッシュボードより最大コンテンツの描画時間と初期JavaScript転送量が良い出発点です。対応する中で最も遅い端末を基準にしましょう。\n\n## レビューに組み込む\n\nビルドコマンドの近くに上限を置き、超過を会話のきっかけにします。誰も確認できない予算はガードレールではありません。\n\n## 実務での例\n\nニュースページなら、中級スマートフォンでLCPを2.5秒未満、初期JavaScriptを圧縮後170KB未満に設定できます。チャートライブラリが60KB増やすなら、別のコストを減らす、遅延読込する、またはユーザー価値が予算変更に見合う理由をレビューします。\n\n## レビューチェックリスト\n\n- 最も遅い対応端末と回線で計測する。\n- 指標とバンドル上限をビルド手順の近くに置く。\n- 毎回同じ経路とデータで比較する。\n\n良い予算は、ユーザーが劣化を感じる前にリリース判断を変えます。',
    },
  },
  'accessible-command-palette': {
    en: {
      id: 'accessible-command-palette', title: 'An Accessible Command Palette', excerpt: 'Keyboard shortcuts are only useful when focus, announcements, and escape routes are predictable.', date: '2024-04-02', author: 'Accessibility Guild', readTime: 7, slug: 'accessible-command-palette-en',
      content: '# An Accessible Command Palette\n\nA command palette is a dialog, not a clever input. Give it a labelled heading, move focus into it when opened, and return focus to the trigger when it closes.\n\n## Make state visible\n\nAnnounce result counts with a polite live region and expose the active option with `aria-activedescendant`. Mouse hover should not be the only way to choose an item.\n\n## Keep an escape route\n\nEscape closes the palette, the backdrop does not steal focus, and every command remains reachable without a pointer. Test the flow with a keyboard before styling the animation.\n\n## In practice\n\nWhen a reader types “theme,” keep focus in the search field while arrow keys move the active result. Announce “three commands” once, expose the highlighted row through `aria-activedescendant`, and let Enter run it. Closing the palette should return focus to the button that opened it.\n\n## Review checklist\n\n- Give the dialog an accessible name.\n- Support Tab, arrow keys, Enter, and Escape without a pointer.\n- Announce empty, loading, and result states without repeating every keystroke.\n\nShip the keyboard path first; animation can follow without changing the interaction contract.',
    },
    ko: {
      id: 'accessible-command-palette', title: '접근 가능한 커맨드 팔레트', excerpt: '키보드 단축키는 포커스와 안내, 닫기 동작이 예측 가능할 때만 유용합니다.', date: '2024-04-02', author: '접근성 길드', readTime: 7, slug: 'accessible-command-palette-ko',
      content: '# 접근 가능한 커맨드 팔레트\n\n커맨드 팔레트는 영리한 입력창이 아니라 다이얼로그입니다. 제목을 연결하고 열릴 때 포커스를 안으로 옮긴 뒤 닫으면 트리거로 돌려보내세요.\n\n## 상태를 보이게 만들기\n\npolite 라이브 영역으로 결과 개수를 알리고 `aria-activedescendant`로 현재 항목을 노출하세요. 마우스 오버만으로 항목을 선택할 수 있으면 안 됩니다.\n\n## 탈출 경로 유지하기\n\nEscape로 닫히고 배경이 포커스를 빼앗지 않으며 모든 명령을 포인터 없이 실행할 수 있어야 합니다. 애니메이션을 꾸미기 전에 키보드로 흐름을 확인하세요.\n\n## 실무 예시\n\n독자가 “테마”를 입력하면 포커스는 검색창에 둔 채 화살표 키로 활성 결과를 옮깁니다. “명령 3개”를 한 번 안내하고 강조된 행을 `aria-activedescendant`로 연결한 뒤 Enter로 실행하세요. 팔레트를 닫으면 열었던 버튼으로 포커스를 돌려보냅니다.\n\n## 리뷰 체크리스트\n\n- 다이얼로그에 접근 가능한 이름을 제공합니다.\n- 포인터 없이 Tab, 화살표, Enter, Escape를 지원합니다.\n- 빈 결과, 로딩, 결과 개수를 과도한 반복 없이 알립니다.\n\n키보드 경로를 먼저 완성하면 애니메이션은 상호작용 계약을 바꾸지 않고 나중에 추가할 수 있습니다.',
    },
    ja: {
      id: 'accessible-command-palette', title: 'アクセシブルなコマンドパレット', excerpt: 'キーボード操作はフォーカスと案内、閉じる動作が予測できて初めて役立ちます。', date: '2024-04-02', author: 'アクセシビリティギルド', readTime: 7, slug: 'accessible-command-palette-ja',
      content: '# アクセシブルなコマンドパレット\n\nコマンドパレットは賢い入力欄ではなくダイアログです。見出しを関連付け、開いたら中へフォーカスを移し、閉じたらトリガーへ戻します。\n\n## 状態を伝える\n\npoliteなライブリージョンで件数を知らせ、`aria-activedescendant`で現在の項目を示します。マウスホバーだけで選べる設計は避けます。\n\n## Escapeを残す\n\nEscapeで閉じ、背景がフォーカスを奪わず、ポインターなしで全コマンドを実行できるようにします。アニメーションを整える前にキーボードで確認しましょう。\n\n## 実務での例\n\n利用者が「テーマ」と入力したら、フォーカスは検索欄に残し、矢印キーで結果を移動します。「3件のコマンド」と一度知らせ、選択行を`aria-activedescendant`で示し、Enterで実行します。閉じた後は起動ボタンへフォーカスを戻します。\n\n## レビューチェックリスト\n\n- ダイアログにアクセシブルな名前を付ける。\n- Tab、矢印、Enter、Escapeをポインターなしで使えるようにする。\n- 空、読込中、結果件数を過剰に繰り返さず通知する。\n\nキーボード経路を先に完成させれば、操作契約を変えずに後からアニメーションを加えられます。',
    },
  },
  'container-queries': {
    en: {
      id: 'container-queries', title: 'Container Queries for Honest Components', excerpt: 'Let a component respond to the space it actually gets instead of guessing from the viewport.', date: '2024-05-18', author: 'CSS Working Group', readTime: 5, slug: 'container-queries-en',
      content: '# Container Queries for Honest Components\n\nViewport media queries describe the page, but reusable components need to understand their own container. Container queries make that relationship explicit.\n\n## Start with one boundary\n\nAdd `container-type: inline-size` to the component shell, then define the smallest layout change that needs more room. Avoid copying every breakpoint from the page.\n\n## Preserve a fallback\n\nA sensible single-column layout is already a good fallback. Enhance it at the container boundary and the same card can live in a sidebar, grid, or full-width article.\n\n## In practice\n\nA story card can stack its thumbnail above the headline by default, then switch to two columns when its own width reaches 32rem. The card behaves correctly in a narrow sidebar and a wide archive without knowing either page layout or adding viewport-specific props.\n\n## Review checklist\n\n- Put containment on the reusable component shell.\n- Choose breakpoints from broken content, not popular device widths.\n- Keep the default layout readable when container queries are unavailable.\n\nA component should respond to the space it receives; the page should only decide how much space to give it.',
    },
    ko: {
      id: 'container-queries', title: '정직한 컴포넌트를 위한 컨테이너 쿼리', excerpt: '뷰포트를 추측하지 말고 컴포넌트가 실제로 받은 공간에 반응하게 만듭니다.', date: '2024-05-18', author: 'CSS 워킹 그룹', readTime: 5, slug: 'container-queries-ko',
      content: '# 정직한 컴포넌트를 위한 컨테이너 쿼리\n\n뷰포트 미디어 쿼리는 페이지를 설명하지만 재사용 컴포넌트는 자신의 컨테이너를 알아야 합니다. 컨테이너 쿼리는 이 관계를 명시합니다.\n\n## 경계 하나부터 시작하기\n\n컴포넌트 셸에 `container-type: inline-size`를 추가하고 더 넓은 공간이 필요할 때의 최소 레이아웃 변화만 정의하세요. 페이지의 모든 브레이크포인트를 복사하지 않습니다.\n\n## 폴백을 유지하기\n\n합리적인 단일 열 레이아웃은 이미 좋은 폴백입니다. 컨테이너 경계에서만 확장하면 같은 카드가 사이드바, 그리드, 본문 어디에서든 작동합니다.\n\n## 실무 예시\n\n기사 카드는 기본으로 썸네일과 제목을 세로로 쌓고, 자신의 너비가 32rem을 넘을 때만 두 열로 바꿀 수 있습니다. 그러면 카드가 좁은 사이드바와 넓은 아카이브 모두에서 페이지 레이아웃이나 뷰포트 전용 prop을 몰라도 올바르게 동작합니다.\n\n## 리뷰 체크리스트\n\n- 재사용 컴포넌트 셸에 컨테이너를 지정합니다.\n- 기기 너비가 아니라 콘텐츠가 깨지는 지점에서 경계를 고릅니다.\n- 쿼리를 지원하지 않아도 기본 레이아웃이 읽혀야 합니다.\n\n컴포넌트는 받은 공간에 반응하고, 페이지는 얼마만큼의 공간을 줄지만 결정하게 하세요.',
    },
    ja: {
      id: 'container-queries', title: '正直なコンポーネントのためのコンテナクエリ', excerpt: 'ビューポートを推測せず、コンポーネントが実際に得た空間へ反応させます。', date: '2024-05-18', author: 'CSSワーキンググループ', readTime: 5, slug: 'container-queries-ja',
      content: '# 正直なコンポーネントのためのコンテナクエリ\n\nビューポートのメディアクエリはページを説明しますが、再利用するコンポーネントは自分のコンテナを理解する必要があります。コンテナクエリが関係を明確にします。\n\n## 境界を一つ決める\n\nコンポーネントのシェルに`container-type: inline-size`を付け、広い空間が必要な最小の変更だけを定義します。ページのブレークポイントをすべて複製しません。\n\n## フォールバックを残す\n\n自然な一列レイアウトは良いフォールバックです。コンテナ境界で拡張すれば、同じカードをサイドバーやグリッドでも使えます。\n\n## 実務での例\n\n記事カードは既定で画像と見出しを縦に積み、自身の幅が32remを超えた時だけ二列へ変更できます。狭いサイドバーでも広い一覧でも、ページ構造やビューポート用propを知らずに正しく表示されます。\n\n## レビューチェックリスト\n\n- 再利用するシェルにコンテナを設定する。\n- 端末幅ではなくコンテンツが崩れる位置を境界にする。\n- クエリなしでも既定レイアウトを読めるようにする。\n\nコンポーネントは与えられた空間に反応し、ページは与える空間だけを決める設計が長持ちします。',
    },
  },
  'optimistic-ui': {
    en: {
      id: 'optimistic-ui', title: 'Optimistic UI Without Lying to Users', excerpt: 'Fast feedback still needs a clear path for failure, undo, and stale state.', date: '2024-06-07', author: 'Product Engineering', readTime: 6, slug: 'optimistic-ui-en',
      content: '# Optimistic UI Without Lying to Users\n\nOptimistic updates make a successful action feel instant, but they must leave room for the server to disagree. Model pending, confirmed, and failed states instead of hiding the request.\n\n## Keep an undo window\n\nFor destructive or reversible actions, show a short undo affordance. It is often simpler than blocking the user with a confirmation modal.\n\n## Recover visibly\n\nIf the request fails, restore the previous value and explain what happened near the affected control. Speed is helpful; silent data loss is not.\n\n## In practice\n\nWhen a reader bookmarks an article, fill the icon immediately and mark the request pending. A success response confirms the state. A failure restores the empty icon, keeps the article in view, and shows a retry message beside the control. A second click should not create a duplicate request.\n\n## Review checklist\n\n- Keep the previous value until the server confirms the change.\n- Define what happens when requests finish out of order.\n- Make retry and undo available beside the affected item.\n\nOptimism is a presentation choice, not permission to lose the server truth or hide failure.',
    },
    ko: {
      id: 'optimistic-ui', title: '사용자를 속이지 않는 낙관적 UI', excerpt: '빠른 피드백에는 실패와 실행 취소, 오래된 상태를 다루는 명확한 경로가 필요합니다.', date: '2024-06-07', author: '프로덕트 엔지니어링', readTime: 6, slug: 'optimistic-ui-ko',
      content: '# 사용자를 속이지 않는 낙관적 UI\n\n낙관적 업데이트는 성공한 동작을 즉시 느끼게 하지만 서버가 거절할 여지도 남겨야 합니다. 요청을 숨기지 말고 대기, 확인, 실패 상태를 모델링하세요.\n\n## 실행 취소 시간 두기\n\n삭제나 되돌릴 수 있는 작업은 짧은 실행 취소 버튼을 보여주세요. 확인 모달로 사용자를 막는 것보다 단순한 경우가 많습니다.\n\n## 눈에 보이게 복구하기\n\n요청이 실패하면 이전 값을 복원하고 해당 컨트롤 가까이에서 이유를 설명하세요. 속도는 유용하지만 조용한 데이터 손실은 그렇지 않습니다.\n\n## 실무 예시\n\n독자가 글을 북마크하면 아이콘을 즉시 채우고 요청을 대기 상태로 표시합니다. 성공 응답은 상태를 확정합니다. 실패하면 빈 아이콘으로 복원하고 글은 그대로 둔 채 컨트롤 옆에 재시도 안내를 보여주세요. 두 번째 클릭이 중복 요청을 만들지 않게 막아야 합니다.\n\n## 리뷰 체크리스트\n\n- 서버 확인 전까지 이전 값을 보관합니다.\n- 요청이 순서와 다르게 끝날 때의 규칙을 정합니다.\n- 영향받은 항목 가까이에 재시도와 실행 취소를 둡니다.\n\n낙관성은 표현 방식일 뿐 서버의 진실을 잃거나 실패를 숨겨도 된다는 뜻은 아닙니다.',
    },
    ja: {
      id: 'optimistic-ui', title: 'ユーザーを欺かない楽観的UI', excerpt: '速いフィードバックには失敗、取り消し、古い状態への明確な道筋が必要です。', date: '2024-06-07', author: 'プロダクトエンジニアリング', readTime: 6, slug: 'optimistic-ui-ja',
      content: '# ユーザーを欺かない楽観的UI\n\n楽観的更新は成功した操作を即座に感じさせますが、サーバーが拒否する余地も必要です。リクエストを隠さず、保留・確定・失敗を状態として扱います。\n\n## 取り消しの時間を作る\n\n削除や戻せる操作には短い取り消しを表示します。確認モーダルで止めるより簡単なことが多い方法です。\n\n## 見える形で戻す\n\n失敗したら以前の値を復元し、対象の近くで理由を説明します。速さは役立ちますが、静かなデータ損失は違います。\n\n## 実務での例\n\n記事をブックマークしたらアイコンを即座に塗り、リクエストを保留中にします。成功で確定し、失敗なら空のアイコンへ戻し、記事は残したまま操作の横に再試行を表示します。二度目のクリックで重複リクエストを作らないことも重要です。\n\n## レビューチェックリスト\n\n- サーバー確定まで以前の値を保持する。\n- リクエストが順不同で完了する場合を決める。\n- 対象の近くに再試行と取り消しを置く。\n\n楽観性は表示の選択であり、サーバーの事実を失ったり失敗を隠したりする許可ではありません。失敗時の説明まで設計して初めて安全です。復旧経路も必須です。',
    },
  },
  'loading-states': {
    en: {
      id: 'loading-states', title: 'Designing Loading States That Explain Themselves', excerpt: 'A loading indicator should set expectations, not merely prove that JavaScript is alive.', date: '2024-07-21', author: 'Interface Studio', readTime: 5, slug: 'loading-states-en',
      content: '# Designing Loading States That Explain Themselves\n\nLoading is a temporary state with a job: tell people what is happening and what they can do next. Use a skeleton when the shape is known and a progress label when time matters.\n\n## Avoid layout jumps\n\nReserve the final content space before data arrives. Stable geometry makes both loading and error states easier to scan.\n\n## Give slow work a name\n\nAfter a short delay, say what is taking time and offer a safe next action. “Loading…” is honest, but “Loading your saved projects…” is useful.\n\n## In practice\n\nAn article archive knows that each result contains a date, title, excerpt, and two tags. Reserve those rows with a quiet skeleton while the first request runs. If the wait crosses a second, replace vague motion with “Loading 24 saved articles” and keep filters available when they can work locally.\n\n## Review checklist\n\n- Match the placeholder geometry to the final content.\n- Delay busy indicators for work that usually finishes instantly.\n- Pair every long wait with a named task, error state, and safe retry.\n\nA useful loading state preserves context and sets expectations; it does not merely decorate latency.',
    },
    ko: {
      id: 'loading-states', title: '스스로 설명하는 로딩 상태 설계', excerpt: '로딩 표시는 자바스크립트가 살아 있다는 증명보다 사용자의 기대를 정해야 합니다.', date: '2024-07-21', author: '인터페이스 스튜디오', readTime: 5, slug: 'loading-states-ko',
      content: '# 스스로 설명하는 로딩 상태 설계\n\n로딩은 해야 할 일이 있는 임시 상태입니다. 무슨 일이 일어나는지와 다음 행동을 알려야 합니다. 형태를 알면 스켈레톤을, 시간이 중요하면 진행 문구를 사용하세요.\n\n## 레이아웃 점프 피하기\n\n데이터가 오기 전에 최종 콘텐츠 공간을 예약하세요. 안정적인 형태는 로딩과 오류 모두를 빠르게 읽게 합니다.\n\n## 느린 작업에 이름 붙이기\n\n조금 기다린 뒤 무엇이 오래 걸리는지 말하고 안전한 다음 행동을 제공하세요. “로딩 중…”도 정직하지만 “저장한 프로젝트를 불러오는 중…”이 더 유용합니다.\n\n## 실무 예시\n\n글 아카이브는 결과마다 날짜, 제목, 요약, 태그 두 개가 온다는 것을 압니다. 첫 요청 동안 그 형태를 조용한 스켈레톤으로 예약하세요. 1초를 넘기면 막연한 움직임 대신 “저장한 글 24개를 불러오는 중”이라고 알리고, 로컬에서 동작할 수 있는 필터는 계속 사용할 수 있게 둡니다.\n\n## 리뷰 체크리스트\n\n- 플레이스홀더 크기를 최종 콘텐츠와 맞춥니다.\n- 보통 즉시 끝나는 작업에는 표시를 잠시 지연합니다.\n- 긴 대기에는 작업 이름, 오류 상태, 안전한 재시도를 둡니다.\n\n좋은 로딩 상태는 맥락과 기대를 지키며, 지연 시간을 꾸미는 데서 끝나지 않습니다.',
    },
    ja: {
      id: 'loading-states', title: '自分で説明できるローディング状態', excerpt: 'ローディング表示はJavaScriptの生存確認ではなく、期待値を整えるためにあります。', date: '2024-07-21', author: 'インターフェーススタジオ', readTime: 5, slug: 'loading-states-ja',
      content: '# 自分で説明できるローディング状態\n\nローディングは役割を持つ一時的な状態です。何が起きているか、次に何ができるかを伝えます。形が分かるならスケルトン、時間が重要なら進捗ラベルを使います。\n\n## レイアウトのジャンプを避ける\n\nデータが届く前に最終コンテンツの空間を確保します。安定した形はローディングとエラーを読みやすくします。\n\n## 遅い処理に名前を付ける\n\n少し待ったら何に時間がかかっているかを伝え、安全な次の操作を示します。「読み込み中」より「保存したプロジェクトを読み込み中」の方が役立ちます。\n\n## 実務での例\n\n記事一覧は各結果に日付、見出し、要約、二つのタグがあると分かっています。最初の通信中は同じ形の静かなスケルトンを予約します。1秒を超えたら「保存済み記事24件を読込中」と伝え、ローカルで動く絞り込みは使えるままにします。\n\n## レビューチェックリスト\n\n- プレースホルダーを最終コンテンツと同じ寸法にする。\n- 普段すぐ終わる処理の表示は少し遅らせる。\n- 長い待機には処理名、エラー、再試行を用意する。\n\n良いローディング状態は文脈と期待を保ち、遅延を飾るだけでは終わりません。',
    },
  },
  'testing-user-flows': {
    en: {
      id: 'testing-user-flows', title: 'Test the User Flow, Not the Implementation', excerpt: 'Small interaction tests become durable when they describe what a person can observe and do.', date: '2024-08-09', author: 'Quality Practice', readTime: 7, slug: 'testing-user-flows-en',
      content: '# Test the User Flow, Not the Implementation\n\nA resilient UI test starts with a visible goal: a person opens a menu, submits a form, or sees a saved result. It should not care which helper function handled the click.\n\n## Prefer real boundaries\n\nRender the smallest real screen and use accessible labels to find controls. Mock only an external boundary that would make the test slow or nondeterministic.\n\n## Assert the next view\n\nThe strongest assertion is usually the message or control that becomes available after the action. It gives a future refactor room while protecting the behavior users rely on.\n\n## In practice\n\nFor a newsletter form, enter an address through the labelled field, submit with the visible button, and assert that the confirmation message appears. Stub only the remote email service. The test should survive renaming a hook, moving state, or replacing the form library because none of those details are the user flow.\n\n## Review checklist\n\n- Start each test with one observable user goal.\n- Query controls by role, name, or label rather than private selectors.\n- Mock only the slow or external boundary and assert the resulting screen.\n\nA durable test protects what a person can do while leaving implementation details free to change.',
    },
    ko: {
      id: 'testing-user-flows', title: '구현이 아닌 사용자 흐름을 테스트하기', excerpt: '사람이 보고 할 수 있는 일을 설명하는 작은 상호작용 테스트는 오래 유지됩니다.', date: '2024-08-09', author: '품질 프랙티스', readTime: 7, slug: 'testing-user-flows-ko',
      content: '# 구현이 아닌 사용자 흐름을 테스트하기\n\n튼튼한 UI 테스트는 사람이 메뉴를 열고, 폼을 제출하고, 저장된 결과를 보는 눈에 보이는 목표에서 시작합니다. 클릭을 처리한 헬퍼 함수가 무엇인지는 알 필요가 없습니다.\n\n## 실제 경계를 우선하기\n\n작은 실제 화면을 렌더링하고 접근 가능한 라벨로 컨트롤을 찾으세요. 외부 경계가 테스트를 느리거나 비결정적으로 만들 때만 모킹합니다.\n\n## 다음 화면을 검증하기\n\n가장 강한 검증은 동작 후 나타나는 메시지나 컨트롤입니다. 리팩터링의 여지를 주면서 사용자가 의존하는 동작을 보호합니다.\n\n## 실무 예시\n\n뉴스레터 폼이라면 라벨이 있는 입력창에 주소를 적고 보이는 버튼으로 제출한 다음 확인 메시지가 나타나는지 검증합니다. 원격 이메일 서비스만 대체하세요. 훅 이름을 바꾸거나 상태를 옮기거나 폼 라이브러리를 교체해도 이 사용자 흐름은 그대로이므로 테스트가 깨지지 않아야 합니다.\n\n## 리뷰 체크리스트\n\n- 테스트마다 관찰 가능한 사용자 목표 하나로 시작합니다.\n- 비공개 선택자 대신 역할, 이름, 라벨로 컨트롤을 찾습니다.\n- 느리거나 외부인 경계만 모킹하고 결과 화면을 검증합니다.\n\n오래가는 테스트는 사람이 할 수 있는 일을 지키고 구현 세부 사항은 자유롭게 바꿀 수 있게 둡니다.',
    },
    ja: {
      id: 'testing-user-flows', title: '実装ではなくユーザーフローをテストする', excerpt: '人が見て操作できることを説明する小さなテストは長く保てます。', date: '2024-08-09', author: 'クオリティプラクティス', readTime: 7, slug: 'testing-user-flows-ja',
      content: '# 実装ではなくユーザーフローをテストする\n\n強いUIテストは、メニューを開く、フォームを送る、保存結果を見るといった見える目標から始めます。クリックを処理したヘルパー関数には依存しません。\n\n## 本物の境界を優先する\n\n最小限の実画面をレンダーし、アクセシブルなラベルで操作を探します。遅さや非決定性を生む外部境界だけをモックします。\n\n## 次の画面を確認する\n\n操作後に現れるメッセージやコントロールを確認するのが最も強い主張です。リファクタリングの余地を残しつつ、ユーザーの行動を守れます。\n\n## 実務での例\n\nニュースレターフォームなら、ラベル付き入力へ住所を入れ、見えるボタンで送信し、確認メッセージを検証します。外部メールサービスだけを置き換えます。フック名、状態の場所、フォームライブラリが変わっても利用者の流れは同じなのでテストは残ります。\n\n## レビューチェックリスト\n\n- 一つの観察可能な利用者目標から始める。\n- 非公開セレクターではなく役割、名前、ラベルで探す。\n- 遅い外部境界だけをモックし、結果画面を確認する。\n\n長持ちするテストは人ができることを守り、実装詳細を自由に変更できるようにします。',
    },
  },
  'typescript-boundaries': {
    en: {
      id: 'typescript-boundaries', title: 'TypeScript Boundaries That Pull Their Weight', excerpt: 'Types are most valuable at the edges where data enters, changes shape, or leaves the app.', date: '2024-09-16', author: 'Platform Team', readTime: 6, slug: 'typescript-boundaries-en',
      content: '# TypeScript Boundaries That Pull Their Weight\n\nTypes should make important assumptions visible. Put them at API responses, form inputs, and module boundaries rather than annotating every local variable.\n\n## Parse before you trust\n\nA TypeScript interface does not validate JSON at runtime. Narrow untrusted data once, then let the rest of the application use a dependable shape.\n\n## Name the conversion\n\nA small function such as `toArticleSummary` documents where a server model becomes a view model. The name is often more useful than a generic mapper abstraction.\n\n## In practice\n\nTreat an article API response as `unknown`. Check that the ID and title are strings, the date parses, and tags form a string array before constructing `ArticleSummary`. Invalid data should produce one boundary error with enough route context to diagnose it, not scattered optional chaining across every card.\n\n## Review checklist\n\n- Accept `unknown` at network and storage boundaries.\n- Validate required fields before converting to an application type.\n- Keep the trusted type smaller than the raw server payload.\n\nTypes pay for themselves when one explicit conversion protects many ordinary call sites.',
    },
    ko: {
      id: 'typescript-boundaries', title: '역할을 다하는 타입스크립트 경계', excerpt: '타입은 데이터가 들어오고 형태가 바뀌고 앱을 나가는 경계에서 가장 큰 가치를 냅니다.', date: '2024-09-16', author: '플랫폼 팀', readTime: 6, slug: 'typescript-boundaries-ko',
      content: '# 역할을 다하는 타입스크립트 경계\n\n타입은 중요한 가정을 보이게 해야 합니다. 모든 지역 변수에 주석을 다는 대신 API 응답, 폼 입력, 모듈 경계에 배치하세요.\n\n## 믿기 전에 파싱하기\n\n타입스크립트 인터페이스는 런타임에서 JSON을 검증하지 않습니다. 신뢰할 수 없는 데이터는 한 번 좁힌 뒤 나머지 앱에서 확실한 형태를 사용하세요.\n\n## 변환에 이름 붙이기\n\n`toArticleSummary` 같은 작은 함수는 서버 모델이 뷰 모델로 바뀌는 위치를 문서화합니다. 일반 매퍼 추상화보다 이름이 더 유용할 때가 많습니다.\n\n## 실무 예시\n\n기사 API 응답은 `unknown`으로 받으세요. `ArticleSummary`를 만들기 전에 ID와 제목이 문자열인지, 날짜가 파싱되는지, 태그가 문자열 배열인지 확인합니다. 잘못된 데이터는 모든 카드에 선택적 체이닝을 흩뿌리지 말고 경로 맥락이 있는 경계 오류 하나로 처리합니다.\n\n## 리뷰 체크리스트\n\n- 네트워크와 저장소 경계에서는 `unknown`을 받습니다.\n- 앱 타입으로 바꾸기 전에 필수 필드를 검증합니다.\n- 신뢰하는 타입은 원본 서버 응답보다 작게 유지합니다.\n\n한 번의 명시적 변환으로 평범한 호출부 여러 곳을 보호할 때 타입의 비용이 회수됩니다.',
    },
    ja: {
      id: 'typescript-boundaries', title: '役に立つTypeScriptの境界', excerpt: '型はデータが入り、形を変え、アプリを出る場所で最も価値を発揮します。', date: '2024-09-16', author: 'プラットフォームチーム', readTime: 6, slug: 'typescript-boundaries-ja',
      content: '# 役に立つTypeScriptの境界\n\n型は重要な前提を見えるようにします。すべてのローカル変数ではなく、APIレスポンス、フォーム入力、モジュール境界に置きましょう。\n\n## 信じる前にパースする\n\nTypeScriptのインターフェースは実行時にJSONを検証しません。信頼できないデータを一度絞り込み、アプリの残りでは確かな形を使います。\n\n## 変換に名前を付ける\n\n`toArticleSummary`のような小さな関数は、サーバーモデルがビューモデルになる場所を示します。汎用マッパーより名前の方が有益なことがあります。\n\n## 実務での例\n\n記事APIの応答は`unknown`として受けます。`ArticleSummary`を作る前にIDと見出しが文字列か、日付を解析できるか、タグが文字列配列か確認します。不正データは各カードの任意連鎖に任せず、経路情報を持つ一つの境界エラーにします。\n\n## レビューチェックリスト\n\n- 通信と保存の境界では`unknown`を受ける。\n- アプリ型へ変換する前に必須項目を検証する。\n- 信頼する型を生の応答より小さく保つ。\n\n一度の明示的な変換で多くの通常コードを守れる時、型のコストが回収されます。',
    },
  },
  'streaming-rendering': {
    en: {
      id: 'streaming-rendering', title: 'Streaming Rendering in Small Pieces', excerpt: 'Reveal a useful shell early, then let slower sections arrive without blocking the whole page.', date: '2024-10-04', author: 'Web Architecture', readTime: 7, slug: 'streaming-rendering-en',
      content: '# Streaming Rendering in Small Pieces\n\nStreaming works best when a page has a clear shell and a few independent sections. Send the navigation and primary heading first, then fill slower data boundaries as they are ready.\n\n## Bound the waiting\n\nEach boundary needs a stable fallback and a failure state. A skeleton should not shift the page when the real section arrives.\n\n## Keep the first view useful\n\nDo not stream a decorative fragment before the content a reader came for. Prioritize the first meaningful interaction, then tune the order with real measurements.\n\n## In practice\n\nFor an article route, render the header, title, and cached body immediately. Stream personalized recommendations behind one boundary and comments behind another. If comments fail, the article remains complete and the comments section can offer its own retry without replacing the page.\n\n## Review checklist\n\n- Give each streamed boundary a fixed-size fallback and local error state.\n- Keep the primary task outside optional slow boundaries.\n- Measure whether the order improves meaningful paint and interaction.\n\nStreaming is useful when it reduces dependency between sections, not when it turns every component into a loading spinner.',
    },
    ko: {
      id: 'streaming-rendering', title: '작은 단위로 스트리밍 렌더링하기', excerpt: '유용한 뼈대를 먼저 보여주고 느린 섹션은 전체 페이지를 막지 않게 도착시킵니다.', date: '2024-10-04', author: '웹 아키텍처', readTime: 7, slug: 'streaming-rendering-ko',
      content: '# 작은 단위로 스트리밍 렌더링하기\n\n스트리밍은 페이지에 명확한 뼈대와 독립적인 몇 개의 섹션이 있을 때 가장 잘 작동합니다. 내비게이션과 주요 제목을 먼저 보내고 느린 데이터 경계는 준비되는 대로 채우세요.\n\n## 기다림에 경계 두기\n\n각 경계에는 안정적인 폴백과 실패 상태가 필요합니다. 실제 섹션이 도착해도 스켈레톤이 페이지를 흔들지 않아야 합니다.\n\n## 첫 화면을 유용하게 유지하기\n\n독자가 찾으러 온 내용보다 장식 조각을 먼저 스트리밍하지 마세요. 첫 의미 있는 상호작용을 우선하고 실제 측정으로 순서를 조정합니다.\n\n## 실무 예시\n\n기사 경로에서는 헤더, 제목, 캐시된 본문을 즉시 렌더링합니다. 개인화 추천과 댓글은 서로 다른 경계 뒤에서 스트리밍하세요. 댓글이 실패해도 기사는 완전하게 남고 댓글 영역만 자체 재시도를 제공하므로 페이지 전체를 다시 로드할 필요가 없습니다.\n\n## 리뷰 체크리스트\n\n- 각 경계에 크기가 고정된 폴백과 로컬 오류 상태를 둡니다.\n- 핵심 작업은 선택적인 느린 경계 밖에 둡니다.\n- 순서가 의미 있는 렌더와 상호작용을 개선하는지 측정합니다.\n\n스트리밍은 섹션 간 의존을 줄일 때 유용하며 모든 컴포넌트를 로딩 표시로 만들기 위한 기능이 아닙니다.',
    },
    ja: {
      id: 'streaming-rendering', title: '小さな単位でストリーミングする', excerpt: '役立つシェルを先に見せ、遅いセクションもページ全体を止めずに届けます。', date: '2024-10-04', author: 'ウェブアーキテクチャ', readTime: 7, slug: 'streaming-rendering-ja',
      content: '# 小さな単位でストリーミングする\n\nストリーミングは明確なシェルと独立したセクションがあるページで効果を発揮します。ナビゲーションと見出しを先に送り、遅いデータ境界を準備できた順に埋めます。\n\n## 待ち時間を区切る\n\n各境界には安定したフォールバックと失敗状態が必要です。実際のセクションが届いてもスケルトンでページが動かないようにします。\n\n## 最初の表示を役立てる\n\n読者が求める内容より装飾を先に流さないでください。最初の意味ある操作を優先し、実測で順序を調整します。\n\n## 実務での例\n\n記事経路ではヘッダー、見出し、キャッシュ済み本文をすぐ描画します。個別推薦とコメントは別々の境界で流します。コメントが失敗しても記事は完成したままで、コメント欄だけが再試行を出せるため、ページ全体を置き換えません。\n\n## レビューチェックリスト\n\n- 各境界に固定寸法のフォールバックと局所エラーを置く。\n- 主目的を任意の遅い境界の外に保つ。\n- 順序が意味ある描画と操作を改善するか計測する。\n\nストリーミングはセクション間の依存を減らすために使い、すべてをローディング表示にはしません。境界は少ないほど理解しやすくなります。',
    },
  },
  'layout-shift': {
    en: {
      id: 'layout-shift', title: 'Finding the One Pixel That Moves Everything', excerpt: 'Cumulative layout shift is easier to fix when you inspect geometry instead of guessing at CSS.', date: '2024-11-11', author: 'Runtime Signals', readTime: 5, slug: 'layout-shift-en',
      content: '# Finding the One Pixel That Moves Everything\n\nLayout shift is a user-visible bug, not just a score. Capture a trace while loading the page and inspect which element changed its rectangle.\n\n## Reserve external media\n\nImages, ads, and embeds need dimensions before their content arrives. Use intrinsic sizing or an aspect ratio so the browser can allocate space early.\n\n## Watch late styles\n\nFonts and client-only class changes can move a whole heading. Load critical styles early and make the first render use the same geometry as the settled state.\n\n## In practice\n\nSuppose a hero image arrives without dimensions and pushes the article title below the fold. Add its intrinsic width and height or reserve the crop with `aspect-ratio`. Then record a throttled reload and inspect the shift sources again; the title rectangle should remain stable before and after the image decodes.\n\n## Review checklist\n\n- Give images, embeds, and ads dimensions before they load.\n- Use a fallback font with metrics close to the final font.\n- Avoid inserting banners above content after the first paint.\n\nFix the moving rectangle at its source rather than hiding the symptom with delayed rendering.',
    },
    ko: {
      id: 'layout-shift', title: '모든 것을 움직이는 1픽셀 찾기', excerpt: 'CSS를 추측하는 대신 실제 geometry를 조사하면 누적 레이아웃 이동을 쉽게 고칠 수 있습니다.', date: '2024-11-11', author: '런타임 시그널', readTime: 5, slug: 'layout-shift-ko',
      content: '# 모든 것을 움직이는 1픽셀 찾기\n\n레이아웃 이동은 점수만의 문제가 아니라 사용자가 보는 버그입니다. 페이지를 로드하는 동안 트레이스를 기록하고 어떤 요소의 사각형이 바뀌었는지 확인하세요.\n\n## 외부 미디어 공간 예약하기\n\n이미지, 광고, 임베드는 콘텐츠가 도착하기 전에 크기가 필요합니다. 고유 크기나 종횡비를 사용해 브라우저가 공간을 미리 배정하게 하세요.\n\n## 늦게 적용되는 스타일 보기\n\n폰트와 클라이언트 전용 클래스 변경은 제목 전체를 움직일 수 있습니다. 중요한 스타일을 일찍 불러오고 첫 렌더도 최종 상태와 같은 geometry를 사용하게 합니다.\n\n## 실무 예시\n\n크기 없는 히어로 이미지가 도착하며 기사 제목을 화면 아래로 민다고 해봅시다. 이미지의 고유 너비와 높이를 넣거나 `aspect-ratio`로 잘릴 영역을 예약하세요. 느린 네트워크에서 다시 기록했을 때 이미지 디코딩 전후로 제목의 사각형이 그대로여야 합니다.\n\n## 리뷰 체크리스트\n\n- 이미지, 임베드, 광고는 로드 전에 크기를 가집니다.\n- 최종 폰트와 메트릭이 비슷한 폴백 폰트를 사용합니다.\n- 첫 페인트 뒤 콘텐츠 위에 배너를 삽입하지 않습니다.\n\n렌더링을 늦춰 증상을 숨기기보다 움직인 사각형의 원인을 직접 고치세요.',
    },
    ja: {
      id: 'layout-shift', title: 'すべてを動かす1ピクセルを探す', excerpt: 'CSSを推測せず形状を調べれば、累積レイアウトシフトを直しやすくなります。', date: '2024-11-11', author: 'ランタイムシグナル', readTime: 5, slug: 'layout-shift-ja',
      content: '# すべてを動かす1ピクセルを探す\n\nレイアウトシフトはスコアだけでなく、ユーザーが見るバグです。ページの読み込みをトレースし、どの要素の矩形が変わったかを調べます。\n\n## 外部メディアの空間を予約する\n\n画像、広告、埋め込みにはコンテンツ前の寸法が必要です。固有サイズやアスペクト比で早く空間を確保します。\n\n## 遅いスタイルを見る\n\nフォントやクライアント専用クラスの変更で見出し全体が動くことがあります。重要なスタイルを早く読み込み、初回も確定状態と同じ形にします。\n\n## 実務での例\n\n寸法のないヒーロー画像が届き、記事見出しを画面外へ押すとします。固有の幅と高さを付けるか、`aspect-ratio`で切り抜き領域を予約します。低速回線で再記録し、画像のデコード前後で見出しの矩形が動かないことを確認します。\n\n## レビューチェックリスト\n\n- 画像、埋め込み、広告に読込前の寸法を与える。\n- 最終フォントと字形寸法が近い代替フォントを使う。\n- 初回描画後に本文の上へバナーを挿入しない。\n\n描画を遅らせて症状を隠すのではなく、動く矩形の原因を直します。再計測で修正を確認してください。',
    },
  },
  'component-api': {
    en: {
      id: 'component-api', title: 'Component APIs With Fewer Surprises', excerpt: 'A small component surface is easier to compose, document, and remove later.', date: '2025-01-08', author: 'UI Systems', readTime: 6, slug: 'component-api-en',
      content: '# Component APIs With Fewer Surprises\n\nA component API is a promise about how other code will use it. Start with the content and states the product already needs, not every option a future screen might request.\n\n## Prefer composition\n\nChildren and a few semantic slots often outlive a dozen boolean props. Let callers own the markup that is truly theirs.\n\n## Make invalid states hard\n\nUse discriminated props when combinations matter, and keep defaults boring. A clear API lowers the cost of changing the component later.\n\n## In practice\n\nA notification can accept `title`, children, and an optional action instead of flags such as compact, closable, warning, success, and hasLink. If tone changes markup, use a small discriminated variant. If the caller owns the action label and destination, pass that element through a named slot.\n\n## Review checklist\n\n- Add a prop only for a state the product already uses.\n- Prefer children or semantic slots for caller-owned content.\n- Remove combinations that render nothing or contradict each other.\n\nThe best component API makes the common call obvious and leaves rare composition in the caller.',
    },
    ko: {
      id: 'component-api', title: '놀라움을 줄이는 컴포넌트 API', excerpt: '작은 컴포넌트 표면은 조합하고 문서화하고 나중에 제거하기 쉽습니다.', date: '2025-01-08', author: 'UI 시스템', readTime: 6, slug: 'component-api-ko',
      content: '# 놀라움을 줄이는 컴포넌트 API\n\n컴포넌트 API는 다른 코드가 사용하는 방식에 대한 약속입니다. 미래 화면이 요청할지 모르는 옵션이 아니라 제품에 이미 필요한 콘텐츠와 상태부터 시작하세요.\n\n## 조합을 우선하기\n\n자식과 의미 있는 슬롯 몇 개가 불리언 prop 열두 개보다 오래갑니다. 실제로 호출자에게 속한 마크업은 호출자가 소유하게 하세요.\n\n## 잘못된 상태 어렵게 만들기\n\n조합이 중요하면 판별 유니온 prop을 사용하고 기본값은 평범하게 유지하세요. 명확한 API는 나중에 변경하는 비용을 낮춥니다.\n\n## 실무 예시\n\n알림 컴포넌트는 compact, closable, warning, success, hasLink 같은 플래그 대신 `title`, children, 선택적 action을 받을 수 있습니다. 톤이 마크업을 바꾸면 작은 판별 variant를 쓰고, 액션 라벨과 목적지는 호출자가 소유하므로 이름 있는 슬롯으로 전달하세요.\n\n## 리뷰 체크리스트\n\n- 제품에서 이미 쓰는 상태에만 prop을 추가합니다.\n- 호출자 콘텐츠에는 children이나 의미 있는 슬롯을 우선합니다.\n- 아무것도 렌더하지 않거나 모순되는 조합을 제거합니다.\n\n좋은 API는 흔한 호출을 명확하게 만들고 드문 조합은 호출자에게 남겨둡니다.',
    },
    ja: {
      id: 'component-api', title: '驚きの少ないコンポーネントAPI', excerpt: '小さなAPIなら組み合わせ、文書化し、後で削除するのも簡単です。', date: '2025-01-08', author: 'UIシステムズ', readTime: 6, slug: 'component-api-ja',
      content: '# 驚きの少ないコンポーネントAPI\n\nコンポーネントAPIは、他のコードがどう使うかという約束です。将来の画面のための全オプションではなく、今必要なコンテンツと状態から始めます。\n\n## 合成を優先する\n\n子要素と少数の意味あるスロットは、たくさんのboolean propより長く使えます。本当に呼び出し側のものは呼び出し側に任せます。\n\n## 無効な状態を作りにくくする\n\n組み合わせが重要なら判別可能なpropを使い、デフォルトは退屈にします。明確なAPIは後の変更コストを下げます。\n\n## 実務での例\n\n通知はcompact、closable、warning、success、hasLinkというフラグ群ではなく、`title`、子要素、任意のactionを受け取れます。トーンでマークアップが変わるなら小さな判別variantを使い、ラベルと遷移先は呼び出し側が所有するスロットにします。\n\n## レビューチェックリスト\n\n- 製品で既に使う状態にだけpropを追加する。\n- 呼び出し側の内容には子要素や意味あるスロットを使う。\n- 何も描画しない、または矛盾する組み合わせを除く。\n\n良いAPIは一般的な呼び出しを明確にし、珍しい合成を呼び出し側に残します。',
    },
  },
  'frontend-observability': {
    en: {
      id: 'frontend-observability', title: 'Frontend Observability With Useful Signals', excerpt: 'Collect the few events that explain a broken experience, then attach enough context to act on them.', date: '2025-02-19', author: 'Signals Team', readTime: 6, slug: 'frontend-observability-en',
      content: '# Frontend Observability With Useful Signals\n\nObservability is not a warehouse of every click. It is a small set of signals that helps a team connect a user-visible failure to a release and a route.\n\n## Name the experience\n\nTrack meaningful events such as article load failure, form completion, or retry success. Include route, release, locale, and a correlation ID while avoiding private content.\n\n## Close the loop\n\nA signal is useful when it has an owner and a next action. Review the top failures with the people who can fix them and delete events that never change a decision.\n\n## In practice\n\nFor an article language switch, record the requested locale, route pattern, release, duration, outcome, and request ID. Do not record the article body or reader input. A dashboard can then answer whether failures cluster by release or locale, while the request ID connects one browser event to a server trace.\n\n## Review checklist\n\n- Start with a user-visible success or failure question.\n- Include release and correlation context without private content.\n- Give every alert an owner, threshold, and next action.\n\nDelete signals that never change a decision; fewer trusted events are easier to operate than exhaustive noise.',
    },
    ko: {
      id: 'frontend-observability', title: '쓸모 있는 신호를 만드는 프론트엔드 관측성', excerpt: '깨진 경험을 설명하는 이벤트만 모으고 실제로 대응할 수 있는 맥락을 연결합니다.', date: '2025-02-19', author: '시그널 팀', readTime: 6, slug: 'frontend-observability-ko',
      content: '# 쓸모 있는 신호를 만드는 프론트엔드 관측성\n\n관측성은 모든 클릭을 저장하는 창고가 아닙니다. 사용자가 보는 실패를 배포와 경로에 연결하는 작은 신호 집합입니다.\n\n## 경험에 이름 붙이기\n\n게시글 로드 실패, 폼 완료, 재시도 성공 같은 의미 있는 이벤트를 추적하세요. 개인정보를 담지 않으면서 경로, 배포 버전, 언어, 상관관계 ID를 포함합니다.\n\n## 끝까지 연결하기\n\n담당자와 다음 행동이 있을 때 신호는 쓸모가 있습니다. 해결할 수 있는 사람과 상위 실패를 검토하고 의사결정을 바꾸지 않는 이벤트는 삭제하세요.\n\n## 실무 예시\n\n기사 언어 전환이라면 요청한 언어, 경로 패턴, 배포 버전, 걸린 시간, 결과, 요청 ID를 기록합니다. 기사 본문이나 독자 입력은 기록하지 마세요. 그러면 대시보드에서 실패가 특정 배포나 언어에 몰리는지 보고, 요청 ID로 브라우저 이벤트와 서버 트레이스를 연결할 수 있습니다.\n\n## 리뷰 체크리스트\n\n- 사용자가 보는 성공이나 실패 질문에서 시작합니다.\n- 개인정보 없이 배포와 상관관계 맥락을 넣습니다.\n- 모든 경보에 담당자, 임계값, 다음 행동을 둡니다.\n\n의사결정을 바꾸지 않는 신호는 삭제하세요. 신뢰할 수 있는 소수 이벤트가 완전한 소음보다 운영하기 쉽습니다.',
    },
    ja: {
      id: 'frontend-observability', title: '役立つシグナルを集めるフロントエンド可観測性', excerpt: '壊れた体験を説明するイベントだけを集め、行動できる文脈を添えます。', date: '2025-02-19', author: 'シグナルチーム', readTime: 6, slug: 'frontend-observability-ja',
      content: '# 役立つシグナルを集めるフロントエンド可観測性\n\n可観測性はすべてのクリックをためる倉庫ではありません。見える失敗をリリースとルートへ結びつける少数のシグナルです。\n\n## 体験に名前を付ける\n\n記事の読み込み失敗、フォーム完了、再試行成功などを追跡します。個人情報を避けつつルート、リリース、ロケール、相関IDを添えます。\n\n## ループを閉じる\n\n担当者と次の行動があって初めてシグナルは役立ちます。直せる人と上位の失敗を見直し、判断を変えないイベントは削除しましょう。\n\n## 実務での例\n\n記事の言語切替なら、要求ロケール、経路パターン、リリース、所要時間、結果、リクエストIDを記録します。本文や読者入力は記録しません。これで失敗が特定リリースや言語に集中するかを見て、IDでブラウザイベントとサーバートレースを結べます。\n\n## レビューチェックリスト\n\n- 利用者が見る成功または失敗の質問から始める。\n- 個人情報なしでリリースと相関情報を含める。\n- 全アラートに担当、しきい値、次の行動を置く。\n\n判断を変えないシグナルは削除します。信頼できる少数のイベントは、完全なノイズより運用しやすくなります。',
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

export function getBlogContentBySlug(slug: string): string | null {
  return Object.values(blogPostsRegistry)
    .flatMap((content) => Object.values(content))
    .find((candidate) => candidate?.slug === slug)?.content ?? null;
}

export async function getBlogContent(slug: string, signal?: AbortSignal): Promise<string> {
  if (signal?.aborted) throw new DOMException('The request was aborted', 'AbortError');

  const contentUrl = getBlogContentBySlug(slug)
    ? `/blog/content/${encodeURIComponent(slug)}`
    : `/blog/${slug}.md`;
  const response = await fetch(contentUrl, { signal });
  if (!response.ok) throw new Error(`Markdown request failed with ${response.status}`);
  return response.text();
}
