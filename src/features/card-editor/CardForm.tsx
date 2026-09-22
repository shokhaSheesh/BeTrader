import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInvestorOptions } from '@/entities/investor'
import { CARDS_TABLE, type InvestorCard } from '@/entities/investor-card'
import { useTableFields } from '@/shared/api/useTableFields'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { investorLabel } from '@/shared/lib/format'
import {
  DatePicker,
  Field,
  FormFooter,
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

export type CardFormValues = z.infer<typeof schema>

interface CardFormProps {
  card?: InvestorCard
  submitLabel: string
  cancelTo: string
  onSubmit: (values: CardFormValues) => void
}

export function CardForm({ card, submitLabel, cancelTo, onSubmit }: CardFormProps) {
  const fields = useTableFields(CARDS_TABLE)
  const [search, setSearch] = useState('')
  const investors = useInvestorOptions(useDebouncedValue(search, 350))
  const [investorName, setInvestorName] = useState(
    card?.investorId ? investorLabel(card.investorName, card.investorPhone) : undefined,
  )
  const { register, control, handleSubmit } = useForm<CardFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      investors_id: card?.investorId ?? '',
      card_name: card?.cardName ?? '',
      masked_pan: card?.maskedPan ?? '',
      type: card?.type ?? '',
      expiry_date: card?.expiryDate ?? null,
    },
  })

  if (fields.isPending) return <PageLoader label="Loading form" />
  const L = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Card">
        <TextField label={L('masked_pan')} className="num" {...register('masked_pan')} />
        <TextField label={L('card_name')} {...register('card_name')} />
        <TextField
          label={L('type')}
          hint="Free text in the backend, e.g. Humo or Uzcard"
          {...register('type')}
        />
        <Field label={L('expiry_date')} htmlFor="expiry_date">
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
        <Field label={L('investors_id')} htmlFor="investors_id">
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
                placeholder="Search by name or phone"
              />
            )}
          />
        </Field>
      </FormSection>
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
