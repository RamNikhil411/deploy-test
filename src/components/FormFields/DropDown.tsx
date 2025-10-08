import { Field } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";

interface DropDownProps {
  field?: Field;
  placeholder?: string;
  options?: string[];
  onSelectClick?: () => void;
  onChange?: (value: string) => void;
  value?: string | number | string[] | { [key: string]: string | number };
}

export default function DropDown({
  field,
  placeholder,
  options,
  onSelectClick,
  onChange,
  value,
}: DropDownProps) {
  const [localValue, setLocalValue] = useState<string>("");
  const [open, setOpen] = useState(false);
  const resolvedOptions = options || field?.options || [];

  useEffect(() => {
    if (typeof value === "string") {
      setLocalValue(value);
    } else {
      setLocalValue("");
    }
  }, [value]);

  const handleValueChange = (val: string) => {
    setLocalValue(val);
    onChange?.(val);
  };
  return (
    <div className="w-full space-y-1">
      {field?.title && (
        <Label
          htmlFor="dropdown"
          className={`${
            field?.fieldLabelProperties?.textAlign === "center"
              ? "justify-center"
              : field?.fieldLabelProperties?.textAlign === "right"
                ? "justify-end"
                : "justify-start"
          }`}
        >
          {field.title}
          {field?.required && <span className="text-red-500">&#42;</span>}
        </Label>
      )}
      <Select
        open={open}
        onOpenChange={(isOpen) => {
          if (!field?.disabled) {
            setOpen(isOpen);
            if (isOpen && onSelectClick) {
              onSelectClick();
            }
          }
        }}
        value={localValue}
        onValueChange={handleValueChange}
        disabled={field?.disabled}
      >
        <SelectTrigger
          className="w-full"
          onPointerDown={(e) => e.preventDefault()}
          disabled={field?.disabled}
        >
          <SelectValue
            placeholder={
              placeholder?.trim() ||
              field?.placeholder?.trim() ||
              "Select an option"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {resolvedOptions.length > 0 ? (
              resolvedOptions
                .filter((opt) => opt.trim() !== "")
                .map((option, idx) => (
                  <SelectItem key={`${option}-${idx}`} value={option}>
                    {option}
                  </SelectItem>
                ))
            ) : (
              <SelectItem value="" disabled>
                No options available
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
