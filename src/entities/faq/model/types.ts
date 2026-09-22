/** Raw row of the u-code `faq` table. */
export interface FaqItemDto {
  guid: string
  question_en: string | null
  question_ru: string | null
  question_uz: string | null
  /** MULTI_LINE */
  answer_en: string | null
  answer_ru: string | null
  answer_uz: string | null
  created_at: string
  updated_at: string
}

export interface FaqItem {
  id: string
  questionEn: string | null
  questionRu: string | null
  questionUz: string | null
  answerEn: string | null
  answerRu: string | null
  answerUz: string | null
  createdAt: string
  updatedAt: string
}

export const toFaqItem = (d: FaqItemDto): FaqItem => ({
  id: d.guid,
  questionEn: d.question_en || null,
  questionRu: d.question_ru || null,
  questionUz: d.question_uz || null,
  answerEn: d.answer_en || null,
  answerRu: d.answer_ru || null,
  answerUz: d.answer_uz || null,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
})
