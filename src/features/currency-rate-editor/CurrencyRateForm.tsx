import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CURRENCY_RATES_TABLE, type CurrencyRate } from '@/entities/currency-rate'
import { useTableFields } from '@/shared/api/useTableFields'
import { numericText, numberToText } from '@/shared/lib/form'
import { DatePicker, Field, FormFooter, FormSection, PageLoader, TextField } from '@/shared/ui'

// "Amount with percent" is a stored backend field: entered as-is, never calculated here (DESIGN.md §0).
const schema = z.object({
  date: z.string().nullable(),
  amount: numericText,
  percent: numericText,
  amount_with_percent: numericText,
})

export type CurrencyRateFormValues = z.infer<typeof schema>

interface CurrencyRateFormProps {
  rate?: CurrencyRate
  submitLabel: string
  cancelTo: string
  onSubmit: (values: CurrencyRateFormValues) => void
}

export function CurrencyRateForm({ rate, submitLabel, cancelTo, onSubmit }: CurrencyRateFormProps) {
  const fields = useTableFields(CURRENCY_RATES_TABLE)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CurrencyRateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: rate?.date ?? null,
      amount: numberToText(rate?.amount),
      percent: numberToText(rate?.percent),
      amount_with_percent: numberToText(rate?.amountWithPercent),
    },
  })

  if (fields.isPending) return <PageLoader label="Loading form" />
  const L = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Rate">
        <Field label={L('date')} htmlFor="date">
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker id="date" value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
        {(['amount', 'percent', 'amount_with_percent'] as const).map((name) => (
          <TextField
            key={name}
            label={L(name)}
            numeric
            error={errors[name]?.message}
            {...register(name)}
          />
        ))}
      </FormSection>
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
