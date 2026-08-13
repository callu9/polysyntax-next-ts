# PolySyntax Multilingual Switching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TechPulse를 PolySyntax로 교체하고, React reconciliation 글을 영어·한국어·일본어로 바꿀 때 글 전체가 원자적으로 전환되며 읽던 위치가 유지되게 한다.

**Architecture:** 기존 Zustand 언어 스토어를 “확정 언어 + 요청 언어”로 확장해 게시글 상세 화면에서만 로딩 성공 후 언어를 확정한다. 순수 정책 함수 한 파일이 언어 해석, 5000ms 경계, 최신 요청 판별, 스크롤 비율 계산을 담당하며 Node 24 내장 테스트로 검증한다. 게시글 화면은 하나의 article snapshot을 교체하고 DOM의 h2/h3 순번을 우선 복원한다.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Zustand 5, react-markdown 10, Node.js 24 built-in test runner, ESLint 9

## Global Constraints

- 브랜드명은 `PolySyntax`, 홈 hero 문구는 정확히 `One frontend idea, three languages.`이다.
- 지원 언어는 `en`, `ko`, `ja`뿐이다.
- 초기 언어 우선순위는 유효한 `language-storage` 값, `navigator.languages[0]`, `navigator.language`, `en` 순서다.
- `ko-*`는 `ko`, `ja-*`는 `ja`, 나머지는 `en`으로 해석한다.
- 전환 성공은 최신 요청이 5000ms 미만에 완료될 때뿐이다. 5000ms 이상은 실패다.
- 로딩·오류 중에는 기존 article snapshot과 확정 언어를 유지한다.
- URL locale, 병렬 비교 화면, prefetch, 사용자 정의 콘텐츠 cache, README 개편, 저장소 전체 lint 정리는 추가하지 않는다.
- 새 npm 의존성을 설치하지 않는다.
- 기존 미커밋 변경은 보존한다. 계획 작성 시점의 `src/`는 untracked이므로 코드 커밋 단계는 사용자가 현재 앱을 baseline으로 커밋한 뒤에만 실행하고, 그 전에는 변경을 stage하지 않는다.

## File Map

- Create: `src/lib/multilingualReading.ts` — 언어 해석, 요청 유효성, 스크롤 수학만 가진 순수 함수.
- Create: `src/lib/multilingualReading.test.ts` — Node 내장 테스트 하나로 모든 비단순 정책을 검증.
- Modify: `src/store/languageStore.ts` — 확정 언어만 저장하고 게시글 전환 요청은 별도로 보관.
- Modify: `src/components/Header.tsx` — 상세 글에서는 언어를 요청하고, 다른 화면에서는 즉시 확정.
- Modify: `src/content/blog/metadata.ts` — Markdown fetch에 `AbortSignal`을 전달하고 실패를 호출자에게 전달.
- Modify: `src/app/blog/react-reconciliation/page.tsx` — snapshot 전환, timeout/retry/latest-wins, 위치 복원 UI.
- Modify: `src/app/layout.tsx`, `src/app/about/page.tsx`, `src/content/translations/{common,home,about}.ts` — 사용자 노출 브랜드와 tagline 교체.

---

### Task 1: PolySyntax 브랜드와 홈 tagline

**Files:**
- Modify: `src/app/layout.tsx:17-20`
- Modify: `src/app/about/page.tsx:14-40`
- Modify: `src/content/translations/common.ts:1-47`
- Modify: `src/content/translations/home.ts:1-20`
- Modify: `src/content/translations/about.ts:1-26`

**Interfaces:**
- Consumes: 기존 `t('common.siteName')`, `t('home.title')`, `t('home.subtitle')` 호출.
- Produces: 모든 기존 화면에서 `PolySyntax` 이름과 홈 hero의 정확한 tagline.

- [ ] **Step 1: 현재 사용자 노출 브랜드 문자열을 확인한다**

Run:

```bash
rg -ni "techpulse" src
```

Expected: layout metadata, common/home/about 번역, about 본문과 연락처에서 일치 항목이 나온다.

- [ ] **Step 2: 번역 레지스트리의 이름과 hero 문구를 교체한다**

`src/content/translations/common.ts`의 세 `siteName`을 다음 값으로 교체한다.

```ts
siteName: 'PolySyntax',
```

