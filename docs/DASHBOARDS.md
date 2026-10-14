# Dashboards & Analytics: data spec

> **Status** (2026-10-14): **Analytics by tariff** is native, on real data. **Dividends analytics** and the **Dashboard** embed the published Metabase and DataLens dashboards; the mock data is gone. The widget inventory below is what those dashboards contain, kept for when the backend team gives us endpoints to rebuild them natively.
>
> **Embedded dashboards.** u-code embeds three published dashboards, all of them public links with no login (`shared/config/dashboards.ts`):
>
> | u-code page | Tool | Dashboard | Ours |
> | --- | --- | --- | --- |
> | Dashboard | Yandex DataLens | `datalens.yandex/8xi4w15qfqsmt` | `/dashboard` — embedded |
> | Analytics → Dividends analytics | Metabase | `public/dashboard/e6bf5716-…` — "BeTrader Dividends Dash" | `/analytics/dividends` — embedded |
> | Analytics → Analytics by tariff | Metabase | `public/dashboard/5b5b7fd7-…` — pivot | rebuilt natively from the microfrontend |
>
> The Metabase frame takes its period from our own filter (`date=from~to`) and hides its title and filter bar. **DataLens can't be driven that way:** a public DataLens link ignores URL parameters (tested with the selector's own value format, `Дата=__between___interval_<from>_<to>`, its field aliases `created_at_kvxm`/`date_wqu8`, and `_embedded`/`_no_controls`). It keeps filter state server-side (`?state=<hash>`). So the Dashboard has no filter of ours; its own date picker and tabs, inside the frame, work. DataLens's signed (private) embedding would accept parameters, if the backend team sets it up. Metabase is OSS v0.63, so signed embedding is available if the backend team ever closes the public links; SSO embedding is not.
>
> **Open with the backend team:** the dividends dashboard is reachable without logging in and lists every investor's full name, PINFL, income and tax withheld.

We draw every chart ourselves (see DESIGN.md), but the **data must match** the dashboards the u-code admin currently embeds. This file lists every widget on those dashboards and what it shows, captured on 2026-09-22.

Tariff (project type) names used across all widgets: **High-yield** (Высокодоходный), **Conservative** (Консервативный), **Halal** (Халяльный).

> Backend: the current widgets are SQL queries inside Yandex DataLens and Metabase, not API endpoints. Each widget below needs an aggregation endpoint from the backend team before we can build it.

---

## `/dashboard`, from Yandex DataLens

Global filter: **date range** (applies to every widget).

### Tab 1: Overview

| # | Widget | Type | Data |
| --- | --- | --- | --- |
| 1 | Total investors | KPI | count of investors |
| 2 | Total deposits | KPI | sum of deposits, **UZS** |
| 3 | Total investments | KPI | sum of investments, **USD** |
| 4 | Total dividends | KPI | sum of dividends paid, **USD** |
| 5 | Registrations per day | Bar chart | new investor sign-ups, grouped by day |
| 6 | USD rate per day | Line chart, 2 series | Niyat's USD rate vs the Central Bank USD rate, by day |
| 7 | Investors table | Table | *did not load in the public view, so columns are unknown; need to confirm* |

### Tab 2: Investments & dividends

| # | Widget | Type | Data |
| --- | --- | --- | --- |
| 1 | Dividends by tariff | Donut | sum of dividends (USD), split by tariff |
| 2 | Investors by tariff | Donut | count of investors with an investment, split by tariff |
| 3 | Investments by tariff | Donut | sum of investments (USD), split by tariff |
| 4 | Investments per day | Bar chart | sum of investments, grouped by day |
| 5 | Investments table | Table, grouped by tariff → investor | tariff · first name · phone · passport series · transaction ID · created at · currency rate · amount (USD) · amount (UZS) |
| 6 | Dividends table | Table | *did not load in the public view, so columns are unknown; need to confirm* |

Notes:
- In DataLens, the **Investments per day** chart shows every bar pinned at 100. It looks like a broken axis or aggregation in DataLens. We should confirm the correct metric with the backend instead of copying it.
- **Investors by tariff** adds up to about 109, while **Total investors** is about 10.7k. That's expected, because the donut counts only investors who have invested, but we should label it clearly ("Investors with active investments").

---

## `/analytics/dividends`, from Metabase

Filter: **date**.

| Column | Type |
| --- | --- |
| Full name | text |
| PINFL | text |
| Dividend amount | money |
| Taxable base | money |
| Tax withheld | money |

One row per investor.

## `/analytics/tariffs` ✅ wired (was the Metabase pivot)

Rebuilt from u-code's **"Analytics by tariff" microfrontend**, which runs SQL through the aggregation endpoint (docs/API.md). Our page runs the same query with the signed-in user's token: investors × tariffs, each deposit with date, investment (USD and UZS), rate and the dividends of the first deposit, plus backend-computed totals. Filters: investor name (server-side) and the dividend period. Verified against the microfrontend: same 239 deposits, 125 investors and identical totals.

### The original Metabase pivot

Filter: **date**. A pivot table:

- **Rows:** investor (full name) → percent
- **Columns:** project (name)
- **Values:** sum of investment · sum of dividends (USD)
- Row and column totals: off in the original. We should turn them **on**, since they're useful.
