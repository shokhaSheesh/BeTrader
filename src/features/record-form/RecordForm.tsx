import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { InvestorPickerField } from '@/entities/investor'
import { usePolicyTypeOptions } from '@/entities/policy-type'
import { backendMessage } from '@/shared/api/errors'
import { uploadFile } from '@/shared/api/ucode'
import { useLookupOptions } from '@/shared/api/useLookupOptions'
import { useTableFields } from '@/shared/api/useTableFields'
import { toast } from '@/shared/lib/toast'
import {
  createDefaults,
  missingRequired,
  numericText,
  textToNumber,
  updateBody,
} from '@/shared/lib/form'
import {
  DatePicker,
  DateTimePicker,
  Field,
  FileField,
  FormFooter,
  FormSection,
  ImageField,
  MultiSelect,
  PageLoader,
  Select,
  SwitchField,
  TextArea,
  TextField,
} from '@/shared/ui'

/**
 * Declarative form for simple tables: each field is a backend slug plus a kind.
 * Labels, required marks and defaults come from the backend schema (DESIGN.md §0); values keep the
 * backend's slugs, so the POST/PUT body maps 1:1. Richer tables (projects, orders…) have their own forms.
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
  | 'password'
  | 'lookup'
  | 'photo'
  | 'file'

export interface FieldSpec {
  name: string
  kind: FieldKind
  hint?: string
  /** `lookup` only: the backend table to pick from and the field to show */
  table?: string
  labelField?: string
}

export interface FormSpec {
  table: string
  sections: { title: string; description?: string; fields: FieldSpec[] }[]
  /** Fields the table's backend function reads on every edit, sent even when unchanged */
  alwaysSend?: readonly string[]
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
  /**
   * The record to send. Create: every field, plus the backend's defaults. Edit: the changed
   * fields plus the required ones and `spec.alwaysSend` (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

/**
 * The record as the backend stores it: numbers as numbers, an unset link as null, an empty
 * password left out (keeps the current one). Only fields the backend's schema has are sent.
 */
function toPayload(
  values: RecordFormValues,
  all: FieldSpec[],
  known: Set<string>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const f of all) {
    if (!known.has(f.name)) continue
    const value = values[f.name]
    if (f.kind === 'number') payload[f.name] = textToNumber(typeof value === 'string' ? value : '')
    else if (f.kind === 'password') {
      if (typeof value === 'string' && value) payload[f.name] = value
    } else if (f.kind === 'policyType' || f.kind === 'investor' || f.kind === 'lookup')
      payload[f.name] = value || null
    else payload[f.name] = value
  }
  return payload
}

function schemaFor(spec: FormSpec) {
  type Value = RecordFormValues[string]
  const shape: Record<string, z.ZodType<Value, Value>> = {}
  for (const f of spec.sections.flatMap((s) => s.fields)) {
    shape[f.name] =
      f.kind === 'number'
        ? numericText
        : f.kind === 'date' || f.kind === 'photo' || f.kind === 'file'
          ? z.string().nullable()
          : f.kind === 'switch'
            ? z.boolean()
            : f.kind === 'options'
              ? z.array(z.string())
              : z.string().trim()
  }
  return z.object(shape)
}

export function RecordForm(props: RecordFormProps) {
  const fields = useTableFields(props.spec.table)
  // The form starts from the schema's defaults and required flags, so it waits for the schema
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <RecordFormBody {...props} fields={fields} />
}

