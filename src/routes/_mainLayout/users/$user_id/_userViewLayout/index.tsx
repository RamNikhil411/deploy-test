import ContactTimeLine from '@/components/contacts/view/TimeLine'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_mainLayout/users/$user_id/_userViewLayout/',
)({
  component: ContactTimeLine,
})
