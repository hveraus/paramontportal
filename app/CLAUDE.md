# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (runs on port 5174, falls back to 5175+)
npm run dev

# Type-check only (run after every change — no output means clean)
npx tsc --noEmit

# Full production build (runs tsc + vite build)
npm run build

# Lint
npm run lint
```

Always run `npx tsc --noEmit` after making changes to verify no type errors before finishing a task.

## Stack

- **React 19 + TypeScript** via Vite 8
- **Tailwind CSS v3** — utility-first; no CSS modules
- **Global font**: Montserrat loaded via Google Fonts in `index.html`
- **Max page width**: `max-w-[1440px]` on the main content container
- **Deployed**: GitHub Pages at `/paramontportal/` — `vite.config.ts` has `base: '/paramontportal/'`; all public-folder image paths must use `${import.meta.env.BASE_URL}filename` (never hardcoded `/filename`)

## Architecture

State-based multi-page SPA. No router library — navigation is driven by `NavigationContext` (`navigate(page)` / `useNavigation()`). Pages registered in `NavigationContext.tsx`.

```
src/
  types/index.ts               ← Single source of truth for all TypeScript interfaces
  context/
    RoleContext.tsx             ← Role-based permission system (useRole)
    NavigationContext.tsx       ← Page routing (useNavigation / navigate)
    LanguageContext.tsx         ← EN/ZH language toggle (useLang)
  mock/
    productDetail.ts            ← Mock data for PDP (single mockProduct object)
    products.ts                 ← Mock product list + CATEGORY_TREE
    orgTree.ts                  ← Org tree, permission configs, MODULE_FEATURES, MENU_ITEMS
  ProductDetailPage.tsx         ← Product Detail Page (tabs + activity panel)
  pages/
    DashboardPage.tsx           ← Homepage / portal dashboard
    ProductsPage.tsx            ← Product list with filters
    SettingsIndexPage.tsx       ← Settings landing (links to sub-pages)
    SettingsPage.tsx            ← Permissions management (3-column layout)
  components/
    TopBar.tsx                  ← Global top bar with lang switcher & role switcher
    Sidebar.tsx                 ← Left nav sidebar
    Breadcrumb.tsx              ← Breadcrumb trail
    StatusTag.tsx               ← Reusable colored badge
    ImageGallery.tsx            ← Product image viewer (zoom, fullscreen)
    ActivityPanel.tsx           ← Comments + Change History (two sub-tabs)
    CommentsThread.tsx          ← Live comment thread with edit/delete
    Timeline.tsx                ← Change history list
    tabs/                       ← One file per PDP tab:
      BasicInfoTab.tsx
      SpecsTab.tsx
      PackagingTab.tsx
      QualityTab.tsx
      CostTab.tsx
      CustomsTab.tsx
      CertificationsTab.tsx
      PatentsTab.tsx
      CommittedTab.tsx          ← Project commitment history table
```

## Language System

`LanguageContext` provides `lang: 'en' | 'zh'` and `setLang`. Default is `'en'`.

```tsx
const { lang } = useLang()
// Usage pattern:
lang === 'en' ? 'English string' : '中文字符串'
```

**All UI chrome must be bilingual.** Data values (names, user-generated content) stay in their original language. Already bilingual: `TopBar`, `DashboardPage`, `SettingsIndexPage`, `SettingsPage` (fully translated, incl. all sub-components). When adding new UI text, always add both EN and ZH variants.

## Role & Permission System

`RoleContext` provides `role`, `currentUser`, and `can(permission)` via `useRole()`.

- **Roles**: `admin | product_manager | pd_china | pd_us | sales`
- **Teams**: `US` or `NB` (Ningbo) — controls comment authorship detection
- **Permissions**: `view_cost`, `view_patents` — tabs gated by these are filtered in `ProductDetailPage.tsx` via the `TABS` array's `costOnly` / `patentOnly` flags

To add a new permission-gated tab:
1. Add a `Permission` type in `RoleContext.tsx` and assign it to the relevant roles
2. Add a flag (e.g. `xyzOnly?: boolean`) to the `TABS` array in `ProductDetailPage.tsx`
3. Update the `visibleTabs` filter expression

## Product Detail Page (PDP) Tabs

`TabId` union and `TABS` array live at the top of `ProductDetailPage.tsx`. Current tabs:

| Tab ID | Label | Guard |
|---|---|---|
| `basic` | Basic Info | — |
| `specs` | Specifications | — |
| `packaging` | Packaging | — |
| `quality` | Quality | — |
| `cost` | Costings | `costOnly` |
| `customs` | Customs | — |
| `certifications` | Certifications | — |
| `patents` | Patents | `patentOnly` |
| `committed` | Committed | — |

`CommittedTab` shows project commitment history: date, project name, client (may be `clientPending: true` when sourced from external CRM), and a project deep-link.

## Data Model

All types live in `src/types/index.ts`. `ProductDetail` is the central interface. Key one-to-many fields:

- `qualityRecords: QualityRecord[]` — table + expandable detail panel
- `certifications: CertificationRecord[]` — card list with expiry badge
- `patents: PatentRecord[]` — card list with status badge
- `committedRecords: CommittedRecord[]` — project commitment table; `clientPending?: boolean` flags entries awaiting external CRM sync
- `iterationRecords: IterationRecord[]` — change history timeline
- `comments: ProductComment[]` — live comment thread

**Computed/formula fields** (derived in tab component, never stored):
- Specs: Item Weight (lbs), Master H/W/D (cm), G.W./N.W. (lbs), CBM, Cu.Ft
- Packaging: Inner per Master, Total Master Cartons, Total CBM, Total Cu.Ft

## Tab Pattern (PDP)

Each tab is a pure display component receiving typed props.

```tsx
// Section header
function SectionDivider({ title }: { title: string }) { … }

// Individual field
function Field({ label, children }: { label: string; children: React.ReactNode }) { … }
```

Field labels: `text-xs font-medium text-slate-400 uppercase tracking-wide`
Section titles: `text-sm font-semibold text-slate-700`
Null/empty values: `<span className="text-slate-300">—</span>`

## Permissions Page (`SettingsPage.tsx`)

3-column layout: Org tree (w-64) | Config panel (flex-1) | Preview panel (w-72).

Key data structures in `src/mock/orgTree.ts`:
- `MODULE_FEATURES` — feature modules with `label`/`labelEn` and `features`/`featuresEn` (bilingual)
- `MENU_ITEMS` — menu items with `label`/`labelEn` (bilingual)
- `PERM_CONFIGS` — per-node permission overrides
- `COMPANY_DEFAULTS` — baseline permissions for the whole company
- `computeEffective(nodeId)` — resolves inherited + custom permissions for a node
- `PermVal = true | false | 'inherit'` — three-state permission value

`OrgNode.hasCustomConfig` flag drives the "定制权限 / Custom" badge shown on users in the tree.

## Mock Data

Always update mock data in the same session as type changes to keep TypeScript clean. Key mock files:
- `src/mock/productDetail.ts` — single `mockProduct` object (all PDP data)
- `src/mock/products.ts` — `MOCK_PRODUCTS[]` + `CATEGORY_TREE`
- `src/mock/orgTree.ts` — `ORG_TREE`, `PERM_CONFIGS`, `COMPANY_DEFAULTS`, `MODULE_FEATURES`, `MENU_ITEMS`, `BUTTON_ACTIONS`, `BUTTON_MODULES`
