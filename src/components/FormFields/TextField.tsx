import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/lib/types";
import { useEffect, useState } from "react";

interface TextFieldProps {
  field?: Field;
  value?: string | number | string[] | { [key: string]: string | number };
  onChange?: (value: string) => void;
}

export default function TextField({ field, value, onChange }: TextFieldProps) {
  const [localValue, setLocalValue] = useState<string>("");

  useEffect(() => {
    if (typeof value === "string") {
      setLocalValue(value);
    } else {
      setLocalValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="space-y-1">
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
      <Input
        placeholder={
          field?.placeholder?.trim() ? field.placeholder : "Enter Text"
        }
        value={localValue}
        onChange={handleChange}
        disabled={field?.disabled}
        className="focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
