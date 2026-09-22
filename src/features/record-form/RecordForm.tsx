import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { InvestorPickerField } from '@/entities/investor'
import { usePolicyTypeOptions } from '@/entities/policy-type'
import { useTableFields } from '@/shared/api/useTableFields'
import { numericText } from '@/shared/lib/form'
import {
  DatePicker,
  Field,
  FormFooter,
  FormSection,
  MultiSelect,
  PageLoader,
  Select,
  SwitchField,
  TextArea,
  TextField,
} from '@/shared/ui'

/**
 * Declarative form for simple tables: each field is a backend slug plus a kind.
 * Labels come from the backend schema (DESIGN.md §0); values keep the backend's slugs,
 * so the future POST/PUT body maps 1:1. Richer tables (projects, orders…) have their own forms.
 */
export type FieldKind =
  | 'text'
  | 'code'
  | 'number'
  | 'date'
  | 'policyType'
  | 'investor'
  | 'longText'
  | 'switch'
  | 'options'

export interface FieldSpec {
  name: string
  kind: FieldKind
  hint?: string
}

export interface FormSpec {
  table: string
  sections: { title: string; description?: string; fields: FieldSpec[] }[]
}

/** Text, numbers-as-text and dates are strings; switches are booleans; options are string arrays. */
export type RecordFormValues = Record<string, string | boolean | string[] | null>

interface RecordFormProps {
  spec: FormSpec
  /** Current values by slug (numbers as text); omit for a create form */
  defaults?: RecordFormValues
  /** Display labels for linked records' current values, by slug (e.g. the investor's name) */
  initialLabels?: Record<string, string | undefined>
  submitLabel: string
  cancelTo: string
  onSubmit: (values: RecordFormValues) => void
}

function schemaFor(spec: FormSpec) {
  type Value = RecordFormValues[string]
  const shape: Record<string, z.ZodType<Value, Value>> = {}
  for (const f of spec.sections.flatMap((s) => s.fields)) {
    shape[f.name] =
      f.kind === 'number'
        ? numericText
        : f.kind === 'date'
          ? z.string().nullable()
          : f.kind === 'switch'
            ? z.boolean()
            : f.kind === 'options'
              ? z.array(z.string())
              : z.string().trim()
  }
  return z.object(shape)
}

export function RecordForm({
  spec,
  defaults,
  initialLabels,
  submitLabel,
  cancelTo,
  onSubmit,
}: RecordFormProps) {
  const fields = useTableFields(spec.table)
  const policyTypes = usePolicyTypeOptions()
  const all = spec.sections.flatMap((s) => s.fields)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(schemaFor(spec)),
    defaultValues: Object.fromEntries(
      all.map((f) => [f.name, defaults?.[f.name] ?? (f.kind === 'date' ? null : '')]),
    ),
  })

  if (fields.isPending) return <PageLoader label="Loading form" />
  const L = fields.fieldLabel
  const error = (name: string) => errors[name]?.message as string | undefined

  const render = (f: FieldSpec) => {
    switch (f.kind) {
      case 'text':
      case 'code':
        return (
          <TextField
            key={f.name}
            label={L(f.name)}
            hint={f.hint}
            className={f.kind === 'code' ? 'num' : undefined}
            {...register(f.name)}
          />
        )
      case 'number':
        return (
          <TextField
            key={f.name}
            label={L(f.name)}
            hint={f.hint}
            numeric
            error={error(f.name)}
            {...register(f.name)}
          />
        )
      case 'date':
        return (
          <Field key={f.name} label={L(f.name)} htmlFor={f.name} hint={f.hint}>
            <Controller
              control={control}
              name={f.name}
              render={({ field }) => (
                <DatePicker
                  id={f.name}
                  value={typeof field.value === 'string' ? field.value : null}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>
        )
      case 'policyType':
        return (
          <Field key={f.name} label={L(f.name)} htmlFor={f.name} hint={f.hint}>
            <Controller
              control={control}
              name={f.name}
              render={({ field }) => (
                <Select
                  id={f.name}
                  value={typeof field.value === 'string' && field.value ? field.value : undefined}
                  onChange={field.onChange}
                  options={policyTypes.options}
                  placeholder={policyTypes.isPending ? 'Loading…' : 'Select'}
                />
              )}
            />
          </Field>
        )
      case 'longText':
        return <TextArea key={f.name} label={L(f.name)} hint={f.hint} {...register(f.name)} />
      case 'switch':
        return (
          <Controller
            key={f.name}
            control={control}
            name={f.name}
            render={({ field }) => (
              <SwitchField
                label={L(f.name)}
                checked={field.value === true}
                onChange={field.onChange}
              />
            )}
          />
        )
      case 'options':
        return (
          <Field key={f.name} label={L(f.name)} htmlFor={f.name} hint={f.hint}>
            <Controller
              control={control}
              name={f.name}
              render={({ field }) => (
                <MultiSelect
                  id={f.name}
                  value={(field.value as string[]) ?? []}
                  onChange={field.onChange}
                  options={fields.fieldOptions(f.name)}
                />
              )}
            />
          </Field>
        )
      case 'investor':
        return (
          <Controller
            key={f.name}
            control={control}
            name={f.name}
            render={({ field }) => (
              <InvestorPickerField
                label={L(f.name)}
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={field.onChange}
                initialLabel={initialLabels?.[f.name]}
              />
            )}
          />
        )
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {spec.sections.map((s) => (
        <FormSection key={s.title} title={s.title} description={s.description}>
          {s.fields.map(render)}
        </FormSection>
      ))}
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
