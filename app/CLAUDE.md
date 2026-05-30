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
    ActivityPanel.tsx           ← Comments + Change History + PD Notes (three sub-tabs)
    CommentsThread.tsx          ← Live comment thread with edit/delete
    Timeline.tsx                ← Change history list
    PDNotesPanel.tsx            ← PD Notes panel: two plain-text sections (PD Comments / NB PD Comments)
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
      SourceFilesTab.tsx        ← Source file list (.ai etc.) with share + download actions
  pages/
    ArchivesPage.tsx            ← Archives file library; file rows have Preview / Share / Download / Delete
    SampleRoomPage.tsx          ← Sample Room: free-form location tree (Browse + Manage modes)
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

| Tab ID | Label | Guard | Edit mode |
|---|---|---|---|
| `basic` | Basic Info | — | ✓ |
| `specs` | Specifications | — | ✓ |
| `packaging` | Packaging | — | ✓ |
| `quality` | Quality | — | ✓ CRUD |
| `cost` | Costings | `costOnly` | ✓ |
| `customs` | Customs | — | ✓ |
| `certifications` | Certifications | — | ✓ CRUD |
| `patents` | Patents | `patentOnly` | ✓ CRUD |
| `committed` | Program | — | read-only |
| `source` | Source Files | — | upload only |

### Edit mode architecture
Each tab has its own Edit/Save/Cancel controls in the action bar above the content. Only one tab can be in edit mode at a time (`editingTab: TabId | null`). A `draft: ProductDetail` is deep-cloned on edit start; Save merges it back to `product` state and appends an `IterationRecord`.

- **Action bar** renders above every tab: left side shows contextual info (cost warning, cert/patent counts, CRM tip, "Editing…" label); right side shows Edit / Save+Cancel or Upload button
- **Unsaved changes guard**: switching tabs while editing shows an amber inline banner — "Discard and switch?" / "Stay"
- **Program tab**: no edit button — read-only by design
- **Source Files tab**: Upload button instead of Edit; share + download per file row

### Status dropdown
The product status badge in the header is clickable — opens a dropdown of all 6 statuses. Selecting a different status shows a confirmation modal before applying. Statuses: `Concept | Proposed | Pre-selected | Initial Sampled | Production | Dropped`

`CommittedTab` shows project commitment history: date, project name, client (may be `clientPending: true` when sourced from external CRM), and a project deep-link.

## Data Model

All types live in `src/types/index.ts`. `ProductDetail` is the central interface. Key fields:

- `qualityRecords: QualityRecord[]` — table + expandable detail panel
- `certifications: CertificationRecord[]` — card list with expiry badge
- `patents: PatentRecord[]` — card list with status badge
- `committedRecords: CommittedRecord[]` — project commitment table; `clientPending?: boolean` flags entries awaiting external CRM sync
- `iterationRecords: IterationRecord[]` — change history timeline
- `comments: ProductComment[]` — live comment thread
- `sourceFiles: SourceFile[]` — design source files (.ai etc.); each has `id`, `name`, `size`, `uploadedAt`, `uploadedBy`
- `pdComments: string | null` — free-text PD notes (US team); displayed in Activity Panel → PD Notes tab
- `nbPdComments: string | null` — free-text NB PD notes (Ningbo team); same tab

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

Permissions are configured **at the member level only** — selecting a company or department node shows a "select a member" prompt instead of the config panel. Each feature in `MODULE_FEATURES` carries three independent action toggles via `FeatureActionPerm = { view; edit; delete }` (each a `PermVal`); the legacy separate "Buttons" tab has been merged away.

## Sample Room (`SampleRoomPage.tsx`)

A storage-location management system with a **free-form, per-root location hierarchy**. Two view modes toggled by `viewMode` state:

- **Browse mode**: left location tree (w-72) + right content panel. Selecting a non-leaf node shows a grid of all descendant leaf slots (occupied cards carry a product thumbnail, status, item#, and the relative path; empty cards are click-to-assign). Selecting a leaf shows its `PositionDetail` (product card or empty state).
- **Manage mode**: full-width tree editor — inline rename, add child / batch-add slots, cascade delete, and per-root **Level Settings** (gear icon on each root row).

Key concepts:
- `LocationNode` — self-referencing tree node (`levelIndex`, `parentId`, `isLeaf`, `order`). A node `isLeaf` when `levelIndex === rootSchema.levels.length - 1` — **never hardcode the depth**.
- `LocationSchema = { levels: { label: string }[] }` — user-defined level names; **1–8 levels, configured per root node** and held in `schemas: Record<rootId, LocationSchema>` state. Use `getRootId(nodeId, nodes)` to resolve a node's owning schema.
- `SampleAssignment` — links a leaf `positionId` to a `productId` (1:1); assignment carries `assignedBy`, `assignedAt`, `notes`.
- Changing a root's schema depth recomputes `isLeaf` for its whole subtree (`handleSaveSchema`).
- Occupancy ratio stats were intentionally removed — only leaf status dots remain.

PRD lives at `docs/PRD-SampleRoom.md`.

## Mock Data

Always update mock data in the same session as type changes to keep TypeScript clean. Key mock files:
- `src/mock/productDetail.ts` — single `mockProduct` object (all PDP data)
- `src/mock/products.ts` — `MOCK_PRODUCTS[]` + `CATEGORY_TREE`
- `src/mock/orgTree.ts` — `ORG_TREE`, `PERM_CONFIGS`, `COMPANY_DEFAULTS`, `MODULE_FEATURES`, `MENU_ITEMS`
- `src/mock/archives.ts` — `MOCK_ARCHIVES: ArchiveFile[]`
- `src/mock/sampleRoom.ts` — `DEFAULT_SCHEMA`, `LOCATION_NODES`, `MOCK_ASSIGNMENTS`

## CI / Build notes

- Local `npx tsc --noEmit` uses incremental cache — may miss errors caught by CI.
- CI runs `npm run build` (= `tsc -b` + Vite), which enforces `noUnusedLocals`.
- When in doubt, run `npm run build` locally before pushing.
- TypeScript 6.0 strict inference: always annotate exported `const` arrays/objects with an explicit type if they have optional fields (e.g. `labelEn`), or use `as const`. `Object.entries()` on a `Record` with extra fields needs an explicit cast.
