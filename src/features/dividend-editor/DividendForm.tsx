import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DIVIDENDS_TABLE, type Dividend } from '@/entities/dividend'
import { useProjectOptions } from '@/entities/project'
import { InvestorPickerField } from '@/features/investor-filter'
import { useTableFields } from '@/shared/api/useTableFields'
import { numericText, numberToText } from '@/shared/lib/form'
import { investorLabel } from '@/shared/lib/format'
import {
  DatePicker,
  Field,
  FormFooter,
  FormSection,
  MultiSelect,
  PageLoader,
  Select,
  TextField,
} from '@/shared/ui'

const schema = z.object({
  investors_id: z.string(),
  projects_id: z.string(),
  type: z.array(z.string()),
  percent: numericText,
  days: numericText,
  period_days: numericText,
  order_amount: numericText,
  amount_uzs: numericText,
  amount_usd: numericText,
  from_date: z.string().nullable(),
  to_date: z.string().nullable(),
})

export type DividendFormValues = z.infer<typeof schema>
const NUMBERS = [
  'percent',
  'days',
  'period_days',
  'order_amount',
  'amount_uzs',
  'amount_usd',
] as const

interface DividendFormProps {
  dividend?: Dividend
  submitLabel: string
  cancelTo: string
  onSubmit: (values: DividendFormValues) => void
}

export function DividendForm({ dividend: d, submitLabel, cancelTo, onSubmit }: DividendFormProps) {
  const fields = useTableFields(DIVIDENDS_TABLE)
  const projects = useProjectOptions()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DividendFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      investors_id: d?.investorId ?? '',
      projects_id: d?.projectId ?? '',
      type: d?.type ?? [],
      percent: numberToText(d?.percent),
      days: numberToText(d?.days),
      period_days: numberToText(d?.periodDays),
      order_amount: numberToText(d?.orderAmount),
      amount_uzs: numberToText(d?.amountUzs),
      amount_usd: numberToText(d?.amountUsd),
      from_date: d?.fromDate?.slice(0, 10) ?? null,
      to_date: d?.toDate?.slice(0, 10) ?? null,
    },
  })

  if (fields.isPending) return <PageLoader label="Loading form" />
  const L = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Who and what">
        <Controller
          control={control}
          name="investors_id"
          render={({ field }) => (
            <InvestorPickerField
              label={L('investors_id')}
              value={field.value}
              onChange={field.onChange}
              initialLabel={
                d?.investorId ? investorLabel(d.investorName, d.investorPhone) : undefined
              }
            />
          )}
        />
        <Field label={L('projects_id')} htmlFor="projects_id">
          <Controller
            control={control}
            name="projects_id"
            render={({ field }) => (
              <Select
                id="projects_id"
                value={field.value || undefined}
                onChange={field.onChange}
                options={projects.options}
              />
            )}
          />
        </Field>
        <Field label={L('type')} htmlFor="type">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <MultiSelect
                id="type"
                value={field.value}
                onChange={field.onChange}
                options={fields.fieldOptions('type')}
              />
            )}
          />
        </Field>
      </FormSection>
      <FormSection title="Period">
        {(['from_date', 'to_date'] as const).map((name) => (
          <Field key={name} label={L(name)} htmlFor={name}>
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <DatePicker id={name} value={field.value} onChange={field.onChange} />
              )}
            />
          </Field>
        ))}
      </FormSection>
      <FormSection title="Amounts">
        {NUMBERS.map((name) => (
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
