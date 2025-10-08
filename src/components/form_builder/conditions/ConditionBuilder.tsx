import FormSuccess from "@/components/Forms/FormSuccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { conditionOption } from "@/lib/types";

interface conditionProps {
  formData: any;
  setFormData: any;
  fields: any[];
  handleAddCondition: any;
  isSelectableField: any;
  selectedField: any;
  setIsAdding: any;
  setOptions: any;
  selectedOption: conditionOption;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<conditionOption | null>
  >;
}

const Conditions = ({
  formData,
  setFormData,
  fields,
  handleAddCondition,
  isSelectableField,
  selectedField,
  setIsAdding,
  setOptions,
  selectedOption,
  setSelectedOption,
}: conditionProps) => {
  return (
    <div className="mt-4 p-2 rounded ">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 border border-lime-600 rounded p-2">
          <div className="flex gap-6 justify-center items-center">
            <Label className="block text-sm font-medium w-24">IF</Label>
            <Select
              value={formData.ifField}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  ifField: val,
                  operator: "",
                  value: "",
                })
              }
            >
              <SelectTrigger className="w-full border rounded px-2 py-1">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((f, idx) => (
                  <SelectItem
                    key={f.id}
                    value={f.id}
                    disabled={f.type === "heading"}
                  >
                    {idx + 1}. {f.title || f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-6 justify-center items-center">
            <Label className="block text-sm font-medium w-24">State</Label>
            <Select
              value={formData.operator}
              onValueChange={(val) =>
                setFormData({ ...formData, operator: val })
              }
            >
              <SelectTrigger
                className={`w-full border rounded px-2 py-1 ${formData.ifField ? "" : "pointer-events-none opacity-50"}`}
              >
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {isSelectableField && (
                  <>
                    <SelectItem value="equals">Is Equal to</SelectItem>
                    <SelectItem value="not_equals">Is Not Equal to</SelectItem>
                  </>
                )}
                <SelectItem value="is_Filled">Is Filled</SelectItem>
                <SelectItem value="is_Empty">Is Empty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isSelectableField &&
            ["equals", "not_equals"].includes(formData.operator) && (
              <div className="flex gap-6 justify-center items-center">
                <Label className="block text-sm font-medium w-24">Value</Label>

                <Select
                  value={formData.value}
                  onValueChange={(val) =>
                    setFormData({ ...formData, value: val })
                  }
                >
                  <SelectTrigger className="w-full border rounded px-2 py-1">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedField?.options?.map((opt, idx) => (
                      <SelectItem key={idx} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
        </div>

        <div className="flex flex-col gap-3 border border-lime-600 rounded p-2 ">
          <div className="flex gap-6 justify-center items-center">
            <Label className="block text-sm font-medium w-24">Do</Label>
            <Select
              value={formData.action}
              onValueChange={(val) => setFormData({ ...formData, action: val })}
            >
              <SelectTrigger className="w-full border rounded px-2 py-1">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {selectedOption?.action.map((a: string) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {["Copy Field Value"].includes(formData.action) && (
            <div className="flex gap-6 justify-center items-center">
              <Label className="block text-sm font-medium w-24">From </Label>
              <Select
                value={formData.fromFields?.[0] || ""}
                onValueChange={(val) =>
                  setFormData({ ...formData, fromFields: [val] })
                }
              >
                <SelectTrigger className="w-full border rounded px-2 py-1">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((f, idx) => (
                    <SelectItem key={f.id} value={f.id}>
                      {idx + 1}. {f.title || f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {["Copy Multiple Field Values"].includes(formData.action) && (
            <div className="flex gap-6 justify-center items-center">
              <Label className="block shrink text-sm font-medium w-20">
                From{" "}
              </Label>
              <div className="flex-1">
                <MultiSelect
                  options={fields}
                  defaultValue={formData.fromFields}
                  onValueChange={(vals) =>
                    setFormData({ ...formData, fromFields: vals })
                  }
                />
              </div>
            </div>
          )}

          {["Show Custom Message"].includes(formData.action) ? (
            <div className="flex flex-col gap-6 justify-center items-center">
              <div className="flex gap-4 items-center">
                <Label className="block text-sm font-medium w-24">
                  Heading
                </Label>
                <Input
                  value={
                    formData.successText ?? "Thank You for Submitting the form!"
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, successText: e.target.value })
                  }
                  placeholder="Enter success heading"
                  className="w-80 border rounded px-2 py-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Input for custom subtext */}
              <div className="flex gap-4 items-center">
                <Label className="block text-sm font-medium w-24">
                  Message
                </Label>
                <Textarea
                  value={
                    formData.successSubtext ??
                    "Your response has been recorded successfully. Our team will review it shortly."
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, successSubtext: e.target.value })
                  }
                  placeholder="Enter success message"
                  className="w-80 border rounded px-2 py-1 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <FormSuccess
                text={formData.successText}
                subtext={formData.successSubtext}
              />
            </div>
          ) : (
            <div className="flex gap-6 justify-center items-center">
              <Label
                className={`block text-sm font-medium  ${formData.action === "Hide Multiple" || formData.action === "Show Multiple" || formData.action === "Require Multiple" || formData.action === "Don't Require Multiple" ? "w-20" : "w-24"}`}
              >
                {" "}
                {["Copy Field Value"].includes(formData.action)
                  ? "To"
                  : "Fields"}{" "}
              </Label>
              {formData.action === "Redirect to URL" ? (
                <Input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={formData.targetFields[0] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetFields: [e.target.value],
                    })
                  }
                />
              ) : formData.action === "Show Multiple" ||
                formData.action === "Hide Multiple" ||
                formData.action === "Require Multiple" ||
                formData.action === "Don't Require Multiple" ? (
                <div className="flex-1">
                  <MultiSelect
                    options={fields}
                    defaultValue={formData.targetFields}
                    onValueChange={(vals) =>
                      setFormData({ ...formData, targetFields: vals })
                    }
                  />
                </div>
              ) : (
                <>
                  <Select
                    value={formData.targetFields[0] || ""}
                    onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        targetFields: [val],
                      })
                    }
                  >
                    <SelectTrigger
                      className={`w-full border rounded px-2 py-1 ${formData.action ? "" : "pointer-events-none opacity-50"}`}
                    >
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f, idx) => (
                        <SelectItem
                          key={f.id}
                          value={f.id}
                          disabled={f.type === "heading"}
                        >
                          {idx + 1}. {f.title || f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 justify-end">
          <Button
            onClick={handleAddCondition}
            className="bg-lime-600 hover:bg-green-700 text-white px-4 py-2  rounded cursor-pointer"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setIsAdding(false);
              setFormData({
                id: Date.now(),
                ifField: "",
                operator: "",
                value: "",
                action: "",
                targetFields: [],
              });
              setOptions(true);
              setSelectedOption(null);
            }}
            className="bg-gray-200 px-4 py-2 rounded text-black hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
