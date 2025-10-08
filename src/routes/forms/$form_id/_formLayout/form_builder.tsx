import FormBuilder from "@/components/form_builder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$form_id/_formLayout/form_builder")({
  component: FormBuilder,
});
