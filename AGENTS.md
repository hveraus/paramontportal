# Paramont V5 — Agent Instructions

Single-page **Product Detail** UI mock for an internal PDM tool. React 19 + TypeScript + Vite + Tailwind 3. **All data is mocked**, no backend, no router, no tests.

## Critical: Working Directory

The Vite project lives in [app/](app/), **not** the repo root. Always `cd app` before running any npm script.

```bash
cd app
npm install     # first time
npm run dev     # Vite dev server
npm run build   # tsc -b && vite build
npm run lint    # eslint .
```

There is no test runner configured. Do not invent one.

## Architecture

- Entry: [app/src/main.tsx](app/src/main.tsx) → [App.tsx](app/src/App.tsx) → [ProductDetailPage.tsx](app/src/ProductDetailPage.tsx)
- One page, one role-gated tab strip. Tab components live in [app/src/components/tabs/](app/src/components/tabs/) and each receives the full `ProductDetail` from [app/src/mock/productDetail.ts](app/src/mock/productDetail.ts).
- Shared presentational components in [app/src/components/](app/src/components/) (e.g. `FieldRow`, `StatusTag`, `Breadcrumb`, `ImageGallery`).
- All domain types are centralized in [app/src/types/index.ts](app/src/types/index.ts). Add new shapes there; don't redefine inline.
- Permissions / current-user / active role come from [app/src/context/RoleContext.tsx](app/src/context/RoleContext.tsx) via `useRole()`. New role-gated UI must use `can('view_xxx')` rather than checking `role` directly. Add new permissions to the `Permission` union and to every entry of `ROLE_PERMISSIONS`.

## Project Conventions

Match the existing files exactly — these differ from common defaults:

- **No semicolons**, single quotes, 2-space indent, trailing commas. ESLint enforces hooks rules but not style.
- **Default-export** every component (`export default function Foo()`).
- Type imports use `import type { ... }`.
- Tailwind utilities only — no CSS modules, no styled-components. Custom palette key is `brand.*` (see [app/tailwind.config.js](app/tailwind.config.js)).
- Empty / null values render as a muted em-dash: `<span className="text-slate-300">—</span>`. Reuse the local `val()` / `yesNo()` helpers in tab files; copy the pattern when adding a new tab.
- Field layout uses a 2-column grid of `FieldRow` (or local `Field`) components; `full` / `span2` promotes a row to full width.
- Domain field labels are bilingual (Chinese comments next to English identifiers in [types/index.ts](app/src/types/index.ts)). Preserve both when editing.
- Status colors are mapped via small `Record<Status, Variant>` lookup objects at the top of each file (see `STAGE_VARIANT`, `ITEM_STATUS_VARIANT`). Follow this pattern instead of inline ternaries.

## When Adding Features

- New tab → add component in `components/tabs/`, register it in the `TABS` array in `ProductDetailPage.tsx`, and gate it with a `costOnly` / `patentOnly` style flag if role-restricted.
- New mock data → extend [productDetail.ts](app/src/mock/productDetail.ts) and the matching interface in [types/index.ts](app/src/types/index.ts) together.
- Avatars use `https://api.dicebear.com/7.x/initials/svg?seed=...` — keep that pattern for any new mock user.

## Out of Scope

Don't add: routing, state management libraries, API/fetch layer, test framework, i18n framework, or React Compiler. This is a visual mock; keep dependencies minimal.
