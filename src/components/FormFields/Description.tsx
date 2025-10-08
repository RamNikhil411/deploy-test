import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/lib/types";

interface DescriptionProps {
  field?: Field;
  value?: string | number | string[] | { [key: string]: string | number };
  onChange?: (value: string) => void;
  maxLength?: number;
  rows?: number;
}

export default function Description({
  field,
  value,
  onChange,
  maxLength = 500,
  rows = 4,
}: DescriptionProps) {
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (typeof value === "string") {
      setDescription(value);
    } else {
      setDescription("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    onChange?.(newValue);
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

        <Textarea
          id={field?.id || "description"}
          placeholder={field?.placeholder?.trim() || "Enter Description"}
          value={description}
          onChange={handleChange}
          rows={rows}
          className="min-h-[100px]"
          disabled={field?.disabled}
        />
      </div>
    </div>
  );
}
