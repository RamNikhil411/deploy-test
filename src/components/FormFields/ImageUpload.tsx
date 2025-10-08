import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Field } from "@/lib/types";

export default function ImageUpload({
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
  onChange?: (value: string | number) => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  return (
    <div className="flex w-full gap-2">
      <div className="flex flex-col gap-1 w-full">
        <Label
          htmlFor="image"
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
          id="image"
          placeholder="Image"
          type="file"
          value={value as string}
          onChange={(e) => {
            setImage(e.target.files![0]);
            onChange?.(e.target.value);
          }}
          disabled={field?.disabled}
        />
      </div>
    </div>
  );
}
