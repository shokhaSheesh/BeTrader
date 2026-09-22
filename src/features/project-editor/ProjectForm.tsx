import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PROJECTS_TABLE, type Project } from '@/entities/project'
import { useProjectTypeOptions } from '@/entities/project-type'
import { useTableFields } from '@/shared/api/useTableFields'
import { numericText, numberToText } from '@/shared/lib/form'
import {
  DatePicker,
  Field,
  FormFooter,
  FormSection,
  MultiSelect,
  PageLoader,
  Select,
  SwitchField,
  TextField,
} from '@/shared/ui'

const schema = z.object({
  name_en: z.string().trim(),
  name_ru: z.string().trim(),
  name_uz: z.string().trim(),
  ticker: z.string().trim(),
  project_types_id: z.string(),
  currency: z.array(z.string()),
  status: z.array(z.string()),
  minimal_amount: numericText,
  deposit_maturity_month: numericText,
  dividend_period: numericText,
  end_time: z.string().nullable(),
  sale: z.boolean(),
  investment: z.boolean(),
  insurance: z.boolean(),
  insurance_amount: numericText,
})

/** Form values use the backend's field slugs, so the future POST/PUT body maps 1:1. */
export type ProjectFormValues = z.infer<typeof schema>

function projectFormValues(p?: Project): ProjectFormValues {
  return {
    name_en: p?.name ?? '',
    name_ru: p?.nameRu ?? '',
    name_uz: p?.nameUz ?? '',
    ticker: p?.ticker ?? '',
    project_types_id: p?.typeId ?? '',
    currency: p?.currencies ?? [],
    status: p?.statuses ?? [],
    minimal_amount: numberToText(p?.minimalAmount),
    deposit_maturity_month: numberToText(p?.maturityMonths),
    dividend_period: numberToText(p?.dividendAccrualPeriod),
    end_time: p?.endTime ?? null,
    sale: p?.holdWhileSelling ?? false,
    investment: p?.holdOnInvestment ?? false,
    insurance: p?.insurance ?? false,
    insurance_amount: numberToText(p?.insuranceAmount),
  }
}

interface ProjectFormProps {
  project?: Project
  submitLabel: string
  cancelTo: string
  onSubmit: (values: ProjectFormValues) => void
}

export function ProjectForm({ project, submitLabel, cancelTo, onSubmit }: ProjectFormProps) {
  const fields = useTableFields(PROJECTS_TABLE)
  const types = useProjectTypeOptions()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: projectFormValues(project),
  })

  if (fields.isPending) return <PageLoader label="Loading form…" />
  const label = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Names">
        <TextField label={label('name_en')} {...register('name_en')} />
        <TextField label={label('name_ru')} {...register('name_ru')} />
        <TextField label={label('name_uz')} {...register('name_uz')} />
        <TextField label={label('ticker')} {...register('ticker')} />
      </FormSection>

      <FormSection title="Investment terms">
        <Field label={label('project_types_id')} htmlFor="project_types_id">
          <Controller
            control={control}
            name="project_types_id"
            render={({ field }) => (
              <Select
                id="project_types_id"
                value={field.value || undefined}
                onChange={field.onChange}
                options={types.options}
                placeholder={types.isPending ? 'Loading…' : 'Select'}
              />
            )}
          />
        </Field>
        <Field label={label('currency')} htmlFor="currency">
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <MultiSelect
                id="currency"
                value={field.value}
                onChange={field.onChange}
                options={fields.fieldOptions('currency')}
              />
            )}
          />
        </Field>
        <TextField
          label={label('minimal_amount')}
          numeric
          error={errors.minimal_amount?.message}
          {...register('minimal_amount')}
        />
        <TextField
          label={label('deposit_maturity_month')}
          numeric
          error={errors.deposit_maturity_month?.message}
          {...register('deposit_maturity_month')}
        />
        <TextField
          label={label('dividend_period')}
          numeric
          error={errors.dividend_period?.message}
          {...register('dividend_period')}
        />
        <Field label={label('end_time')} htmlFor="end_time">
          <Controller
            control={control}
            name="end_time"
            render={({ field }) => (
              <DatePicker id="end_time" value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
      </FormSection>

      <FormSection title="Status and insurance">
        <Field label={label('status')} htmlFor="status">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <MultiSelect
                id="status"
                value={field.value}
                onChange={field.onChange}
                options={fields.fieldOptions('status')}
              />
            )}
          />
        </Field>
        <TextField
          label={label('insurance_amount')}
          numeric
          error={errors.insurance_amount?.message}
          {...register('insurance_amount')}
        />
        {(['sale', 'investment', 'insurance'] as const).map((name) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <SwitchField label={label(name)} checked={field.value} onChange={field.onChange} />
            )}
          />
        ))}
      </FormSection>

      <FormSection title={label('image')} description="Uploading images isn't connected yet.">
        {project?.imageUrl ? (
          <img
            src={project.imageUrl}
            alt=""
            className="size-24 rounded-sm bg-surface-muted object-cover"
          />
        ) : (
          <p className="text-fg-muted">No image.</p>
        )}
      </FormSection>

      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