`src/content/translations/home.ts`의 언어별 title/subtitle을 다음과 같이 교체한다.

```ts
en: {
  title: 'Welcome to PolySyntax',
  subtitle: 'One frontend idea, three languages.',
  latestArticles: 'Latest Articles',
  readMore: 'Read More',
},
ko: {
  title: 'PolySyntax에 오신 것을 환영합니다',
  subtitle: 'One frontend idea, three languages.',
  latestArticles: '최신 글',
  readMore: '더 읽기',
},
ja: {
  title: 'PolySyntaxへようこそ',
  subtitle: 'One frontend idea, three languages.',
  latestArticles: '最新の記事',
  readMore: '続きを読む',
},
```

`src/content/translations/about.ts`에서는 `TechPulse`를 `PolySyntax`로, `contact@techpulse.com`을 `contact@polysyntax.dev`로 교체한다. 기존 설명과 mission 문구는 변경하지 않는다.

- [ ] **Step 3: layout metadata와 실제 about 본문을 교체한다**

`src/app/layout.tsx`:

```ts
export const metadata: Metadata = {
  title: "PolySyntax - Multilingual Frontend Reading",
  description: "One frontend idea, three languages.",
};
```

`src/app/about/page.tsx`의 세 사용자 노출 문장을 다음처럼 바꾼다.

```tsx
<h2 className="text-2xl font-bold mb-4">About PolySyntax</h2>
<p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
  PolySyntax is your go-to source for the latest frontend technology news, trends, and insights.
  We provide in-depth articles, tutorials, and best practices to help you stay ahead in the ever-evolving
  world of web development.
</p>
```

```tsx
<p className="text-lg text-slate-600 dark:text-slate-400">
  PolySyntax is available in English, Korean, and Japanese to serve our global developer community.
</p>
```

- [ ] **Step 4: 브랜드 잔여 문자열과 tagline을 검증한다**

Run:

```bash
rg -ni "techpulse" src
rg -nF "One frontend idea, three languages." src/content/translations/home.ts src/app/layout.tsx
npx eslint src/app/layout.tsx src/app/about/page.tsx src/content/translations/common.ts src/content/translations/home.ts src/content/translations/about.ts
```

Expected: 첫 명령은 출력 없이 exit 1, 두 번째 명령은 home 번역 3개와 metadata 설명 1개를 출력, ESLint는 exit 0.

- [ ] **Step 5: 앱 source baseline이 이미 커밋된 경우에만 브랜드 변경을 커밋한다**

`git ls-files src/app/layout.tsx`가 파일을 출력하지 않으면 이 commit 단계는 건너뛰고 변경을 unstaged로 둔다. 출력하면 다음을 실행한다.

```bash
git add src/app/layout.tsx src/app/about/page.tsx src/content/translations/common.ts src/content/translations/home.ts src/content/translations/about.ts
git commit -m "feat: rebrand app as PolySyntax"
```

---

### Task 2: 순수 언어·전환·스크롤 정책과 내장 테스트

**Files:**
- Create: `src/lib/multilingualReading.test.ts`
- Create: `src/lib/multilingualReading.ts`

**Interfaces:**
- Consumes: 저장된 unknown 값, 브라우저 언어 문자열, request id/timestamp, article 치수.
- Produces: `Language`, `resolveLanguage()`, `readPersistedLanguage()`, `canCommitRequest()`, `getArticleScrollRatio()`, `getArticleScrollTarget()`, `LANGUAGE_TIMEOUT_MS`.

- [ ] **Step 1: 실패하는 단일 정책 테스트를 추가한다**

