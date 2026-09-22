import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ACCOUNTS_TABLE, type Account } from '@/entities/account'
import { useInvestorOptions } from '@/entities/investor'
import { useTableFields } from '@/shared/api/useTableFields'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { numericText, numberToText } from '@/shared/lib/form'
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

export type AccountFormValues = z.infer<typeof schema>

interface AccountFormProps {
  account?: Account
  submitLabel: string
  cancelTo: string
  onSubmit: (values: AccountFormValues) => void
}

export function AccountForm({ account, submitLabel, cancelTo, onSubmit }: AccountFormProps) {
  const fields = useTableFields(ACCOUNTS_TABLE)
  const [search, setSearch] = useState('')
  const investors = useInvestorOptions(useDebouncedValue(search, 350))
  const [investorName, setInvestorName] = useState(
    account?.investorId ? investorLabel(account.investorName, account.investorPhone) : undefined,
  )
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      investors_id: account?.investorId ?? '',
      full_name: account?.fullName ?? '',
      deposit: numberToText(account?.deposit),
      invest: numberToText(account?.invest),
      dividend: numberToText(account?.interestIncome),
      tranzit: numberToText(account?.tranzit),
    },
  })

  if (fields.isPending) return <PageLoader label="Loading form" />
  const L = fields.fieldLabel

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormSection title="Owner">
        <Field label={L('investors_id')} htmlFor="investors_id">
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
                placeholder="Search by name or phone"
              />
            )}
          />
        </Field>
        <TextField label={L('full_name')} {...register('full_name')} />
      </FormSection>
      <FormSection title="Balances">
        {(['deposit', 'invest', 'dividend', 'tranzit'] as const).map((name) => (
          <TextField
            key={name}
            label={L(name)}
            numeric
            error={errors[name]?.message}
            {...register(name)}
          />
        ))}
      </FormSection>
      <FormFooter cancelTo={cancelTo} submitLabel={submitLabel} />
    </form>
  )
}
