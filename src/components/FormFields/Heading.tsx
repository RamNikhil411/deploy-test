import { Field } from "@/lib/types";
import { Label } from "../ui/label";
import { useContext } from "react";
import { FormContext } from "@/context/formContext";
import { Input } from "../ui/input";

export default function Heading({ field }: { field?: Field }) {
  const { activeField, setActiveField, setFields } = useContext(FormContext);
  return (
    <div className="flex w-full gap-2">
      <div className="flex flex-col gap-1 w-full">
        <div className="space-y-2">
          <Label
            className={`${
              field?.fieldLabelProperties?.textAlign === "center"
                ? "justify-center"
                : field?.fieldLabelProperties?.textAlign === "right"
                  ? "justify-end"
                  : "justify-start"
            }`}
            style={{
              fontSize: field?.fieldLabelProperties?.fontsize,
            }}
          >
            {field?.title ?? field?.label ?? " "}
            {field?.required && <span className="text-red-500">&#42;</span>}
          </Label>
          {activeField?.id === field?.id ? (
            <Input
              value={field?.placeholder}
              placeholder="Enter Sub Heading"
              onChange={(e) => {
                const newValue = e.target.value;

                setFields((prevFields) => {
                  const updatedFields = prevFields.map((f) => {
                    if (f.id === field?.id) {
                      return { ...f, placeholder: newValue };
                    }
                    return f;
                  });

                  // Update activeField here
                  const updatedActiveField =
                    updatedFields.find((f) => f.id === field?.id) || null;
                  setActiveField(updatedActiveField);

                  return updatedFields;
                });
              }}
            />
          ) : field?.placeholder ? (
            <Label
              className={`${
                field?.fieldLabelProperties?.textAlign === "center"
                  ? "justify-center"
                  : field?.fieldLabelProperties?.textAlign === "right"
                    ? "justify-end"
                    : "justify-start"
              }`}
              style={{
                fontSize: field?.fieldLabelProperties?.subLabelFontSize,
              }}
            >
              {field?.placeholder?.trim()
                ? field?.placeholder
                : "Enter Heading"}
            </Label>
          ) : null}
        </div>
      </div>
    </div>
  );
}