`src/lib/multilingualReading.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

// @ts-expect-error Node's type-stripping runner requires the .ts extension.
import { canCommitRequest, getArticleScrollRatio, getArticleScrollTarget, readPersistedLanguage, resolveLanguage } from './multilingualReading.ts';

test('valid persisted language wins over the browser', () => {
  assert.equal(resolveLanguage('ja', 'ko-KR'), 'ja');
});

test('browser primary subtags normalize and unsupported values use English', () => {
  assert.equal(resolveLanguage(undefined, 'ko-KR'), 'ko');
  assert.equal(resolveLanguage(undefined, 'ja-JP'), 'ja');
  assert.equal(resolveLanguage(undefined, 'en-GB'), 'en');
  assert.equal(resolveLanguage(undefined, 'fr-FR'), 'en');
  assert.equal(resolveLanguage(undefined, undefined), 'en');
});

test('malformed or invalid persisted values are ignored', () => {
  assert.equal(readPersistedLanguage('{broken'), undefined);
  assert.equal(readPersistedLanguage('{"state":{}}'), undefined);
  assert.equal(readPersistedLanguage('{"state":{"language":"fr"}}'), undefined);
  assert.equal(readPersistedLanguage('{"state":{"language":"ko"}}'), 'ko');
});

test('only the latest request completed before 5000 ms can commit', () => {
  assert.equal(canCommitRequest(2, 2, 1000, 5999), true);
  assert.equal(canCommitRequest(2, 2, 1000, 6000), false);
  assert.equal(canCommitRequest(1, 2, 1000, 1100), false);
});

test('article-local scroll math clamps both ratio and document target', () => {
  assert.equal(getArticleScrollRatio(800, 200, 1400, 800), 1);
  assert.equal(getArticleScrollRatio(0, 200, 1400, 800), 0);
  assert.equal(getArticleScrollTarget(0.5, 300, 1800, 800, 2200), 800);
  assert.equal(getArticleScrollTarget(1, 1800, 1800, 800, 2400), 1600);
});
```

- [ ] **Step 2: 테스트가 구현 부재로 실패하는지 확인한다**

Run:

```bash
node --test --experimental-strip-types src/lib/multilingualReading.test.ts
```

Expected: `ERR_MODULE_NOT_FOUND`로 FAIL.

- [ ] **Step 3: 가장 작은 순수 구현을 추가한다**

`src/lib/multilingualReading.ts`:

```ts
export const SUPPORTED_LANGUAGES = ['en', 'ko', 'ja'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const LANGUAGE_TIMEOUT_MS = 5000;

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as Language);
}

export function readPersistedLanguage(raw: string | null): Language | undefined {
  if (!raw) return undefined;

  try {
    const language = (JSON.parse(raw) as { state?: { language?: unknown } }).state?.language;
    return isLanguage(language) ? language : undefined;
  } catch {
    return undefined;
  }
}

export function resolveLanguage(persisted: unknown, browserLanguage?: string): Language {
  if (isLanguage(persisted)) return persisted;

  const primarySubtag = browserLanguage?.toLowerCase().split('-')[0];
  return primarySubtag === 'ko' || primarySubtag === 'ja' ? primarySubtag : 'en';
}

export function canCommitRequest(
  requestId: number,
  latestRequestId: number,
  startedAt: number,
  completedAt: number,
): boolean {
  return requestId === latestRequestId && completedAt - startedAt < LANGUAGE_TIMEOUT_MS;
}

export function getArticleScrollRatio(
  scrollY: number,
  articleTop: number,
  articleHeight: number,
  viewportHeight: number,
): number {
  return Math.min(1, Math.max(0, (scrollY - articleTop) / Math.max(1, articleHeight - viewportHeight)));
}

export function getArticleScrollTarget(
  ratio: number,
  articleTop: number,
  articleHeight: number,
  viewportHeight: number,
  documentHeight: number,
): number {
  const target = articleTop + Math.min(1, Math.max(0, ratio)) * Math.max(0, articleHeight - viewportHeight);
  return Math.min(Math.max(0, target), Math.max(0, documentHeight - viewportHeight));
}
```

- [ ] **Step 4: 테스트와 정적 검사를 통과시킨다**

Run:

```bash
node --test --experimental-strip-types src/lib/multilingualReading.test.ts
npx eslint src/lib/multilingualReading.ts src/lib/multilingualReading.test.ts
```

Expected: 5 tests PASS, ESLint exit 0.

- [ ] **Step 5: 앱 source baseline이 이미 커밋된 경우에만 정책과 테스트를 커밋한다**

`git ls-files src/lib`가 기존 tracked source를 출력하지 않으면 이 commit 단계는 건너뛰고 변경을 unstaged로 둔다. baseline이 존재하면 다음을 실행한다.

```bash
git add src/lib/multilingualReading.ts src/lib/multilingualReading.test.ts
git commit -m "test: define multilingual reading policies"
```

