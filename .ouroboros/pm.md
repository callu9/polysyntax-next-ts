# PolySyntax 다국어 프론트엔드 콘텐츠 서비스

*Created At: 2026-08-13T05:44:46.771832+00:00*

## Goal

프론트엔드 개발자가 영어 중심의 깊이 있는 기술 자료를 영어·한국어·일본어로 읽고 언어별 표현을 한 게시글에서 비교할 수 있게 한다.

## Service Name

- **Selected:** PolySyntax
- **Meaning:** 여러 언어(Poly)로 하나의 기술 문법과 개념(Syntax)을 읽고 비교하는 서비스
- **Tagline (EN):** One frontend idea, three languages.
- **Tagline (KO):** 하나의 프론트엔드 개념, 세 가지 언어.
- **Tagline (JA):** ひとつのフロントエンド概念を、3つの言語で。
- **Why selected:** 다국어 비교라는 핵심 가치를 담으면서 특정 언어나 현재 세 가지 언어에 브랜드 확장성을 제한하지 않는다.
- **Alternatives considered:** LocaleStack은 다국어 개발 도구처럼 들릴 수 있고, Transyntax는 발음이 덜 직관적이며 자동 번역 서비스로 오해될 수 있어 제외했다.
- **Validation required before public launch:** 도메인 및 상표 사용 가능성 확인

## User Stories

1. **As a** 프론트엔드 개발자, **I want to** 동일한 기술 게시글을 영어·한국어·일본어로 전환해 읽고 싶다, **so that** 영어 자료를 이해하는 데 드는 시간과 노력을 줄이고 언어별 기술 표현을 한곳에서 비교할 수 있다.

## Constraints

- Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, Zustand, react-markdown 스택을 사용한다.
- 홈(/), 블로그 목록·게시글(/blog, /blog/react-reconciliation), 로그인(/login), 소개(/about) 화면을 제공한다.
- 언어 선택은 브라우저에 저장한다.
- 글 메타데이터는 src/content/blog/metadata.ts에 두고 Markdown 본문은 public/blog/에서 클라이언트가 불러온다.
- 다크 테마 스타일을 제공한다.
- 로그인은 데모용 mock 방식이다.
- 아직 커밋되지 않은 사용자 작업 내용을 보존해야 한다.

## Success Criteria

1. 사용자가 게시글에서 영어·한국어·일본어 중 하나를 선택하면 같은 게시글을 유지한 채 본문, 제목, 메타데이터가 즉시 선택 언어로 전환된다.
2. 언어를 전환해도 사용자가 읽던 위치를 최대한 유지한다.
3. 새로고침하거나 다시 방문해도 마지막으로 선택한 언어가 유지된다.
4. Markdown 기반 게시글 1편을 영어·한국어·일본어로 제공한다.

## Assumptions

- 언어 전환 시 읽던 위치를 '최대한 유지'하는 구체적인 허용 오차나 측정 방식은 아직 정의되지 않았다.
- 출시 후 이용률, 재방문율 등 정량적인 성과 목표는 아직 정해지지 않았다.

## Decide Later

The following items were deferred or identified as premature at this stage. They should be revisited when more context is available:

- README의 Next.js 14 및 이전 app/ 경로 설명을 실제 Next.js 16 및 src/app/ 구조에 맞게 수정하는 작업
- 현재 npm run lint를 실패시키는 11개 오류와 10개 경고의 수정

---
*PM ID: pm_seed_interview_20260813_044540*
*Interview ID: interview_20260813_044540*
