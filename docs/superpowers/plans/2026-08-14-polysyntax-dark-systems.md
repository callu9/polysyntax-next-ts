# PolySyntax Dark Systems Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle all existing PolySyntax routes as a responsive Dark Systems, journal-led frontend publication without changing application behavior.

**Architecture:** Replace the existing light/blue Tailwind presentation with a small semantic token layer in `globals.css`, then apply those tokens through the existing shared shell and route components. Existing content retrieval, language state, auth state, routes, and markdown rendering remain the same; pages only change their markup hierarchy and utility classes.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind CSS 4, Zustand, Radix UI, react-markdown.

## Global Constraints

- Use the exact palette: canvas `#1C2228`, surface `#252E33`, raised surface `#2B363C`, text `#F6F5F0`, muted `#AEB8B9`, border `#465157`, accent `#D9DF74`.
- Do not add dependencies, fonts, images, APIs, routes, storage keys, or interactions.
- Preserve EN/KO/JA selection, article atomic loading/error/retry/position restoration, and mock-login behavior.
- Keep the header sticky at about 64 px; navigation is desktop-only while logo and language control remain visible on small screens.
- Design and check at 375 px and 1440 px; no horizontal overflow, clipped controls, or color-only focus indicators.
- Respect `prefers-reduced-motion`; avoid layout-moving hover effects.
- Source is user-owned and currently untracked: do not stage or commit source files without explicit user authorization.

## File Structure

- Modify: `src/app/globals.css` — Dark Systems semantic tokens, typography defaults, reusable reading and motion rules.
- Modify: `src/app/layout.tsx` — apply the semantic page background/text tokens to the root body.
- Modify: `src/components/Header.tsx` — compact editorial header while retaining existing language and auth logic.
- Modify: `src/components/Footer.tsx` — three-column, rule-led footer.
- Modify: `src/app/page.tsx` — journal-front-page hierarchy using the existing single post metadata.
- Modify: `src/app/blog/page.tsx` — vertical archive list with metadata-first entries.
- Modify: `src/app/blog/react-reconciliation/page.tsx` — narrow article reading layout and semantic Markdown styles.
- Modify: `src/app/login/page.tsx` — restrained panel, shared form controls, unchanged submit flow.
- Modify: `src/app/about/page.tsx` — readable editorial column with section labels and rules.

---

### Task 1: Establish semantic Dark Systems tokens and motion baseline

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Tailwind v4 `@theme inline` mappings and the existing `body` element.
- Produces: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-accent`, and `ring-ring` utilities mapped to the selected palette.

- [ ] **Step 1: Write the failing visual acceptance checklist**

Record this browser checklist in the active task before styling: at `/`, inspect `body` and a focused link; expected current failure is a white/blue palette and browser-default-looking focus treatment.

```text
At 1440 px: body background is #1C2228; primary text is #F6F5F0.
At 375 px: no document horizontal overflow.
Tab focus has a visible outline plus an accent color.
With reduced motion enabled: no transition animation is required.
```

- [ ] **Step 2: Verify the baseline fails**

Run the dev server and inspect `/` in the browser. Confirm the current white canvas and blue emphasis do not satisfy the checklist.

- [ ] **Step 3: Implement the minimal semantic baseline**

In `src/app/globals.css`, replace the current neutral light/dark token values with the exact selected hex values in `:root`, keeping the existing `@theme inline` utility mapping. Remove the separate `.dark` palette so Dark Systems is authoritative. Add only these global rules:

```css
html { color-scheme: dark; }
body { min-width: 320px; background: var(--background); color: var(--foreground); }
:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }
```

Map the semantic values so `--background` is canvas, `--card`/`--popover` are surface, `--secondary`/`--muted` are raised surface, `--foreground` is text, `--muted-foreground` is muted, `--border`/`--input` are border, and `--ring`/`--primary` are accent. In `src/app/layout.tsx`, replace its light/dark color classes with `bg-background text-foreground`.

- [ ] **Step 4: Verify the checklist passes**

Run `npm run dev`, inspect `/` at 375 px and 1440 px, and tab to a link. Confirm the checklist values and visible focus treatment. Stop the server when finished.

- [ ] **Step 5: Run the scoped static check**

Run: `npx eslint src/app/globals.css src/app/layout.tsx`

Expected: exit 0.

### Task 2: Restyle the shared shell without changing its state behavior

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `useTranslation`, `useLanguageStore`, `useAuthStore`, `DropdownMenu`, and all existing route/auth handlers.
- Produces: a 64 px sticky header and responsive three-column footer; the `selectLanguage` function and its article-route behavior remain unchanged.

- [ ] **Step 1: Write the failing interaction checklist**

```text
At 1440 px the header shows the PolySyntax mark, three navigation links, language control, and auth control.
At 375 px the mark and language control remain visible and navigation is hidden.
Selecting a language on /blog/react-reconciliation still enters the existing loading flow.
Footer columns stack at 375 px and retain each existing route/contact link.
```

- [ ] **Step 2: Verify the baseline**

Run the dev server and use the existing language dropdown on the article. Confirm the interaction works before changing only class names and layout wrappers.

- [ ] **Step 3: Implement the minimal shell redesign**

In `Header.tsx`, retain imports, hooks, `languages`, and `selectLanguage` unchanged. Replace blue/slate/dark utility classes with semantic classes; use a `border-b border-border bg-background/95 backdrop-blur` header, compact uppercase navigation labels, an accent text/underline active-state derived from `pathname`, and bordered surface controls. Keep nav `hidden md:flex`, the outer height `h-16`, and visible focus styles from Task 1.

In `Footer.tsx`, retain links and email. Replace the dark block with `border-t border-border bg-background`, use muted uppercase labels, surface-neutral links that become primary text with a thin accent indicator on hover/focus, and keep `grid-cols-1 md:grid-cols-3`.

- [ ] **Step 4: Verify the interaction checklist passes**

At both viewport sizes, check shell layout, tab focus, language menu keyboard selection, and an article language switch. Confirm the article continues to load and no header/footer control is clipped.

- [ ] **Step 5: Run scoped lint**

Run: `npx eslint src/components/Header.tsx src/components/Footer.tsx`

Expected: exit 0.

### Task 3: Convert home and blog index to journal/archive layouts

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/blog/page.tsx`

