import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PROJECT_TYPES_TABLE, type ProjectType } from '@/entities/project-type'
import { useTableFields } from '@/shared/api/useTableFields'
import { numericText, numberToText } from '@/shared/lib/form'
import { Field, FormFooter, FormSection, MultiSelect, PageLoader, TextField } from '@/shared/ui'

const schema = z.object({
  name_en: z.string().trim(),
  name_ru: z.string().trim(),
  name_uz: z.string().trim(),
  from_percent: numericText,
  to_percent: numericText,
  calculate_dividend: z.array(z.string()),
})

export type ProjectTypeFormValues = z.infer<typeof schema>

function toValues(t?: ProjectType): ProjectTypeFormValues {
  return {
    name_en: t?.name ?? '',
    name_ru: t?.nameRu ?? '',
    name_uz: t?.nameUz ?? '',
    from_percent: numberToText(t?.fromPercent),
    to_percent: numberToText(t?.toPercent),
    calculate_dividend: t?.dividendCalculation ?? [],
  }
}

interface ProjectTypeFormProps {
  projectType?: ProjectType
  submitLabel: string
  cancelTo: string
  onSubmit: (values: ProjectTypeFormValues) => void
}

export function ProjectTypeForm({
  projectType,
  submitLabel,
  cancelTo,
  onSubmit,
}: ProjectTypeFormProps) {
  const fields = useTableFields(PROJECT_TYPES_TABLE)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toValues(projectType),
  })

  if (fields.isPending) return <PageLoader label="Loading form…" />
  const label = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Names">
        <TextField label={label('name_en')} {...register('name_en')} />
        <TextField label={label('name_ru')} {...register('name_ru')} />
        <TextField label={label('name_uz')} {...register('name_uz')} />
      </FormSection>
      <FormSection title="Yield and dividends">
        <TextField
          label={label('from_percent')}
          numeric
          error={errors.from_percent?.message}
          {...register('from_percent')}
        />
        <TextField
          label={label('to_percent')}
          numeric
          error={errors.to_percent?.message}
          {...register('to_percent')}
        />
        <Field label={label('calculate_dividend')} htmlFor="calculate_dividend">
          <Controller
            control={control}
            name="calculate_dividend"
            render={({ field }) => (
              <MultiSelect
                id="calculate_dividend"
                value={field.value}
                onChange={field.onChange}
                options={fields.fieldOptions('calculate_dividend')}
              />
            )}
          />
        </Field>
      </FormSection>
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
