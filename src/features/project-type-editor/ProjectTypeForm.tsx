import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PROJECT_TYPES_TABLE, type ProjectType } from '@/entities/project-type'
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

const schema = z.object({
  name_en: z.string().trim(),
  name_ru: z.string().trim(),
  name_uz: z.string().trim(),
  from_percent: numericText,
  to_percent: numericText,
  calculate_dividend: z.array(z.string()),
})

/** Form values use the backend's field slugs, so the POST/PUT body maps 1:1. */
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

/** The record as the backend stores it: percents as numbers, cleared ones as null. */
function toPayload(values: ProjectTypeFormValues): Record<string, unknown> {
  return {
    ...values,
    from_percent: textToNumber(values.from_percent),
    to_percent: textToNumber(values.to_percent),
  }
}

interface ProjectTypeFormProps {
  projectType?: ProjectType
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New type: every field, plus the backend's defaults.
   * Existing type: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function ProjectTypeForm(props: ProjectTypeFormProps) {
  const fields = useTableFields(PROJECT_TYPES_TABLE)
  // The form starts from the schema's defaults and required flags, so it waits for the schema
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <ProjectTypeFormBody {...props} fields={fields} />
}

function ProjectTypeFormBody({
  projectType,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: ProjectTypeFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<ProjectTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: projectType
      ? toValues(projectType)
      : { ...toValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: ProjectTypeFormValues) => {
    const payload = toPayload(values)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing)
        setError(slug as keyof ProjectTypeFormValues, { message: 'Required' })
      return
    }
    onSubmit(
      projectType
        ? updateBody(payload, dirtyFields, schemaFields)
        : { ...createDefaults(schemaFields), ...payload },
    )
  }

  const label = fields.fieldLabel
  const required = fields.isRequired

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormSection title="Names">
        <TextField
          label={label('name_en')}
          required={required('name_en')}
          error={errors.name_en?.message}
          {...register('name_en')}
        />
        <TextField
          label={label('name_ru')}
          required={required('name_ru')}
          error={errors.name_ru?.message}
          {...register('name_ru')}
        />
        <TextField
          label={label('name_uz')}
          required={required('name_uz')}
          error={errors.name_uz?.message}
          {...register('name_uz')}
        />
      </FormSection>
      <FormSection title="Yield and dividends">
        <TextField
          label={label('from_percent')}
          required={required('from_percent')}
          numeric
          error={errors.from_percent?.message}
          {...register('from_percent')}
        />
        <TextField
          label={label('to_percent')}
          required={required('to_percent')}
          numeric
          error={errors.to_percent?.message}
          {...register('to_percent')}
        />
        <Field
          label={label('calculate_dividend')}
          htmlFor="calculate_dividend"
          required={required('calculate_dividend')}
          error={errors.calculate_dividend?.message}
        >
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
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
    </form>
  )
}

/** Only the defaults that are form fields; the rest go in on submit. */
function pickFormKeys(defaults: Record<string, unknown>): Partial<ProjectTypeFormValues> {
  const keys = Object.keys(toValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
