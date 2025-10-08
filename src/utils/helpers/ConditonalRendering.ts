import { Answer } from "@/components/form_builder/FormPreview";
import { Condition, Field } from "@/lib/types";

export default function ConditionalRendering(
  fields: Field[],
  conditions: Condition[],
  answers?: Answer[]
) {
  let visibleFields: Field[] = fields.map((field) => ({
    ...field,
    visible: true,
    required: field.required ?? false,
    disabled: field.disabled ?? false,
  }));
  const updatedAnswers: Record<string, any> = {};
  let successMessage: { text: string; subtext: string } | null = null;

  conditions.forEach((condition) => {
    if (condition.action === "Show" || condition.action === "Show Multiple") {
      condition.targetFields?.forEach((targetFieldId) => {
        visibleFields = visibleFields.map((field) =>
          field.id === targetFieldId ? { ...field, visible: false } : field
        );
      });
    }
  });

  conditions.forEach((condition) => {
    const answer = answers?.find((a) => a.id === condition.ifField);
    let conditionMet = false;

    switch (condition.operator) {
      case "equals":
        if (Array.isArray(answer?.value)) {
          conditionMet = answer.value.includes(condition.value);
        } else {
          conditionMet = answer?.value === condition.value;
        }
        break;
      case "not_equals":
        if (Array.isArray(answer?.value)) {
          conditionMet = !answer.value.includes(condition.value);
        } else {
          conditionMet = answer?.value !== condition.value;
        }
        break;
      case "is_Filled":
        conditionMet = Array.isArray(answer?.value)
          ? answer.value.length > 0
          : !!answer?.value;
        break;
      case "is_Empty":
        conditionMet = Array.isArray(answer?.value)
          ? answer.value.length === 0
          : !answer?.value;
        break;
    }

    if (conditionMet) {
      if (condition.action === "Show Custom Message") {
        successMessage = {
          text: condition.successText ?? "Thank You for Submitting the form!",
          subtext:
            condition.successSubtext ??
            "Your response has been recorded successfully. Our team will review it shortly.",
        };
      }
      condition.targetFields?.forEach((targetFieldId) => {
        visibleFields = visibleFields.map((field) => {
          if (field.id === targetFieldId) {
            if (
              condition.action === "Show Multiple" ||
              condition.action === "Show"
            ) {
              return {
                ...field,
                visible: conditionMet,
              };
            }
            if (
              condition.action === "Hide" ||
              condition.action === "Hide Multiple"
            ) {
              return {
                ...field,
                visible: !conditionMet,
              };
            }
            if (
              condition.action === "Require" ||
              condition.action === "Require Multiple"
            ) {
              return { ...field, required: conditionMet };
            }
            if (
              condition.action === "Don't Require" ||
              condition.action === "Don't Require Multiple"
            ) {
              return { ...field, required: !conditionMet };
            }
            if (condition.action === "Disable") {
              return { ...field, disabled: conditionMet };
            }
            if (condition.action === "Enable") {
              return { ...field, disabled: !conditionMet };
            }
          }
          return field;
        });

        if (
          condition.action === "Copy Field Value" ||
          condition.action === "Copy Multiple Field Values"
        ) {
          const combinedValue = (condition.fromFields || [])
            .map((id) => answers?.find((a) => a.id === id)?.value)
            .filter(Boolean)
            .join(", ");
          updatedAnswers[targetFieldId] = combinedValue;
        }
      });
    }
  });

  return { visibleFields, updatedAnswers, successMessage };
}
