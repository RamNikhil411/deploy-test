import AddUser from '@/components/contacts/users/AddUser'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_mainLayout/users/$user_id/edit')({
  component: AddUser,
})
