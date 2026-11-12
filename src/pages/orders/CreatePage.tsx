import { ORDERS_TABLE } from '@/entities/order'
import { OrderForm } from '@/features/order-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function CreatePage() {
  const t = useT()
  const create = useCreateRecord({ table: ORDERS_TABLE, noun: 'order', routes: RECORDS.orders })

  return (
    <>
      <PageHeader
        back={{ to: RECORDS.orders.list, label: t('Orders') }}
        title={t('Create order')}
      />
      <OrderForm
        submitLabel={t('Create order')}
        cancelTo={RECORDS.orders.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