---

### Task 3: 확정 언어와 요청 언어를 분리한다

**Files:**
- Modify: `src/store/languageStore.ts:1-21`
- Modify: `src/components/Header.tsx:1-68`

**Interfaces:**
- Consumes: Task 2의 `Language`, `resolveLanguage()`, 기존 `language-storage` 형식.
- Produces: `language`, `requestedLanguage`, `setLanguage(language)`, `requestLanguage(language)`, `clearRequestedLanguage()`.

- [ ] **Step 1: 기존 store/header가 새 상태 계약을 아직 제공하지 않는지 확인한다**

Run:

```bash
rg -n "requestedLanguage|requestLanguage|clearRequestedLanguage|skipHydration" src/store/languageStore.ts src/components/Header.tsx
```

Expected: 출력 없이 exit 1.

- [ ] **Step 2: 확정 언어만 안전하게 저장하는 store로 교체한다**

`src/store/languageStore.ts` 전체를 다음 내용으로 교체한다.

```ts
import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import { readPersistedLanguage, resolveLanguage, type Language } from '@/lib/multilingualReading';

export type { Language } from '@/lib/multilingualReading';

type PersistedLanguageState = Pick<LanguageState, 'language'>;

export interface LanguageState {
  language: Language;
  requestedLanguage: Language | null;
  setLanguage: (language: Language) => void;
  requestLanguage: (language: Language) => void;
  clearRequestedLanguage: () => void;
}

const languageStorage: PersistStorage<PersistedLanguageState> = {
  getItem: (name) => {
    if (typeof localStorage === 'undefined') return null;

    try {
      const language = readPersistedLanguage(localStorage.getItem(name));
      return language ? { state: { language } } : null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {
      // Persistence is optional; the in-memory language remains usable.
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Nothing else is required when storage is unavailable.
    }
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist<LanguageState, [], [], PersistedLanguageState>(
    (set) => ({
      language: 'en',
      requestedLanguage: null,
      setLanguage: (language) => set({ language, requestedLanguage: null }),
      requestLanguage: (language) => set((state) => ({
        requestedLanguage: language === state.language ? null : language,
      })),
      clearRequestedLanguage: () => set({ requestedLanguage: null }),
    }),
    {
      name: 'language-storage',
      storage: languageStorage,
      partialize: ({ language }) => ({ language }),
      merge: (persisted, current) => ({
        ...current,
        language: resolveLanguage(
          (persisted as Partial<PersistedLanguageState> | undefined)?.language,
          typeof navigator === 'undefined'
            ? undefined
            : navigator.languages?.[0] || navigator.language,
        ),
        requestedLanguage: null,
      }),
      skipHydration: true,
    },
  ),
);
```

- [ ] **Step 3: Header에서 route별 언어 동작과 hydration을 연결한다**

`src/components/Header.tsx`에 import를 추가한다.

```ts
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
```

컴포넌트 시작부의 store 사용을 다음으로 교체한다.

```ts
const { t } = useTranslation();
const pathname = usePathname();
const previousPathname = useRef(pathname);
const { language, requestedLanguage, setLanguage, requestLanguage, clearRequestedLanguage } = useLanguageStore();
const { user, logout, isAuthenticated } = useAuthStore();
const selectedLanguage = requestedLanguage ?? language;
const isArticleRoute = pathname.startsWith('/blog/');

useEffect(() => {
  useLanguageStore.persist.rehydrate();
}, []);

useEffect(() => {
  document.documentElement.lang = language;
}, [language]);

useEffect(() => {
  if (previousPathname.current.startsWith('/blog/') && !isArticleRoute) {
    clearRequestedLanguage();
  }
  previousPathname.current = pathname;
}, [clearRequestedLanguage, isArticleRoute, pathname]);

const selectLanguage = (nextLanguage: Language) => {
  if (isArticleRoute) requestLanguage(nextLanguage);
  else setLanguage(nextLanguage);
};
```

dropdown trigger와 item은 확정 언어 대신 선택 언어를 표시한다.

```tsx
<DropdownMenuTrigger
  aria-label={t('common.language')}
  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
>
  {selectedLanguage.toUpperCase()}
  <ChevronDown size={16} />
</DropdownMenuTrigger>
```

