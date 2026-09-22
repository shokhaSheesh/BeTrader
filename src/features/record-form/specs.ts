import type { FormSpec } from './RecordForm'

// Form definitions for the simple tables. Order = what an admin fills in first.
export const FORM_SPECS = {
  transactionPolicy: {
    table: 'transaction_policy',
    sections: [
      {
        title: 'Policy',
        fields: [
          { name: 'policy_Type_id', kind: 'policyType' },
          {
            name: 'amount',
            kind: 'number',
            hint: 'A USD amount or a count, depending on the policy type',
          },
        ],
      },
    ],
  },
  financialModeling: {
    table: 'financial_modeling',
    sections: [
      {
        title: 'Price',
        fields: [
          { name: 'project_key_name', kind: 'code', hint: 'e.g. SP500' },
          { name: 'date', kind: 'date' },
          { name: 'price', kind: 'number' },
        ],
      },
    ],
  },
  amlBlacklist: {
    table: 'black_list',
    sections: [
      {
        title: 'Person',
        fields: [
          { name: 'name', kind: 'text' },
          { name: 'surname', kind: 'text' },
          { name: 'passport', kind: 'code' },
          { name: 'pin', kind: 'code' },
        ],
      },
    ],
  },
  investorScore: {
    table: 'investor_score',
    sections: [
      {
        title: 'Score',
        fields: [
          { name: 'investors_id', kind: 'investor' },
          { name: 'score', kind: 'number' },
        ],
      },
    ],
  },
  rbaMatrix: {
    table: 'rba_matrix',
    sections: [
      {
        title: 'Risk band',
        fields: [
          { name: 'amount_from', kind: 'number' },
          { name: 'amount_to', kind: 'number' },
          { name: 'score', kind: 'number' },
        ],
      },
    ],
  },
  strSar: {
    table: 'str_sar',
    sections: [
      {
        title: 'Report',
        fields: [
          { name: 'date', kind: 'date' },
          { name: 'policy_Type_id', kind: 'policyType' },
          { name: 'last_transaction_amount', kind: 'number' },
        ],
      },
      {
        title: 'Subject',
        fields: [
          { name: 'investors_id', kind: 'investor' },
          {
            name: 'investors_id_2',
            kind: 'investor',
            hint: 'The backend links a second investor record here, shown by passport',
          },
        ],
      },
    ],
  },
  policyTypes: {
    table: 'policy_Type',
    sections: [
      {
        title: 'Labels',
        fields: [
          { name: 'label_en', kind: 'text' },
          { name: 'label_ru', kind: 'text' },
          { name: 'label_uz', kind: 'text' },
        ],
      },
    ],
  },
} satisfies Record<string, FormSpec>
