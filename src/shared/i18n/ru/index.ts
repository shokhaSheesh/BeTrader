// Russian dictionary: every other file in this folder default-exports a part of it
// (English text → Russian), merged here. One file per area keeps parallel work conflict-free.
const parts = import.meta.glob<Record<string, string>>(['./*.ts', '!./index.ts'], {
  eager: true,
  import: 'default',
})

export const RU: Record<string, string> = Object.assign({}, ...Object.values(parts))