```tsx
<DropdownMenuItem
  key={lang.value}
  onClick={() => selectLanguage(lang.value)}
  className={`cursor-pointer ${selectedLanguage === lang.value ? 'bg-blue-100 dark:bg-blue-900 font-semibold' : ''}`}
>
  {lang.label}
</DropdownMenuItem>
```

- [ ] **Step 4: store/header를 검증한다**

Run:

```bash
node --test --experimental-strip-types src/lib/multilingualReading.test.ts
npx eslint src/store/languageStore.ts src/components/Header.tsx
npm run build
```

Expected: 5 tests PASS, 지정 파일 ESLint exit 0, Next.js build exit 0.

- [ ] **Step 5: 앱 source baseline이 이미 커밋된 경우에만 언어 상태 변경을 커밋한다**

`git ls-files src/store/languageStore.ts`가 파일을 출력하지 않으면 이 commit 단계는 건너뛰고 변경을 unstaged로 둔다. 출력하면 다음을 실행한다.

```bash
git add src/store/languageStore.ts src/components/Header.tsx
git commit -m "feat: defer article language persistence"
```

---

### Task 4: article snapshot 전환, timeout/retry, 위치 복원

**Files:**
- Modify: `src/content/blog/metadata.ts:1-72`
- Modify: `src/app/blog/react-reconciliation/page.tsx:1-147`

**Interfaces:**
- Consumes: `requestedLanguage`, `setLanguage()`, Task 2의 timeout/latest/scroll 함수, 기존 Markdown 세 파일.
- Produces: `getBlogContent(slug, signal): Promise<string>`와 하나의 원자적 `ArticleSnapshot` 전환 UI.

- [ ] **Step 1: Markdown fetch가 실패와 cancellation을 전달하도록 바꾼다**

`src/content/blog/metadata.ts`에서 반환 타입을 재사용 가능하게 이름 붙인다.

```ts
import type { Language } from '@/lib/multilingualReading';

export type BlogPost = BlogPostMeta & { language: Language };
```

파일 맨 위의 중복 `type Language = 'en' | 'ko' | 'ja'` 선언은 제거한다.

`getBlogPost()`와 `getAllBlogPosts()`의 반환 타입을 각각 `BlogPost | null`, `BlogPost[]`로 바꾸고, `getBlogContent()`를 다음으로 교체한다.

```ts
export async function getBlogContent(slug: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch(`/blog/${slug}.md`, { signal });
  if (!response.ok) throw new Error(`Markdown request failed with ${response.status}`);
  return response.text();
}
```

- [ ] **Step 2: page 상단에 snapshot/position 계약을 추가한다**

`src/app/blog/react-reconciliation/page.tsx`의 import를 다음과 같이 정리한다.

```ts
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/i18n/useTranslation';
import { getBlogPost, getBlogContent, type BlogPost } from '@/content/blog/metadata';
import {
  LANGUAGE_TIMEOUT_MS,
  canCommitRequest,
  getArticleScrollRatio,
  getArticleScrollTarget,
} from '@/lib/multilingualReading';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
```

컴포넌트 위에 다음 타입과 DOM 함수를 둔다.

```ts
type ArticleSnapshot = { article: BlogPost; content: string };
type Transition = { state: 'idle' | 'loading' | 'error'; target: BlogPost['language'] | null };
type ReadingPosition = { headingOrdinal: number | null; ratio: number };

function captureReadingPosition(article: HTMLElement): ReadingPosition {
  const headings = Array.from(article.querySelectorAll<HTMLElement>('h2, h3'));
  let headingOrdinal: number | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  headings.forEach((heading, index) => {
    const distance = Math.abs(heading.getBoundingClientRect().top);
    if (distance < nearestDistance) {
      headingOrdinal = index;
      nearestDistance = distance;
    }
  });

  const articleTop = window.scrollY + article.getBoundingClientRect().top;
  return {
    headingOrdinal,
    ratio: getArticleScrollRatio(
      window.scrollY,
      articleTop,
      article.scrollHeight,
      window.innerHeight,
    ),
  };
}

function restoreReadingPosition(article: HTMLElement, position: ReadingPosition): void {
  const headings = article.querySelectorAll<HTMLElement>('h2, h3');
  const heading = position.headingOrdinal === null ? undefined : headings[position.headingOrdinal];

  if (heading) {
    window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top });
    return;
  }

  const articleTop = window.scrollY + article.getBoundingClientRect().top;
  window.scrollTo({
    top: getArticleScrollTarget(
      position.ratio,
      articleTop,
      article.scrollHeight,
      window.innerHeight,
      document.documentElement.scrollHeight,
    ),
  });
}
```

