import { useMemo, useState } from 'react'
import { notWired } from '@/features/record-actions'
import {
  PermissionMatrix,
  usePermissionDraft,
  type PermissionTables,
} from '@/features/role-permissions'
import { useLookupOptions } from '@/shared/api/useLookupOptions'
import { RECORDS } from '@/shared/config/routes'
import { usePermissions } from '@/shared/permissions'
import {
  Field,
  FormFooter,
  FormSection,
  PageHeader,
  PageLoader,
  Select,
  TextField,
} from '@/shared/ui'

/**
 * Create a role and set its page permissions in one go. Every table starts with no rights.
 * Saving is POST /v2/role + PUT /v2/role-permission/detailed on the auth API: not wired yet (writes are on hold).
 */
export default function RoleCreatePage() {
  const clientTypes = useLookupOptions('client_type', 'name')
  const [clientType, setClientType] = useState<string>()
  // The project's tables (from the signed-in role's permission list), all switched off.
  const { tables, isPending } = usePermissions()
  const blank = useMemo<PermissionTables | undefined>(
    () =>
      tables &&
      new Map(
        [...tables].map(([slug, t]) => [
          slug,
          { label: t.label, read: false, create: false, update: false, delete: false },
        ]),
      ),
    [tables],
  )
  const draft = usePermissionDraft(blank)

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
      <FormSection title="Role">
        <TextField label="Name" name="name" autoComplete="off" />
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
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold">Permissions</h2>
          <p className="mt-0.5 text-fg-muted">
            What this role can do on each page. Everything starts off; use a column header to switch
            a right on for every page.
          </p>
        </div>
        {isPending || !draft.tables ? (
          <PageLoader label="Loading pages" />
        ) : (
          <PermissionMatrix
            tables={draft.tables}
            onToggle={draft.toggle}
            onToggleColumn={draft.setColumn}
          />
        )}
      </section>
      <FormFooter cancelTo={RECORDS.roles.list} submitLabel="Create role" />
    </form>
  )
}
