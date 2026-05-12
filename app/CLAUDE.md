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

## Architecture

This is a single-page **Product Detail Page (PDP)** prototype for a sample management system. There is no router — the app renders one page.

```
src/
  types/index.ts          ← Single source of truth for all TypeScript interfaces
  mock/productDetail.ts   ← All mock data (no API calls anywhere)
  context/RoleContext.tsx ← Role-based permission system
  ProductDetailPage.tsx   ← Root page component (layout + tab orchestration)
  components/
    tabs/                 ← One file per tab (BasicInfoTab, SpecsTab, …)
    ActivityPanel.tsx     ← Comments + Change History (two sub-tabs)
    CommentsThread.tsx    ← Live comment thread with edit/delete
    ImageGallery.tsx      ← Main product image viewer (zoom, fullscreen)
    StatusTag.tsx         ← Reusable colored badge
    Timeline.tsx          ← Change history list
```

### Role & Permission System

`RoleContext` provides `role`, `currentUser`, and `can(permission)` throughout the app. All components consume it via `useRole()`.

- **Roles**: `admin | product_manager | pd_china | pd_us | sales`
- **Teams**: `US` or `NB` (Ningbo) — controls comment authorship detection
- **Permissions**: `view_cost`, `view_patents` — tabs gated by these are filtered in `ProductDetailPage.tsx` via the `TABS` array's `costOnly` / `patentOnly` flags

To add a new permission-gated tab:
1. Add a `Permission` type in `RoleContext.tsx` and assign it to the relevant roles
2. Add a flag (e.g. `xyzOnly?: boolean`) to the `TABS` array in `ProductDetailPage.tsx`
3. Update the `visibleTabs` filter expression

### Data Model

All types live in `src/types/index.ts`. `ProductDetail` is the central interface — every tab receives the full product object (or a specific slice like `patents`, `certifications`, `qualityRecords`).

**One-to-many relationships** (list + detail pattern):
- `qualityRecords: QualityRecord[]` — each record has its own attachments and images; tab renders a table list + expandable detail panel
- `certifications: CertificationRecord[]` — card list, validity derived from `expiryDate`
- `patents: PatentRecord[]` — card list with status badge

**Computed/formula fields** (never stored, always derived in the tab component):
- Specs: Item Weight (lbs), Master H/W/D (cm), G.W./N.W. (lbs), CBM, Cu.Ft
- Packaging: Inner per Master, Total Master Cartons, Total CBM, Total Cu.Ft

### Tab Pattern

Each tab is a pure display component receiving typed props. Field layout follows a consistent pattern:

```tsx
// Section header
function SectionDivider({ title }: { title: string }) { … }

// Individual field
function Field({ label, children }: { label: string; children: React.ReactNode }) { … }
```

Field labels: `text-xs font-medium text-slate-400 uppercase tracking-wide`
Section titles: `text-sm font-semibold text-slate-700`

Null/empty values always render `<span className="text-slate-300">—</span>`.

### Mock Data

`src/mock/productDetail.ts` exports a single `mockProduct` object. When adding new type fields, always update mock data in the same session to keep TypeScript happy.
