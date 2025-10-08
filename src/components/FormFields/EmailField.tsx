import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/lib/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames

interface EmailFieldProps {
  field?: Field;
  value?: string | number | string[] | { [key: string]: string | number };
  onChange?: (value: string) => void;
  validateOnBlur?: boolean;
}

export default function EmailField({
  field,
  value,
  onChange,
  validateOnBlur = true,
}: EmailFieldProps) {
  const [localValue, setLocalValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [touched, setTouched] = useState<boolean>(false);

  useEffect(() => {
    if (typeof value === "string") {
      setLocalValue(value);
    } else {
      setLocalValue("");
    }
  }, [value]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);

    if (touched) {
      setIsValid(validateEmail(newValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      setIsValid(validateEmail(localValue));
    }
  };

  return (
    <div className="flex w-full gap-2">
      <div className="flex flex-col gap-1 w-full">
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
          placeholder={field?.placeholder?.trim() || "Enter Email"}
          type="email"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            !isValid && touched && "border-red-500 focus:border-red-500"
          )}
          disabled={field?.disabled}
        />
        {!isValid && touched && (
          <p className="text-xs text-red-500 mt-1">
            Please enter a valid email address
          </p>
        )}
      </div>
    </div>
  );
}
