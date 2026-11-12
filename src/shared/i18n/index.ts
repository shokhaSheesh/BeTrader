import { useCallback, useEffect } from 'react'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { useUiStore, type Language } from '@/shared/lib/ui-store'
import { RU } from './ru'

// Interface translations, on i18next. The English text is the key: `t('Create project')`, so
// a text with no translation falls back to English, never to a key. Field names and select
// options are not translated here: they come from u-code's schema in each language
// (useTableFields), since the backend owns them. See docs/I18N.md.

export type { Language }
export type Vars = Record<string, string | number>

void i18n.use(initReactI18next).init({
  resources: { en: { translation: {} }, ru: { translation: RU } },
  lng: useUiStore.getState().language,
  fallbackLng: 'en',
  // English sentences are the keys: dots and colons in them are text, not key paths
  keySeparator: false,
  nsSeparator: false,
  // `{name}` placeholders; React escapes the output already
  interpolation: { prefix: '{', suffix: '}', escapeValue: false },
  returnNull: false,
  returnEmptyString: false,
})

// The header's language menu sets the store; i18next follows it
useUiStore.subscribe((state, previous) => {
  if (state.language !== previous.language) void i18n.changeLanguage(state.language)
})

/** Translate outside React (toasts from hooks, error messages): the current language. */
export function translate(text: string, vars?: Vars, language = useUiStore.getState().language) {
  return i18n.t(text, { ...vars, lng: language })
}

export const useLanguage = () => useUiStore((s) => s.language)

/** `const t = useT()` then `t('Delete {noun}', { noun })`. Re-renders on a language change. */
export function useT() {
  const language = useLanguage()
  const { t } = useTranslation()
  return useCallback(
    (text: string, vars?: Vars) => t(text, { ...vars, lng: language }),
    [t, language],
  )
}

/**
 * Picks the record's own text for the interface language, for records the backend stores in
 * several languages (`title_en` / `title_ru`): `pick(r.titleEn, r.titleRu)`. Falls back to English.
 */
export function useLocalized() {
  const language = useLanguage()
  return useCallback(
    (en: string | null | undefined, ru: string | null | undefined) =>
      (language === 'ru' && ru) || en || ru || null,
    [language],
  )
}

/**
 * Russian plural forms: `plural(n, ['запись', 'записи', 'записей'])`.
 * English callers pass two forms: `plural(n, ['record', 'records'])`.
 */
export function plural(
  n: number,
  forms: readonly string[],
  language = useUiStore.getState().language,
) {
  if (language !== 'ru' || forms.length < 3) return forms[n === 1 ? 0 : 1] ?? forms[0]
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

/** Keeps `<html lang>` in step with the interface language (screen readers, hyphenation). */
export function useDocumentLanguage() {
  const language = useLanguage()
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
}

/** Month and weekday names for calendars and chart axes. */
export const MONTHS: Record<Language, readonly string[]> = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  ru: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  uz: [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentabr',
    'Oktabr',
    'Noyabr',
    'Dekabr',
  ],
}
export const MONTHS_SHORT: Record<Language, readonly string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  uz: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
}
/** Monday first, as in Uzbekistan */
export const WEEKDAYS: Record<Language, readonly string[]> = {
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  uz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
}
