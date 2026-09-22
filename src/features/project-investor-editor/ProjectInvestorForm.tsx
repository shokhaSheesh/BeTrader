import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInvestorOptions } from '@/entities/investor'
import { useProjectOptions } from '@/entities/project'
import { PROJECT_INVESTORS_TABLE, type ProjectInvestor } from '@/entities/project-investor'
import { useTableFields } from '@/shared/api/useTableFields'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { numericText, numberToText } from '@/shared/lib/form'
import { formatPhone } from '@/shared/lib/format'
import {
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
})

export type ProjectInvestorFormValues = z.infer<typeof schema>

interface ProjectInvestorFormProps {
  record?: ProjectInvestor
  submitLabel: string
  cancelTo: string
  onSubmit: (values: ProjectInvestorFormValues) => void
}

export function ProjectInvestorForm({
  record,
  submitLabel,
  cancelTo,
  onSubmit,
}: ProjectInvestorFormProps) {
  const fields = useTableFields(PROJECT_INVESTORS_TABLE)
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
    formState: { errors },
  } = useForm<ProjectInvestorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      investors_id: record?.investorId ?? '',
      projects_id: record?.projectId ?? '',
      investment: numberToText(record?.investment),
      dividend: numberToText(record?.interestIncome),
    },
  })

  if (fields.isPending) return <PageLoader label="Loading form…" />
  const label = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Investment">
        <Field label={label('investors_id')} htmlFor="investors_id">
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
        <Field label={label('projects_id')} htmlFor="projects_id">
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
          numeric
          error={errors.investment?.message}
          {...register('investment')}
        />
        <TextField
          label={label('dividend')}
          numeric
          error={errors.dividend?.message}
          {...register('dividend')}
        />
      </FormSection>
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
