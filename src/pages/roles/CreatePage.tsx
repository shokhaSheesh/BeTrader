import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useCreateRoleMutation } from '@/entities/role'
import {
  PermissionMatrix,
  usePermissionDraft,
  type PermissionTables,
} from '@/features/role-permissions'
import { backendMessage } from '@/shared/api/errors'
import { useLookupOptions } from '@/shared/api/useLookupOptions'
import { RECORDS } from '@/shared/config/routes'
import { toast } from '@/shared/lib/toast'
import { usePermissions } from '@/shared/permissions'
import {
  Field,
  FormActions,
  FormSection,
  PageHeader,
  PageLoader,
  Select,
  TextField,
} from '@/shared/ui'
import { useT } from '@/shared/i18n'

/**
 * Create a role and set its page permissions in one go. Every table starts with no rights.
 * Saving is POST /v2/role, then PUT /v2/role-permission/detailed for the new role (auth API).
 */
export default function RoleCreatePage() {
  const t = useT()
  const navigate = useNavigate()
  const clientTypes = useLookupOptions('client_type', 'name')
  const [name, setName] = useState('')
  const [clientType, setClientType] = useState<string>()
  // u-code's own role form requires both
  const [errors, setErrors] = useState<{ name?: string; clientType?: string }>({})
  const create = useCreateRoleMutation()
  // The project's tables (from the signed-in role's permission list), all switched off.
  const { tables, isPending } = usePermissions()
  const blank = useMemo<PermissionTables | undefined>(
    () =>
      tables &&
      new Map(
        [...tables].map(([slug, table]) => [
          slug,
          { label: table.label, read: false, create: false, update: false, delete: false },
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
        const missing = {
          name: name.trim() ? undefined : t('Required'),
          clientType: clientType ? undefined : t('Required'),
        }
        setErrors(missing)
        if (missing.name || missing.clientType || !draft.tables) return
        create.mutate(
          { name: name.trim(), clientTypeId: clientType!, tables: draft.tables },
          {
            onSuccess: (id) => {
              toast.success(t('Role created'))
              navigate(RECORDS.roles.detail(id), { replace: true })
            },
            onError: (error) =>
              toast.error(t("Couldn't create the role"), backendMessage(error) ?? error.message),
          },
        )
      }}
      className="flex flex-col gap-6"
    >
      <PageHeader
        back={{ to: RECORDS.roles.list, label: t('Roles & permissions') }}
        title={t('Create role')}
      />
      <FormActions
        cancelTo={RECORDS.roles.list}
        submitLabel={t('Create role')}
        submitting={create.isPending}
      />
      <FormSection title={t('Role')}>
        <TextField
          label={t('Name')}
          name="name"
          autoComplete="off"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Field label={t('Client type')} htmlFor="client_type" required error={errors.clientType}>
          <Select
            id="client_type"
            value={clientType}
            onChange={setClientType}
            options={clientTypes.options}
            placeholder={clientTypes.isPending ? t('Loading…') : t('Select')}
          />
        </Field>
      </FormSection>
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold">{t('Permissions')}</h2>
          <p className="mt-0.5 text-fg-muted">
            {t(
              'What this role can do on each page. Everything starts off; use a column header to switch a right on for every page.',
            )}
          </p>
        </div>
        {isPending || !draft.tables ? (
          <PageLoader label={t('Loading pages')} />
        ) : (
          <PermissionMatrix
            tables={draft.tables}
            onToggle={draft.toggle}
            onToggleColumn={draft.setColumn}
          />
        )}
      </section>
    </form>
  )
}
