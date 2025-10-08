import Regions from "@/components/contacts/regions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_mainLayout/regions/")({
  component: Regions,
});
