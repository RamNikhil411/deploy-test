import { conditionOption } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import React from "react";

const ConditionOption = ({
  option,
  setIsAdding,
  setOptions,
  setSelectedOption,
}: {
  option: conditionOption;
  setIsAdding: any;
  setOptions: any;
  setSelectedOption: React.Dispatch<React.SetStateAction<conditionOption>>;
}) => {
  return (
    <div
      className="border flex justify-between items-center p-3 my-2 rounded-md bg-gray-50 group hover:bg-[linear-gradient(92deg,#FFF3DF_13.84%,#E9F8E0_87.71%)]"
      onClick={() => {
        setSelectedOption(option);
        setIsAdding(true);
        setOptions(false);
      }}
    >
      <div className="flex items-center gap-4">
        <div className="bg-lime-600 p-1.5 rounded text-white">
          {option.icon && <option.icon className="w-3.5 h-3.5" />}
        </div>
        <div>
          <div className="text-md">{option.label}</div>
          <div className="text-smd font-extralight">{option.value}</div>
        </div>
      </div>
      <div className="border p-0.5 rounded bg-gray-100 border-gray-200 group-hover:bg-white">
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default ConditionOption;
