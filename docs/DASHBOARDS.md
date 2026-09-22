# Dashboards & Analytics: data spec

> **Status (2026-09-22):** all widgets below are built in the admin with **mock data** (`shared/mocks/analytics.ts`, badged "Mock data"). Two deliberate changes from the originals: the USD rate chart uses **one axis** (the original had two), and the three tariff donuts are **stacked bars**. Wiring means replacing each mock with an aggregation endpoint.

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

## `/analytics/tariffs`, from Metabase

Filter: **date**. A pivot table:

- **Rows:** investor (full name) → percent
- **Columns:** project (name)
- **Values:** sum of investment · sum of dividends (USD)
- Row and column totals: off in the original. We should turn them **on**, since they're useful.
