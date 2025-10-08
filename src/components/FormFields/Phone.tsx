import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/lib/types";
import { useEffect, useState } from "react";

interface PhoneFieldProps {
  field?: Field;
  value?: string | number | string[] | { [key: string]: string | number };
  onChange?: (value: string) => void;
}

export default function Phone({ field, value, onChange }: PhoneFieldProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // Sync local state with external value
  useEffect(() => {
    if (typeof value === "string") {
      setPhoneNumber(value);
    } else if (typeof value === "number") {
      setPhoneNumber(value.toString());
    } else {
      setPhoneNumber("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    onChange?.(value);
  };

  return (
    <div className="flex w-full gap-2">
      <div className="flex flex-col gap-1 w-full">
        <Label
          htmlFor="phone"
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
          placeholder={field?.placeholder?.trim() || "Enter Phone"}
          type="tel"
          value={phoneNumber}
          onChange={handleChange}
          disabled={field?.disabled}
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}