function RecordFormBody({
  spec,
  defaults,
  initialLabels,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: RecordFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const known = new Set(schemaFields.map((f) => f.slug))
  const policyTypes = usePolicyTypeOptions()
  const all = spec.sections.flatMap((s) => s.fields)
  const isEdit = defaults !== undefined
  // A new record starts with what the backend defines as defaults
  const backendDefaults = isEdit ? {} : createDefaults(schemaFields)
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(schemaFor(spec)),
    defaultValues: Object.fromEntries(
      all.map((f) => [
        f.name,
        defaults?.[f.name] ??
          (backendDefaults[f.name] as RecordFormValues[string] | undefined) ??
          (f.kind === 'date' || f.kind === 'photo' || f.kind === 'file'
            ? null
            : f.kind === 'options'
              ? []
              : f.kind === 'switch'
                ? false
                : ''),
      ]),
    ),
  })

  const submit = (values: RecordFormValues) => {
    const payload = toPayload(values, all, known)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing) setError(slug, { message: 'Required' })
      return
    }
    onSubmit(
      isEdit
        ? updateBody(payload, dirtyFields, schemaFields, spec.alwaysSend)
        : { ...backendDefaults, ...payload },
    )
  }

  const L = fields.fieldLabel
  const req = fields.isRequired
  const error = (name: string) => errors[name]?.message as string | undefined
  const typeOf = (name: string) => schemaFields.find((f) => f.slug === name)?.type

  const render = (f: FieldSpec) => {
    switch (f.kind) {
      case 'text':
      case 'code':
        return (
          <TextField
            key={f.name}
            label={L(f.name)}
            hint={f.hint}
            required={req(f.name)}
            error={error(f.name)}
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
            required={req(f.name)}
            numeric
            error={error(f.name)}
            {...register(f.name)}
          />
        )
      case 'date':
        return (
          <Field
            key={f.name}
            label={L(f.name)}
            htmlFor={f.name}
            hint={f.hint}
            required={req(f.name)}
            error={error(f.name)}
          >
            <Controller
              control={control}
              name={f.name}
              render={({ field }) => {
                const value = typeof field.value === 'string' ? field.value : null
                // A DATE_TIME field keeps its time; a DATE field is a day
                return typeOf(f.name) === 'DATE_TIME' ? (
                  <DateTimePicker id={f.name} value={value} onChange={field.onChange} />
                ) : (
                  <DatePicker id={f.name} value={value} onChange={field.onChange} />
                )
              }}
            />
          </Field>
        )
      case 'policyType':
        return (
          <Field
            key={f.name}
            label={L(f.name)}
            htmlFor={f.name}
            hint={f.hint}
            required={req(f.name)}
            error={error(f.name)}
          >
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
      case 'password':
        // Never prefilled; empty on edit means "keep the current password".
        return (
          <TextField
            key={f.name}
            type="password"
            autoComplete="new-password"
            label={L(f.name)}
            hint={f.hint}
            required={req(f.name) && !isEdit}
            error={error(f.name)}
            {...register(f.name)}
          />
        )
      case 'lookup':
        return (
          <Field
            key={f.name}
            label={L(f.name)}
            htmlFor={f.name}
            hint={f.hint}
            required={req(f.name)}
            error={error(f.name)}
          >
            <Controller
              control={control}
              name={f.name}
              render={({ field }) => (
                <LookupSelect
                  id={f.name}
                  table={f.table!}
                  labelField={f.labelField ?? 'name'}
                  value={typeof field.value === 'string' ? field.value : ''}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>
        )
      case 'longText':
        return (
          <TextArea
            key={f.name}
            label={L(f.name)}
            hint={f.hint}
            error={error(f.name)}
            {...register(f.name)}
          />
        )
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
          <Field
            key={f.name}
            label={L(f.name)}
            htmlFor={f.name}
            hint={f.hint}
            required={req(f.name)}
            error={error(f.name)}
          >
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
      case 'photo':
      case 'file': {
        // Uploads go to the field's storage folder, as u-code's own admin does
        const upload = (file: File) =>
          uploadFile(file, schemaFields.find((s) => s.slug === f.name)?.folder)
        const onError = (e: unknown) =>
          toast.error("Couldn't upload the file", backendMessage(e) ?? 'Please try again.')
        return (
          <Field
            key={f.name}
            label={L(f.name)}
            htmlFor={f.name}
            hint={f.hint}
            required={req(f.name)}
            error={error(f.name)}
          >
            <Controller
              control={control}
              name={f.name}
              render={({ field }) => {
                const value = typeof field.value === 'string' && field.value ? field.value : null
                return f.kind === 'photo' ? (
                  <ImageField
                    id={f.name}
                    value={value}
                    onChange={field.onChange}
                    upload={upload}
                    onError={onError}
                  />
                ) : (
                  <FileField
                    id={f.name}
                    value={value}
                    onChange={field.onChange}
                    upload={upload}
                    onError={onError}
                  />
                )
              }}
            />
          </Field>
        )
      }
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
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      {spec.sections.map((s) => (
        <FormSection key={s.title} title={s.title} description={s.description}>
          {/* A field shows only when this environment's schema has it */}
          {s.fields.filter((f) => known.has(f.name)).map(render)}
        </FormSection>
      ))}
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
    </form>
  )
}

/** Dropdown of records from another (small) backend table, e.g. roles by name. */
function LookupSelect({
  id,
  table,
  labelField,
  value,
  onChange,
}: {
  id: string
  table: string
  labelField: string
  value: string
  onChange: (v: string) => void
}) {
  const lookup = useLookupOptions(table, labelField)
  return (
    <Select
      id={id}
      value={value || undefined}
      onChange={onChange}
      options={lookup.options}
      placeholder={lookup.isPending ? 'Loading…' : 'Select'}
    />
  )
}
