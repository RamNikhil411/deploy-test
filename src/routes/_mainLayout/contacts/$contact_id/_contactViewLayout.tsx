import ViewContact from '@/components/contacts/view'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_mainLayout/contacts/$contact_id/_contactViewLayout',
)({
  component: ViewContact,
})

function RouteComponent() {
  return (
    <div>Hello "/contacts/_contactLayout/$contact_id/_contactViewLayout"!</div>
  )
}
