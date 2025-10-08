import Contacts from "@/components/contacts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/contacts/")({
  component: Contacts,
});
