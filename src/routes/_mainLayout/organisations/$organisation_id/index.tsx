import OrganizationView from "@/components/contacts/organizations/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_mainLayout/organisations/$organisation_id/"
)({
  component: OrganizationView,
});
