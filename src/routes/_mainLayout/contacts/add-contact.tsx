import AddContact from "@/components/contacts/AddContact";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/contacts/add-contact")({
  component: AddContact,
});
