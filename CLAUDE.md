@AGENTS.md

# NovaFrame Magic AR — Codebase Guide

## Project Overview

NovaFrame is a Spanish-language e-commerce platform for premium canvas/print art products with interactive 3D visualization and AR (Augmented Reality) viewing. Built on Next.js 15 with a static export strategy, it deploys to Firebase Hosting and Vercel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.1.0 (App Router, static export) |
| UI Runtime | React 19.2.4 |
| 3D / AR | Three.js 0.170.0, @react-three/fiber, @react-three/drei, @react-three/xr, mind-ar |
| Animation | Framer Motion 12, motion 12 |
| Styling | Tailwind CSS v4 (via @tailwindcss/postcss) |
| Backend | Firebase 12 (Firestore, Hosting) |
| Icons | lucide-react |
| Language | JavaScript (JSX) — no TypeScript |

---

## Directory Structure

```
src/
  app/               # Next.js App Router pages
    admin/orders/    # Admin order panel
    api/save-mind/   # API route (Firestore writes)
    ar-viewer/       # Standalone AR viewer
    compile/         # Synthesis/compilation page
    deployment-hub/  # Custom design deployment
    laboratorio/     # Lab customizer (magic/, configurar/)
    magic/[id]/      # Dynamic product detail with AR
    marketplace/     # Product marketplace
    support/         # Support page
    top-deployments/ # Featured deployments showcase
    layout.js        # Root layout + provider stack
    page.js          # Home page
    globals.css      # Tailwind theme + custom animations
  components/        # ~49 reusable React components
  contexts/
    DeploymentContext.jsx   # Cart / artifact queue (localStorage-backed)
    TerminalContext.jsx     # Product modal and navigation
    LanguageContext.jsx     # i18n language switcher (ES default)
  lib/
    firebase.js            # Firebase SDK initialization
    translations.js        # All i18n strings (~600 lines)
    magic-registry.js      # Product registry helpers
    priceUtils.js          # Pricing calculations
    orderUtils.js          # Shopping cart helpers
    utils.js               # General utilities
  config/
    index.js               # SAMPLE_PRODUCTS array, categories, sizes, finishes
  types/
    index.js               # Product/variant schemas (JS, not TS)
  three-compat.js          # Three.js compatibility shim (aliased in webpack)
public/
  images/            # Product images (.webp)
  ar/                # MindAR marker files (.mind)
  videos/            # Video assets
  manifest.json      # PWA manifest
```

---

## Development Commands

```bash
npm run dev      # Dev server on 0.0.0.0 (all interfaces)
npm run build    # Static export → out/
npm run start    # Run production server
npm run lint     # ESLint
```

**No test runner is configured.** There are no test files or test scripts.

---

## Critical Architecture Constraints

### Static Export
`next.config.mjs` sets `output: 'export'`. This means:
- **No server-side features**: no Server Actions, no middleware, no `headers()`, no `cookies()` in render, no streaming
- `next/image` is used with `unoptimized: true`
- All routes must be statically renderable or use dynamic rendering client-side
- The build output goes to `out/` and is served as plain static files

### Client Components
Interactive features require `'use client'` at the top of the file. Most components in this codebase are client components because of Framer Motion and React Context. When adding new components:
- Default to `'use client'` unless the component is purely presentational with no hooks or browser APIs
- 3D/AR components (`@react-three/*`, `mind-ar`) must always be client components

### Dynamic Imports
Heavy 3D and AR components use `next/dynamic` with `{ ssr: false }`. Follow this pattern for any new heavy or browser-only component:
```js
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), { ssr: false });
```

### Path Alias
Use `@/` for all imports from `src/`:
```js
import { useLang } from '@/contexts/LanguageContext';
import { SAMPLE_PRODUCTS } from '@/config';
```

---

## Styling Conventions

