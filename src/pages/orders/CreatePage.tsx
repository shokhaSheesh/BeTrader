import { OrderForm } from '@/features/order-editor'
import { notWired } from '@/features/record-actions'
import { RECORDS } from '@/shared/config/routes'
import { PageHeader } from '@/shared/ui'

export default function CreatePage() {
  return (
    <>
      <PageHeader back={{ to: RECORDS.orders.list, label: 'Orders' }} title="Create order" />
      <OrderForm
        submitLabel="Create order"
        cancelTo={RECORDS.orders.list}
        onSubmit={() => notWired('create')}
      />
    </>
  )
}
