import ContactTimeLine from '@/components/contacts/view/TimeLine'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_mainLayout/contacts/$contact_id/_contactViewLayout/',
)({
  component: ContactTimeLine,
})


