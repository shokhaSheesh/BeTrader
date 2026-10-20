import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PROJECTS_TABLE, type Project } from '@/entities/project'
import { useProjectTypeOptions } from '@/entities/project-type'
import { backendMessage } from '@/shared/api/errors'
import { uploadFile } from '@/shared/api/ucode'
import { useTableFields } from '@/shared/api/useTableFields'
import {
  createDefaults,
  numericText,
  numberToText,
  textToNumber,
  updateBody,
} from '@/shared/lib/form'
import { toast } from '@/shared/lib/toast'
import {
  DatePicker,
  Field,
  FormActions,
  FormSection,
  ImageField,
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
  board_order: numericText,
  image: z.string().nullable(),
})

/** Form values use the backend's field slugs, so the POST/PUT body maps 1:1. */
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
    board_order: numberToText(p?.boardOrder),
    image: p?.imageUrl ?? null,
  }
}

const NUMERIC = [
  'minimal_amount',
  'deposit_maturity_month',
  'dividend_period',
  'insurance_amount',
  'board_order',
] as const

/** The record as the backend stores it: numbers as numbers, cleared fields as null. */
function toPayload(values: ProjectFormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    ...values,
    project_types_id: values.project_types_id || null,
  }
  for (const name of NUMERIC) payload[name] = textToNumber(values[name])
  return payload
}

interface ProjectFormProps {
  project?: Project
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New project: every field, plus the backend's defaults.
   * Existing project: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function ProjectForm(props: ProjectFormProps) {
  const fields = useTableFields(PROJECTS_TABLE)
  // The form starts from the schema's defaults, so it waits for the schema
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <ProjectFormBody {...props} fields={fields} />
}

function ProjectFormBody({
  project,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: ProjectFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const types = useProjectTypeOptions()
  const schemaFields = fields.data ?? []
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    // A new project starts with what the backend defines as defaults (e.g. currency USD)
    defaultValues: project
      ? projectFormValues(project)
      : { ...projectFormValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: ProjectFormValues) =>
    onSubmit(
      project
        ? updateBody(toPayload(values), dirtyFields, schemaFields)
        : { ...createDefaults(schemaFields), ...toPayload(values) },
    )

  const label = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormActions cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
      <FormSection title="Names">
        <TextField label={label('name_en')} {...register('name_en')} />
        <TextField label={label('name_ru')} {...register('name_ru')} />
        <TextField label={label('name_uz')} {...register('name_uz')} />
        <TextField label={label('ticker')} {...register('ticker')} />
        <TextField
          label={label('board_order')}
          numeric
          error={errors.board_order?.message}
          {...register('board_order')}
        />
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

      <FormSection title={label('image')}>
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <ImageField
              id="image"
              value={field.value}
              onChange={field.onChange}
              upload={(file) =>
                uploadFile(file, schemaFields.find((f) => f.slug === 'image')?.folder)
              }
              onError={(error) =>
                toast.error(
                  "Couldn't upload the image",
                  backendMessage(error) ?? 'Please try again.',
                )
              }
            />
          )}
        />
      </FormSection>
    </form>
  )
}

/** Only the defaults that are form fields; the rest (e.g. created_time) go in on submit. */
function pickFormKeys(defaults: Record<string, unknown>): Partial<ProjectFormValues> {
  const keys = Object.keys(projectFormValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
