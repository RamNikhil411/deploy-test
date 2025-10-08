import Verify from '@/components/join-organization/verify'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/join-organization/verify')({
  component: Verify,
})

function RouteComponent() {
  return <div>Hello "/join-organization/verify"!</div>
}
