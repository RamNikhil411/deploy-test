import FormSettings from "@/components/form_builder/FormSettings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/forms/$form_id/_formLayout/form_settings"
)({
  component: FormSettings,
});
