import { useState } from 'react'
import { Dialog } from 'radix-ui'
import { backendMessage } from '@/shared/api/errors'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib/cn'
import { toIsoDate } from '@/shared/lib/date'
import { formatDate } from '@/shared/lib/format'
import { textToNumber } from '@/shared/lib/form'
import { toast } from '@/shared/lib/toast'
import { Button, Calendar, TextField } from '@/shared/ui'
import { menuItem } from '@/shared/ui/styles'
import { useCreateDividendMutation } from './api'

interface CreateDividendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: { id: string; name: string }
}

type Range = { from: string; to: string }

const iso = (d: Date) => toIsoDate(d.getFullYear(), d.getMonth(), d.getDate())
const shift = (d: Date, days: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)

/** The ranges u-code's dividend form offers, Monday-first weeks as in Uzbekistan. */
function presets(): { label: string; range: Range }[] {
  const today = new Date()
  const weekday = (today.getDay() + 6) % 7 // Monday = 0
  const monday = shift(today, -weekday)
  const y = today.getFullYear()
  const m = today.getMonth()
  return [
    { label: 'Today', range: { from: iso(today), to: iso(today) } },
    { label: 'Yesterday', range: { from: iso(shift(today, -1)), to: iso(shift(today, -1)) } },
    { label: 'This week', range: { from: iso(monday), to: iso(shift(monday, 6)) } },
    { label: 'Last week', range: { from: iso(shift(monday, -7)), to: iso(shift(monday, -1)) } },
    { label: 'This month', range: { from: toIsoDate(y, m, 1), to: iso(new Date(y, m + 1, 0)) } },
    { label: 'Last month', range: { from: toIsoDate(y, m - 1, 1), to: iso(new Date(y, m, 0)) } },
  ]
}

/** Start of the first day and end of the last, as the backend receives them */
const toTimestamps = ({ from, to }: Range) => {
  const [fy, fm, fd] = from.split('-').map(Number)
  const [ty, tm, td] = to.split('-').map(Number)
  return {
    from: new Date(fy, fm - 1, fd).toISOString(),
    to: new Date(ty, tm - 1, td, 23, 59, 59, 999).toISOString(),
  }
}

/**
 * "Create dividend" on a project, as u-code's Divident button: a period and the total amount
 * to distribute. The backend works out each investor's share (demo mode only, for now).
 */
export function CreateDividendDialog({ open, onOpenChange, project }: CreateDividendDialogProps) {
  const t = useT()
  const create = useCreateDividendMutation()
  const today = iso(new Date())
  const [range, setRange] = useState<Range>({ from: today, to: today })
  // A range being picked on the calendar: start chosen, end not yet
  const [draft, setDraft] = useState<string | null>(null)
  const [upTo, setUpTo] = useState('1')
  const [startingToday, setStartingToday] = useState('1')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string>()

  const reset = () => {
    setRange({ from: today, to: today })
    setDraft(null)
    setUpTo('1')
    setStartingToday('1')
    setAmount('')
    setError(undefined)
  }
  const close = (next: boolean) => {
    if (create.isPending) return
    onOpenChange(next)
    if (!next) reset()
  }

  const pickDay = (day: string) => {
    if (!draft) return setDraft(day)
    setRange(day < draft ? { from: day, to: draft } : { from: draft, to: day })
    setDraft(null)
  }
  const days = (text: string) => Math.max(1, Math.min(3650, Number(text) || 1))

  const submit = () => {
    const profit = textToNumber(amount)
    if (profit === null || profit <= 0) {
      setError(t('Enter an amount above zero'))
      return
    }
    create.mutate(
      { projectId: project.id, profit, ...toTimestamps(range) },
      {
        onSuccess: () => {
          toast.success(t('Dividend created'), t('It has been distributed among the investors.'))
          close(false)
        },
        onError: (e) =>
          toast.error(
            t("Couldn't create the dividend"),
            backendMessage(e) ?? t('Please try again.'),
          ),
      },
    )
  }

  const shown = draft ? { from: draft, to: null } : range
  const rangeText =
    range.from === range.to
      ? formatDate(range.from)
      : `${formatDate(range.from)} – ${formatDate(range.to)}`
  const numberInput =
    'num h-9 w-14 rounded-sm border border-transparent bg-surface-muted px-2 text-center outline-none focus:border-focus'

  return (
    <Dialog.Root open={open} onOpenChange={close}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-scrim" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100%-32px)] w-[calc(100%-32px)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-surface p-6 outline-none">
          <Dialog.Title className="text-lg font-semibold">{t('Create dividend')}</Dialog.Title>
          <Dialog.Description className="mt-1 text-fg-muted">{project.name}</Dialog.Description>

          <form
            noValidate
            className="mt-6 flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 flex w-full items-baseline justify-between gap-3 font-medium">
                <span>
                  {t('Period')} <span className="text-danger-text">*</span>
                </span>
                <span className="num font-normal text-fg-muted">{rangeText}</span>
              </legend>
              <div className="flex flex-col overflow-hidden rounded-sm border border-line sm:flex-row">
                <div className="flex flex-col gap-0.5 border-b border-line p-1 sm:w-64 sm:border-r sm:border-b-0">
                  {presets().map((p) => {
                    const active = !draft && range.from === p.range.from && range.to === p.range.to
                    return (
                      <button
                        key={p.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setRange(p.range)
                          setDraft(null)
                        }}
                        className={cn(
                          menuItem,
                          'w-full text-left hover:bg-surface-muted',
                          active && 'font-medium text-fg',
                        )}
                      >
                        {t(p.label)}
                      </button>
                    )
                  })}
                  <div className="mt-1 flex flex-col gap-1.5 border-t border-line px-2.5 pt-2 pb-1.5">
                    <label className="flex items-center gap-2">
                      <input
                        inputMode="numeric"
                        value={upTo}
                        aria-label={t('Number of days up to today')}
                        onChange={(e) => {
                          setUpTo(e.target.value.replace(/\D/g, ''))
                          setDraft(null)
                          setRange({
                            from: iso(shift(new Date(), 1 - days(e.target.value))),
                            to: today,
                          })
                        }}
                        className={numberInput}
                      />
                      <span className="text-fg-muted">{t('days up to today')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        inputMode="numeric"
                        value={startingToday}
                        aria-label={t('Number of days starting today')}
                        onChange={(e) => {
                          setStartingToday(e.target.value.replace(/\D/g, ''))
                          setDraft(null)
                          setRange({
                            from: today,
                            to: iso(shift(new Date(), days(e.target.value) - 1)),
                          })
                        }}
                        className={numberInput}
                      />
                      <span className="text-fg-muted">{t('days starting today')}</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center">
                  <Calendar range={shown} onChange={pickDay} />
                  <p className="px-4 pb-3 text-xs text-fg-muted">
                    {draft ? t('Now pick the end date') : t('Pick the start date')}
                  </p>
                </div>
              </div>
            </fieldset>

            <TextField
              label={t('Dividend amount')}
              required
              numeric
              value={amount}
              placeholder={t('Enter amount')}
              hint={t('The total amount to distribute among the project’s investors')}
              error={error}
              onChange={(e) => {
                setAmount(e.target.value)
                setError(undefined)
              }}
            />

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => close(false)} disabled={create.isPending}>
                {t('Cancel')}
              </Button>
              <Button type="submit" loading={create.isPending}>
                {t('Create dividend')}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
