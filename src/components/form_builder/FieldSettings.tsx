import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field } from "@/lib/types";
import { AlignJustify, AlignLeft, AlignRight, X } from "lucide-react";

interface FieldSettingsProps {
  activeField: Field | null;
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  setActiveField: React.Dispatch<React.SetStateAction<Field | null>>;
  fields: Field[];
  activeSubFieldLabel?: string | null;
  setActiveSubFieldLabel?: (label: string | null) => void;
}
export default function FieldSettings({
  activeField,
  setFields,
  setActiveField,
  fields,
  activeSubFieldLabel,
  setActiveSubFieldLabel,
}: FieldSettingsProps) {
  const handleFieldChange = (key: keyof Field, value: any) => {
    if (!activeField) return;
    const updatedFields = fields?.map((field) =>
      field.id === activeField.id ? { ...field, [key]: value } : field
    );
    const updatedActiveField =
      updatedFields?.find((f) => f.id === activeField.id) || null;

    setFields(updatedFields);
    setActiveField(updatedActiveField);
  };

  const handleSubFieldChange = (subfieldKey: string, value: any) => {
    if (!activeField) return;
    const updatedSubFields = activeField.subFields.map((subfield) =>
      subfield.label === subfieldKey
        ? {
            ...subfield,
            properties: {
              ...subfield.properties,
              visible: value,
            },
          }
        : subfield
    );
    handleFieldChange("subFields", updatedSubFields);
  };

  const updateSubField = (
    subfieldLabel: string,
    newSubfield: any,
    subFieldId?: string
  ) => {
    if (!activeField) return;
    const updatedSubFields = activeField.subFields.map((subfield) =>
      subFieldId
        ? subfield.id === subFieldId
          ? newSubfield
          : subfield
        : subfield.label === subfieldLabel
          ? newSubfield
          : subfield
    );

    const updatedFields = fields.map((field) =>
      field.id === activeField.id
        ? { ...field, subFields: updatedSubFields }
        : field
    );

    setFields(updatedFields);

    setActiveField({
      ...activeField,
      subFields: updatedSubFields,
    });
  };
  const renderSubFieldPlaceholders = (
    subFields: Field["subFields"],
    filterVisible = false
  ) => {
    const filteredSubFields = filterVisible
      ? subFields?.filter((subfield) => subfield.properties?.visible)
      : subFields;
    return filteredSubFields?.map((subfield, idx) => (
      <Input
        key={idx}
        value={subfield.properties?.placeholder || ""}
        onChange={(e) => {
          updateSubField(subfield.label, {
            ...subfield,
            properties: {
              ...subfield.properties,
              placeholder: e.target.value,
            },
          });
        }}
        placeholder={`Enter ${subfield.label}`}
        className="w-full focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    ));
  };

  const renderSubFieldLabels = (subFields: Field["subFields"]) => {
    return subFields?.map((subfield, idx) => (
      <Input
        key={`label-${idx}`}
        value={subfield.label || ""}
        onChange={(e) => {
          updateSubField(
            subfield.label,
            {
              ...subfield,
              label: e.target.value,
            },
            subfield.id
          );
        }}
        placeholder={`Label for ${subfield.type}`}
        className="w-full focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    ));
  };

  const handleAlignmentChange = (alignment: string) => {
    if (!activeField) return;
    handleFieldChange("fieldLabelProperties", {
      ...activeField?.fieldLabelProperties,
      textAlign: alignment,
    });
  };

  const handleFontSizeChange = (fontSize: string, subLabelFontSize: string) => {
    if (!activeField) return;
    handleFieldChange("fieldLabelProperties", {
      ...activeField.fieldLabelProperties,
      fontsize: fontSize,
      subLabelFontSize: subLabelFontSize,
    });
  };

  return (
    <div className="w-full p-4 border-l space-y-4 overflow-auto scrollbar-hide">
      <h2 className="text-lg capitalize">
        {activeField ? `${activeField.label} Settings` : "Select Elements"}
      </h2>
      {activeField && (
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4 mt-4">
            <div>
              <Label className="block text-sm font-normal">Label</Label>
              <Input
                value={activeField?.title ?? activeField.label ?? ""}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Enter label text"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {![
              "radio",
              "multiChoice",
              "image",
              "address",
              "fullName",
              "submit",
            ].includes(activeField?.type || "") && (
              <div>
                <Label className="block text-sm font-normal">
                  {activeField?.type === "heading"
                    ? "Subheading Text"
                    : "Placeholder"}
                </Label>
                <Input
                  value={activeField.placeholder || ""}
                  onChange={(e) =>
                    handleFieldChange("placeholder", e.target.value)
                  }
                  placeholder={`Enter ${activeField.type} `}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            )}
            {activeField?.type === "fullName" && (
              <div>
                <Label className="block text-sm font-normal">Labels</Label>
                <div className="space-y-2 mb-4">
                  {renderSubFieldLabels(activeField.subFields)}
                </div>
                <Label className="block text-sm font-normal">
                  Place Holders
                </Label>
                <div className="space-y-2">
                  {renderSubFieldPlaceholders(activeField.subFields)}
                </div>
              </div>
            )}
            {activeField?.type === "address" && (
              <>
                {/* Toggle which subfields are visible */}
                <div className="space-y-2">
                  <Label className="block text-sm font-normal">
                    Field Options
                  </Label>
                  {activeField?.subFields?.map((subfield) => (
                    <div
                      key={subfield.label}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`show-${subfield.label}`}
                        checked={subfield.properties?.visible || false}
                        onCheckedChange={(val) =>
                          handleSubFieldChange(subfield.label, val)
                        }
                      />
                      <Label
                        htmlFor={`show-${subfield.label}`}
                        className="cursor-pointer"
                        onClick={() => {
                          if (setActiveSubFieldLabel) {
                            setActiveSubFieldLabel(subfield.label);
                          }
                        }}
                      >
                        {subfield.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Label className="block text-sm font-normal">
                    Place Holder
                  </Label>
                  {renderSubFieldPlaceholders(activeField.subFields, true)?.map(
                    (placeholderInput, idx) => (
                      <div key={idx} className="flex flex-col gap-2 mt-2">
                        {placeholderInput}
                        {activeField.subFields?.filter(
                          (subfield) => subfield.properties?.visible
                        )[idx].type === "dropdown" &&
                          activeField.subFields?.filter(
                            (subfield) => subfield.properties?.visible
                          )[idx].label === activeSubFieldLabel && (
                            <div className="space-y-2">
                              <Label className="block text-sm font-normal">
                                {
                                  activeField.subFields?.filter(
                                    (subfield) => subfield.properties?.visible
                                  )[idx].label
                                }{" "}
                                Options
                              </Label>
                              {(
                                activeField.subFields?.filter(
                                  (subfield) => subfield.properties?.visible
                                )[idx].properties?.options || []
                              ).map((opt, optIdx) => (
                                <div
                                  key={optIdx}
                                  className="flex gap-2 items-center"
                                >
                                  <Input
                                    value={opt}
                                    onChange={(e) => {
                                      const subfield =
                                        activeField.subFields?.filter(
                                          (sf) => sf.properties?.visible
                                        )[idx];
                                      const updatedOptions = [
                                        ...(subfield.properties.options || []),
                                      ];
                                      updatedOptions[optIdx] = e.target.value;
                                      updateSubField(subfield.label, {
                                        ...subfield,
                                        properties: {
                                          ...subfield.properties,
                                          options: updatedOptions,
                                        },
                                      });
                                    }}
                                    placeholder={`Option ${optIdx + 1}`}
                                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const subfield =
                                        activeField.subFields?.filter(
                                          (sf) => sf.properties?.visible
                                        )[idx];
                                      const updatedOptions = (
                                        subfield.properties.options || []
                                      ).filter((_, i) => i !== optIdx);
                                      updateSubField(subfield.label, {
                                        ...subfield,
                                        properties: {
                                          ...subfield.properties,
                                          options: updatedOptions,
                                        },
                                      });
                                    }}
                                    className="text-gray-500 hover:text-red-600"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const subfield =
                                    activeField.subFields?.filter(
                                      (sf) => sf.properties?.visible
                                    )[idx];
                                  updateSubField(subfield.label, {
                                    ...subfield,
                                    properties: {
                                      ...subfield.properties,
                                      options: [
                                        ...(subfield.properties?.options || []),
                                        `${subfield.label} ${
                                          (subfield.properties?.options
                                            ?.length ?? 0) + 1
                                        }`,
                                      ],
                                    },
                                  });
                                }}
                              >
                                + Add Option
                              </Button>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
              </>
            )}
            {["dropdown", "radio", "multiChoice"].includes(
              activeField?.type || ""
            ) && (
              <div className="space-y-2">
                <Label className="block text-sm font-normal">Options</Label>
                {(activeField?.options || [])?.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [
                          ...(activeField?.options || []),
                        ];
                        updatedOptions[index] = e.target.value;
                        handleFieldChange("options", updatedOptions);
                      }}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedOptions = (
                          activeField?.options || []
                        ).filter((_, i) => i !== index);
                        handleFieldChange("options", updatedOptions);
                      }}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    handleFieldChange("options", [
                      ...(activeField?.options || []),
                      `Option ${(activeField.options?.length ?? 0) + 1}`,
                    ])
                  }
                >
                  Add Option
                </Button>
              </div>
            )}
            {activeField?.type === "phone" && (
              <div className="space-y-4 ">
                <div className="flex items-center justify-between pt-4">
                  <Label className="text-sm">Country Code</Label>
                  <Switch
                    checked={activeField?.countryCode || false}
                    onCheckedChange={(value) =>
                      handleFieldChange("countryCode", value)
                    }
                    className="bg-green-300"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="block text-sm font-normal">
                    Input Mask
                  </Label>
                  <Input
                    value={activeField?.inputMask || ""}
                    onChange={(e) =>
                      handleFieldChange("inputMask", e.target.value)
                    }
                    placeholder="0000 000 000"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            )}
            {activeField?.type === "heading" && (
              <div>
                <Label className="block text-sm font-normal">
                  Label Font Size
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleFontSizeChange("20px", "14px")}
                    className={`${
                      activeField?.fieldLabelProperties?.fontsize === "20px"
                        ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-200 hover:border-green-600 hover:text-green-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Default
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFontSizeChange("30px", "16px")}
                    className={`${
                      activeField?.fieldLabelProperties?.fontsize === "30px"
                        ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-200 hover:border-green-600 hover:text-green-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Large
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFontSizeChange("18px", "12px")}
                    className={`${
                      activeField?.fieldLabelProperties?.fontsize === "18px"
                        ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-200 hover:border-green-600 hover:text-green-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Small
                  </Button>
                </div>
              </div>
            )}

            {/* Required */}
            <div className="flex items-center justify-between pt-4">
              <Label className="text-sm">Required</Label>
              <Switch
                checked={activeField?.required || false}
                onCheckedChange={(value) =>
                  handleFieldChange("required", value)
                }
                className="bg-green-300"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <Label className="text-sm">Disable</Label>
              <Switch
                checked={activeField?.disabled || false}
                onCheckedChange={(value) =>
                  handleFieldChange("disabled", value)
                }
                className="bg-green-300"
              />
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-4">
            {activeField?.type === "submit" && (
              <div className="space-y-2">
                <Label className="font-normal">Button Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    className="w-4/5 shrink-0 h-8 bg-gray-200 rounded focus-visible:ring-0"
                    value={
                      activeField?.fieldLabelProperties?.color || "#000000"
                    }
                    onChange={(e) =>
                      handleFieldChange("fieldLabelProperties", {
                        ...activeField?.fieldLabelProperties,
                        color: e.target.value,
                      })
                    }
                  />
                  <input
                    type="color"
                    className="h-8 w-8 p-0 border-0 rounded-full cursor-pointer appearance-none
                 [&::-webkit-color-swatch-wrapper]:p-0
                 [&::-webkit-color-swatch-wrapper]:rounded-full
                 [&::-webkit-color-swatch]:rounded-full"
                    value={
                      activeField?.fieldLabelProperties?.color || "#000000"
                    }
                    onChange={(e) =>
                      handleFieldChange("fieldLabelProperties", {
                        ...activeField?.fieldLabelProperties,
                        color: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <Label className="font-normal">Label Width</Label>
            <Input
              className="w-4/5 h-8 bg-gray-200 rounded focus-visible:ring-0"
              placeholder="0"
              type="number"
            />
            <Label className="font-normal">Label Alignment</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAlignmentChange("left")}
                className={` border rounded focus-visible:ring-0  cursor-pointer ${
                  activeField?.fieldLabelProperties?.textAlign === "left"
                    ? "bg-lime-500 border-lime-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <AlignLeft
                  className={`w-8 h-6 ${
                    activeField?.fieldLabelProperties?.textAlign === "left"
                      ? "stroke-white"
                      : "stroke-black"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => handleAlignmentChange("center")}
                className={` border rounded focus-visible:ring-0 cursor-pointer ${
                  activeField?.fieldLabelProperties?.textAlign === "center"
                    ? "bg-lime-500 border-lime-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <AlignJustify
                  className={`w-8 h-6 ${
                    activeField?.fieldLabelProperties?.textAlign === "center"
                      ? "stroke-white"
                      : "stroke-black"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => handleAlignmentChange("right")}
                className={` border rounded focus-visible:ring-0 cursor-pointer ${
                  activeField?.fieldLabelProperties?.textAlign === "right"
                    ? "bg-lime-500 border-lime-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <AlignRight
                  className={`w-8 h-6 ${
                    activeField?.fieldLabelProperties?.textAlign === "right"
                      ? "stroke-white"
                      : "stroke-black"
                  }`}
                />
              </button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