**Interfaces:**
- Consumes: `useTranslation`, `useLanguageStore`, `getAllBlogPosts`, `BlogPost`, and Next `Link`.
- Produces: existing post links displayed as a front-page feature and archive rows; no new data source or placeholder post content.

- [ ] **Step 1: Write the failing content-layout checklist**

```text
Home uses actual post metadata rather than three repeated "Article Title" cards.
Home has an ISSUE 001-style label, a lead article link, and compact secondary/archive presentation.
Blog is a rule-separated vertical archive; each article title is a Next Link.
At 375 px, all rows stack and fit the viewport; at 1440 px, the lead area can use a two-column composition.
```

- [ ] **Step 2: Verify the baseline fails**

Inspect `/` and `/blog`: the current home repeats three mock cards with gradient artwork, and `/blog` uses large rounded gradient cards.

- [ ] **Step 3: Implement the smallest content-backed layouts**

In `src/app/page.tsx`, import `Link`, `getAllBlogPosts`, and `useLanguageStore`. Read the current language and take the first entry from `getAllBlogPosts(language)`. Replace the inert Subscribe button and repeated mock card array with:

```tsx
const featuredArticle = getAllBlogPosts(language)[0];
```

Render an `ISSUE 001` label, existing translated title/subtitle, and—when `featuredArticle` exists—a bordered feature `Link` with its date, read time, title, excerpt, and translated read-more label. Do not manufacture secondary content when only one real post exists; add one concise archive link to `/blog` instead.

In `src/app/blog/page.tsx`, keep `getAllBlogPosts` and locale date formatting. Replace the grid/card/gradient markup with a `divide-y divide-border` list. Each row is an `article` with metadata, title, excerpt, and the existing `Link`; use a class-only hover contrast change and an accent arrow/rule that does not move layout.

- [ ] **Step 4: Verify the checklist passes**

At `/` and `/blog`, test EN, KO, and JA; open the article from both routes; inspect at 375 px and 1440 px. Confirm no mock post text or gradient artwork remains.

- [ ] **Step 5: Run scoped lint**

Run: `npx eslint src/app/page.tsx src/app/blog/page.tsx`

Expected: exit 0.

### Task 4: Apply the long-form article reading treatment

**Files:**
- Modify: `src/app/blog/react-reconciliation/page.tsx`

**Interfaces:**
- Consumes: `ArticleSnapshot`, `ReadingPosition`, `getBlogContent`, language-store operations, and `markdownComponents`.
- Produces: the same fetch, timeout, retry, and restoration behavior with Dark Systems markup/classes for article states and Markdown nodes.

- [ ] **Step 1: Write the failing reading checklist**

