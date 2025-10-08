import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field } from "@/lib/types";
import { useEffect, useState } from "react";

interface RadioButtonsProps {
  field: Field;
  value?: string | number | string[] | { [key: string]: string | number };
  onChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

export function RadioButtons({
  field,
  value,
  onChange,
  orientation = "horizontal",
}: RadioButtonsProps) {
  const options = field?.options || [];
  const [selectedValue, setSelectedValue] = useState<string>("");

  // Sync local state with external value
  useEffect(() => {
    if (typeof value === "string") {
      setSelectedValue(value);
    } else if (typeof value === "number") {
      setSelectedValue(value.toString());
    } else {
      setSelectedValue("");
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
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

      <RadioGroup
        className={`flex ${orientation === "horizontal" ? "flex-wrap gap-4" : "flex-col gap-2"} w-full`}
        value={selectedValue}
        onValueChange={handleValueChange}
      >
        {options.length > 0 ? (
          options.map((option, index) => (
            <div key={`${option}-${index}`} className="flex items-center gap-3">
              <RadioGroupItem
                value={option}
                id={`radio-${field.id}-${index}`}
                disabled={field?.disabled}
              />
              <Label
                htmlFor={`radio-${field.id}-${index}`}
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
      </RadioGroup>
    </div>
  );
}
