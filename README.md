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

## Demo mode (on by default)

The admin currently runs on **made-up data, in the browser**: no request reaches u-code.

- **Login:** any login and password signs in as a full admin.
- **Data:** generated, realistic demo records for every page (`src/shared/mock/seed.ts`). No real person's data.
- **Create / edit / delete / upload** work on that data and show up across pages; **a page refresh resets everything** to the original demo data.
- **The Dashboard** is drawn natively from the mock backend (`GET /v1/analytics/dashboard`, the endpoint we need from the backend team). With the real backend it shows the DataLens embed.
- **Dividends analytics** is drawn natively too (`GET /v1/analytics/dividends`); with the real backend it shows the Metabase embed. In demo mode nothing loads from outside the app.
- **How it works:** a mock backend (`src/shared/mock/`) is plugged in as axios' adapter and answers the same endpoints u-code does. All the real API code is untouched.
- **Back to the real backend:** build with `VITE_MOCK=false` (e.g. in Vercel's environment variables). Nothing else changes.

## Deploying (Vercel)

- **No environment variables are required.** The app defaults to u-code's public API hosts (`shared/config/env.ts`). Set `VITE_API_URL` / `VITE_AUTH_URL` only to use a different backend.
- **The admin works in u-code's Test environment** by default (`VITE_ENVIRONMENT=test`). Create, edit and delete only ever run there; see `docs/API.md` "Environments".
- `vercel.json` sends every path to `index.html`, so deep links and page refreshes (e.g. `/finance/orders`) work.

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
