import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/lib/types";
import DropDown from "./DropDown";
import { normalizeKey } from "@/utils/helpers/form_functions";
import { useEffect, useState } from "react";

export default function Address({
  field,
  onSubFieldClick,
  value,
  onChange,
}: {
  field: Field;
  onSubFieldClick?: (subFieldLabel: string | null) => void;
  value?:
    | string
    | number
    | string[]
    | { [subFieldLabel: string]: string | number };
  onChange?: (value: string | number, subFieldLabel?: string) => void;
}) {
  // Initialize local state with the current value or empty object
  const [localValues, setLocalValues] = useState<{
    [key: string]: string | number;
  }>({});

  // Sync local state when the external value changes
  useEffect(() => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      setLocalValues(value as { [key: string]: string | number });
    }
  }, [value]);

  const handleInputChange = (
    inputValue: string | number,
    subFieldLabel: string
  ) => {
    // Update local state immediately
    const newValues = {
      ...localValues,
      [subFieldLabel]: inputValue,
    };
    setLocalValues(newValues);

    // Notify parent component of the change
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
      <div className="w-full flex flex-wrap gap-2">
        {field?.subFields?.find((sf) => sf.label === "Street Address")
          ?.properties?.visible && (
          <div className="min-w-[49%] max-w-[100%] flex-[1_0_49%]">
            <Input
              placeholder={
                field?.subFields
                  ?.find((sf) => sf.label === "Street Address")
                  ?.properties?.placeholder?.trim()
                  ? field.subFields?.find((sf) => sf.label === "Street Address")
                      ?.properties?.placeholder
                  : "Enter Street Address"
              }
              className="focus-visible:ring-0 py-0 focus-visible:ring-offset-0"
              value={localValues[normalizeKey("Street Address")] || ""}
              onChange={(e) =>
                handleInputChange(
                  e.target.value,
                  normalizeKey("Street Address")
                )
              }
            />
          </div>
        )}
        {field?.subFields?.find((sf) => sf.label === "City")?.properties
          ?.visible && (
          <div className="min-w-[49%] max-w-[100%] flex-[1_0_49%]">
            <DropDown
              placeholder={
                field?.subFields?.find((sf) => sf.label === "City")?.properties
                  ?.placeholder ?? "Select City"
              }
              options={
                field?.subFields?.find((sf) => sf.label === "City")?.properties
                  ?.options ?? []
              }
              onSelectClick={() => onSubFieldClick && onSubFieldClick("City")}
              value={localValues[normalizeKey("City")] || ""}
              onChange={(val) => {
                handleInputChange(val, normalizeKey("City"));
              }}
            />
          </div>
        )}
        {field?.subFields?.find((sf) => sf.label === "State")?.properties
          ?.visible && (
          <div className="min-w-[49%] max-w-[100%] flex-[1_0_49%]">
            <DropDown
              placeholder={
                field?.subFields?.find((sf) => sf.label === "State")?.properties
                  ?.placeholder ?? "Select State"
              }
              options={
                field?.subFields?.find((sf) => sf.label === "State")?.properties
                  ?.options ?? []
              }
              onSelectClick={() => onSubFieldClick && onSubFieldClick("State")}
              value={localValues[normalizeKey("State")] || ""}
              onChange={(val) => handleInputChange(val, normalizeKey("State"))}
            />
          </div>
        )}
        {field?.subFields?.find((sf) => sf.label === "Country")?.properties
          ?.visible && (
          <div className="min-w-[49%] max-w-[100%] flex-[1_0_49%]">
            <DropDown
              placeholder={
                field?.subFields?.find((sf) => sf.label === "Country")
                  ?.properties?.placeholder ?? "Select Country"
              }
              options={
                field?.subFields?.find((sf) => sf.label === "Country")
                  ?.properties?.options ?? []
              }
              onSelectClick={() =>
                onSubFieldClick && onSubFieldClick("Country")
              }
              value={localValues[normalizeKey("Country")] || ""}
              onChange={(val) =>
                handleInputChange(val, normalizeKey("Country"))
              }
            />
          </div>
        )}
        {field?.subFields?.find((sf) => sf.label === "Postal Code")?.properties
          ?.visible && (
          <div className="min-w-[49%] max-w-[100%] flex-[1_0_49%]">
            <Input
              placeholder={
                field?.subFields
                  ?.find((sf) => sf.label === "Postal Code")
                  ?.properties?.placeholder?.trim()
                  ? field.subFields?.find((sf) => sf.label === "Postal Code")
                      ?.properties?.placeholder
                  : "Enter Postal Code"
              }
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              value={localValues[normalizeKey("Postal Code")] || ""}
              onChange={(e) =>
                handleInputChange(e.target.value, normalizeKey("Postal Code"))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
