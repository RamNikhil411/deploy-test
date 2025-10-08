import Organizations from "@/components/contacts/organizations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/organisations/")(
  {
    component: Organizations,
  }
);
