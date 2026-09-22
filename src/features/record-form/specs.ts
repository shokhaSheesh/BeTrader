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
  news: {
    table: 'news',
    sections: [
      {
        title: 'English',
        fields: [
          { name: 'title_en', kind: 'text' },
          { name: 'description_en', kind: 'longText' },
        ],
      },
      {
        title: 'Russian',
        fields: [
          { name: 'title_ru', kind: 'text' },
          { name: 'description_ru', kind: 'longText' },
        ],
      },
      {
        title: 'Uzbek',
        fields: [
          { name: 'title_uz', kind: 'text' },
          { name: 'description_uz', kind: 'longText' },
        ],
      },
      { title: 'Photo', description: "Uploading images isn't connected yet.", fields: [] },
    ],
  },
  faq: {
    table: 'faq',
    // The backend labels all three languages just "Question" / "Answer", so each language is its own section.
    sections: [
      {
        title: 'English',
        fields: [
          { name: 'question_en', kind: 'text' },
          { name: 'answer_en', kind: 'longText' },
        ],
      },
      {
        title: 'Russian',
        fields: [
          { name: 'question_ru', kind: 'text' },
          { name: 'answer_ru', kind: 'longText' },
        ],
      },
      {
        title: 'Uzbek',
        fields: [
          { name: 'question_uz', kind: 'text' },
          { name: 'answer_uz', kind: 'longText' },
        ],
      },
    ],
  },
  documents: {
    table: 'documents',
    sections: [
      { title: 'Owner', fields: [{ name: 'investors_id', kind: 'investor' }] },
      {
        title: 'Titles',
        fields: [
          { name: 'title_en', kind: 'text' },
          { name: 'title_ru', kind: 'text' },
          { name: 'title_uz', kind: 'text' },
        ],
      },
      {
        title: 'Files',
        description: "Uploading files isn't connected yet; the current files stay as they are.",
        fields: [],
      },
    ],
  },
  aboutUs: {
    table: 'about_us',
    sections: [
      {
        title: 'Text',
        fields: [
          { name: 'text_en', kind: 'longText' },
          { name: 'text_ru', kind: 'longText' },
          { name: 'text_uz', kind: 'longText' },
        ],
      },
      {
        title: 'Files',
        description: "Uploading files isn't connected yet; the current files stay as they are.",
        fields: [],
      },
    ],
  },
  contactInfo: {
    table: 'contact_info',
    sections: [
      {
        title: 'Contacts',
        fields: [
          { name: 'phone', kind: 'code' },
          { name: 'telegram', kind: 'text', hint: 'Full link, e.g. https://t.me/…' },
        ],
      },
    ],
  },
  notifications: {
    table: 'notification',
    sections: [
      {
        title: 'Delivery',
        fields: [
          { name: 'type', kind: 'options' },
          { name: 'send_at', kind: 'date' },
          { name: 'link', kind: 'text' },
          { name: 'is_sent', kind: 'switch' },
        ],
      },
      {
        title: 'English',
        fields: [
          { name: 'title_en', kind: 'text' },
          { name: 'content_en', kind: 'longText' },
        ],
      },
      {
        title: 'Russian',
        fields: [
          { name: 'title_ru', kind: 'text' },
          { name: 'content_ru', kind: 'longText' },
        ],
      },
      {
        title: 'Uzbek',
        fields: [
          { name: 'title_uz', kind: 'text' },
          { name: 'content_uz', kind: 'longText' },
        ],
      },
    ],
  },
  smsTemplates: {
    table: 'sms_template',
    sections: [
      {
        title: 'Texts',
        fields: [
          { name: 'en', kind: 'longText' },
          { name: 'ru', kind: 'longText' },
          { name: 'uz', kind: 'longText' },
          { name: 'text', kind: 'longText' },
        ],
      },
    ],
  },
  maintenance: {
    table: 'maintenance_works',
    sections: [
      {
        title: 'App status',
        description: 'While this is on, the Niyat app shows a maintenance screen to investors.',
        fields: [{ name: 'maintenance_works', kind: 'switch' }],
      },
    ],
  },
} satisfies Record<string, FormSpec>
