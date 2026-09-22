import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { INVESTORS_TABLE, type Investor } from '@/entities/investor'
import { useTableFields } from '@/shared/api/useTableFields'
import { numericText, numberToText } from '@/shared/lib/form'
import {
  Field,
  FormFooter,
  FormSection,
  MultiSelect,
  PageLoader,
  Select,
  SwitchField,
  TextField,
} from '@/shared/ui'

// Every editable field of `investors`. Not here on purpose:
// - secrets: `pin_code`, `fmc_token`, `user_id_auth` (never shown or edited in the admin)
// - system lookups set by the backend on sign-up: `client_type_id`, `role_id`
// - `image`: uploads aren't wired yet
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
  tg_caht_id: numericText,
})

/** Keyed by the backend's field slugs, so the future POST/PUT body maps 1:1. */
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
    tg_caht_id: numberToText(i?.tgChatId),
  }
}

interface InvestorFormProps {
  investor?: Investor
  submitLabel: string
  cancelTo: string
  onSubmit: (values: InvestorFormValues) => void
}

export function InvestorForm({ investor, submitLabel, cancelTo, onSubmit }: InvestorFormProps) {
  const fields = useTableFields(INVESTORS_TABLE)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InvestorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toValues(investor),
  })

  if (fields.isPending) return <PageLoader label="Loading form" />
  const L = fields.fieldLabel
  // Free-text date fields: the backend stores them as text (SINGLE_LINE), so they stay text here.
  const textDateHint = 'Stored as text by the backend, e.g. 19.03.1994'

  const multi = (name: 'gender' | 'lang' | 'platform_type') => (
    <Field label={L(name)} htmlFor={name}>
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
    </Field>
  )

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Personal">
        <TextField label={L('surname')} {...register('surname')} />
        <TextField label={L('name')} {...register('name')} />
        <TextField label={L('patronymic')} {...register('patronymic')} />
        <TextField label={L('full_name')} {...register('full_name')} />
        {multi('gender')}
        <TextField label={L('birth_date')} hint={textDateHint} {...register('birth_date')} />
        <TextField label={L('birth_place')} {...register('birth_place')} />
        <TextField label={L('citizenship')} {...register('citizenship')} />
      </FormSection>

      <FormSection title="Identity document">
        <TextField label={L('passport')} className="num" {...register('passport')} />
        <TextField label={L('pinfl')} className="num" {...register('pinfl')} />
        <TextField label={L('issued_by')} {...register('issued_by')} />
        <TextField label={L('issued_date')} hint={textDateHint} {...register('issued_date')} />
        <Controller
          control={control}
          name="is_identified"
          render={({ field }) => (
            <SwitchField label="Identified" checked={field.value} onChange={field.onChange} />
          )}
        />
      </FormSection>

      <FormSection title="Contact and address">
        <TextField label={L('phone')} type="tel" className="num" {...register('phone')} />
        <TextField label={L('country_name')} {...register('country_name')} />
        <TextField label={L('city')} {...register('city')} />
        <TextField label={L('district')} {...register('district')} />
        <TextField label={L('street')} {...register('street')} />
      </FormSection>

      <FormSection title="App and acquisition">
        {multi('lang')}
        {multi('platform_type')}
        <Field label={L('mode')} htmlFor="mode">
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
        </Field>
        <TextField
          label={L('score')}
          numeric
          error={errors.score?.message}
          {...register('score')}
        />
        <TextField label={L('campaign')} {...register('campaign')} />
        <TextField label={L('media_source')} {...register('media_source')} />
        <TextField
          label={L('tg_caht_id')}
          numeric
          error={errors.tg_caht_id?.message}
          {...register('tg_caht_id')}
        />
      </FormSection>

      <FormSection title={L('image')} description="Uploading images isn't connected yet.">
        {investor?.imageUrl ? (
          <img
            src={investor.imageUrl}
            alt=""
            className="size-24 rounded-full bg-surface-muted object-cover"
          />
        ) : (
          <p className="text-fg-muted">No photo.</p>
        )}
      </FormSection>

      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
