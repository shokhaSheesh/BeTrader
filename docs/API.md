# Backend API (u-code)

The admin panel reads data straight from the u-code backend that powers the current Niyat admin. Mapped on 2026-09-22.

> **Read-only for now.** Only the GET endpoints below are wired. The create, edit and delete *pages* exist, but their Save and Delete buttons call `notWired()` (`features/record-actions`), which shows a toast saying nothing was changed. To wire one, replace that call with the real mutation.

## Auth

`POST {VITE_AUTH_URL}/v3/multicompany/default-login`

```json
{ "username": "…", "password": "…" }
```

| Result | Where |
| --- | --- |
| Access token | `data.response.token.access_token` (valid for **30 days**, see `expires_at`) |
| Refresh token | `data.response.token.refresh_token` |
| Environment and resource IDs | `data.response.environment_id`, `data.response.resource_id` |
| Wrong login or password | HTTP **400/500** with `"cannot get user"`. u-code has no 401 for this, so we treat any server error on login as bad credentials. |

### Refresh ✅ wired

`PUT {VITE_AUTH_URL}/v2/refresh` with `{ refresh_token, env_id }` plus the `Authorization` and `environment-id` headers. It returns `data.token`, shaped like the login token. **Refreshed tokens live only 24 hours** (login tokens live 30 days). A bad refresh token gets HTTP 500.

We refresh in two cases (`src/shared/session/refresh.ts`, `src/shared/api/http.ts`):
1. **Before a request**, when the token expires within 60 seconds.
2. **After a 401**: refresh once, then replay the request.

Parallel requests share a single refresh call. If the refresh fails, we log out and the router sends the user to `/login`.

Login: `src/features/auth/api/login.ts`. Session store: `src/shared/session/store.ts`.

## Request headers

Added automatically by `src/shared/api/http.ts`:

```
Authorization: Bearer <access_token>
environment-id: <environment_id>
resource-id: <resource_id>
```

A 401 response triggers one refresh and a retry (see above). The user is logged out only if the refresh fails.

## Reading tables

Every admin page is backed by one u-code **table** (a slug).

| Call | Endpoint | Helper |
| --- | --- | --- |
| List | `GET {VITE_API_URL}/v2/items/{slug}?data={"offset":0,"limit":20,"search":"…"}` | `getTableItems(slug, { page, pageSize, search })` |
| One record | `GET {VITE_API_URL}/v2/items/{slug}/{guid}?with_relations=true` | `getTableItem(slug, guid)` |
| Schema | `GET {VITE_API_URL}/v2/fields/{slug}` | `getTableFields(slug)` / `useTableFields(slug)` |

**Always take labels from the schema.** Each field has `attributes.label_en`, and select fields have `attributes.options: [{ value, label }]` (e.g. `invest` → "Investment"). `useTableFields(slug).optionLabel(field, value)` returns the backend's label, or the raw value if there isn't one. See DESIGN.md §0.

Notes:
- Paging and search go **inside** the JSON `data` query parameter. Plain `?offset=&limit=` query parameters are ignored.
- The list response is `data.data.response` (rows) plus `data.data.count` (total, for pagination).
- Linked records come back already joined as `<field>_data` (e.g. `project_types_id_data`). The list does this by default; **the single-record endpoint only does it with `?with_relations=true`** (a plain query parameter, not inside `data`).
- An **unknown ID returns 200 with an empty `{}`**, not a 404. `getTableItem` turns that into `RecordNotFoundError`, and the page shows "This … doesn't exist".
- `search` behaviour differs per table and the schema's `is_search` flag is unreliable (investors search works with no field flagged). **Test it before adding a search box:** `search` on `project_investors` is silently ignored; on `investors` it matches name, phone and PINFL, but not passport.
- An empty result comes back as `response: null` (not `[]`). `getTableItems` normalises it.
- Fields are snake_case. Each entity maps them to a camelCase model in `entities/<name>/model/types.ts` (see `toProject`).

## Filtering and sorting (server-side)

Filters go into the same `data` JSON as paging (`ListParams.filters`, built with `shared/api/filters.ts`). Verified on 2026-09-22:

| Field type | Syntax | Example |
| --- | --- | --- |
| Switch | `{ "field": true }` | `{ "is_identified": false }` gives 4 105 investors |
| Multiselect | `{ "field": ["a", "b"] }`, **always an array**; a plain string gets HTTP 500 | `{ "gender": ["male"] }` gives 3 552 |
| Lookup (link) | `{ "field": "<guid>" }` | `{ "projects_id": "…" }` gives 82 |
| Date / number range | `{ "field": { "$gte": …, "$lt": … } }` | `{ "created_time": { "$gte": "2026-09-01T00:00:00Z" } }` |
| Sort | `"order": { "field": -1 }` | `{ "created_time": -1 }` gives newest first |

Filters combine with each other and with `search`. **There is no aggregation endpoint** (sum, average, distinct count), so KPIs that need one are shown as "Backend pending" (DESIGN.md §3).

## Page → table map

Row counts as of 2026-09-22. Every table answered GET with 200.

