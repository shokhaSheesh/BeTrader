import { NiyatMark } from '@/shared/ui/logo/NiyatMark'

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <NiyatMark size={32} />
      <span className="text-base font-semibold text-on-inverse">Niyat</span>
    </div>
  )
}
