import ViewContact from '@/components/contacts/view'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_mainLayout/users/$user_id/_userViewLayout',
)({
  component: ViewContact,
})