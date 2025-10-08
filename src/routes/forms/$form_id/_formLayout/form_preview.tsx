import FormPreview from "@/components/form_builder/FormPreview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/forms/$form_id/_formLayout/form_preview"
)({
  component: FormPreview,
});
