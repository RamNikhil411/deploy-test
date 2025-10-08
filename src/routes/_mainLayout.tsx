import ContactNavbar from "@/components/contacts/ContactNavbar";
import CreateContactContext from "@/context/contactContext";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout")({
  component: () => (
    <CreateContactContext>
      <ContactNavbar />
    </CreateContactContext>
  ),
});
