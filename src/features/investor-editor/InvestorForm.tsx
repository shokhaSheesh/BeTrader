import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { INVESTORS_TABLE, type Investor } from '@/entities/investor'
import { backendMessage } from '@/shared/api/errors'
import { uploadFile } from '@/shared/api/ucode'
import { useTableFields } from '@/shared/api/useTableFields'
import {
  createDefaults,
  missingRequired,
  numericText,
  numberToText,
  textToNumber,
  updateBody,
} from '@/shared/lib/form'
import { toast } from '@/shared/lib/toast'
import {
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

// Every editable field of `investors`. Not here on purpose:
// - the app login's own fields: `pin_code`, `fmc_token`, `user_id_auth` (never shown or edited)
// - system lookups set by the backend on sign-up: `client_type_id`, `role_id`
// The environments' schemas differ (Production has campaign/media_source, Test has
// social_type/social_sub_type), so each field shows only when the schema has it.
const text = z.string().trim()
const schema = z.object({
  surname: text,
  name: text,
  patronymic: text,
  full_name: text,
  phone: text,
  passport: text,
  pinfl: text,
  issued_by: text,
  issued_date: text,
  birth_date: text,
  birth_place: text,
  gender: z.array(z.string()),
  citizenship: text,
  country_name: text,
  city: text,
  district: text,
  street: text,
  is_identified: z.boolean(),
  lang: z.array(z.string()),
  platform_type: z.array(z.string()),
  mode: z.string(),
  score: numericText,
  campaign: text,
  media_source: text,
  social_type: text,
  social_sub_type: text,
  tg_caht_id: numericText,
  image: z.string().nullable(),
})

/** Keyed by the backend's field slugs, so the POST/PUT body maps 1:1. */
export type InvestorFormValues = z.infer<typeof schema>

function toValues(i?: Investor): InvestorFormValues {
  return {
    surname: i?.surname ?? '',
    name: i?.name ?? '',
    patronymic: i?.patronymic ?? '',
    full_name: i?.fullName ?? '',
    phone: i?.phone ?? '',
    passport: i?.passport ?? '',
    pinfl: i?.pinfl ?? '',
    issued_by: i?.issuedBy ?? '',
    issued_date: i?.issuedDate ?? '',
    birth_date: i?.birthDate ?? '',
    birth_place: i?.birthPlace ?? '',
    gender: i?.gender ?? [],
    citizenship: i?.citizenship ?? '',
    country_name: i?.country ?? '',
    city: i?.city ?? '',
    district: i?.district ?? '',
    street: i?.street ?? '',
    is_identified: i?.isIdentified ?? false,
    lang: i?.languages ?? [],
    platform_type: i?.platforms ?? [],
    mode: i?.mode ?? '',
    score: numberToText(i?.score),
    campaign: i?.campaign ?? '',
    media_source: i?.mediaSource ?? '',
    social_type: i?.socialType ?? '',
    social_sub_type: i?.socialSubType ?? '',
    tg_caht_id: numberToText(i?.tgChatId),
    image: i?.imageUrl ?? null,
  }
}

/**
 * The record as the backend stores it: numbers as numbers, an unset mode as null.
 * Only fields the backend's schema has are sent.
 */
function toPayload(values: InvestorFormValues, known: Set<string>): Record<string, unknown> {
  const all: Record<string, unknown> = {
    ...values,
    mode: values.mode || null,
    score: textToNumber(values.score),
    tg_caht_id: textToNumber(values.tg_caht_id),
  }
  return Object.fromEntries(Object.entries(all).filter(([slug]) => known.has(slug)))
}

interface InvestorFormProps {
  investor?: Investor
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New investor: every field, plus the backend's defaults.
   * Existing investor: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function InvestorForm(props: InvestorFormProps) {
  const fields = useTableFields(INVESTORS_TABLE)
  // The form follows the schema (which fields exist, defaults, required), so it waits for it
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <InvestorFormBody {...props} fields={fields} />
}

function InvestorFormBody({
  investor,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: InvestorFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const known = new Set(schemaFields.map((f) => f.slug))
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<InvestorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: investor
      ? toValues(investor)
      : { ...toValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: InvestorFormValues) => {
    const payload = toPayload(values, known)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing)
        setError(slug as keyof InvestorFormValues, { message: 'Required' })
      return
    }
    onSubmit(
      investor
        ? updateBody(payload, dirtyFields, schemaFields)
        : { ...createDefaults(schemaFields), ...payload },
    )
  }

  const L = fields.fieldLabel
  const req = fields.isRequired
  /** Renders a field only when this environment's schema has it */
  const when = (slug: string, node: ReactNode) => (known.has(slug) ? node : null)
  const textField = (
    slug: keyof InvestorFormValues,
    extra: {
      hint?: string
      className?: string
      numeric?: boolean
      type?: string
      readOnly?: boolean
    } = {},
  ) =>
    when(
      slug,
      <TextField
        label={L(slug)}
        required={req(slug)}
        error={errors[slug]?.message}
        {...extra}
        {...register(slug)}
      />,
    )
  // Free-text date fields: the backend stores them as text (SINGLE_LINE), so they stay text here.
  const textDate = { hint: 'Stored as text by the backend, e.g. 19.03.1994' }

  const multi = (name: 'gender' | 'lang' | 'platform_type') =>
    when(
      name,
      <Field label={L(name)} htmlFor={name} required={req(name)} error={errors[name]?.message}>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <MultiSelect
              id={name}
              value={field.value}
              onChange={field.onChange}
              options={fields.fieldOptions(name)}
            />
          )}
        />
      </Field>,
    )

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormActions cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
      <FormSection title="Personal">
        {textField('surname')}
        {textField('name')}
        {textField('patronymic')}
        {textField('full_name')}
        {multi('gender')}
        {textField('birth_date', textDate)}
        {textField('birth_place')}
        {textField('citizenship')}
      </FormSection>

      <FormSection title="Identity document">
        {textField('passport', { className: 'num' })}
        {textField('pinfl', { className: 'num' })}
        {textField('issued_by')}
        {textField('issued_date', textDate)}
        {when(
          'is_identified',
          <Controller
            control={control}
            name="is_identified"
            render={({ field }) => (
              <SwitchField label="Identified" checked={field.value} onChange={field.onChange} />
            )}
          />,
        )}
      </FormSection>

      <FormSection title="Contact and address">
        {/* The phone is the app login: read-only, so the admin never moves a login account. */}
        {textField('phone', {
          type: 'tel',
          className: 'num',
          readOnly: true,
          hint: "It's the investor's app login, so it can't be changed here.",
        })}
        {textField('country_name')}
        {textField('city')}
        {textField('district')}
        {textField('street')}
      </FormSection>

      <FormSection title="App and acquisition">
        {multi('lang')}
        {multi('platform_type')}
        {when(
          'mode',
          <Field
            label={L('mode')}
            htmlFor="mode"
            required={req('mode')}
            error={errors.mode?.message}
          >
            <Controller
              control={control}
              name="mode"
              render={({ field }) => (
                <Select
                  id="mode"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={fields.fieldOptions('mode')}
                />
              )}
            />
          </Field>,
        )}
        {textField('score', { numeric: true })}
        {textField('campaign')}
        {textField('media_source')}
        {textField('social_type')}
        {textField('social_sub_type')}
        {textField('tg_caht_id', { numeric: true })}
      </FormSection>

      {when(
        'image',
        <FormSection title={L('image')}>
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
                    "Couldn't upload the photo",
                    backendMessage(error) ?? 'Please try again.',
                  )
                }
              />
            )}
          />
        </FormSection>,
      )}
    </form>
  )
}

/** Only the defaults that are form fields; the rest (e.g. created_time) go in on submit. */
function pickFormKeys(defaults: Record<string, unknown>): Partial<InvestorFormValues> {
  const keys = Object.keys(toValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
