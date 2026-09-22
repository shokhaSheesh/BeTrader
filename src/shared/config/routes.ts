export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  projects: {
    root: '/projects',
    list: '/projects',
    types: '/projects/types',
    investors: '/projects/investors',
  },
  investors: {
    root: '/investors',
    list: '/investors',
    accounts: '/investors/accounts',
    cards: '/investors/cards',
  },
  finance: {
    root: '/finance',
    orders: '/finance/orders',
    transactions: '/finance/transactions',
    dividends: '/finance/dividends',
    currencyRates: '/finance/currency-rates',
    currencyPercent: '/finance/currency-percent',
    transactionPolicy: '/finance/transaction-policy',
    financialModeling: '/finance/financial-modeling',
  },
  compliance: {
    root: '/compliance',
    amlBlacklist: '/compliance/aml-blacklist',
    investorScore: '/compliance/investor-score',
    rbaMatrix: '/compliance/rba-matrix',
    strSar: '/compliance/str-sar',
    policyTypes: '/compliance/policy-types',
  },
  content: {
    root: '/content',
    news: '/content/news',
    faq: '/content/faq',
    documents: '/content/documents',
    aboutUs: '/content/about-us',
    contactInfo: '/content/contact-info',
  },
  communication: {
    root: '/communication',
    notifications: '/communication/notifications',
    smsTemplates: '/communication/sms-templates',
    maintenance: '/communication/maintenance',
  },
  referrals: {
    root: '/referrals',
    links: '/referrals/links',
    settings: '/referrals/settings',
  },
  analytics: {
    root: '/analytics',
    dividends: '/analytics/dividends',
    tariffs: '/analytics/tariffs',
  },
  integrations: {
    root: '/integrations',
    bitrixLeads: '/integrations/bitrix-leads',
  },
  staff: {
    root: '/staff',
    employees: '/staff/employees',
  },
} as const

/** Detail / create / edit routes for a list page at `base`. */
function recordRoutes(base: string) {
  return {
    list: base,
    create: `${base}/new`,
    detail: (id: string) => `${base}/${id}`,
    edit: (id: string) => `${base}/${id}/edit`,
    patterns: { create: `${base}/new`, detail: `${base}/:id`, edit: `${base}/:id/edit` },
  }
}

export const RECORDS = {
  projects: recordRoutes(ROUTES.projects.list),
  projectTypes: recordRoutes(ROUTES.projects.types),
  projectInvestors: recordRoutes(ROUTES.projects.investors),
  investors: recordRoutes(ROUTES.investors.list),
  accounts: recordRoutes(ROUTES.investors.accounts),
  cards: recordRoutes(ROUTES.investors.cards),
  orders: recordRoutes(ROUTES.finance.orders),
  transactions: recordRoutes(ROUTES.finance.transactions),
  dividends: recordRoutes(ROUTES.finance.dividends),
  currencyRates: recordRoutes(ROUTES.finance.currencyRates),
  currencyPercent: recordRoutes(ROUTES.finance.currencyPercent),
  transactionPolicy: recordRoutes(ROUTES.finance.transactionPolicy),
  financialModeling: recordRoutes(ROUTES.finance.financialModeling),
  amlBlacklist: recordRoutes(ROUTES.compliance.amlBlacklist),
  investorScore: recordRoutes(ROUTES.compliance.investorScore),
  rbaMatrix: recordRoutes(ROUTES.compliance.rbaMatrix),
  strSar: recordRoutes(ROUTES.compliance.strSar),
  policyTypes: recordRoutes(ROUTES.compliance.policyTypes),
}
