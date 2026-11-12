import rolesFixture from './data/roles.json'
import {
  BANKS,
  CITIES,
  FATHER_NAMES,
  FEMALE_NAMES,
  MALE_NAMES,
  STREETS,
  SURNAMES,
  createRandom,
  dateValue,
  phoneNumber,
  type Random,
} from './random'

// Made-up demo data for every table the admin reads. Nothing here belongs to a real person:
// names, phones, passports and amounts are generated. Shapes follow the u-code schemas
// (data/fields.json), so the pages read them exactly as they read the real backend.

export type Row = Record<string, unknown> & { guid: string }
export type Tables = Record<string, Row[]>

export const CLIENT_TYPES = {
  employee: '66f033f8-b369-438b-aa60-26cd84c88be2',
  investor: '5a2b8c1e-3f4d-4e6a-9b7c-1d2e3f4a5b6c',
}

/** The role every demo login signs in with: full rights */
export const ADMIN_ROLE_ID = rolesFixture.find((r) => r.name === 'DEFAULT ADMIN')!.guid
const INVESTOR_ROLE_ID = rolesFixture.find((r) => r.name === 'Investor')!.guid

const p = (text: string) => `<p>${text}</p>`

export function seed(): Tables {
  const r = createRandom()
  const t: Tables = {}
  const stamp = (d: Date) => ({ created_at: d.toISOString(), updated_at: d.toISOString() })
  const row = (fields: Record<string, unknown>, created = r.pastDate(365, 30)): Row => ({
    guid: r.uuid(),
    ...stamp(created),
    ...fields,
  })

  // System lookups the joins point at
  t.client_type = [
    { guid: CLIENT_TYPES.employee, name: 'Employee', ...stamp(new Date('2025-03-01')) },
    { guid: CLIENT_TYPES.investor, name: 'Investor', ...stamp(new Date('2025-03-01')) },
  ]
  t.role = rolesFixture.map((x) => ({
    guid: x.guid,
    name: x.name,
    client_type_id: x.client_type_id,
    is_system: x.is_system,
    ...stamp(new Date('2025-03-01')),
  }))

  // ── Projects ────────────────────────────────────────────────────────────────
  t.project_types = [
    { en: 'Conservative', ru: 'Консервативный', uz: 'Konservativ', from: 12, to: 15 },
    { en: 'Balanced', ru: 'Сбалансированный', uz: 'Muvozanatli', from: 15, to: 18 },
    { en: 'Growth', ru: 'Рост', uz: "O'sish", from: 30, to: 50 },
  ].map((x) =>
    row(
      {
        name_en: x.en,
        name_ru: x.ru,
        name_uz: x.uz,
        from_percent: x.from,
        to_percent: x.to,
        calculate_dividend: ['percent'],
      },
      new Date('2025-04-02'),
    ),
  )

  t.projects = [
    {
      en: 'Riverside Residences',
      ru: 'Риверсайд Резиденс',
      uz: 'Riverside Turar-joy',
      ticker: 'RVR',
      type: 1,
      status: 'invest',
    },
    {
      en: 'Silk Road Logistics',
      ru: 'Логистика Шёлкового пути',
      uz: "Ipak Yo'li Logistika",
      ticker: 'SRL',
      type: 0,
      status: 'invest',
    },
    {
      en: 'Green Valley Agro',
      ru: 'Грин Вэлли Агро',
      uz: 'Green Valley Agro',
      ticker: 'GVA',
      type: 2,
      status: 'invest',
    },
    {
      en: 'City Retail Fund',
      ru: 'Фонд городской торговли',
      uz: 'Shahar Savdo Fondi',
      ticker: 'CRF',
      type: 1,
      status: 'closed',
    },
  ].map((x, i) => {
    const created = new Date(Date.UTC(2025, 3 + i * 2, 10))
    return row(
      {
        name_en: x.en,
        name_ru: x.ru,
        name_uz: x.uz,
        ticker: x.ticker,
        status: [x.status],
        currency: ['USD'],
        image: `/mock/project-${i + 1}.svg`,
        project_types_id: t.project_types[x.type].guid,
        created_time: created.toISOString(),
        minimal_amount: [100, 300, 500, 1000][i],
        dividend_period: 2,
        deposit_maturity_month: [3, 6, 12, 6][i],
        insurance_amount: [2_000_000, 3_000_000, 2_000_000, 5_000_000][i],
        end_time: dateValue(new Date(Date.UTC(2027, i * 3, 1))),
        board_order: i + 1,
        sale: x.status === 'invest',
        insurance: i !== 2,
        investment: x.status === 'invest',
      },
      created,
    )
  })

  // ── Investors and what they own ─────────────────────────────────────────────
  t.investors = Array.from({ length: 64 }, (_, i) => investor(r, i))
  t.account = t.investors.map((inv) =>
    row(
      {
        investors_id: inv.guid,
        full_name: inv.full_name,
        deposit: r.float(0, 4_000, 2),
        invest: r.chance(0.7) ? r.float(100, 25_000, 2) : 0,
        dividend: r.float(0, 1_500, 2),
        tranzit: r.chance(0.2) ? r.float(10, 500, 2) : 0,
      },
      new Date(String(inv.created_time)),
    ),
  )
  const accountOf = new Map(t.account.map((a) => [a.investors_id as string, a.guid]))

  t.investor_cards = t.investors
    .filter(() => r.chance(0.6))
    .flatMap((inv) =>
      Array.from({ length: r.chance(0.25) ? 2 : 1 }, () => {
        const type = r.pick(['Uzcard', 'Humo'] as const)
        const created = r.pastDate(300, 1)
        const expiry = new Date(Date.now() + r.int(-20, 1100) * 86_400_000)
        return row(
          {
            investors_id: inv.guid,
            type,
            card_name: r.pick(BANKS),
            masked_pan: `${type === 'Uzcard' ? '8600' : '9860'}${r.digits(2)}******${r.digits(4)}`,
            expiry_date: dateValue(expiry),
            card_token: r.chance(0.85) ? `tok_${r.digits(6)}${r.uuid().slice(0, 8)}` : null,
            created_time: created.toISOString(),
          },
          created,
        )
      }),
    )
  const cardsOf = (investorId: string) =>
    t.investor_cards.filter((c) => c.investors_id === investorId)

  // ── Orders, dividends, transactions ─────────────────────────────────────────
  const openProjects = t.projects.filter((x) => (x.status as string[])[0] === 'invest')
  let orderNo = 1000
  t.orders = Array.from({ length: 140 }, () => {
    const inv = r.pick(t.investors)
    const project = r.chance(0.85) ? r.pick(openProjects) : r.pick(t.projects)
    const buy = r.chance(0.76)
    const created = r.pastDate(330, 0.2)
    const rate = r.float(12_050, 12_950, 2)
    const usd =
      r.pick([100, 250, 500, 1000, 1500, 2000, 3000, 5000, 7500, 10000]) +
      (r.chance(0.3) ? r.int(1, 99) : 0)
    const months = Number(project.deposit_maturity_month)
    return row(
      {
        external_order_id: String(++orderNo),
        investors_id: inv.guid,
        projects_id: project.guid,
        account_id: accountOf.get(inv.guid),
        type: [buy ? 'buy' : 'sell'],
        status: [r.chance(0.93) ? 'confirmed' : r.pick(['pending', 'cancelled'])],
        currency: [r.chance(0.73) ? 'UZS' : 'USD'],
        from_account: [buy ? 'deposit' : 'investment'],
        to_account: [buy ? 'investment' : 'deposit'],
        amount_usd: usd,
        amount_uzs: Math.round(usd * rate * 100) / 100,
        currency_rate: rate,
        transaction_fee: 0,
        insurance: 0,
        is_insurance: r.chance(0.3),
        amount_usd_with_fee: usd,
        amount_uzs_with_fee: Math.round(usd * rate * 100) / 100,
        created_time: created.toISOString(),
        updated_time: created.toISOString(),
        deposit_maturity_date: new Date(created.getTime() + months * 30 * 86_400_000).toISOString(),
        transaction_id: `TX${r.digits(10)}`,
        otp: null,
      },
      created,
    )
  }).sort((a, b) => String(a.created_time).localeCompare(String(b.created_time)))

  const confirmedBuys = t.orders.filter(
    (o) => (o.type as string[])[0] === 'buy' && (o.status as string[])[0] === 'confirmed',
  )
  t.dividend = confirmedBuys.flatMap((o) => {
    const start = new Date(String(o.created_time))
    const periods = Math.min(6, Math.floor((Date.now() - start.getTime()) / (5 * 86_400_000)))
    return Array.from({ length: Math.max(0, Math.min(periods, r.int(1, 3))) }, (_, k) => {
      const from = new Date(start.getTime() + k * 5 * 86_400_000)
      const to = new Date(from.getTime() + 5 * 86_400_000)
      const percent = r.float(0.3, 0.66, 3)
      const usd = Math.round(Number(o.amount_usd) * percent) / 100
      const rate = r.float(12_050, 12_950, 2)
      return row(
        {
          investors_id: o.investors_id,
          projects_id: o.projects_id,
          type: [r.chance(0.9) ? 'debit' : 'profit'],
          from_date: from.toISOString(),
          to_date: to.toISOString(),
          period_days: 5,
          days: 5,
          percent,
          amount_usd: usd,
          amount_uzs: Math.round(usd * rate * 100) / 100,
          order_amount: o.amount_usd,
          nominal_amount_usd: o.amount_usd,
          remaining_amount_usd: Math.max(0, Number(o.amount_usd) - usd),
        },
        to,
      )
    })
  })

  t.transactions = [
    ...t.orders.map((o) => ({
      investors_id: o.investors_id,
      projects_id: o.projects_id,
      orders_id: o.guid,
      operation: o.type,
      type: (o.type as string[])[0] === 'buy' ? '-' : '+',
      from_account: o.from_account,
      to_account: o.to_account,
      account: o.from_account,
      payment_type: ['account'],
      amount_usd: o.amount_usd,
      amount_uzs: o.amount_uzs,
      currency: o.currency,
      currency_rate: o.currency_rate,
      status: o.status,
      when: new Date(String(o.created_time)),
    })),
    ...t.dividend.map((d) => ({
      investors_id: d.investors_id,
      projects_id: d.projects_id,
      operation: ['dividend'],
      type: '+',
      from_account: ['investment'],
      to_account: ['dividend'],
      account: ['dividend'],
      payment_type: ['account'],
      amount_usd: d.amount_usd,
      amount_uzs: d.amount_uzs,
      currency: ['USD'],
      currency_rate: Math.round((Number(d.amount_uzs) / Number(d.amount_usd)) * 100) / 100,
      status: ['confirmed'],
      when: new Date(String(d.to_date)),
    })),
    ...Array.from({ length: 70 }, () => {
      const inv = r.pick(t.investors)
      const topup = r.chance(0.75)
      const card = cardsOf(inv.guid)[0]
      const usd = r.pick([50, 100, 200, 300, 500, 1000, 2000])
      const rate = r.float(12_050, 12_950, 2)
      return {
        investors_id: inv.guid,
        investor_cards_id: card?.guid ?? null,
        operation: [topup ? 'topup' : 'withdraw'],
        type: topup ? '+' : '-',
        from_account: [topup ? 'card' : 'deposit'],
        to_account: [topup ? 'deposit' : 'card'],
        account: [topup ? 'deposit' : 'card'],
        payment_type: [card ? 'card' : 'account'],
        amount_usd: usd,
        amount_uzs: Math.round(usd * rate * 100) / 100,
        currency: ['UZS'],
        currency_rate: rate,
        status: [r.chance(0.92) ? 'confirmed' : 'pending'],
        when: r.pastDate(330, 0.1),
      }
    }),
  ]
    .sort((a, b) => a.when.getTime() - b.when.getTime())
    .map(({ when, ...x }) =>
      row(
        {
          ...x,
          account_id: accountOf.get(x.investors_id as string),
          external_id: `EXT${r.digits(9)}`,
          transaction_fee: 0,
          insurance: 0,
          is_insurance: false,
          amount_usd_with_fee: x.amount_usd,
          amount_uzs_with_fee: x.amount_uzs,
          score: r.int(1, 7),
          otp: null,
          created_time: when.toISOString(),
          updated_time: when.toISOString(),
        },
        when,
      ),
    )

  // Holdings: one per investor and project with a confirmed deposit
  const holdings = new Map<string, Row[]>()
  for (const o of confirmedBuys) {
    const key = `${o.investors_id}|${o.projects_id}`
    holdings.set(key, [...(holdings.get(key) ?? []), o])
  }
  t.project_investors = [...holdings.values()].map((orders) => {
    const first = orders[0]
    const investment = orders.reduce((s, o) => s + Number(o.amount_usd), 0)
    const dividend = t.dividend
      .filter((d) => d.investors_id === first.investors_id && d.projects_id === first.projects_id)
      .reduce((s, d) => s + Number(d.amount_usd), 0)
    const rate = Number(first.currency_rate)
    const created = new Date(String(first.created_time))
    return row(
      {
        investors_id: first.investors_id,
        projects_id: first.projects_id,
        investment: Math.round(investment * 100) / 100,
        investment_uzs: Math.round(investment * rate * 100) / 100,
        dividend: Math.round(dividend * 100) / 100,
        dividend_uzs: Math.round(dividend * rate * 100) / 100,
        status: r.chance(0.8) ? 'active' : 'closed',
        created_time: created.toISOString(),
        updated_time: created.toISOString(),
        closing_date: first.deposit_maturity_date,
      },
      created,
    )
  })

  // ── Rates and limits ────────────────────────────────────────────────────────
  let rate = 12_400
  t.currency_rates = Array.from({ length: 150 }, (_, i) => {
    rate = Math.min(12_990, Math.max(11_900, rate + r.float(-45, 48, 2)))
    const day = new Date(Date.now() - (149 - i) * 86_400_000)
    const percent = r.chance(0.95) ? 1 : 2
    return row(
      {
        date: dateValue(day),
        amount: Math.round(rate * 100) / 100,
        percent,
        amount_with_percent: Math.round(rate * (1 + percent / 100) * 100) / 100,
      },
      day,
    )
  })

  t.currency_percent = [
    ['currency', 1],
    ['transaction', 1],
    ['insurance', 0.5],
  ].map(([type, percent]) => row({ type: [type], percent }, new Date('2025-05-01')))

  t.policy_Type = [
    [
      'Maximum withdrawal amount limit',
      'Лимит максимальной суммы вывода',
      'Maksimal yechib olish summasi limiti',
    ],
    [
      'Maximum top-up amount limit',
      'Лимит максимальной суммы пополнения',
      "Maksimal to'ldirish summasi limiti",
    ],
    [
      'Monthly transaction limit (account top-up)',
      'Месячный лимит операций (пополнение)',
      "Oylik operatsiyalar limiti (to'ldirish)",
    ],
    [
      'Monthly transaction limit (Withdrawal)',
      'Месячный лимит операций (вывод)',
      'Oylik operatsiyalar limiti (yechib olish)',
    ],
    [
      'Daily transaction limit (account top-up)',
      'Дневной лимит операций (пополнение)',
      "Kunlik operatsiyalar limiti (to'ldirish)",
    ],
    [
      'Daily transaction limit (Withdrawal)',
      'Дневной лимит операций (вывод)',
      'Kunlik operatsiyalar limiti (yechib olish)',
    ],
  ].map(([en, ru, uz]) => row({ label_en: en, label_ru: ru, label_uz: uz }, new Date('2025-05-01')))

  t.transaction_policy = t.policy_Type.map((pt, i) =>
    row(
      { policy_Type_id: pt.guid, amount: [10_000, 10_000, 30_000, 30_000, 5_000, 5_000][i] },
      new Date('2025-05-02'),
    ),
  )

  t.rba_matrix = [
    [0, 100, 1],
    [101, 1_000, 3],
    [1_001, 5_000, 5],
    [5_001, 1_000_000, 7],
  ].map(([from, to, score]) =>
    row({ amount_from: from, amount_to: to, score }, new Date('2025-05-03')),
  )

  t.financial_modeling = ['SP500', 'NASDAQ', 'GOLD'].flatMap((key) => {
    let price = { SP500: 6_840, NASDAQ: 21_300, GOLD: 2_650 }[key]!
    return Array.from({ length: 40 }, (_, i) => {
      price = Math.round(price * (1 + r.float(-0.012, 0.013, 4)) * 100) / 100
      const day = new Date(Date.now() - (39 - i) * 86_400_000)
      return row({ project_key_name: key, date: dateValue(day), price }, day)
    })
  })

  // ── Compliance ──────────────────────────────────────────────────────────────
  t.investor_score = t.investors
    .filter(() => r.chance(0.5))
    .map((inv) => row({ investors_id: inv.guid, score: r.int(1, 10) }))

  t.black_list = Array.from({ length: 120 }, () => {
    const female = r.chance(0.4)
    const surname = r.pick(SURNAMES) + (female ? 'a' : '')
    return row({
      name: (female ? r.pick(FEMALE_NAMES) : r.pick(MALE_NAMES)).toUpperCase(),
      surname: surname.toUpperCase(),
      passport: `${r.pick(['AA', 'AB', 'AC', 'AD'])}${r.digits(7)}`,
      pin: `${r.int(3, 6)}${r.digits(13)}`,
    })
  })

  t.str_sar = Array.from({ length: 9 }, () => {
    const [a, b] = [r.pick(t.investors), r.pick(t.investors)]
    const when = r.pastDate(120, 1)
    return row(
      {
        investors_id: a.guid,
        investors_id_2: r.chance(0.5) ? b.guid : null,
        policy_Type_id: r.pick(t.policy_Type).guid,
        date: when.toISOString(),
        last_transaction_amount: r.pick([5_200, 9_800, 12_000, 31_500, 48_000]),
      },
      when,
    )
  })

  // ── Content ─────────────────────────────────────────────────────────────────
  t.news = [
    [
      'Niyat opens Riverside Residences for investment',
      'Риверсайд Резиденс открыт для инвестиций',
      'Riverside Turar-joy investitsiya uchun ochildi',
    ],
    [
      'Quarterly dividends paid to all investors',
      'Квартальные дивиденды выплачены всем инвесторам',
      "Choraklik dividendlar barcha investorlarga to'landi",
    ],
    [
      'New: top up with Humo cards',
      'Новое: пополнение картами Humo',
      "Yangi: Humo kartalari bilan to'ldirish",
    ],
    [
      'How we choose the projects we offer',
      'Как мы выбираем проекты',
      'Loyihalarni qanday tanlaymiz',
    ],
    [
      'Green Valley Agro: first harvest report',
      'Грин Вэлли Агро: отчёт о первом урожае',
      'Green Valley Agro: birinchi hosil hisoboti',
    ],
    [
      'Scheduled maintenance this weekend',
      'Плановые работы в выходные',
      'Dam olish kunlari rejali texnik ishlar',
    ],
  ].map(([en, ru, uz], i) => {
    const when = r.pastDate(160 - i * 25, 140 - i * 25)
    return row(
      {
        title_en: en,
        title_ru: ru,
        title_uz: uz,
        description_en:
          p(`${en}. Read the full update in the Niyat app.`) +
          p('<strong>What this means for you:</strong> nothing changes in your current deposits.'),
        description_ru: p(`${ru}. Подробности в приложении Niyat.`),
        description_uz: p(`${uz}. Batafsil Niyat ilovasida.`),
        photo: `/mock/news-${(i % 3) + 1}.svg`,
        created_time: when.toISOString(),
      },
      when,
    )
  })

  t.faq = [
    [
      'How is the commission charged?',
      'Как взимается комиссия?',
      'Komissiya qanday olinadi?',
      'The commission is charged only for bank-related operations: card top-ups and withdrawals.',
    ],
    [
      'When are dividends paid?',
      'Когда выплачиваются дивиденды?',
      "Dividendlar qachon to'lanadi?",
      'Dividends are calculated every 5 days and credited to your dividend account.',
    ],
    [
      'Can I withdraw my investment early?',
      'Можно ли вывести инвестицию досрочно?',
      'Investitsiyani muddatidan oldin yechib olsa boʻladimi?',
      'Yes. An early sale moves the amount back to your deposit account; dividends already paid stay yours.',
    ],
    [
      'Is my deposit insured?',
      'Застрахован ли мой депозит?',
      'Depozitim sugʻurtalanganmi?',
      'Projects marked <strong>Insured</strong> cover the deposit up to the project’s insurance amount.',
    ],
    [
      'Which cards can I use?',
      'Какие карты можно использовать?',
      'Qaysi kartalardan foydalanish mumkin?',
      'Uzcard and Humo cards issued by any bank in Uzbekistan.',
    ],
    [
      'How do I verify my identity?',
      'Как пройти идентификацию?',
      'Shaxsimni qanday tasdiqlayman?',
      'Open Profile → Identification and follow the steps with your passport or ID card.',
    ],
    [
      'What is the minimum investment?',
      'Какая минимальная сумма инвестиции?',
      'Minimal investitsiya qancha?',
      'Each project sets its own minimum, starting from 100 USD.',
    ],
  ].map(([en, ru, uz, answer]) =>
    row({
      question_en: en,
      question_ru: ru,
      question_uz: uz,
      answer_en: p(answer),
      answer_ru: p(`${ru.replace('?', '')}: подробный ответ.`),
      answer_uz: p(`${uz.replace('?', '')}: batafsil javob.`),
    }),
  )

  t.documents = t.investors.slice(0, 30).map((inv) => {
    const when = r.pastDate(300, 2)
    return row(
      {
        investors_id: inv.guid,
        title_en: 'Investment agreement',
        title_ru: 'Инвестиционный договор',
        title_uz: 'Investitsiya shartnomasi',
        file: '/mock/sample.pdf',
        file_en: '/mock/sample.pdf',
        file_uz: r.chance(0.6) ? '/mock/sample.pdf' : null,
      },
      when,
    )
  })

  t.about_us = [
    row(
      {
        text_en:
          p(
            '<strong>Niyat</strong> is an investment platform that lets anyone in Uzbekistan invest in vetted real-economy projects from 100 USD.',
          ) + p('We publish every project’s terms, insurance and dividend history.'),
        text_ru: p(
          '<strong>Niyat</strong> — инвестиционная платформа для вложений в проверенные проекты реального сектора от 100 USD.',
        ),
        text_uz: p(
          '<strong>Niyat</strong> — 100 USD dan boshlab tekshirilgan loyihalarga sarmoya kiritish platformasi.',
        ),
        files: ['/mock/sample.pdf'],
      },
      new Date('2025-05-10'),
    ),
  ]
  t.contact_info = [
    row({ phone: '+998712000000', telegram: '@niyat_support' }, new Date('2025-05-10')),
  ]
  t.link_settings = [
    row({ base_url: 'https://niyat.uz/referral/', sender_percentage: 10 }, new Date('2025-05-10')),
  ]
  t.maintenance_works = [row({ maintenance_works: false }, new Date('2025-05-10'))]

  t.sms_template = [
    [
      'otp',
      'Niyat: your confirmation code is {{.code}}',
      'Niyat: ваш код подтверждения {{.code}}',
      'Niyat: tasdiqlash kodingiz {{.code}}',
    ],
    [
      'topup',
      'Niyat: your account was topped up with {{.amount}}',
      'Niyat: счёт пополнен на {{.amount}}',
      "Niyat: hisobingiz {{.amount}} ga to'ldirildi",
    ],
    [
      'withdraw',
      'Niyat: {{.amount}} was sent to your card',
      'Niyat: {{.amount}} отправлено на карту',
      'Niyat: {{.amount}} kartangizga yuborildi',
    ],
    [
      'dividend',
      'Niyat: dividends of {{.amount}} credited',
      'Niyat: начислены дивиденды {{.amount}}',
      'Niyat: {{.amount}} dividend hisoblandi',
    ],
    [
      'login',
      'Niyat: new sign-in to your account',
      'Niyat: новый вход в аккаунт',
      'Niyat: hisobingizga yangi kirish',
    ],
  ].map(([text, en, ru, uz]) => row({ text, en, ru, uz }, new Date('2025-05-12')))

  t.notification = Array.from({ length: 24 }, (_, i) => {
    const sendAt = new Date(
      Date.now() + (i < 3 ? (i + 1) * 86_400_000 : -r.float(1, 200) * 86_400_000),
    )
    const warning = r.chance(0.25)
    const [en, ru, uz] = warning
      ? ['Scheduled maintenance', 'Плановые работы', 'Rejali texnik ishlar']
      : r.pick([
          ['Dividends credited', 'Дивиденды начислены', 'Dividendlar hisoblandi'],
          ['New project available', 'Доступен новый проект', 'Yangi loyiha mavjud'],
          ['Your deposit is confirmed', 'Ваш депозит подтверждён', 'Depozitingiz tasdiqlandi'],
        ])
    return row(
      {
        title_en: en,
        title_ru: ru,
        title_uz: uz,
        content_en: p(`${en}. Open the app for details.`),
        content_ru: p(`${ru}. Подробности в приложении.`),
        content_uz: p(`${uz}. Batafsil ilovada.`),
        type: [warning ? 'warning' : 'info'],
        link: r.chance(0.3) ? 'https://niyat.uz' : null,
        image: r.chance(0.3) ? `/mock/news-${r.int(1, 3)}.svg` : null,
        send_at: sendAt.toISOString(),
        is_sent: sendAt.getTime() < Date.now(),
      },
      new Date(Math.min(sendAt.getTime(), Date.now()) - 3_600_000),
    )
  })

  // ── Referrals ───────────────────────────────────────────────────────────────
  t.referral_links = Array.from({ length: 56 }, () => {
    const sender = r.pick(t.investors)
    const joined = r.chance(0.55) ? r.pick(t.investors.filter((x) => x !== sender)) : null
    const sent = r.pastDate(240, 1)
    return row(
      {
        investors_id: sender.guid,
        send_investor_u_id: sender.user_id_auth,
        send_phone_number: sender.phone,
        entered_phone_number: joined ? joined.phone : phoneNumber(r),
        investors_id_2: joined?.guid ?? null,
        is_active: !!joined,
        send_at: sent.toISOString(),
        register_date: joined
          ? new Date(sent.getTime() + r.float(0.1, 6) * 86_400_000).toISOString()
          : null,
        device_id: r.uuid().slice(0, 16),
        transactions_id: null,
        transactions_id_2: null,
      },
      sent,
    )
  })

  // ── Staff ───────────────────────────────────────────────────────────────────
  t.employee = [
    ['admin', 'DEFAULT ADMIN'],
    ['director', 'Director'],
    ['finance.lead', 'Finance'],
    ['marketing', 'Marketing Manager'],
    ['octobank', 'OctoBank'],
  ].map(([login, roleName], i) =>
    row(
      {
        login,
        password: '••••••••',
        role_id: t.role.find((x) => x.name === roleName)!.guid,
        client_type_id: CLIENT_TYPES.employee,
        user_id_auth: r.uuid(),
        photo: i < 3 ? `/mock/avatar-${i + 1}.svg` : null,
      },
      new Date(Date.UTC(2025, 4, 1 + i * 9)),
    ),
  )

  // ── Integrations ────────────────────────────────────────────────────────────
  t.bitrix_leads = Array.from({ length: 48 }, () => {
    const inv = r.pick(t.investors)
    const status = r.pick(['created', 'created', 'deposit_updated', 'error'] as const)
    const leadId = String(r.int(10_000, 99_999))
    const when = r.pastDate(200, 0.05)
    return row(
      {
        investors_id: inv.guid,
        phone: inv.phone,
        status,
        lead_type: r.pick(['registration', 'deposit']),
        bitrix_method: status === 'deposit_updated' ? 'crm.lead.update' : 'crm.lead.add',
        http_status: status === 'error' ? r.pick([400, 500, 503]) : 200,
        bitrix_lead_id: status === 'error' ? null : leadId,
        error:
          status === 'error'
            ? 'Bitrix answered with an error: service temporarily unavailable'
            : null,
        request_body: JSON.stringify(
          { fields: { TITLE: inv.full_name, PHONE: [{ VALUE: inv.phone }] } },
          null,
          2,
        ),
        response_body: JSON.stringify(
          status === 'error' ? { error: 'SERVICE_UNAVAILABLE' } : { result: Number(leadId) },
          null,
          2,
        ),
        deposit_synced: status === 'deposit_updated',
      },
      when,
    )
  })

  return t
}