- [ ] **Step 3: 기존 content/loading effect를 최신 요청 우선 snapshot effect로 교체한다**

컴포넌트 시작부의 기존 `article`, `content`, `loading`, `useEffect`를 다음 코드로 교체한다.

```ts
const { language, requestedLanguage, setLanguage } = useLanguageStore();
const { t } = useTranslation();
const targetLanguage = requestedLanguage ?? language;
const [snapshot, setSnapshot] = useState<ArticleSnapshot | null>(null);
const [transition, setTransition] = useState<Transition>({ state: 'idle', target: null });
const [retryCount, setRetryCount] = useState(0);
const articleRef = useRef<HTMLElement>(null);
const pendingPosition = useRef<ReadingPosition | null>(null);
const latestRequestId = useRef(0);

useEffect(() => {
  const targetArticle = getBlogPost('react-reconciliation', targetLanguage);
  if (!targetArticle) {
    setTransition({ state: 'error', target: targetLanguage });
    return;
  }

  const requestId = ++latestRequestId.current;
  const startedAt = performance.now();
  const controller = new AbortController();
  const position = articleRef.current ? captureReadingPosition(articleRef.current) : null;
  const timeout = window.setTimeout(() => controller.abort(), LANGUAGE_TIMEOUT_MS);

  setTransition({ state: 'loading', target: targetLanguage });

  getBlogContent(targetArticle.slug, controller.signal)
    .then((content) => {
      const completedAt = performance.now();
      if (!canCommitRequest(requestId, latestRequestId.current, startedAt, completedAt)) {
        if (requestId === latestRequestId.current) {
          setTransition({ state: 'error', target: targetLanguage });
        }
        return;
      }

      pendingPosition.current = position;
      setSnapshot({ article: targetArticle, content });
      setTransition({ state: 'idle', target: null });
    })
    .catch(() => {
      if (requestId === latestRequestId.current) {
        setTransition({ state: 'error', target: targetLanguage });
      }
    })
    .finally(() => window.clearTimeout(timeout));

  return () => {
    window.clearTimeout(timeout);
    controller.abort();
  };
}, [retryCount, targetLanguage]);

useLayoutEffect(() => {
  if (!snapshot) return;

  if (articleRef.current && pendingPosition.current) {
    restoreReadingPosition(articleRef.current, pendingPosition.current);
    pendingPosition.current = null;
  }

  setLanguage(snapshot.article.language);
}, [setLanguage, snapshot]);

const article = snapshot?.article;
const content = snapshot?.content ?? '';
```

이 effect는 새 요청 시작 시 snapshot을 지우지 않는다. 성공 시 `setSnapshot()` 한 번으로 title/metadata/body를 함께 교체하고 DOM commit 뒤 layout effect의 `setLanguage()`가 `language-storage`를 갱신한다.
기존 `if (!article)` 조기 반환 블록은 제거해 initial loading/error 상태가 아래 상태 UI까지 도달하게 한다.

- [ ] **Step 4: 로딩·오류·retry UI를 기존 article 위에 추가한다**

article을 감싸는 container에서 기존 `<article>` 바로 앞에 다음 상태 UI를 둔다.

```tsx
{transition.state === 'loading' && transition.target && (
  <p role="status" aria-live="polite" className="mb-6 text-sm text-blue-600 dark:text-blue-400">
    Loading {transition.target.toUpperCase()}…
  </p>
)}

{transition.state === 'error' && transition.target && (
  <div role="alert" className="mb-6 rounded-lg border border-red-300 p-4 dark:border-red-800">
    <p className="mb-3 text-red-700 dark:text-red-300">
      Could not load {transition.target.toUpperCase()}. The current article is unchanged.
    </p>
    <button
      type="button"
      onClick={() => setRetryCount((count) => count + 1)}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Retry {transition.target.toUpperCase()}
    </button>
  </div>
)}
```

