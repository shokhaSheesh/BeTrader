import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ACCOUNTS_TABLE, type Account } from '@/entities/account'
import { useInvestorOptions } from '@/entities/investor'
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
import { investorLabel } from '@/shared/lib/format'
import { Field, FormFooter, FormSection, PageLoader, SearchSelect, TextField } from '@/shared/ui'

const schema = z.object({
  investors_id: z.string(),
  full_name: z.string().trim(),
  deposit: numericText,
  invest: numericText,
  dividend: numericText,
  tranzit: numericText,
})

/** Form values use the backend's field slugs, so the POST/PUT body maps 1:1. */
export type AccountFormValues = z.infer<typeof schema>

const BALANCES = ['deposit', 'invest', 'dividend', 'tranzit'] as const

function toValues(account?: Account): AccountFormValues {
  return {
    investors_id: account?.investorId ?? '',
    full_name: account?.fullName ?? '',
    deposit: numberToText(account?.deposit),
    invest: numberToText(account?.invest),
    dividend: numberToText(account?.interestIncome),
    tranzit: numberToText(account?.tranzit),
  }
}

/**
 * The record as the backend stores it: the owner's id or null, balances as numbers.
 * On a new account the backend fills `full_name` from the investor itself (whatever is sent is
 * replaced, verified in Test), so it's only sent when editing.
 */
function toPayload(values: AccountFormValues, isNew: boolean): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    investors_id: values.investors_id || null,
    ...(!isNew && { full_name: values.full_name }),
  }
  for (const name of BALANCES) payload[name] = textToNumber(values[name])
  return payload
}

interface AccountFormProps {
  account?: Account
  submitLabel: string
  cancelTo: string
  /**
   * The record to send. New account: every field, plus the backend's defaults.
   * Existing account: the changed fields plus the required ones (empty when nothing changed).
   */
  onSubmit: (payload: Record<string, unknown>) => void
  submitting?: boolean
}

export function AccountForm(props: AccountFormProps) {
  const fields = useTableFields(ACCOUNTS_TABLE)
  // The form starts from the schema's defaults and required flags, so it waits for the schema
  if (fields.isPending) return <PageLoader label="Loading form" />
  return <AccountFormBody {...props} fields={fields} />
}

function AccountFormBody({
  account,
  submitLabel,
  cancelTo,
  onSubmit,
  submitting,
  fields,
}: AccountFormProps & { fields: ReturnType<typeof useTableFields> }) {
  const schemaFields = fields.data ?? []
  const [search, setSearch] = useState('')
  const investors = useInvestorOptions(useDebouncedValue(search, 350))
  const [investorName, setInvestorName] = useState(
    account?.investorId ? investorLabel(account.investorName, account.investorPhone) : undefined,
  )
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: account
      ? toValues(account)
      : { ...toValues(), ...pickFormKeys(createDefaults(schemaFields)) },
  })

  const submit = (values: AccountFormValues) => {
    const payload = toPayload(values, !account)
    // Fields the backend requires, checked here so the user sees which one is missing
    const missing = missingRequired(payload, schemaFields)
    if (missing.length) {
      for (const slug of missing) setError(slug as keyof AccountFormValues, { message: 'Required' })
      return
    }
    onSubmit(
      account
        ? updateBody(payload, dirtyFields, schemaFields)
        : { ...createDefaults(schemaFields), ...payload },
    )
  }

  const L = fields.fieldLabel
  const req = fields.isRequired

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <FormSection title="Owner">
        <Field
          label={L('investors_id')}
          htmlFor="investors_id"
          required={req('investors_id')}
          error={errors.investors_id?.message}
        >
          <Controller
            control={control}
            name="investors_id"
            render={({ field }) => (
              <SearchSelect
                id="investors_id"
                value={field.value || null}
                valueLabel={investorName}
                onChange={(o) => {
                  field.onChange(o.value)
                  setInvestorName(o.label)
                }}
                options={investors.options}
                search={search}
                onSearchChange={setSearch}
                loading={investors.isFetching}
                paging={investors.paging}
                placeholder="Search by name or phone"
              />
            )}
          />
        </Field>
        {/* A new account gets the investor's name from the backend, so the field shows on edit only */}
        {account && (
          <TextField
            label={L('full_name')}
            required={req('full_name')}
            error={errors.full_name?.message}
            {...register('full_name')}
          />
        )}
      </FormSection>
      <FormSection title="Balances">
        {BALANCES.map((name) => (
          <TextField
            key={name}
            label={L(name)}
            required={req(name)}
            numeric
            error={errors[name]?.message}
            {...register(name)}
          />
        ))}
      </FormSection>
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} submitting={submitting} />
    </form>
  )
}

/** Only the defaults that are form fields; the rest go in on submit. */
function pickFormKeys(defaults: Record<string, unknown>): Partial<AccountFormValues> {
  const keys = Object.keys(toValues())
  return Object.fromEntries(Object.entries(defaults).filter(([k]) => keys.includes(k)))
}
