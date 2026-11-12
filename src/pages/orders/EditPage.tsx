import { useParams } from 'react-router'
import { ORDERS_TABLE, useOrderQuery } from '@/entities/order'
import { OrderForm } from '@/features/order-editor'
import { useUpdateRecord } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader, RecordBoundary } from '@/shared/ui'
import { useT } from '@/shared/i18n'

export default function EditPage() {
  const t = useT()
  const { id } = useParams()
  const query = useOrderQuery(id)
  const update = useUpdateRecord({ table: ORDERS_TABLE, noun: 'order', routes: RECORDS.orders }, id)

  return (
    <RecordBoundary
      query={query}
      noun="order"
      back={{ to: RECORDS.orders.list, label: t('Orders') }}
    >
      {(o) => {
        const title = o.orderId ? t('Order {id}', { id: o.orderId }) : t('Order')
        return (
          <>
            <PageHeader
              back={{ to: RECORDS.orders.detail(o.id), label: title }}
              title={o.orderId ? t('Edit order {id}', { id: o.orderId }) : t('Edit order')}
            />
            <OrderForm
              order={o}
              submitLabel={t('Save changes')}
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
