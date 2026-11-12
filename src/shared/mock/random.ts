// Deterministic randomness for the demo data: the same seed gives the same data on every load,
// so screenshots and walkthroughs stay stable.

export function createRandom(seed = 20261112) {
  let s = seed >>> 0
  /** mulberry32: [0, 1) */
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min
  const float = (min: number, max: number, digits = 2) =>
    Number((next() * (max - min) + min).toFixed(digits))
  const pick = <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)]
  const chance = (p: number) => next() < p
  const digits = (n: number) => Array.from({ length: n }, () => int(0, 9)).join('')
  const uuid = () => {
    const h = (n: number) =>
      Array.from({ length: n }, () => Math.floor(next() * 16).toString(16)).join('')
    return `${h(8)}-${h(4)}-4${h(3)}-${pick(['8', '9', 'a', 'b'])}${h(3)}-${h(12)}`
  }
  /** A moment `daysAgo` days back (fractional days give a time of day) */
  const pastDate = (maxDaysAgo: number, minDaysAgo = 0) =>
    new Date(Date.now() - float(minDaysAgo, maxDaysAgo, 4) * 86_400_000)
  return { next, int, float, pick, chance, digits, uuid, pastDate }
}

export type Random = ReturnType<typeof createRandom>

export const MALE_NAMES = [
  'Aziz',
  'Bekzod',
  'Dilshod',
  'Jasur',
  'Otabek',
  'Sardor',
  'Sherzod',
  'Ulugbek',
  'Javlon',
  'Rustam',
  'Farrux',
  'Akmal',
  'Bobur',
  'Jamshid',
  'Shoxrux',
  'Islom',
  'Doniyor',
  'Temur',
  'Nodir',
  'Sanjar',
  'Kamol',
  'Anvar',
  'Oybek',
  'Zafar',
] as const

export const FEMALE_NAMES = [
  'Malika',
  'Dilnoza',
  'Nilufar',
  'Madina',
  'Gulnora',
  'Shahnoza',
  'Zarina',
  'Kamola',
  'Sevara',
  'Nodira',
  'Feruza',
  'Mohira',
  'Laylo',
  'Dildora',
  'Munisa',
  'Sabina',
  'Aziza',
  'Barno',
] as const

/** Masculine form; the feminine one adds "a" (Karimov → Karimova). */
export const SURNAMES = [
  'Karimov',
  'Rahimov',
  'Tursunov',
  'Yusupov',
  'Abdullayev',
  'Ismoilov',
  'Nazarov',
  'Saidov',
  'Ergashev',
  'Mirzayev',
  'Qodirov',
  'Xolmatov',
  'Aliyev',
  'Usmonov',
  'Sobirov',
  'Haydarov',
  'Toshmatov',
  'Jurayev',
  'Umarov',
  'Rasulov',
  'Sultonov',
  'Mahmudov',
] as const

export const FATHER_NAMES = [
  'Akmal',
  'Bahodir',
  'Farhod',
  'Ilhom',
  'Laziz',
  'Murod',
  'Nurali',
  'Odil',
  'Rustam',
  'Shavkat',
  'Tohir',
  'Valijon',
  'Xasan',
  'Yorqin',
  'Zokir',
] as const

export const CITIES = [
  {
    city: 'Tashkent',
    districts: ['Yunusobod', 'Chilonzor', 'Mirzo Ulugbek', 'Yakkasaroy', 'Shayxontohur'],
  },
  { city: 'Samarkand', districts: ['Siyob', 'Bogishamol', 'Registon'] },
  { city: 'Bukhara', districts: ['Markaz', 'Gijduvon'] },
  { city: 'Namangan', districts: ['Davlatobod', 'Yangi Namangan'] },
  { city: 'Fergana', districts: ['Qirguli', 'Markaz'] },
  { city: 'Andijan', districts: ['Bogishamol', 'Asaka'] },
] as const

export const STREETS = [
  'Amir Temur',
  'Mustaqillik',
  'Navoiy',
  'Bobur',
  'Shota Rustaveli',
  'Buyuk Ipak Yoli',
  'Afrosiyob',
  'Bunyodkor',
  'Mirobod',
  'Oybek',
] as const

export const BANKS = [
  'NBU',
  'Kapitalbank',
  'Hamkorbank',
  'Ipoteka Bank',
  'Aloqabank',
  'Agrobank',
  'TBC Bank',
] as const

/** +998 9X XXX XX XX, stored without spaces as u-code's phone field does */
export const phoneNumber = (r: Random) =>
  `+998${r.pick(['90', '91', '93', '94', '97', '99', '88', '33'])}${r.digits(7)}`

export const isoDay = (d: Date) => d.toISOString().slice(0, 10)
/** A DATE field's value: the day at UTC midnight */
export const dateValue = (d: Date) => `${isoDay(d)}T00:00:00.000Z`
