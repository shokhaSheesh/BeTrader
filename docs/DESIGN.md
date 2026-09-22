# Niyat Admin: Design Rules

These rules apply to every screen and every PR. If a screen needs to break one, change the rule here first and tell the team, instead of making a one-off exception.

---

## 0. The front end displays; the back end decides

We never make up, derive or fix business data on the front end. If something is the backend's job, it stays the backend's job, even when it would be quicker to patch it in the UI.

**Comes from the backend, never hardcoded or guessed:**
- Labels for statuses, types and select options. Read them from `GET /v2/fields/{table}` through `useTableFields()`; never keep a `{ invest: 'Investment' }` map in the front end.
- Units and meaning. If the backend doesn't say a number is months or per year, we don't add "months" or "per year". The column header uses the backend's field label.
- Classifications, such as which tariff a project belongs to. Never infer them from names or IDs.
- Calculations: totals, balances, dividends, tax, percentages, currency conversion.
- Permissions and validation rules. The front end may validate for convenience, but the backend is the authority.

**What the front end *does* own:** presentation. That means number, date and money formatting (§2), layout, colors, loading and empty states, and translating a raw error into a readable message.

**When the data is missing or unclear:** show the raw value (or `—`), and raise it with the backend team, and note it in `docs/API.md`. Never ship a guess.

---

## 1. Loading states: every action gets instant feedback

A user must never wonder whether a click worked. Anything that takes time shows a visible state **immediately**.

| Situation | What we show | Component |
| --- | --- | --- |
| Button triggers a request (save, create, block, refund) | Spinner **inside** the button, label stays, button disabled, width does not change | `<Button loading>` |
| First load of a page or table | **Skeleton** shaped like the real content (rows, cards) | `<Skeleton>`, `<DataTable loading>` |
| Refetch: filters, pagination, search | Keep the old rows visible and dimmed, plus a thin progress bar on top of the table. Never blank the table. | `<DataTable fetching>` |
| Modal / drawer submit | Submit button loads, and the modal cannot be closed until the request finishes | `<Modal>` + `<Button loading>` |
| Row action (block user, approve) | Loader on **that row's** action only, not the whole table | `<RowAction loading>` |
| Request finished | Toast for success or error. Errors say what failed and what to do. | `toast.success / toast.error` |

The loader is **one brand mark: a lime arc spinning on an ink disc** (`Loader`), the app icon's colors. It never has visible text; its label is for screen readers only.

| Where | What |
| --- | --- |
| Before any JavaScript runs (hard refresh) | Boot loader in `index.html`, the same mark in plain HTML/CSS, so the screen is never blank white |
| Any request in flight | `GlobalProgress`: a thin lime bar across the top of the window |
| A table's first load | `Loader` centered over skeleton rows |
| A table refetch (search, filter, page) | Old rows dimmed plus a thin **forest-green bar sliding across the top of the table**, so you can tell *this table* is refreshing without losing what's on screen |
| A page's code, a record, or a form schema loading | `PageLoader` (`Loader`, centered) |
| A KPI loading | A small `Loader` in the card |

Rules:
- A skeleton alone is not enough: it always comes with the `Loader`.
- Disable the trigger while the request is running, so no double submits (critical for money operations).
- No full-screen spinners except the initial app boot.
- Skeletons must match the real layout. A generic grey box is not a skeleton.
- If a loader finishes in under 300 ms, keep it on screen until 300 ms have passed, so it doesn't flicker.
- Loading state comes from TanStack Query (`isPending`, `isFetching`, `mutation.isPending`). Do not use a hand-rolled `useState(false)`.

---

## 2. Typography: one family, everywhere

