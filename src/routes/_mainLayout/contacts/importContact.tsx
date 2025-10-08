import ImportContacts from '@/components/contacts/importContacts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_mainLayout/contacts/importContact')({
  component: ImportContacts,
})

function RouteComponent() {
  return <div>Hello "/contacts/_contactLayout/importContact"!</div>
}
