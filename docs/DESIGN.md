# Niyat Admin: Design Rules

These rules apply to every screen and every PR. If a screen needs to break one, change the rule here first and tell the team, instead of making a one-off exception.

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

Rules:
- Disable the trigger while the request is running, so no double submits (critical for money operations).
- No full-screen spinners except the initial app boot.
- Skeletons must match the real layout. A generic grey box is not a skeleton.
- If a loader finishes in under 300 ms, keep it on screen until 300 ms have passed, so it doesn't flicker.
- Loading state comes from TanStack Query (`isPending`, `isFetching`, `mutation.isPending`). Do not use a hand-rolled `useState(false)`.

---

## 2. Typography: one family, everywhere

**Font: [Onest](https://fonts.google.com/specimen/Onest)** (self-hosted via `@fontsource-variable/onest`).
We chose it because it is a neo-grotesk made for product interfaces, it supports Cyrillic and the Uzbek Latin `ʻ` (oʻ, gʻ), it has tabular figures, and it is not one of the fonts every AI-generated dashboard ships with.

> If the Figma specifies a different font, the Figma wins. Replace `--font-sans` in `tokens.css` and this section. There is still only ever **one** family.

- One family for everything: headings, body, tables, buttons, numbers. **No second display font, no monospace font.**
- Weights: **400** (body), **500** (labels, table headers, buttons), **600** (page titles, key figures). Never 300 or below, never 700 or above.
- Type scale (px): `12 / 14 / 16 / 20 / 24 / 32`. Nothing in between. Body text in tables and forms is 14.
- Letter-spacing stays at the default. No `tracking-wide` uppercase labels.
- Sentence case everywhere: "Create user", not "Create User" and not "CREATE USER".

### Numbers

Numbers are the product. They must look like a bank statement, not a crypto landing page.

- Every amount, ID, date, time, counter, percentage and every table cell with digits uses the **`num` utility** (tabular, lining figures). Onest defaults to proportional digits, so columns won't line up without it.
- Money is formatted only through `formatMoney()` (`shared/lib/format.ts`): `1 250 000 UZS`, with a space as the thousands separator and the currency code after the amount.
- In tables, amounts are **right-aligned**. The currency code may be smaller or muted, but it uses the same font.
- Negative amounts: a real minus sign (`−`, U+2212) plus the negative color token. Parentheses and hyphens are not allowed.
- KPI figures: 24–32 px, weight 600, a solid color, no gradients, no count-up animations.
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
| `FilterBar` | Search is always first and on the left. Filters are dropdowns of the same height. "Reset" appears only when a filter is active. Filters are stored in the URL (`?status=active&page=2`) so views can be shared. |
| `DataTable` | Same row height, header style, hover, borders and padding on every page. Status is always a `<Badge>`. Row actions are always an icon menu in the last column. |
| `Pagination` | Always at the bottom, always the same component, with the same page sizes (20 / 50 / 100). |
| Forms | Label above the input, helper or error text below. Create and edit use a **drawer**. Destructive confirmations use a **modal**. |
| Dates | One format across the app via `formatDateTime()`. |

### Empty, error and "no results" states

These three always use the same component, `<EmptyState>`, rendered **inside** the table area so the page layout never jumps.

| Variant | When | Content |
| --- | --- | --- |
| `empty` | There is no data yet | Icon · "No users yet" · one line of explanation · the page's create button, if there is one |
| `no-results` | Filters or search returned nothing | Icon · "Nothing matches these filters" · a "Reset filters" button |
| `error` | The request failed | Icon · "Couldn't load transactions" · a "Try again" button |

Same icon size, same spacing and same copy pattern every time. No illustrations, mascots or emoji.

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
- Gradients, glassmorphism, glow, blur backgrounds, neon borders
- Cards with a colored left border as decoration
- Heavy drop shadows on everything (we use borders and surface contrast, and a shadow only on floating layers: dropdowns, modals, toasts)

**Shapes and layout**
- A different border radius on every element (we use one small radius scale: 6 / 8 / 12)
- Everything in a rounded card with 32 px padding, which is too airy for an admin tool; tables should be dense and easy to scan
- Decorative icons next to every heading, or icons in colored circles
- Emoji anywhere in the UI

**Copy**
- Lorem ipsum, "Welcome back! 👋", "Supercharge your…", "Seamlessly…"
- Fake data like "John Doe" or `$12,345.67`. Mock data uses realistic Uzbek names and UZS amounts.

**The test:** put the screen next to a real banking back-office tool. If ours looks like a template, it's wrong.

---

## 5. Color

**Status: pending Figma analysis.** The palette is fixed. Which color does which job gets decided from the Figma.

| Primitive | Hex |
| --- | --- |
| `brand-lime` | `#C7EF61` |
| `brand-ink` | `#212125` |
| `brand-mist` | `#F1F1F1` |
| `brand-forest` | `#163300` |

Rules that already apply:
- Components use **semantic tokens only** (`bg`, `surface`, `text`, `text-muted`, `border`, `accent`, `success`, `danger`, …). Never raw hex, never `brand-*` directly.
- Status colors (success, warning, danger, info) are defined once as tokens and only ever shown through `<Badge>` and toasts.
- Text must meet a WCAG AA contrast ratio (4.5:1). Lime is a fill color, not a text color on light backgrounds.

_TODO after Figma: fill in the semantic mapping table (token → primitive → where it's used)._

---

## PR checklist

- [ ] Every async action has a loading state (§1)
- [ ] Only Onest, only weights 400/500/600, only sizes from the scale (§2)
- [ ] All digits use `num`; money goes through `formatMoney()` (§2)
- [ ] The page uses `PageHeader` / `FilterBar` / `DataTable` / `EmptyState` / `Pagination` (§3)
- [ ] Nothing from the banned list in §4
- [ ] No raw hex or `brand-*` in components (§5)
