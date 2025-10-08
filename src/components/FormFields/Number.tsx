import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Field } from "@/lib/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberFieldProps {
  field?: Field;
  value?: string | number | string[] | { [key: string]: string | number };
  onChange?: (value: number | "") => void;
}

export default function NumberField({
  field,
  value,
  onChange,
}: NumberFieldProps) {
  const [localValue, setLocalValue] = useState<string>("");

  // Sync local state with external value
  useEffect(() => {
    if (typeof value === "number") {
      setLocalValue(value.toString());
    } else if (typeof value === "string" && !isNaN(Number(value))) {
      setLocalValue(value);
    } else {
      setLocalValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);

    if (onChange) {
      const parsedValue = inputValue === "" ? "" : Number(inputValue);
      onChange(parsedValue);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
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
          type="number"
          placeholder={field?.placeholder?.trim() || "Enter Number"}
          className={cn(
            "w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
          value={localValue}
          onChange={handleChange}
          disabled={field?.disabled}
        />
      </div>
    </div>
  );
}
