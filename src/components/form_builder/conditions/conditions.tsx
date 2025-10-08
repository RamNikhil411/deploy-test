import ConditionIcon from "@/components/ui/icons/conditionIcon";
import { FormContext } from "@/context/formContext";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, PlusCircle, X } from "lucide-react";
import { useContext, useState } from "react";
import { Button } from "../../ui/button";

import { conditionItemConstants } from "@/lib/constants/conditionConstants";
import { Condition, conditionOption } from "@/lib/types";
import Conditions from "./ConditionBuilder";
import ConditionOption from "./conditionItem";

export default function ConditionBuilder() {
  const { conditions, setConditions } = useContext(FormContext);
  const [isAdding, setIsAdding] = useState(false);
  const { fields } = useContext(FormContext);
  const navigate = useNavigate();
  const { form_id } = useParams({ strict: false });

  const [options, setOptions] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<conditionOption | null>(
    null
  );

  const [formData, setFormData] = useState<Condition>({
    id: Date.now(),
    ifField: "",
    operator: "",
    value: "",
    action: "",
    targetFields: [],
  });

  const handleAddCondition = () => {
    setConditions((prev) => [...prev, { ...formData, id: Date.now() }]);
    setFormData({
      id: Date.now(),
      ifField: "",
      operator: "",
      value: "",
      action: "",
      targetFields: [],
    });
    setIsAdding(false);
    setSelectedOption(null);
  };

  const handleRemoveCondition = (id: number) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const selectedField = fields.find((f) => f.id === formData.ifField);
  const isSelectableField =
    selectedField?.type &&
    ["dropdown", "multiChoice", "radio"].includes(selectedField?.type);

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      <div className="p-4 max-w-2xl mx-auto border bg-white h-[calc(100vh-6rem)] overflow-auto rounded-lg shadow-none scrollbar-hide">
        <div className="flex gap-2 mb-4  justify-start items-center">
          <span
            onClick={() => navigate({ to: `/forms/${form_id}/form_builder` })}
            className="cursor-pointer text-gray-500 hover:text-gray-700 gap-2"
          >
            <ArrowLeft className="h-5 w-4" />
          </span>
          <div className="bg-lime-600 p-1.5 rounded text-white">
            {(selectedOption?.icon && (
              <selectedOption.icon className="h-5 w-4" />
            )) || <ConditionIcon className="h-5 w-4 " />}{" "}
          </div>
          <div className="flex flex-col">
            <h2>{selectedOption?.label || "Conditions"}</h2>
            <span className=" text-smd font-light">
              {selectedOption?.value ||
                " Automatically trigger an action if a condition is met"}
            </span>
          </div>
        </div>

        {!options && !isAdding && (
          <Button
            onClick={() => setOptions(true)}
            className="bg-lime-600 hover:bg-green-700 text-white px-4 py-2 w-full rounded cursor-pointer"
          >
            <PlusCircle className="" /> Add Condition
          </Button>
        )}

        {options &&
          conditionItemConstants.map((item) => (
            <ConditionOption
              key={item.label}
              option={item}
              setIsAdding={setIsAdding}
              setOptions={setOptions}
              setSelectedOption={setSelectedOption}
            />
          ))}

        {selectedOption && !options && (
          <Conditions
            formData={formData}
            setFormData={setFormData}
            fields={fields}
            handleAddCondition={handleAddCondition}
            isSelectableField={isSelectableField}
            selectedField={selectedField}
            setIsAdding={setIsAdding}
            setOptions={setOptions}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        )}

        {!options && !isAdding && conditions.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-md font-medium mb-2">Added Conditions</h3>
            <ul className="space-y-2">
              {conditions.map((c) => {
                const ifFieldLabel =
                  fields.find((f) => f.id === c.ifField)?.title || c.ifField;
                const targetFieldLabels = c.targetFields
                  .map((id) => fields.find((f) => f.id === id)?.title || id)
                  .join(", ");
                const CustomMessage = `${c.successText ? c.successText : ""} ${c.successSubtext ? c.successSubtext : ""}`;

                return (
                  <div
                    className="flex justify-between items-center p-2 border rounded"
                    key={c.id}
                  >
                    <div key={c.id} className="p-2 ">
                      IF <strong>{ifFieldLabel}</strong>{" "}
                      {c.operator.replace("_", " ")} {c.value} &#8594;{" "}
                      {c.action.toUpperCase()}{" "}
                      <strong>{CustomMessage || targetFieldLabels}</strong>
                    </div>
                    <Button
                      onClick={() => handleRemoveCondition(c.id)}
                      className="text-red-500 bg-transparent hover:bg-red-100 px-2 py-1 rounded cursor-pointer border shadow-none"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </ul>
          </div>
        ) : (
          !options &&
          !isAdding &&
          conditions.length === 0 && (
            <div className="mt-6">
              <hr className="mb-4" />
              <h1 className="text-lime-600">
                CREATE YOUR FIRST CONDITION HERE
              </h1>
              <div className="text-sm">
                You don't have any saved conditions yet. Click here to add a new
                condition.
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
