import type { TariffDeposit, TariffTotals } from '@/entities/tariff-analytics'

export interface TariffExportData {
  /** Every deposit, in the order the backend returned them: one sheet row each */
  deposits: TariffDeposit[]
  /** Tariff keys as shown in the table (English), in column order */
  tariffs: string[]
  /** Russian tariff names the original report uses as column groups */
  tariffLabels: Map<string, string>
  totals: Map<string, TariffTotals>
  grand: TariffTotals | null
  /** Period, YYYY-MM-DD; `to` is inclusive here (the label and file name show it) */
  from: string
  to: string
}

// Matches u-code's own export: same sheet layout, labels, number formats and file name.
const SUB_HEADERS = [
  'Дата внесения',
  'Сумма инвестиций',
  'Сумма внесения (сум)',
  'Курс',
  'Сумма дохода',
]
const MONTHS_RU = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]
const HEADER_FILL = 'FFEFF2F7'
const GROUP_FILL = 'FFDDE3EC'
const MONEY = '#,##0.00'
const WHOLE = '#,##0'
const DATE_TIME = 'DD.MM.YYYY HH:MM'

const ruDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS_RU[m - 1]} ${y}`
}

/**
 * "2026-09-24 10:46" → a real Date, so Excel stores it as a date, not text.
 * Built in UTC: xlsx serials carry no zone, and ExcelJS writes a date's UTC parts,
 * so a local Date would shift the backend's time by the viewer's offset.
 */
const toDate = (value: string | null) => {
  const m = value && /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(value)
  return m
    ? new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5])))
    : null
}

/**
 * Builds the .xlsx of "Analytics by tariff", the same file u-code's microfrontend produces.
 * ExcelJS is imported here (and this module is imported on click), so it never loads with the app.
 */
export async function exportTariffReport(data: TariffExportData) {
  const ExcelJS = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Analytics by tariff')
  const lastColumn = 2 + data.tariffs.length * SUB_HEADERS.length

  // Row 1: title with the period
  sheet.mergeCells(1, 1, 1, lastColumn)
  const title = sheet.getCell(1, 1)
  title.value = `Аналитика по тарифам · период: ${ruDate(data.from)} — ${ruDate(data.to)}`
  title.font = { bold: true, size: 12 }

  // Rows 3–4: Full Name / Percent, then a group of five columns per tariff
  const groups = sheet.getRow(3)
  const subs = sheet.getRow(4)
  groups.getCell(1).value = 'Full Name'
  groups.getCell(2).value = 'Percent'
  sheet.mergeCells(3, 1, 4, 1)
  sheet.mergeCells(3, 2, 4, 2)
  data.tariffs.forEach((tariff, index) => {
    const start = 3 + index * SUB_HEADERS.length
    sheet.mergeCells(3, start, 3, start + SUB_HEADERS.length - 1)
    const cell = groups.getCell(start)
    cell.value = data.tariffLabels.get(tariff) ?? tariff
    cell.alignment = { horizontal: 'center' }
    SUB_HEADERS.forEach((label, i) => (subs.getCell(start + i).value = label))
  })
  for (const row of [groups, subs]) {
    row.font = { bold: true }
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: row === groups ? GROUP_FILL : HEADER_FILL },
      }
      cell.alignment = { ...cell.alignment, vertical: 'middle' }
    })
  }

  // One row per deposit, under its own tariff's columns, with the name and percent repeated
  const column = new Map(data.tariffs.map((t, i) => [t, 3 + i * SUB_HEADERS.length]))
  for (const deposit of data.deposits) {
    const row = sheet.addRow([])
    row.getCell(1).value = deposit.fullName ?? ''
    row.getCell(2).value = deposit.percent ?? ''
    const start = column.get(deposit.projectName ?? '—')
    if (start === undefined) continue
    const date = row.getCell(start)
    date.value = toDate(deposit.depositAt)
    date.numFmt = DATE_TIME
    const values: [number, number | null | undefined][] = [
      [start + 1, deposit.investmentUsd],
      [start + 2, deposit.investmentUzs],
      [start + 3, deposit.rate],
      [start + 4, deposit.dividendUsd],
    ]
    for (const [cellColumn, value] of values) {
      const cell = row.getCell(cellColumn)
      // Zero reads as nothing in this report: u-code's file leaves the cell empty too
      cell.value = value || null
      cell.numFmt = cellColumn === start + 2 ? WHOLE : MONEY
    }
  }

  // Totals, as the report shows them
  const totals = sheet.addRow([])
  totals.font = { bold: true }
  totals.getCell(1).value = 'Итого'
  totals.getCell(2).value = data.grand?.investors ?? null
  data.tariffs.forEach((tariff, index) => {
    const t = data.totals.get(tariff)
    const start = 3 + index * SUB_HEADERS.length
    const values: [number, number | null | undefined, string][] = [
      [start + 1, t?.investmentUsd, MONEY],
      [start + 2, t?.investmentUzs, WHOLE],
      [start + 3, t?.rate, MONEY],
      [start + 4, t?.dividendUsd, MONEY],
    ]
    for (const [column, value, format] of values) {
      const cell = totals.getCell(column)
      cell.value = value ?? null
      cell.numFmt = format
    }
  })

  sheet.getColumn(1).width = 26
  sheet.getColumn(2).width = 12
  for (let c = 3; c <= lastColumn; c++) sheet.getColumn(c).width = [18, 16, 18, 11, 14][(c - 3) % 5]
  // Keep the name, percent and both header rows in view while scrolling
  sheet.views = [{ state: 'frozen', xSplit: 2, ySplit: 4 }]

  const buffer = await workbook.xlsx.writeBuffer()
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = `analytics_by_tariff_${data.from}_${data.to}.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}
