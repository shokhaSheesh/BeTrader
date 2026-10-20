import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInvestorOptions } from '@/entities/investor'
import { CARDS_TABLE, type InvestorCard } from '@/entities/investor-card'
import { useTableFields } from '@/shared/api/useTableFields'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { createDefaults, missingRequired, updateBody } from '@/shared/lib/form'
import { investorLabel } from '@/shared/lib/format'
import {
  DatePicker,
  Field,
  FormActions,
  FormSection,
  PageLoader,
  SearchSelect,
  TextField,
} from '@/shared/ui'

// `card_token` is not editable here: it's a payment token issued by the processor, never handled by the admin.
const schema = z.object({
  investors_id: z.string(),
  card_name: z.string().trim(),
  masked_pan: z.string().trim(),
  type: z.string().trim(),
  expiry_date: z.string().nullable(),
})

/** Form values use the backend's field slugs, so the POST/PUT body maps 1:1. */
export type CardFormValues = z.infer<typeof schema>

function toValues(card?: InvestorCard): CardFormValues {
  return {
    investors_id: card?.investorId ?? '',
    card_name: card?.cardName ?? '',
    masked_pan: card?.maskedPan ?? '',
    type: card?.type ?? '',
    expiry_date: card?.expiryDate ?? null,
  }
}

/** The record as the backend stores it: the owner's id or null. */
const toPayload = (values: CardFormValues): Record<string, unknown> => ({
  ...values,
  investors_id: values.investors_id || null,
})

interface CardFormProps {
  card?: InvestorCard
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New card: every field, plus the backend's defaults.
   * Existing card: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function CardForm(props: CardFormProps) {
  const fields = useTableFields(CARDS_TABLE)
  // The form starts from the schema's defaults and required flags, so it waits for the schema
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <CardFormBody {...props} fields={fields} />
}

function CardFormBody({
  card,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: CardFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const [search, setSearch] = useState('')
  const investors = useInvestorOptions(useDebouncedValue(search, 350))
  const [investorName, setInvestorName] = useState(
    card?.investorId ? investorLabel(card.investorName, card.investorPhone) : undefined,
  )
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<CardFormValues>({
    resolver: zodResolver(schema),
    defaultValues: card
      ? toValues(card)
      : { ...toValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: CardFormValues) => {
    const payload = toPayload(values)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing) setError(slug as keyof CardFormValues, { message: 'Required' })
      return
    }
    onSubmit(
      card
        ? updateBody(payload, dirtyFields, schemaFields)
        : { ...createDefaults(schemaFields), ...payload },
    )
  }

  const L = fields.fieldLabel
  const req = fields.isRequired

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormActions cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
      <FormSection title="Card">
        <TextField
          label={L('masked_pan')}
          required={req('masked_pan')}
          className="num"
          error={errors.masked_pan?.message}
          {...register('masked_pan')}
        />
        <TextField
          label={L('card_name')}
          required={req('card_name')}
          error={errors.card_name?.message}
          {...register('card_name')}
        />
        <TextField
          label={L('type')}
          required={req('type')}
          hint="Free text in the backend, e.g. Humo or Uzcard"
          error={errors.type?.message}
          {...register('type')}
        />
        <Field
          label={L('expiry_date')}
          htmlFor="expiry_date"
          required={req('expiry_date')}
          error={errors.expiry_date?.message}
        >
          <Controller
            control={control}
            name="expiry_date"
            render={({ field }) => (
              <DatePicker id="expiry_date" value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
      </FormSection>
      <FormSection title="Owner">
        <Field
          label={L('investors_id')}
          htmlFor="investors_id"
          required={req('investors_id')}
          error={errors.investors_id?.message}
        >
          <Controller
            control={control}
            name="investors_id"
            render={({ field }) => (
              <SearchSelect
                id="investors_id"
                value={field.value || null}
                valueLabel={investorName}
                onChange={(o) => {
                  field.onChange(o.value)
                  setInvestorName(o.label)
                }}
                options={investors.options}
                search={search}
                onSearchChange={setSearch}
                loading={investors.isFetching}
                paging={investors.paging}
                placeholder="Search by name or phone"
              />
            )}
          />
        </Field>
      </FormSection>
    </form>
  )
}

/** Only the defaults that are form fields; the rest (e.g. created_time) go in on submit. */
function pickFormKeys(defaults: Record<string, unknown>): Partial<CardFormValues> {
  const keys = Object.keys(toValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
