import AddOrganization from "@/components/contacts/organizations/AddOrganization";
import AddContact from "@/components/contacts/organizations/AddOrganization";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_mainLayout/organisations/add-organisation"
)({
  component: AddOrganization,
});