snapshot이 없고 error가 아닐 때는 상태 UI 뒤에 다음 initial loading 문구를 표시한다.

```tsx
{!article && transition.state !== 'error' && (
  <p className="py-12 text-center text-slate-600 dark:text-slate-400">Loading…</p>
)}
```

기존 article element는 `{article && (`와 `)}`로 감싸고 opening tag를 `<article ref={articleRef} className="prose dark:prose-invert max-w-none">`로 바꾼다. 내부 날짜 locale 기준은 `article.language`, Markdown 입력은 위에서 만든 `content`를 사용한다. 기존 `loading/content not available` 삼항식은 제거한다.

- [ ] **Step 5: 수정 파일의 기존 `any` lint 오류를 함께 제거한다**

`ReactMarkdown`의 components를 컴포넌트 밖 상수로 옮기고 `Components` 타입으로 문맥 타이핑한다. 각 renderer는 `node`를 DOM에 spread하지 않도록 소비한다.

```tsx
const markdownComponents: Components = {
  h2: ({ node, ...props }) => {
    void node;
    return <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />;
  },
  h3: ({ node, ...props }) => {
    void node;
    return <h3 className="text-xl font-bold mt-6 mb-3" {...props} />;
  },
  p: ({ node, ...props }) => {
    void node;
    return <p className="mb-4 leading-relaxed" {...props} />;
  },
  ul: ({ node, ...props }) => {
    void node;
    return <ul className="list-disc list-inside mb-4 space-y-2" {...props} />;
  },
  ol: ({ node, ...props }) => {
    void node;
    return <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />;
  },
  code: ({ node, className, ...props }) => {
    void node;
    return className ? (
      <code className="bg-slate-900 text-slate-100 p-4 rounded-lg block mb-4 overflow-x-auto text-sm" {...props} />
    ) : (
      <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm" {...props} />
    );
  },
  pre: ({ node, ...props }) => {
    void node;
    return <pre className="mb-4" {...props} />;
  },
  blockquote: ({ node, ...props }) => {
    void node;
    return <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-slate-600 dark:text-slate-400" {...props} />;
  },
  a: ({ node, ...props }) => {
    void node;
    return <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />;
  },
};
```

`ReactMarkdown` 호출은 다음 세 속성만 사용한다.

```tsx
<ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
  {content}
</ReactMarkdown>
```

- [ ] **Step 6: 자동 검증을 통과시킨다**

Run:

```bash
node --test --experimental-strip-types src/lib/multilingualReading.test.ts
npx eslint src/lib/multilingualReading.ts src/lib/multilingualReading.test.ts src/store/languageStore.ts src/components/Header.tsx src/content/blog/metadata.ts src/app/blog/react-reconciliation/page.tsx
npm run build
```

Expected: 5 tests PASS, 지정 파일 ESLint exit 0, Next.js build exit 0.

- [ ] **Step 7: 앱 source baseline이 이미 커밋된 경우에만 article 전환 변경을 커밋한다**

`git ls-files src/app/blog/react-reconciliation/page.tsx`가 파일을 출력하지 않으면 이 commit 단계는 건너뛰고 변경을 unstaged로 둔다. 출력하면 다음을 실행한다.

```bash
git add src/content/blog/metadata.ts src/app/blog/react-reconciliation/page.tsx
git commit -m "feat: switch article languages atomically"
```

---

### Task 5: 브라우저 수동 검증과 작업 기록

**Files:**
- Modify: `docs/codex/tasks/active/polysyntax-multilingual-switching.md`

**Interfaces:**
- Consumes: Tasks 1-4의 실행 가능한 앱과 `.ouroboros/seed.yaml` AC-1~AC-5.
- Produces: 실제 브라우저 검증 증거와 깨끗한 범위의 인계 기록.

- [ ] **Step 1: 개발 서버를 시작하고 기존 route를 연다**

Run:

```bash
npm run dev
```

Expected: 서버가 시작되고 `/`, `/blog`, `/blog/react-reconciliation`, `/login`, `/about`이 응답한다.

- [ ] **Step 2: 브랜드와 초기 언어 우선순위를 확인한다**

브라우저에서 다음을 순서대로 확인한다.

