import FormLayout from "@/components/form_builder/FormLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$form_id/_formLayout")({
  component: FormLayout,
});