function investor(r: Random, i: number): Row {
  const female = r.chance(0.42)
  const name = female ? r.pick(FEMALE_NAMES) : r.pick(MALE_NAMES)
  const surname = r.pick(SURNAMES) + (female ? 'a' : '')
  const patronymic = `${r.pick(FATHER_NAMES)} ${female ? 'qizi' : "o'g'li"}`
  const place = r.pick(CITIES)
  // Newest first in the list: spread sign-ups over the last year
  const created = r.pastDate((64 - i) * 5.6, (63 - i) * 5.6)
  const born = new Date(Date.UTC(r.int(1968, 2004), r.int(0, 11), r.int(1, 28)))
  const issued = new Date(Date.UTC(r.int(2015, 2024), r.int(0, 11), r.int(1, 28)))
  const dmy = (d: Date) =>
    `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${d.getUTCFullYear()}`
  const identified = r.chance(0.78)
  return {
    guid: r.uuid(),
    created_at: created.toISOString(),
    updated_at: created.toISOString(),
    created_time: created.toISOString(),
    name,
    surname,
    patronymic,
    full_name: `${surname} ${name} ${patronymic}`,
    phone: phoneNumber(r),
    gender: [female ? 'female' : 'male'],
    birth_date: dmy(born),
    birth_place: place.city,
    citizenship: 'UZB',
    country_name: 'Uzbekistan',
    city: place.city,
    district: r.pick(place.districts),
    street: `${r.pick(STREETS)} ko'chasi, ${r.int(1, 120)}`,
    passport: identified ? `${r.pick(['AA', 'AB', 'AC', 'AD'])}${r.digits(7)}` : null,
    pinfl: identified ? `${female ? r.pick([4, 6]) : r.pick([3, 5])}${r.digits(13)}` : null,
    issued_by: identified ? `${place.city} IIB` : null,
    issued_date: identified ? dmy(issued) : null,
    is_identified: identified,
    lang: [r.pick(['uz', 'uz', 'ru', 'en'])],
    platform_type: [r.pick(['ios', 'android', 'android', 'web'])],
    mode: r.chance(0.3) ? 'dark' : null,
    score: r.int(1, 10),
    social_type: r.chance(0.5) ? r.pick(['instagram', 'telegram', 'facebook']) : null,
    social_sub_type: null,
    tg_caht_id: r.chance(0.4) ? Number(`5${r.digits(9)}`) : null,
    image: null,
    fmc_token: null,
    pin_code: null,
    user_id_auth: r.uuid(),
    client_type_id: CLIENT_TYPES.investor,
    role_id: INVESTOR_ROLE_ID,
  }
}