1. `/`의 header, hero, document title이 `PolySyntax`이고 hero 문구가 정확히 `One frontend idea, three languages.`이다.
2. `/about`에 `TechPulse`가 노출되지 않는다.
3. `language-storage`를 삭제하고 브라우저 기본 언어를 `ko-KR`, `ja-JP`, `fr-FR`로 각각 바꿔 새로고침하면 KO, JA, EN이 선택된다.
4. `language-storage`에 유효한 `ja`를 저장하면 브라우저가 `ko-KR`이어도 JA가 선택된다.
5. 저장값을 잘못된 JSON과 `fr` 값으로 각각 바꾸면 브라우저 기본 언어로 복구된다.

- [ ] **Step 3: 성공·timeout·retry·latest-wins를 확인한다**

1. 글 상세에서 EN→KO를 선택한다. loading status가 즉시 나타나며 기존 EN 제목·metadata·본문이 유지되다가 KO snapshot으로 함께 바뀌는지 확인한다.
2. DevTools console에서 다음 코드를 실행해 JA fetch를 timeout 상태로 만든다.

```js
window.__polySyntaxFetch = window.fetch;
window.fetch = (input, init) => String(input).endsWith('react-reconciliation-ja.md')
  ? new Promise((resolve, reject) => {
      void resolve;
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })
  : window.__polySyntaxFetch(input, init);
```

3. JA를 선택하고 5000ms 뒤 기존 KO snapshot과 저장 언어가 유지되며 `Retry JA`가 나타나는지 확인한다.
4. console에서 `window.fetch = window.__polySyntaxFetch`로 복원하고 `Retry JA`를 눌러 JA가 성공하는지 확인한다.
5. Network를 Slow 3G로 바꾼 뒤 EN→KO→JA를 빠르게 눌러 마지막 JA만 화면과 저장값을 바꾸는지 확인한다.

- [ ] **Step 4: heading ordinal과 ratio fallback을 확인한다**

1. 글 중간 h2/h3가 viewport 상단에 가장 가까운 상태에서 언어를 바꾸고 동일 순번의 heading이 상단에 오는지 확인한다.
2. fallback은 자동 테스트의 계산 결과를 먼저 확인한다.
3. 브라우저에서도 fallback을 재현하려면 console에서 다음 fetch wrapper를 적용하고, 기존 글의 마지막 heading 근처에서 JA로 바꾼다.

```js
window.__polySyntaxFetch = window.fetch;
window.fetch = async (input, init) => {
  const response = await window.__polySyntaxFetch(input, init);
  if (!String(input).endsWith('react-reconciliation-ja.md')) return response;
  const markdownWithoutHeadings = (await response.text()).replace(/^#{2,3} .+$/gm, '');
  return new Response(markdownWithoutHeadings, { status: response.status, headers: response.headers });
};
```

Expected: 같은 heading 순번이 없으므로 새 article의 동일한 진행 비율 근처로 이동한다. 확인 후 `window.fetch = window.__polySyntaxFetch`로 복원한다.

- [ ] **Step 5: 최종 검증과 범위 확인을 실행한다**

Run:

```bash
node --test --experimental-strip-types src/lib/multilingualReading.test.ts
npm run build
npx eslint src/lib/multilingualReading.ts src/lib/multilingualReading.test.ts src/store/languageStore.ts src/components/Header.tsx src/content/blog/metadata.ts src/app/blog/react-reconciliation/page.tsx src/app/layout.tsx src/app/about/page.tsx src/content/translations/common.ts src/content/translations/home.ts src/content/translations/about.ts
git diff --check
git status --short
```

Expected: test/build/scoped ESLint/diff check는 모두 exit 0. `git status`에는 사용자의 기존 변경이 남을 수 있지만 이번 작업 파일의 의도하지 않은 변경은 없다.

- [ ] **Step 6: active task에 검증 결과를 기록하고 커밋한다**

`docs/codex/tasks/active/polysyntax-multilingual-switching.md`의 Verification Evidence 표에 실제 명령, exit code, 브라우저 확인 결과를 기록한다. 그 파일만 stage해 커밋한다.

```bash
git add docs/codex/tasks/active/polysyntax-multilingual-switching.md
git commit -m "docs: record PolySyntax verification"
```

원격 push나 PR 생성은 사용자가 별도로 요청할 때만 수행한다.
