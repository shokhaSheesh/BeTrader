import { ORDERS_TABLE } from '@/entities/order'
import { OrderForm } from '@/features/order-editor'
import { useCreateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  const create = useCreateRecord({ table: ORDERS_TABLE, noun: 'order', routes: RECORDS.orders })

  return (
    <>
      <PageHeader back={{ to: RECORDS.orders.list, label: 'Orders' }} title="Create order" />
      <OrderForm
        submitLabel="Create order"
        cancelTo={RECORDS.orders.list}
        submitting={create.submitting}
        onSubmit={create.submit}
      />
    </>
  )
}
