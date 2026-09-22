import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CURRENCY_PERCENT_TABLE, type CurrencyPercent } from '@/entities/currency-percent'
import { useTableFields } from '@/shared/api/useTableFields'
import { numericText, numberToText } from '@/shared/lib/form'
import { Field, FormFooter, FormSection, MultiSelect, PageLoader, TextField } from '@/shared/ui'

const schema = z.object({ type: z.array(z.string()), percent: numericText })

export type CurrencyPercentFormValues = z.infer<typeof schema>

interface CurrencyPercentFormProps {
  item?: CurrencyPercent
  submitLabel: string
  cancelTo: string
  onSubmit: (values: CurrencyPercentFormValues) => void
}

export function CurrencyPercentForm({
  item,
  submitLabel,
  cancelTo,
  onSubmit,
}: CurrencyPercentFormProps) {
  const fields = useTableFields(CURRENCY_PERCENT_TABLE)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CurrencyPercentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: item?.type ?? [], percent: numberToText(item?.percent) },
  })

  if (fields.isPending) return <PageLoader label="Loading form" />
  const L = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Percent">
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
        <TextField
          label={L('percent')}
          numeric
          error={errors.percent?.message}
          {...register('percent')}
        />
      </FormSection>
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
