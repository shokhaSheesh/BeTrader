import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInvestorOptions } from '@/entities/investor'
import { useProjectOptions } from '@/entities/project'
import { PROJECT_INVESTORS_TABLE, type ProjectInvestor } from '@/entities/project-investor'
import { useTableFields } from '@/shared/api/useTableFields'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import {
  createDefaults,
  missingRequired,
  numericText,
  numberToText,
  textToNumber,
  updateBody,
} from '@/shared/lib/form'
import { formatPhone } from '@/shared/lib/format'
import {
  DateTimePicker,
  Field,
  FormFooter,
  FormSection,
  PageLoader,
  SearchSelect,
  Select,
  TextField,
} from '@/shared/ui'

const schema = z.object({
  investors_id: z.string(),
  projects_id: z.string(),
  investment: numericText,
  dividend: numericText,
  // Only in the Test environment's schema so far: shown when the backend has them
  investment_uzs: numericText,
  dividend_uzs: numericText,
  status: z.string().trim(),
  closing_date: z.string().nullable(),
})

/** Form values use the backend's field slugs, so the POST/PUT body maps 1:1. */
export type ProjectInvestorFormValues = z.infer<typeof schema>

function toValues(record?: ProjectInvestor): ProjectInvestorFormValues {
  return {
    investors_id: record?.investorId ?? '',
    projects_id: record?.projectId ?? '',
    investment: numberToText(record?.investment),
    dividend: numberToText(record?.interestIncome),
    investment_uzs: numberToText(record?.investmentUzs),
    dividend_uzs: numberToText(record?.interestIncomeUzs),
    status: record?.status ?? '',
    closing_date: record?.closingDate ?? null,
  }
}

/**
 * The record as the backend stores it: ids or null, amounts as numbers. Only fields the
 * backend's schema has are sent, so the Test-only ones never reach an environment without them.
 */
function toPayload(
  values: ProjectInvestorFormValues,
  schemaFields: { slug: string }[],
): Record<string, unknown> {
  const all: Record<string, unknown> = {
    investors_id: values.investors_id || null,
    projects_id: values.projects_id || null,
    investment: textToNumber(values.investment),
    dividend: textToNumber(values.dividend),
    investment_uzs: textToNumber(values.investment_uzs),
    dividend_uzs: textToNumber(values.dividend_uzs),
    status: values.status || null,
    closing_date: values.closing_date,
  }
  const known = new Set(schemaFields.map((f) => f.slug))
  return Object.fromEntries(Object.entries(all).filter(([slug]) => known.has(slug)))
}

interface ProjectInvestorFormProps {
  record?: ProjectInvestor
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New record: every field, plus the backend's defaults.
   * Existing record: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function ProjectInvestorForm(props: ProjectInvestorFormProps) {
  const fields = useTableFields(PROJECT_INVESTORS_TABLE)
  // The form starts from the schema's defaults and required flags, so it waits for the schema
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <ProjectInvestorFormBody {...props} fields={fields} />
}

function ProjectInvestorFormBody({
  record,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: ProjectInvestorFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const projects = useProjectOptions()
  const [investorSearch, setInvestorSearch] = useState('')
  const investors = useInvestorOptions(useDebouncedValue(investorSearch, 350))
  const [investorLabel, setInvestorLabel] = useState(
    record?.investorName
      ? [record.investorName, record.investorPhone && formatPhone(record.investorPhone)]
          .filter(Boolean)
          .join(' · ')
      : undefined,
  )

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<ProjectInvestorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: record
      ? toValues(record)
      : { ...toValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: ProjectInvestorFormValues) => {
    const payload = toPayload(values, schemaFields)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing)
        setError(slug as keyof ProjectInvestorFormValues, { message: 'Required' })
      return
    }
    onSubmit(
      record
        ? updateBody(payload, dirtyFields, schemaFields)
        : { ...createDefaults(schemaFields), ...payload },
    )
  }

  const label = fields.fieldLabel
  const required = fields.isRequired
  const has = (slug: string) => schemaFields.some((f) => f.slug === slug)

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormSection title="Investment">
        <Field
          label={label('investors_id')}
          htmlFor="investors_id"
          required={required('investors_id')}
          error={errors.investors_id?.message}
        >
          <Controller
            control={control}
            name="investors_id"
            render={({ field }) => (
              <SearchSelect
                id="investors_id"
                value={field.value || null}
                valueLabel={investorLabel}
                onChange={(o) => {
                  field.onChange(o.value)
                  setInvestorLabel(o.label)
                }}
                options={investors.options}
                search={investorSearch}
                onSearchChange={setInvestorSearch}
                loading={investors.isFetching}
                placeholder="Search by name or phone"
              />
            )}
          />
        </Field>
        <Field
          label={label('projects_id')}
          htmlFor="projects_id"
          required={required('projects_id')}
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
                placeholder={projects.isPending ? 'Loading…' : 'Select'}
              />
            )}
          />
        </Field>
        <TextField
          label={label('investment')}
          required={required('investment')}
          numeric
          error={errors.investment?.message}
          {...register('investment')}
        />
        <TextField
          label={label('dividend')}
          required={required('dividend')}
          numeric
          error={errors.dividend?.message}
          {...register('dividend')}
        />
        {has('investment_uzs') && (
          <TextField
            label={label('investment_uzs')}
            required={required('investment_uzs')}
            numeric
            error={errors.investment_uzs?.message}
            {...register('investment_uzs')}
          />
        )}
        {has('dividend_uzs') && (
          <TextField
            label={label('dividend_uzs')}
            required={required('dividend_uzs')}
            numeric
            error={errors.dividend_uzs?.message}
            {...register('dividend_uzs')}
          />
        )}
      </FormSection>
      {(has('status') || has('closing_date')) && (
        <FormSection title="Status">
          {has('status') && (
            <TextField
              label={label('status')}
              required={required('status')}
              error={errors.status?.message}
              {...register('status')}
            />
          )}
          {has('closing_date') && (
            <Field
              label={label('closing_date')}
              htmlFor="closing_date"
              required={required('closing_date')}
              error={errors.closing_date?.message}
            >
              <Controller
                control={control}
                name="closing_date"
                render={({ field }) => (
                  <DateTimePicker id="closing_date" value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          )}
        </FormSection>
      )}
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
    </form>
  )
}

/** Only the defaults that are form fields; the rest go in on submit. */
function pickFormKeys(defaults: Record<string, unknown>): Partial<ProjectInvestorFormValues> {
  const keys = Object.keys(toValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
