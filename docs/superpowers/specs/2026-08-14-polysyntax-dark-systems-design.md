# PolySyntax Dark Systems Design

## Decision

Apply the selected **Dark Systems × Journal-led** visual direction to the existing
PolySyntax pages: home, blog index, article, login, and about. The change is
visual and structural only: existing routes, language switching, Markdown
loading, mock login, and content stay intact.

The result should feel like a focused frontend publication rather than a generic
SaaS landing page: calm, technical, and editorial.

## Visual system

Use CSS custom properties in the existing global stylesheet; do not add a
design-system dependency.

| Token | Value | Use |
| --- | --- | --- |
| `--canvas` | `#1C2228` | Page background |
| `--surface` | `#252E33` | Header, cards, fields |
| `--surface-raised` | `#2B363C` | Hover and elevated areas |
| `--text` | `#F6F5F0` | Primary reading text |
| `--muted` | `#AEB8B9` | Metadata and supporting copy |
| `--border` | `#465157` | Rules, field borders, dividers |
| `--accent` | `#D9DF74` | Active state, key links, small emphasis |

The accent is deliberately sparse. It must not become a large background,
body-text color, or the only indication of interaction. Use the existing Geist
fonts: normal-case text for reading and small uppercase, increased-letter-
spacing labels for issue numbers, dates, languages, and categories.

## Layout and components

### Shared shell

- Keep the header sticky and compact (about 64 px), with the PolySyntax mark at
  left, route navigation in the center on desktop, and the existing accessible
  language control at right.
- On small screens, keep the mark and language control visible; collapse the
  route navigation into the project’s existing mobile treatment rather than
  introducing a new menu dependency.
- Use a centered content width of roughly 72–75rem with 1rem mobile and 2rem+
  desktop gutters. Prefer hairline borders and whitespace to large rounded
  panels or heavy shadows.
- Make visible keyboard focus use the accent plus a border/outline shape so
  color is not the only cue.

### Home (`/`)

- Replace the card-grid-first impression with a journal front page.
- Begin with a thin issue label, a large editorial headline, and the existing
  three-language proposition. The lead story is a wide bordered feature with
  its category/date/reading time above the title.
- Place secondary posts below as compact list entries: number or category,
  title, one-line summary, and metadata. Use a two-column grid only when the
  viewport has room; stack cleanly on mobile.
- Keep calls to action as ordinary links/buttons already supported by the
  application. Do not add subscription or account flows.

### Blog index (`/blog`)

- Present entries as an archive: section heading and count/descriptor, then a
  vertical list separated by rules.
- Each entry has restrained metadata, a prominent title, an optional excerpt,
  and a clear full-row or title link. Hover raises contrast slightly and shows
  the accent as a small rule or arrow, without movement that affects layout.

### Article (`/blog/react-reconciliation`)

- Use a narrow reading column (about 42–46rem) nested in the wider shell.
- Place category, date, read time, and current language above the title; use a
  large but not oversized title and a strong rule before the Markdown body.
- Style Markdown headings, code blocks, blockquotes, lists, tables, and links
  for prolonged reading. Code blocks use the raised surface and a visible
  border; inline code remains readable without the accent as its only signal.
- Preserve the current atomic language switch, loading/error/retry behavior,
  and heading-position restoration. A transition may use a short opacity
  change, but must respect `prefers-reduced-motion`.

### Login and about

- Keep these routes deliberately simple: a labelled section header and one
  bounded content panel, not a dashboard-style composition.
- Login fields and the mock sign-in control use the shared surface, border,
  focus, and accent rules. Preserve existing validation and demo behavior.
- About uses a readable single column with small metadata-style section labels
  and rules between sections.

### Footer

- Use three compact desktop columns: publication statement, route links, and
  contact. Stack them on mobile.
- Retain existing links and contact details; use a top border rather than a
  contrasting footer block.

## Implementation boundaries

- Reuse existing routes, content metadata, translations, Zustand state, and
  Markdown renderer. No content-model, API, routing, or storage changes.
- Prefer changes in the existing layout, shared header/footer, page components,
  and global CSS. Extract a component only if duplicated markup would otherwise
  be introduced across at least two pages.
- Do not add images, illustration assets, fonts, dependencies, animations,
  analytics, or new interactions.
- The earlier app-wide light/dark theme toggle is not expanded in this pass;
  Dark Systems is the authoritative presentation for this redesign.

## Acceptance checks

- Every existing route renders in the Dark Systems palette and shared shell.
- At 375 px and 1440 px widths, content remains readable with no clipped
  navigation, controls, or horizontal overflow.
- Links, form controls, language selection, keyboard focus, loading/error,
  retry, and reduced-motion behavior remain usable.
- Existing multilingual policy test, scoped lint, and production build pass;
  visually inspect home, blog index, article, login, and about in the browser.
