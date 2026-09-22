# Niyat Admin

Super-admin panel for Niyat (fintech). React 19 + Vite + TypeScript.

## Getting started

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                 |
| ------------------- | ---------------------------- |
| `npm run dev`       | Dev server                   |
| `npm run build`     | Type-check + production build |
| `npm run typecheck` | Type-check only              |
| `npm run lint`      | oxlint                       |
| `npm run format`    | Prettier on `src/`           |

## Stack

| Concern      | Choice                                  |
| ------------ | --------------------------------------- |
| Routing      | React Router (data router, lazy pages)  |
| Server state | TanStack Query                          |
| Client state | Zustand (auth only, persisted)          |
| HTTP         | Axios instance in `shared/api/http.ts`  |
| Forms        | react-hook-form + zod                   |
| Styling      | Tailwind v4, tokens in `app/styles/tokens.css` |
| Icons        | lucide-react                            |

## Structure

Layers may import only from layers **below** them:
`app → pages → widgets → features → entities → shared`

```
src/
  app/           # bootstrap: providers, router + guards, global styles & tokens
  pages/         # one folder per route, default export, lazy-loaded
  widgets/       # composite UI blocks (layout: sidebar, header)
  features/      # user actions with logic (auth, block user, refund, ...)
    <feature>/api     # queries/mutations
    <feature>/model   # stores, hooks, schemas
    <feature>/ui      # feature-specific components
  entities/      # business models: types + API + small UI (user, transaction)
  shared/        # no business logic
    api/         # axios instance, query client
    config/      # env, route constants
    lib/         # cn(), formatters
    ui/          # design-system primitives (Button, Input, Table, ...)
    hooks/  types/
  assets/        # icons, images
```

## Rules

- **The front end displays; the back end decides.** Never hardcode or guess labels, units, classifications or calculations. See `docs/DESIGN.md` §0.
- Import via the `@/` alias, never long relative paths across layers.
- Route paths come from `ROUTES` in `shared/config/routes.ts`, never string literals.
- Server data lives in TanStack Query, not Zustand.
- The backend is u-code, read through `shared/api/ucode.ts`. Endpoints and the page → table map are in `docs/API.md`.
- Components use **semantic** tokens only (`bg-surface`, `text-fg-muted`, `bg-accent`, …), never raw hex. See `docs/DESIGN.md` §5.
