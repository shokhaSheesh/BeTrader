import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DIVIDENDS_TABLE, type Dividend } from '@/entities/dividend'
import { useProjectOptions } from '@/entities/project'
import { InvestorPickerField } from '@/entities/investor'
import { useTableFields } from '@/shared/api/useTableFields'
import {
  createDefaults,
  missingRequired,
  numericText,
  numberToText,
  textToNumber,
  updateBody,
} from '@/shared/lib/form'
import { investorLabel } from '@/shared/lib/format'
import {
  DateTimePicker,
  Field,
  FormActions,
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
  // Only the Test environment's schema has these so far: shown when the backend has them
  nominal_amount_usd: numericText,
  remaining_amount_usd: numericText,
  from_date: z.string().nullable(),
  to_date: z.string().nullable(),
})

/** Form values use the backend's field slugs, so the POST/PUT body maps 1:1. */
export type DividendFormValues = z.infer<typeof schema>

const NUMBERS = [
  'percent',
  'days',
  'period_days',
  'order_amount',
  'amount_uzs',
  'amount_usd',
  'nominal_amount_usd',
  'remaining_amount_usd',
] as const

function toValues(d?: Dividend): DividendFormValues {
  return {
    investors_id: d?.investorId ?? '',
    projects_id: d?.projectId ?? '',
    type: d?.type ?? [],
    percent: numberToText(d?.percent),
    days: numberToText(d?.days),
    period_days: numberToText(d?.periodDays),
    order_amount: numberToText(d?.orderAmount),
    amount_uzs: numberToText(d?.amountUzs),
    amount_usd: numberToText(d?.amountUsd),
    nominal_amount_usd: numberToText(d?.nominalAmountUsd),
    remaining_amount_usd: numberToText(d?.remainingAmountUsd),
    from_date: d?.fromDate ?? null,
    to_date: d?.toDate ?? null,
  }
}

/**
 * The record as the backend stores it: ids or null, numbers as numbers. Only fields the
 * backend's schema has are sent, so the Test-only ones never reach an environment without them.
 */
function toPayload(values: DividendFormValues, known: Set<string>): Record<string, unknown> {
  const all: Record<string, unknown> = {
    ...values,
    investors_id: values.investors_id || null,
    projects_id: values.projects_id || null,
  }
  for (const name of NUMBERS) all[name] = textToNumber(values[name])
  return Object.fromEntries(Object.entries(all).filter(([slug]) => known.has(slug)))
}

interface DividendFormProps {
  dividend?: Dividend
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New dividend: every field, plus the backend's defaults.
   * Existing dividend: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function DividendForm(props: DividendFormProps) {
  const fields = useTableFields(DIVIDENDS_TABLE)
  // The form follows the schema (which fields exist, defaults, required), so it waits for it
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <DividendFormBody {...props} fields={fields} />
}

function DividendFormBody({
  dividend: d,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: DividendFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const known = new Set(schemaFields.map((f) => f.slug))
  const projects = useProjectOptions()
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<DividendFormValues>({
    resolver: zodResolver(schema),
    defaultValues: d
      ? toValues(d)
      : { ...toValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: DividendFormValues) => {
    const payload = toPayload(values, known)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing)
        setError(slug as keyof DividendFormValues, { message: 'Required' })
      return
    }
    onSubmit(
      d
        ? updateBody(payload, dirtyFields, schemaFields)
        : { ...createDefaults(schemaFields), ...payload },
    )
  }

  const L = fields.fieldLabel
  const req = fields.isRequired

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormActions cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
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
        <Field
          label={L('projects_id')}
          htmlFor="projects_id"
          required={req('projects_id')}
          error={errors.projects_id?.message}
        >
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
        <Field label={L('type')} htmlFor="type" required={req('type')} error={errors.type?.message}>
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
          <Field
            key={name}
            label={L(name)}
            htmlFor={name}
            required={req(name)}
            error={errors[name]?.message}
          >
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <DateTimePicker id={name} value={field.value} onChange={field.onChange} />
              )}
            />
          </Field>
        ))}
      </FormSection>
      <FormSection title="Amounts">
        {NUMBERS.filter((name) => known.has(name)).map((name) => (
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
function pickFormKeys(defaults: Record<string, unknown>): Partial<DividendFormValues> {
  const keys = Object.keys(toValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
