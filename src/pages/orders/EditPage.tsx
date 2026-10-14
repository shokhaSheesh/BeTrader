import { useParams } from 'react-router'
import { ORDERS_TABLE, useOrderQuery } from '@/entities/order'
import { OrderForm } from '@/features/order-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'

export default function EditPage() {
  const { id } = useParams()
  const query = useOrderQuery(id)
  const update = useUpdateRecord({ table: ORDERS_TABLE, noun: 'order', routes: RECORDS.orders }, id)

  return (
    <RecordBoundary query={query} noun="order" back={{ to: RECORDS.orders.list, label: 'Orders' }}>
      {(o) => {
        const title = o.orderId ? `Order ${o.orderId}` : 'Order'
        return (
          <>
            <PageHeader
              back={{ to: RECORDS.orders.detail(o.id), label: title }}
              title={o.orderId ? `Edit order ${o.orderId}` : 'Edit order'}
            />
            <OrderForm
              order={o}
              submitLabel="Save changes"
              cancelTo={RECORDS.orders.detail(o.id)}
              submitting={update.submitting}
              onSubmit={update.submit}
            />
          </>
        )
      }}
    </RecordBoundary>
  )
}
