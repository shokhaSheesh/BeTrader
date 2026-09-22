/**
 * MOCK DATA for Dashboard and Analytics, replacing the Yandex DataLens / Metabase dashboards in u-code.
 * Every number and name here is INVENTED: same shapes as docs/DASHBOARDS.md, not real figures.
 * Every page using this shows a "Mock data" badge. Replace with backend aggregation endpoints
 * when they exist (docs/API.md, "KPIs" question) and delete this file.
 */
import { toIsoDate } from '@/shared/lib/date'

// Deterministic generator: the mock looks the same on every reload.
function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = rng(20260922)
const between = (a: number, b: number) => a + rand() * (b - a)
const round2 = (n: number) => Math.round(n * 100) / 100

export const TARIFFS = [
  { key: 'high-yield', name: 'High-yield', color: '#94c22f' },
  { key: 'conservative', name: 'Conservative', color: '#4b5fc0' },
  { key: 'halal', name: 'Halal', color: '#14a08c' },
] as const

const DAYS: string[] = []
for (let d = new Date(2026, 0, 1); d <= new Date(2026, 8, 22); d.setDate(d.getDate() + 1)) {
  DAYS.push(toIsoDate(d.getFullYear(), d.getMonth(), d.getDate()))
}

/** Registrations per day: a trickle, then the August–September campaign spike. */
export const registrationsPerDay = DAYS.map((x) => {
  const inSpike =
    (x >= '2026-08-08' && x <= '2026-08-28') || (x >= '2026-09-04' && x <= '2026-09-14')
  return {
    x,
    y: Math.round(
      inSpike ? between(140, 480) : x >= '2026-08-01' ? between(8, 90) : between(0, 18),
    ),
  }
})

/** USD rate per day: Niyat's rate and the Central Bank's, drifting down with small noise. */
const niyatRate: { x: string; y: number }[] = []
const cbRate: { x: string; y: number }[] = []
DAYS.forEach((x, i) => {
  const base = 12_780 - i * 3.2 + Math.sin(i / 9) * 45
  cbRate.push({ x, y: round2(base + between(-12, 12)) })
  niyatRate.push({ x, y: round2(base + 110 + between(-15, 15)) })
})
export const usdRates = { niyat: niyatRate, centralBank: cbRate }

/** Investments per day (USD): most days quiet, some days with purchases. */
export const investmentsPerDay = DAYS.map((x) => ({
  x,
  y: rand() < 0.45 ? 0 : round2(between(300, 4_200)),
}))

export const kpis = {
  totalInvestors: 10_480,
  totalDepositsUzs: 15_204_380.5,
  totalInvestmentsUsd: 171_406.2,
  totalDividendsUsd: 4_893.35,
}

/** By-tariff split (DataLens showed three donuts; drawn here as stacked bars). */
export const tariffSplit = {
  dividendsUsd: { 'high-yield': 4_502.4, conservative: 318.25, halal: 72.7 },
  investors: { 'high-yield': 84, conservative: 15, halal: 12 },
  investmentsUsd: { 'high-yield': 166_020.1, conservative: 3_810, halal: 1_576.1 },
}

const NAMES = [
  'ALIYEV JASUR',
  'KARIMOVA DILNOZA',
  'TURSUNOV BEKZOD',
  'RAHIMOVA MADINA',
  'QODIROV SHERZOD',
  'ISMOILOVA NIGORA',
  'YUSUPOV OTABEK',
  'NAZAROVA MALIKA',
  'HASANOV FARRUX',
  'ERGASHEVA ZARINA',
  'SOBIROV AZIZBEK',
  'MIRZAYEVA SEVARA',
]
const phone = () => `+99890${String(Math.floor(between(1_000_000, 9_999_999)))}`
const passport = () =>
  `A${'ABCD'[Math.floor(rand() * 4)]}${String(Math.floor(between(1_000_000, 9_999_999)))}`
const recentDay = () => DAYS[DAYS.length - 1 - Math.floor(rand() * 60)]
const tariff = () => TARIFFS[rand() < 0.75 ? 0 : rand() < 0.5 ? 1 : 2]

export const investorsTable = NAMES.map((name, i) => ({
  id: `inv-${i}`,
  name,
  phone: phone(),
  registered: `${recentDay()}T${String(Math.floor(between(8, 20))).padStart(2, '0')}:15:00`,
  identified: rand() > 0.3,
}))

export const investmentsTable = NAMES.slice(0, 10).map((name, i) => {
  const t = tariff()
  const usd = round2(between(300, 3_000))
  const rate = round2(between(11_900, 12_300))
  return {
    id: `invest-${i}`,
    tariff: t.name,
    tariffColor: t.color,
    name,
    phone: phone(),
    passport: passport(),
    transactionId: String(Math.floor(between(10_000_000, 99_999_999))),
    created: `${recentDay()}T10:${String(10 + i).padStart(2, '0')}:00`,
    rate,
    usd,
    uzs: Math.round(usd * rate),
  }
})

export const dividendsTable = NAMES.slice(0, 10).map((name, i) => {
  const t = tariff()
  return {
    id: `div-${i}`,
    name,
    tariff: t.name,
    tariffColor: t.color,
    usd: round2(between(4, 180)),
    period: recentDay(),
  }
})

/** Analytics → Dividends (Metabase "Dividends per investor"). */
export const dividendsPerInvestor = NAMES.map((name, i) => {
  const sum = round2(between(20, 900))
  const taxable = round2(sum * 0.95)
  return {
    id: `dpi-${i}`,
    name,
    pinfl: String(Math.floor(between(30_000_000_000_000, 69_999_999_999_999))),
    sum,
    taxable,
    tax: round2(taxable * 0.05),
  }
})

/** Analytics → By tariff (Metabase pivot): investor × project, investment and dividends (USD). */
export const tariffPivot = NAMES.slice(0, 8).map((name, i) => ({
  id: `pv-${i}`,
  name,
  percent: `${[30, 40, 50, 15, 18][i % 5]}%`,
  cells: Object.fromEntries(
    TARIFFS.map((t) => [
      t.key,
      rand() < 0.45
        ? null
        : { investment: round2(between(300, 5_000)), dividends: round2(between(5, 250)) },
    ]),
  ) as Record<(typeof TARIFFS)[number]['key'], { investment: number; dividends: number } | null>,
}))
