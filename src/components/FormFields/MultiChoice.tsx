import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Field } from "@/lib/types";
import { useEffect, useState } from "react";

export function MultiChoice({
  field,
  value,
  onChange,
}: {
  field: Field;
  value?:
    | string[]
    | string
    | number
    | { [subFieldLabel: string]: string | number };
  onChange?: (value: string[]) => void;
}) {
  const options = field?.options || [];

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedValues(value);
    } else if (value === undefined) {
      setSelectedValues([]);
    } else if (typeof value === "string" || typeof value === "number") {
      setSelectedValues([String(value)]);
    }
  }, [value]);

  const toggleOption = (option: string) => {
    const updated = selectedValues.includes(option)
      ? selectedValues.filter((o) => o !== option)
      : [...selectedValues, option];

    setSelectedValues(updated);

    onChange?.(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <Label
        className={`text-sm ${
          field?.fieldLabelProperties?.textAlign === "center"
            ? "justify-center"
            : field?.fieldLabelProperties?.textAlign === "right"
              ? "justify-end"
              : "justify-start"
        }`}
      >
        {field?.title ?? field?.label ?? " "}
        {field?.required && <span className="text-red-500">&#42;</span>}
      </Label>

      <div className="flex flex-wrap gap-4">
        {options?.length > 0 ? (
          options.map((option, index) => (
            <div key={`${option}-${index}`} className="flex items-center gap-3">
              <Checkbox
                id={`${field.id}-${option}-${index}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={() => toggleOption(option)}
                className={`data-[state=checked]:text-black ${field?.disabled ? "pointer-events-none" : ""}`}
                // disabled={field?.disabled}
              />
              <Label
                htmlFor={`${field.id}-${option}-${index}`}
                className="font-normal cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No options available
          </div>
        )}
      </div>
    </div>
  );
}
