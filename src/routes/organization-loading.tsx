import { OrganizationLoading } from '@/components/join-organization/organization-loading'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/organization-loading')({
  component: OrganizationLoading,
})
