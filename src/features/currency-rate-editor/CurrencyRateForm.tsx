import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CURRENCY_RATES_TABLE, type CurrencyRate } from '@/entities/currency-rate'
import { useTableFields } from '@/shared/api/useTableFields'
import {
  createDefaults,
  missingRequired,
  numericText,
  numberToText,
  textToNumber,
  updateBody,
} from '@/shared/lib/form'
import { DatePicker, Field, FormActions, FormSection, PageLoader, TextField } from '@/shared/ui'

// "Amount with percent" is a stored backend field: entered as-is, never calculated here (DESIGN.md §0).
const schema = z.object({
  date: z.string().nullable(),
  amount: numericText,
  percent: numericText,
  amount_with_percent: numericText,
})

/** Form values use the backend's field slugs, so the POST/PUT body maps 1:1. */
export type CurrencyRateFormValues = z.infer<typeof schema>

const NUMBERS = ['amount', 'percent', 'amount_with_percent'] as const

function toValues(rate?: CurrencyRate): CurrencyRateFormValues {
  return {
    date: rate?.date ?? null,
    amount: numberToText(rate?.amount),
    percent: numberToText(rate?.percent),
    amount_with_percent: numberToText(rate?.amountWithPercent),
  }
}

/** The record as the backend stores it: numbers as numbers, cleared ones as null. */
function toPayload(values: CurrencyRateFormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = { date: values.date }
  for (const name of NUMBERS) payload[name] = textToNumber(values[name])
  return payload
}

interface CurrencyRateFormProps {
  rate?: CurrencyRate
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New rate: every field, plus the backend's defaults.
   * Existing rate: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function CurrencyRateForm(props: CurrencyRateFormProps) {
  const fields = useTableFields(CURRENCY_RATES_TABLE)
  // The form starts from the schema's defaults and required flags, so it waits for the schema
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <CurrencyRateFormBody {...props} fields={fields} />
}

function CurrencyRateFormBody({
  rate,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: CurrencyRateFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<CurrencyRateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: rate
      ? toValues(rate)
      : { ...toValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: CurrencyRateFormValues) => {
    const payload = toPayload(values)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing)
        setError(slug as keyof CurrencyRateFormValues, { message: 'Required' })
      return
    }
    onSubmit(
      rate
        ? updateBody(payload, dirtyFields, schemaFields)
        : { ...createDefaults(schemaFields), ...payload },
    )
  }

  const L = fields.fieldLabel
  const req = fields.isRequired

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormActions cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
      <FormSection title="Rate">
        <Field label={L('date')} htmlFor="date" required={req('date')} error={errors.date?.message}>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker id="date" value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
        {NUMBERS.map((name) => (
          <TextField
            key={name}
            label={L(name)}
            required={req(name)}
            numeric
            error={errors[name]?.message}
            {...register(name)}
          />
        ))}
      </FormSection>
    </form>
  )
}

/** Only the defaults that are form fields; the rest go in on submit. */
function pickFormKeys(defaults: Record<string, unknown>): Partial<CurrencyRateFormValues> {
  const keys = Object.keys(toValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