**Font: [Onest](https://fonts.google.com/specimen/Onest)** (self-hosted via `@fontsource-variable/onest`).
We chose it because it is a neo-grotesk made for product interfaces, it supports Cyrillic and the Uzbek Latin `ʻ` (oʻ, gʻ), it has tabular figures, and it is not one of the fonts every AI-generated dashboard ships with.

**Why not the mobile app's fonts?** The app uses SF Pro for numbers and Inter for text. We deliberately don't copy that:
- SF Pro's license only allows it in apps for Apple platforms. It can't be served on the web, and it only renders on Macs that already have it installed.
- Inter is the font of AI-generated dashboards (§4), and the app's split into two families breaks the one-family rule.
- What we keep from the app is the *feel of its numbers*: bold, slightly tight, dominant. Key figures use Onest 600 with `tracking-tight` (−1%, the same tracking as the app's amounts).

Rules:
- One family for everything: headings, body, tables, buttons, numbers. **No second display font, no monospace font.**
- Weights: **400** (body), **500** (labels, table headers, buttons), **600** (page titles, key figures). Tailwind's other weights are removed in `tokens.css`, so anything else won't build.
- Type scale: `text-xs` 12 · `text-sm` 14 (default body, tables, forms) · `text-base` 16 · `text-lg` 20 · `text-xl` 24 (page titles) · `text-2xl` 32 (KPI figures). Nothing in between, and the other sizes are removed.
- Letter-spacing stays at the default, except `tracking-tight` on figures of 24 px and up. No `tracking-wide` uppercase labels.
- Sentence case everywhere: "Create user", not "Create User" and not "CREATE USER".

### Numbers

Numbers are the product. They must look like a bank statement, not a crypto landing page.

- Every amount, ID, date, time, counter, percentage and every table cell with digits uses the **`num` utility** (tabular, lining figures). Onest defaults to proportional digits, so columns won't line up without it.
- Money and numbers are formatted **only** through `shared/lib/format.ts`, which copies the app's format:

  | Case | Function | Output |
  | --- | --- | --- |
  | UZS | `formatMoney(59330000)` | `59 330 000 UZS`: space for thousands, code after the amount, decimals only when they exist (`14 977 041.72 UZS`) |
  | USD | `formatMoney(210.08, 'USD')` | `$210.08`: `$` before the amount with no space, always 2 decimals |
  | Direction | `formatSignedMoney(±n)` | `+ 390 000 UZS` / `− 90 000 000 UZS` |
  | Count | `formatNumber(10697)` | `10 697` |
  | Date | `formatDate` / `formatDateTime` | `08.09.2026` / `08.09.2026 05:00` |

- **Inflow vs outflow:** inflows are `+` and green; outflows are `−` and **red** (a product decision on 2026-09-22 that overrides the app's neutral outflows: admins scanning a ledger should see money leaving at a glance). Always show the sign as well, so the direction never depends on color alone.
- In tables, amounts are **right-aligned**. The currency code may be smaller or muted, but it uses the same font.
- KPI figures: `text-2xl font-semibold tracking-tight num`, a solid color, no gradients, no count-up animations.
- Never switch to a monospace font to make numbers "look technical".

---

## 3. Consistency: one pattern per job

Every list page has the same anatomy, built from the same shared components. No page gets a custom version.

```
┌─────────────────────────────────────────────────────────┐
│ PageHeader:  Title · optional subtitle    [Primary CTA] │
├─────────────────────────────────────────────────────────┤
│ FilterBar:   [Search]  [Filter] [Filter] [Date]  Reset  │
├─────────────────────────────────────────────────────────┤
│ DataTable                                               │
│   or EmptyState / ErrorState in the same box            │
├─────────────────────────────────────────────────────────┤
│ Pagination:  Showing 1–20 of 340         ‹ 1 2 3 … ›    │
└─────────────────────────────────────────────────────────┘
```

| Element | Rule |
| --- | --- |
| `PageHeader` | Title on the left, **one** primary action on the right ("Create user", "Add admin"). Secondary actions go in a "More" menu. |
| Create button | Always the primary `<Button>` with a `+` icon, in the page header. Label is "Create {thing}" or "Add {thing}". Never a floating button, never inside the table. |
| `FilterBar` | Search first and on the left, then `FilterSelect` (one of), `FilterMultiSelect` (any of), `DateRangeFilter` (range calendar with presets). All are 40 px white controls; an active filter gets an ink border and shows its value ("Gender: Male"). "Reset" appears only while something is active. Search and filters live in the URL (`?identified=no&gender=male&from=2026-09-01`) via `useListParams`, so any view can be shared as a link. |
| Filtering and search | **Always on the backend.** Never filter, search or sort rows on the front end: it would only cover the current page and give wrong totals. Only add a filter or search box the backend actually honours (check first, docs/API.md). If it doesn't, leave the control out. |
| KPI cards | Only where they help a decision; currently **Investors** (identification funnel), **Cards** (expiring or expired), **Orders** (buy, sell, pending) and **Transactions** (count per operation). Status or operation values in KPIs are the backend's options, with labels from the schema. The grid sizes itself to the number of cards. Layout (`KpiCard`): **title** (what is counted, muted) on top, **count** below (`text-2xl font-semibold`), and the **icon on the right in a 56 px tinted circle** whose tone matches what's counted (§5 "Color in data"), vertically centered. No hint line under the count. Every number must be computed by the backend: a filtered `count` via `useTableCount`. Anything the backend can't compute yet is `pending`: "—" plus a **Backend pending** badge. Never compute it on the front end. |
| `DataTable` | Same row height, header style, hover, borders and padding on every page. Status is always a `<Badge>`. Row actions are always an icon menu in the last column. |
| Columns | **Show every field the backend sends**; never trim columns to fit. Wide tables scroll sideways, and the first column (what the row is) and the ⋯ column stay pinned. Headers are the backend's labels. Cells use the shared renderers in `shared/ui/cells.tsx` (`TextCell`, `CodeCell`, `NumberCell`, `YesNoCell`, `OptionsCell`, `DateCell`, `DateTimeCell`, `ImageCell`), so "—", badges and dates are identical everywhere. **The only exception is secrets:** `pin_code`, push tokens and auth IDs are never shown. |
| Sidebar | Collapsible (the button at the bottom), remembered per browser. Collapsed shows icons only: a tooltip names each item, and a section's pages open in a flyout. The active section stays lime. |
| `Pagination` | Always at the bottom, always the same component, with the same page sizes (20 / 50 / 100). |
| Rows | Clicking a row opens its **detail page**. The last column is always the ⋯ menu: View, Edit, Delete (`actionsColumn`). |
| Detail page | `PageHeader` with a back link; actions on the right are Delete (`danger-ghost`) and **Edit** (primary). Then `DetailSection` panels of label/value pairs, with a "Record" panel (created, updated, ID) last. |
| Create / edit | A **full page** (`/…/new`, `/…/:id/edit`), not a drawer: our records have too many fields for one. `FormSection` panels, then the sticky `FormFooter` (Cancel, Save). Field labels come from the backend (§0). |
| Forms | Label above the control, error or hint below (`Field`). |
| Delete | Always `ConfirmDialog` (danger), naming the record and saying it can't be undone. It can't be closed while the request runs. |
| Loading and missing records | `RecordBoundary` covers every detail and edit page with the same loader, error and "doesn't exist" states. |
| Dates | One format across the app via `formatDateTime()`. |

### Empty, error and "no results" states

These three always use the same component, `<EmptyState>`, rendered **inside** the table area so the page layout never jumps.

| Variant | When | Content |
| --- | --- | --- |
| `empty` | There is no data yet | Icon · "No users yet" · one line of explanation · the page's create button, if there is one |
| `no-results` | Filters or search returned nothing | Icon · "Nothing matches these filters" · a "Reset filters" button |
| `error` | The request failed | Icon · "Couldn't load transactions" · a "Try again" button |

Same icon size, same spacing and same copy pattern every time. No illustrations, mascots or emoji.

### No browser defaults, ever

Every control uses our design. Browser-native UI looks different on every OS and browser, can't be themed, and is the fastest way to make the product feel unfinished. The complete list:

| Never use | Use instead |
| --- | --- |
| `<select>` | `Select` (single) / `MultiSelect` (multiple) |
| `<input type="date">` and other date/time inputs | `DatePicker` with our `Calendar`: **3 views: days → months → years**. Click the title to step up a view and pick to step back down. Weeks start on Monday. |
| A long list in a dropdown (investors, 10k+ rows) | `SearchSelect`: server-side search, keyboard navigation |
| `<input type="number">` (browser spinner arrows) | `TextField numeric`: text input, decimal keyboard, tabular digits |
| `<input type="checkbox">` / radio | `CheckboxBox` / our radio (not built yet) |
| On/off checkbox | `Switch` / `SwitchField`: lime track when on, like the app |
| `window.confirm` / `alert` | `ConfirmDialog` |
| `window.alert` for results | `toast.success / error / info` (top right) |
| A `title="…"` tooltip | Our `Tooltip` (to build when first needed) |
| `<input type="file">` | Our upload field (to build when uploads are wired) |
| The native search clear "×" and autofill yellow | Hidden or overridden; `SearchInput` has its own clear button |

Behavior (keyboard, focus trapping, screen readers) comes from **Radix** headless primitives, which carry no styles of their own. Every pixel is ours, so behavior comes from Radix and looks from us. Popovers all share `popoverSurface`, menu rows share `menuItem`, and inputs share `controlBase` (`shared/ui/styles.ts`), so they can't drift apart.

### Build order

Never style a page ad hoc. If a page needs something visual, it goes into `shared/ui` first and the page uses it from there. If two pages need slightly different versions of a component, add a variant to it; don't fork it.

---

## 4. It must not look AI-generated

The sure signs of a vibe-coded dashboard, all banned:

**Type**
- Inter, Poppins, Space Grotesk, DM Sans, Plus Jakarta, Manrope or Geist as the default font
- A monospace font (JetBrains Mono, Fira Code, …) for numbers or "data"
- Uppercase, wide-tracked eyebrow labels above every section
- Gradient text or oversized hero numbers on KPI cards

**Color and surfaces**
- Purple or indigo accents, or any color outside the Niyat palette
- Gradients, glassmorphism, glow, blur backgrounds, neon borders (the app blurs behind its keypad, but that doesn't apply to an admin panel)
- Cards with a colored left border as decoration
- Drop shadows on cards or buttons. We're flat like the app: 1 px `border-line` plus surface contrast. The only shadow token is `shadow-popover`, for dropdowns, popovers and toasts.

**Shapes and layout**
- A radius that isn't on the scale (see §5 "Shape")
- Everything in a rounded card with 32 px padding, which is too airy for an admin tool; tables should be dense and easy to scan
- Decorative icons next to every heading, or icons in colored circles (KPI icons sit in a pale tinted circle that carries meaning, §5 "Color in data"; decoration-only colored icons are still banned)
- Emoji anywhere in the UI

**Copy**
- Lorem ipsum, "Welcome back! 👋", "Supercharge your…", "Seamlessly…"
- Fake data like "John Doe" or `$12,345.67`. Mock data uses realistic Uzbek names and UZS amounts.

**The test:** put the screen next to a real banking back-office tool. If ours looks like a template, it's wrong.

---

## 5. Color, shape, elevation

Source: the BeTrader mobile Figma (spec extracted 2026-09-22). The admin panel keeps the app's identity: **white and light-grey surfaces, dark ink, lime as a sparing accent, flat surfaces.** It adapts that to a desktop tool that people use all day.

### How the brand colors are used

| Brand color | In the app | In the admin panel |
| --- | --- | --- |
| **Ink** `#212125` | All text and icons; the tab bar; dark buttons on sheets | All text (`fg`); the **sidebar** (`inverse`), which plays the role of the app's tab bar; focus rings |
| **Mist** `#F1F1F1` | Secondary background; inputs; secondary chips | **App background** (`canvas`) behind white panels; inputs, table headers, secondary buttons (`surface-muted`); text on the sidebar |
| **Lime** `#C7EF61` | Primary buttons; active tab; selected chip; progress; badges | Primary button (`accent`); **active sidebar item**; selected chip or tab; the High-yield tariff. Always a fill or an active state, **never text on a light surface** |
| **Forest** `#163300` | Deep "rich" surfaces; Conservative tariff card | Login screen background (`brand-deep`); the **default chart series** (`chart-1`); the Conservative tariff |
| White `#FFFFFF` | Screen background | Panels, tables, header, modals (`surface`) |

Lime is the loudest color we have. On a normal page it appears in at most three places: the active sidebar item, the page's single primary button, and a selected filter chip or tab. If a screen has more lime than that, something is wrong.

### Semantic tokens (`src/app/styles/tokens.css`)

Components use **only** these. The hex values live in `:root` as `--niyat-*`, which generates no Tailwind utilities, and Tailwind's default palette is removed, so `bg-red-500` or `bg-[#C7EF61]`-style shortcuts don't exist.

| Group | Tokens | Use |
| --- | --- | --- |
| Surfaces | `canvas` · `surface` · `surface-muted` · `surface-hover` | page background · panels · inputs, table header, secondary button · row hover |
| Text | `fg` · `fg-muted` · `fg-subtle` | main text · secondary text (5.3:1) · **placeholders and disabled only** |
| Lines | `line` · `line-strong` · `focus` | dividers, panel and table borders · input borders · focus ring |
| Accent | `accent` · `accent-hover` · `on-accent` | primary button and active states · its hover · text on lime (ink, 12:1) |
| Inverse | `inverse` · `inverse-hover` · `on-inverse` · `on-inverse-muted` · `inverse-line` | sidebar and dark buttons |
| Brand deep | `brand-deep` · `on-brand-deep` | login background · lime on forest (10.6:1) |
| Status | `success` · `danger` · `warning` · `info`, each with `-text` and `-tint` | base = dot or icon · `-text` = readable text (all ≥ 5.4:1) · `-tint` = badge background |
| Money | `money-in` · `money-out` | inflow (green) · outflow (ink, never red), see §2 |
| Tariffs | `tariff-high-yield` · `tariff-halal` · `tariff-conservative` | lime · green · forest, the same everywhere (badges, donuts, legends). **Not used yet:** the backend doesn't send a tariff key, and we don't guess one from names (§0) |
| Charts | `chart-1` · `chart-2` · `chart-muted` · `chart-grid` | forest (default series) · green · grey benchmark (e.g. the Central Bank rate) · grid lines |
| Overlay | `scrim` | behind modals (ink at 60%; the app's 70% black hides too much data) |

Why the status text colors are darker than the app's: the app's green `#27AE60` is only 2.9:1 on white and its red `#EB5757` is 3.5:1. That works for large text on a phone, but fails AA for 14 px text in dense tables. We keep the app's colors as the base (dots, icons, chart fills) and use darker shades of the same hue for text.

> The app's `blue` and `gold` hex values weren't captured from the Figma. We used `#2F80ED` and `#F2C94C`, which come from the same default palette as the app's confirmed green and red (`#27AE60`, `#EB5757`). **Confirm them in Figma.**

### Color in data

The rest of the UI is neutral, and color is saved for **what someone should notice**. All value-to-color mapping lives in one file, `shared/lib/tones.ts` (`toneFor(field, value)`), so it's consistent everywhere and changed in one place.

| Colored | How |
| --- | --- |
| **Statuses** | Pending → warning · Confirmed → success · Canceled → danger. Projects: Investment → success, Testing → warning, Closed → neutral |
| **Transaction operation** | Top up → success · Withdraw → warning · Buy → info · Dividend → accent (lime) · Transfer → neutral |
| **Key types** | Order Buy → info · Order **Sell → danger** (money out) · Dividend Profit → success (Debit neutral) |
| **Identification** | Identified → success · Not identified → warning |
| **Money direction** (`transactions.type` +/−) | `DirectionCell`: arrow up in a green circle for **in**, arrow down in a **red** circle for **out** (§2) |
| **KPI icons** | The icon circle takes the tone of what it counts (Withdraw KPI = warning, Total = accent). Neutral when nothing stands out |

**Stays neutral:** currency, account types, payment type, calculation types, anything that's just a category. If every column is colored, nothing stands out. Add a value to `tones.ts` only when it genuinely needs attention.

Tones: `neutral`, `success`, `warning`, `danger`, `info`, `accent` (lime tint with forest text). Each is a pale tint plus a readable text color, all ≥ 5.4:1. The values and labels still come from the backend (§0). Only the color is a front-end presentation choice.

### Components

| Element | Look |
| --- | --- |
| Primary button | `bg-accent text-on-accent`, pill (`rounded-full`), hover `bg-accent-hover`, spinner in ink |
| Dark button | `bg-inverse text-on-inverse`, pill. Used for confirmations in modals, like the app's buttons on sheets |
| Secondary button | `bg-surface-muted text-fg`, pill |
| Ghost button | text only, `hover:bg-surface-muted` |
| Danger button | `bg-danger-text text-surface`, pill, only in destructive confirmations |
| Input / select | `bg-surface-muted`, 1 px `line-strong` on focus, `rounded-sm` |
| Badge / chip | `rounded-full`, `-tint` background + `-text` color, tone from `toneFor()` (see "Color in data"). A selected filter chip is `bg-accent text-on-accent` |
| Panel (table, card) | `bg-surface`, 1 px `border-line`, `rounded-md` |
| Sidebar | `bg-inverse`. Items are `text-on-inverse-muted`. The active item is `bg-inverse-hover text-accent font-medium`, and its section icon turns lime |

### Shape

Taken from the Figma's border scale; the other values are removed.

| Token | px | Use |
| --- | --- | --- |
| `rounded-xs` | 4 | checkboxes, tiny tags |
| `rounded-sm` | 8 | inputs, selects, dropdown menus, sidebar items, icon tiles |
| `rounded-md` | 16 | panels, tables, cards, modals, drawers |
| `rounded-full` | pill | **all buttons**, badges, chips, avatars (the app's buttons are pills) |

The app's 24 and 32 px radii are for large mobile cards and look too soft in a dense desktop tool, so we don't use them.

### Spacing and elevation

- Spacing follows the Figma scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64` (`p-1 · 2 · 3 · 4 · 6 · 8 · 12 · 16`). Page padding 24, panel padding 16–24, gap between controls 8–12.
- Flat. Borders are 1 px `line`. The only shadow is `shadow-popover` (dropdowns, popovers, toasts). No shadows on cards or buttons.

### Accessibility

- Text meets WCAG AA (4.5:1). Every text token above was checked against the surfaces it sits on.
- `fg-subtle` is below 4.5:1, so it's only for placeholders and disabled states.
- Focus is always visible: a 2 px `focus` outline (ink), which turns lime on the dark sidebar.

---

## PR checklist

- [ ] Nothing the backend owns is hardcoded or guessed: labels, units, classifications, calculations (§0)
- [ ] Every async action has a loading state; skeletons come with a labelled spinner (§1)
- [ ] No native browser controls: select, date, number, checkbox, confirm, alert, title tooltips (§3)
- [ ] Only Onest, only weights 400/500/600, only sizes from the scale (§2)
- [ ] All digits use `num`; money goes through `formatMoney()` (§2)
- [ ] The page uses `PageHeader` / `FilterBar` / `DataTable` / `EmptyState` / `Pagination` (§3)
- [ ] Nothing from the banned list in §4
- [ ] Semantic tokens only: no raw hex or arbitrary values like `bg-[#…]` (§5)
- [ ] Lime appears in at most 3 places on the screen and is never used as text on a light surface (§5)
- [ ] Buttons and badges are pills; panels are `rounded-md`; nothing has a shadow except popovers (§5)
