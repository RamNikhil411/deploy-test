
import FormBuilder from '@/components/form_builder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/formBuilder')({
  component: FormBuilder,
})

