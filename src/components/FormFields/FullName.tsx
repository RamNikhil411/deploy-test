import { Field } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { normalizeKey } from "@/utils/helpers/form_functions";
import { useEffect, useState } from "react";

export default function FullName({
  field,
  value,
  onChange,
}: {
  field?: Field;
  value?:
    | string
    | number
    | string[]
    | { [subFieldLabel: string]: string | number };
  onChange?: (value: string | number, subFieldLabel?: string) => void;
}) {
  const [localValues, setLocalValues] = useState<{
    [key: string]: string | number;
  }>({});

  useEffect(() => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      setLocalValues(value as { [key: string]: string | number });
    }
  }, [value]);

  const handleInputChange = (inputValue: string, subFieldLabel: string) => {
    const newValues = {
      ...localValues,
      [subFieldLabel]: inputValue,
    };
    setLocalValues(newValues);

    onChange && onChange(inputValue, subFieldLabel);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <Label
        className={`${
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
      <div className="flex w-full gap-2">
        {field?.subFields?.map((subfield) => (
          <div key={subfield?.id} className="flex flex-col gap-1 w-1/2">
            <Label className="font-normal">{subfield?.label || ""}</Label>
            <Input
              id={`subfield-${subfield?.id}`}
              placeholder={
                subfield?.properties?.placeholder?.trim()
                  ? subfield?.properties.placeholder
                  : ""
              }
              value={localValues[normalizeKey(subfield?.label)] || ""}
              onChange={(e) => {
                handleInputChange(e.target.value, normalizeKey(subfield.label));
              }}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={field?.disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