- **Tailwind CSS v4** utility classes everywhere — no CSS Modules
- Custom design tokens are in `src/app/globals.css` under `@theme`:
  - Colors: `neon-pink` (#c026d3), `neon-cyan`, `neon-yellow`, `neon-green`
  - Utilities: `glass`, `glass-dark`, `terminal-border`, `neon-border-*`, `text-gradient`
  - Animations: `scanline`, `scan-vertical`, `float`, `pulse-slow`, `neon-flicker`
- Design language: dark background, cyberpunk/neon aesthetic, glassmorphism, scanline effects
- Use `clsx` + `tailwind-merge` (via `cn()` utility in `src/lib/utils.js`) for conditional classes
- Primary display font: **Space Grotesk** (loaded via `next/font`)

---

## State Management

Three React Contexts provide global state — import via their custom hooks:

| Context | Hook | Responsibility |
|---|---|---|
| `DeploymentContext` | `useDeployment()` | Cart/artifact queue, persisted to `localStorage` as `novaframe_deployments` |
| `TerminalContext` | `useTerminal()` | Product modal open/close, navigation |
| `LanguageContext` | `useLang()` | Active language, `t()` translation function |

The provider stack in `layout.js` is: `LanguageContext → DeploymentContext → TerminalContext`.

No Redux, Zustand, or Tanstack Query. Keep it that way unless there is a compelling reason.

---

## Internationalization

- All user-facing strings come from `src/lib/translations.js`
- The primary language is **Spanish (ES)**; English is also supported
- Access strings via the `t()` helper from `useLang()`:
  ```js
  const { t } = useLang();
  return <h1>{t('hero.title')}</h1>;
  ```
- Add new strings to both `es` and `en` objects in `translations.js`

---

## Product Data

Products live in `src/config/index.js` as the `SAMPLE_PRODUCTS` array (~50+ items). Each product has:
- `id`, `name`, `category`, `description`
- `price`, `sizes[]`, `finishes[]`
- `images[]` (pointing to `public/images/*.webp`)
- `arMindFile` (pointing to `public/ar/*.mind`)

Pricing logic: `src/lib/priceUtils.js`. Order utilities: `src/lib/orderUtils.js`.

---

## Firebase / Backend

### Firestore Collections
| Collection | Access |
|---|---|
| `orders` | Anyone can create; read/update/delete restricted to `jesusrodriguez7129@gmail.com` |
| `support_requests` | Same permissions |

Security rules are in `firestore.rules`. Indexes in `firestore.indexes.json`.

### Required Environment Variables
All are `NEXT_PUBLIC_*` (client-side). Set these in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

There is no `.env.example` — create one if adding new environment variables.

---

## AR / 3D Patterns

- **MindAR** (image-based AR): marker files are `.mind` binaries in `public/ar/`. Vercel caches these for 1 year (see `vercel.json`).
- **@react-three/fiber**: always inside a `<Canvas>` component, always client-side
- **three-compat.js** at `src/three-compat.js` is a webpack alias (`three` → this file) to resolve Three.js version conflicts between R3F and MindAR
- Camera controls use `camera-controls` (pinned version, not the R3F drei camera controls)

---

## Deployment

| Target | Config file | Output dir |
|---|---|---|
| Firebase Hosting | `firebase.json` | `out/` |
| Vercel | `vercel.json` | `out/` |

Both serve the static export. Firebase rewrites all routes to `/index.html` for SPA navigation.

Build and deploy:
```bash
npm run build          # creates out/
firebase deploy        # deploy to Firebase Hosting
# or push to Vercel via git
```

---

## ESLint

Config is in `eslint.config.mjs` extending `eslint-config-next/core-web-vitals`. Notable relaxed rules:
- React 19 experimental hook warnings are downgraded to warnings (not errors)
- Three.js / R3F hook patterns are allowed
- `react/display-name` and JSX entity rules are relaxed

Run `npm run lint` before committing.

---

## Key Conventions

1. **No TypeScript** — use plain `.js` / `.jsx` files
2. **No test files** — there is no test suite; verify behavior manually
3. **Spanish first** — UI strings in Spanish; add to `translations.js`, never hardcode
4. **Static-export safe** — never use Next.js server-only APIs (Server Actions, `headers()`, `cookies()`, middleware)
5. **Client-heavy** — most components need `'use client'`; lazy-load 3D/AR components with `next/dynamic`
6. **No comments** unless the WHY is non-obvious
7. **Tailwind only** — no CSS Modules, no styled-components
8. **Context for state** — use existing contexts; don't introduce new state libraries
