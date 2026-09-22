import { useState } from 'react'
import { notWired } from '@/features/record-actions'
import { useLookupOptions } from '@/shared/api/useLookupOptions'
import { RECORDS } from '@/shared/config/routes'
import { Field, FormFooter, FormSection, PageHeader, Select, TextField } from '@/shared/ui'

/** Creating a role is POST /v2/role on the auth API: not wired yet (writes are on hold). */
export default function RoleCreatePage() {
  const clientTypes = useLookupOptions('client_type', 'name')
  const [clientType, setClientType] = useState<string>()
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        notWired('create')
      }}
      className="flex flex-col gap-6"
    >
      <PageHeader
        back={{ to: RECORDS.roles.list, label: 'Roles & permissions' }}
        title="Create role"
      />
      <FormSection title="Role" description="Permissions are set after the role is created.">
        <TextField label="Name" name="name" />
        <Field label="Client type" htmlFor="client_type">
          <Select
            id="client_type"
            value={clientType}
            onChange={setClientType}
            options={clientTypes.options}
            placeholder={clientTypes.isPending ? 'Loading…' : 'Select'}
          />
        </Field>
      </FormSection>
      <FormFooter cancelTo={RECORDS.roles.list} submitLabel="Create role" />
    </form>
  )
}
