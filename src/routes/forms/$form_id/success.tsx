import FormSuccess from '@/components/Forms/FormSuccess'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forms/$form_id/success')({
  component: FormSuccess,
})

