// FormField.tsx

import { useDraggable } from "@dnd-kit/core";

const FormField = ({ field }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${field.label}`,
    data: {
      type: "form-field",
      field,
      isFromPalette: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="border  border-gray-300 flex items-center justify-between rounded-md p-2 cursor-move"
    >
      <div className="font-normal text-sm text-slate-800">{field.label}</div>
      <div>
        {field.icon && <field.icon className="w-5 h-5 text-lime-600" />}
      </div>
    </div>
  );
};

export default FormField;