```text
The article body is constrained to approximately 42–46rem.
Metadata includes date, author, read time, and current language above the title.
Headings, links, blockquotes, inline code, and fenced code use the selected palette with readable contrast.
Loading/error/retry remain visible; switching EN to JA retains the existing article-position behavior.
```

- [ ] **Step 2: Verify the baseline and behavior**

At the article route, scroll to a heading, switch language, and note its ordinal. Confirm the existing behavior works before class-only/markup visual changes.

- [ ] **Step 3: Implement the minimal reading treatment**

Do not change `captureReadingPosition`, `restoreReadingPosition`, effect dependencies, requests, or error state. Replace only presentation:

```tsx
<article ref={articleRef} className="mx-auto max-w-3xl">
```

Place an uppercase metadata row including `article.language.toUpperCase()` above the `h1`, and a `border-b border-border` rule after the header. Update `markdownComponents` classes to use semantic `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`, and accent link/focus styles. Keep fenced code horizontally scrollable and retain GFM. Restyle status and retry/error controls to use the shared surface, border, accent, and descriptive alert text. Add only an opacity transition if it is paired with the global reduced-motion rule from Task 1.

- [ ] **Step 4: Verify the reading checklist passes**

Inspect all three languages, code blocks, links, and blockquotes. Switch language after scrolling to a heading and confirm the ordinal remains in view. Simulate keyboard focus on the retry control if the error state is available.

- [ ] **Step 5: Run existing policy test and scoped lint**

Run:

```bash
node --test --experimental-strip-types src/lib/multilingualReading.test.ts
npx eslint src/app/blog/react-reconciliation/page.tsx
```

Expected: policy test reports 5 passes; ESLint exits 0.

### Task 5: Finish login and about, then verify the full redesign

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `docs/codex/tasks/active/polysyntax-multilingual-switching.md` — append visual-redesign verification evidence only after checks pass.

**Interfaces:**
- Consumes: existing `login` handler, router push, translation hook, and static about copy.
- Produces: matched bounded editorial panels while preserving form submission and text content.

- [ ] **Step 1: Write the failing finish checklist**

```text
Login form remains keyboard usable and successful demo login redirects to /.
Login and about use a bounded surface panel, labels, rules, and the shared focus treatment.
All five routes render at 375 px and 1440 px without horizontal overflow.
```

- [ ] **Step 2: Verify the baseline**

Open `/login` and `/about`; confirm the existing login submission works before touching classes.

- [ ] **Step 3: Implement the minimal remaining route styles**

In `login/page.tsx`, preserve state and `handleSubmit`. Replace white/slate/blue classes with a single bordered `bg-card` form panel, semantic labels/inputs, and an accent submit button with high-contrast foreground. Keep native `required`, disabled state, and error message semantics.

In `about/page.tsx`, preserve copy and heading order. Replace prose/light classes with a narrow column, uppercase section labels (using the existing headings), `border-t border-border` separators between sections, and muted reading copy. Do not introduce translations or change content in this visual pass.

- [ ] **Step 4: Run full verification**

Run:

```bash
node --test --experimental-strip-types src/lib/multilingualReading.test.ts
npx eslint src/app/globals.css src/app/layout.tsx src/components/Header.tsx src/components/Footer.tsx src/app/page.tsx src/app/blog/page.tsx src/app/blog/react-reconciliation/page.tsx src/app/login/page.tsx src/app/about/page.tsx
npm run build
```

Expected: policy test reports 5 passes; ESLint exits 0 for the changed files; production build exits 0.

- [ ] **Step 5: Perform final browser acceptance pass and record evidence**

Start the production-equivalent app. At 375 px and 1440 px, inspect `/`, `/blog`, `/blog/react-reconciliation`, `/login`, and `/about`; exercise keyboard focus, language menu, article language switch, and demo login. Append only the observed commands/results to the active task handoff.

- [ ] **Step 6: Commit only if source staging is explicitly authorized**

If the user explicitly authorizes staging the source files, run:

```bash
git add src/app/globals.css src/app/layout.tsx src/components/Header.tsx src/components/Footer.tsx src/app/page.tsx src/app/blog/page.tsx src/app/blog/react-reconciliation/page.tsx src/app/login/page.tsx src/app/about/page.tsx docs/codex/tasks/active/polysyntax-multilingual-switching.md
git diff --cached --check
git commit -m "feat: apply Dark Systems editorial design"
```

Otherwise, leave source files unstaged and report the verification evidence.