| Page | Route | Table slug | Rows |
| --- | --- | --- | --- |
| Projects | `/projects` | `projects` | 3 ✅ wired |
| Project types | `/projects/types` | `project_types` | 3 ✅ wired |
| Project investors | `/projects/investors` | `project_investors` | 109 ✅ wired (no search, see below) |
| Investors | `/investors` | `investors` | 10 705 ✅ wired (list, detail; create/edit/delete pages built, not wired) |
| Accounts | `/investors/accounts` | `account` | 10 737 |
| Cards | `/investors/cards` | `investor_cards` | 1 084 |
| Orders | `/finance/orders` | `orders` | 209 |
| Transactions | `/finance/transactions` | `transactions` | 3 158 |
| Dividends | `/finance/dividends` | `dividend` | 2 047 |
| Currency rates | `/finance/currency-rates` | `currency_rates` | 500 |
| Currency percent | `/finance/currency-percent` | `currency_percent` | 3 |
| Transaction policy | `/finance/transaction-policy` | `transaction_policy` | 6 |
| Financial modeling | `/finance/financial-modeling` | `financial_modeling` | 166 |
| AML blacklist | `/compliance/aml-blacklist` | `black_list` | 22 700 |
| Investor score | `/compliance/investor-score` | `investor_score` | 0 |
| RBA matrix | `/compliance/rba-matrix` | `rba_matrix` | 4 |
| STR/SAR | `/compliance/str-sar` | `str_sar` | 1 |
| Policy types | `/compliance/policy-types` | `policy_Type` (capital T) | 6 |
| News | `/content/news` | `news` | 0 |
| FAQ | `/content/faq` | `faq` | 6 |
| Documents | `/content/documents` | `documents` | 21 590 |
| About us | `/content/about-us` | `about_us` | 1 |
| Contact info | `/content/contact-info` | `contact_info` | 1 |
| Notifications | `/communication/notifications` | `notification` | 1 |
| SMS templates | `/communication/sms-templates` | `sms_template` | 7 |
| Maintenance works | `/communication/maintenance` | `maintenance_works` | 1 |
| Referral links | `/referrals/links` | `referral_links` | 795 |
| Link settings | `/referrals/settings` | `link_settings` | 1 |
| Bitrix leads | `/integrations/bitrix-leads` | `bitrix_leads` | 12 299 |
| Employees | `/staff/employees` | `employee` | 5 |

Dashboard and Analytics don't map to one table. They need aggregated data (see `DASHBOARDS.md`).

## Open questions for the backend

| Table | Question |
| --- | --- |
| `projects.dividend_period` | "Dividend accrual period" has no unit: months, days or payouts? It's set per project, in each project's record. |
| `projects.sale` / `investment` | Labelled "Hold while selling" / "Hold on investment". What does `true` mean for the investor? Not shown until this is clarified. |
| `projects` | No tariff key, so we can't color by tariff (High-yield, Halal, Conservative) without guessing from names. |
| `project_types` | English names look like test data ("Super Bistro", "1st Type", "2nd Type"), while the Russian names are the real tariffs. |
| `project_types.created_at` | No time zone in the timestamp (other tables send `Z`). |
| `project_investors` | **Security:** the list joins the *entire* investor record into every row: passport, PINFL, `pin_code`, push token and more. The admin shows only name, phone and passport. Please limit the joined fields. |
| `project_investors` | `search` is ignored, so the page has no search box (filters by project and date work). Could search cover the investor's name, phone and passport? |
| `project_investors.investment` / `dividend` | Labelled "Investment" and "Interest income", with no currency. Amounts are shown without one until it's defined. |
| `projects` (form) | No field is `required` in the schema, so the forms require nothing. Should the names be required? |
| `investors` | **Security:** every list row returns `pin_code` and `fmc_token` (push token) to the admin client. We never display them, but they shouldn't leave the backend at all. |
| `investors.full_name` | Unidentified investors have the name `"<nil> Foydalanuvchi <nil>"`, which is Go's `nil` written into a string. Shown as sent (DESIGN.md §0); should be empty or null. |
| `investors.birth_date` / `issued_date` | Stored as free text (`SINGLE_LINE`), not dates, so they can't be formatted or filtered by range. |
| KPIs | Sum endpoints for `project_investors.investment` and `dividend`, plus a distinct count of `investors_id`, so the "Backend pending" cards can show real numbers. |

## Adding a new section

1. **Entity** (`entities/<name>/`): a `Dto` for the raw row, a camelCase model, `to<Name>()`, then `use<Name>sQuery` / `use<Name>Query` built on `useTableListQuery` / `useTableItemQuery` (`shared/api/queries.ts`).
2. **List page** (`pages/<name>/index.tsx`): copy `pages/projects`, which uses `PageHeader` + Create, `FilterBar` (only if the table has searchable fields), `DataTable` with `onRowClick` and `actionsColumn`, `ListEmptyState`, `Pagination`, `useListParams`, and `useTableFields` for labels.
3. **Form** (`features/<name>-editor/`): form values keyed by the backend's field slugs, labels from `fieldLabel()`, options from `fieldOptions()`.
4. **Detail, create and edit pages**: copy `pages/projects/{DetailPage,CreatePage,EditPage}.tsx`, add `recordRoutes(...)` to `RECORDS`, and register them in `RECORD_PAGES` (`app/router/index.tsx`).
