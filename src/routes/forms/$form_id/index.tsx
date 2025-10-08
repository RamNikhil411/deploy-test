import Form from "@/components/form_builder/Form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$form_id/")({
  component: Form,
});
