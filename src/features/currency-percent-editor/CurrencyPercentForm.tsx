import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CURRENCY_PERCENT_TABLE, type CurrencyPercent } from '@/entities/currency-percent'
import { useTableFields } from '@/shared/api/useTableFields'
import {
  createDefaults,
  missingRequired,
  numericText,
  numberToText,
  textToNumber,
  updateBody,
} from '@/shared/lib/form'
import { Field, FormFooter, FormSection, MultiSelect, PageLoader, TextField } from '@/shared/ui'

const schema = z.object({ type: z.array(z.string()), percent: numericText })

/**
 * The backend's Table actions function reads the record's type on every edit and delete; without
 * it the edit is saved but answered 500 "type not found" (verified in Test, 2026-10-20).
 */
const CURRENCY_PERCENT_CONTEXT = ['type'] as const

/** Form values use the backend's field slugs, so the POST/PUT body maps 1:1. */
export type CurrencyPercentFormValues = z.infer<typeof schema>

const toValues = (item?: CurrencyPercent): CurrencyPercentFormValues => ({
  type: item?.type ?? [],
  percent: numberToText(item?.percent),
})

/** The record as the backend stores it: the percent as a number, cleared as null. */
const toPayload = (values: CurrencyPercentFormValues): Record<string, unknown> => ({
  type: values.type,
  percent: textToNumber(values.percent),
})

interface CurrencyPercentFormProps {
  item?: CurrencyPercent
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New percent: every field, plus the backend's defaults.
   * Existing percent: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function CurrencyPercentForm(props: CurrencyPercentFormProps) {
  const fields = useTableFields(CURRENCY_PERCENT_TABLE)
  // The form starts from the schema's defaults and required flags, so it waits for the schema
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <CurrencyPercentFormBody {...props} fields={fields} />
}

function CurrencyPercentFormBody({
  item,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: CurrencyPercentFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<CurrencyPercentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? toValues(item)
      : { ...toValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: CurrencyPercentFormValues) => {
    const payload = toPayload(values)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing)
        setError(slug as keyof CurrencyPercentFormValues, { message: 'Required' })
      return
    }
    onSubmit(
      item
        ? updateBody(payload, dirtyFields, schemaFields, CURRENCY_PERCENT_CONTEXT)
        : { ...createDefaults(schemaFields), ...payload },
    )
  }

  const L = fields.fieldLabel
  const req = fields.isRequired

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormSection title="Percent">
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
        <TextField
          label={L('percent')}
          required={req('percent')}
          numeric
          error={errors.percent?.message}
          {...register('percent')}
        />
      </FormSection>
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
    </form>
  )
}

/** Only the defaults that are form fields; the rest go in on submit. */
function pickFormKeys(defaults: Record<string, unknown>): Partial<CurrencyPercentFormValues> {
  const keys = Object.keys(toValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
