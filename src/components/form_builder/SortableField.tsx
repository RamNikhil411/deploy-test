import React, { useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2Icon } from "lucide-react";
import { FormContext } from "@/context/formContext";
import { renderField } from "@/utils/helpers/FieldRender";
import { motion } from "motion/react";

interface SortableFieldProps {
  id: string;
  field: any; // Replace with your specific field type
  onFieldClick: (id: string) => void;
  fieldDelete: (fieldId: string) => void;
  onSubFieldClick?: (fieldId: string, subFieldLabel: string | null) => void;
}

const SortableField: React.FC<SortableFieldProps> = ({
  id,
  field,
  onFieldClick,
  fieldDelete,
  onSubFieldClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "form-field",
      field,
      source: "canvas",
    },
    transition: {
      duration: 250,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const { layout } = useContext(FormContext);

  // Type-safe transform object
  const safeTransform = {
    x: transform?.x ?? 0,
    y: transform?.y ?? 0,
    scaleX: isDragging ? 1.02 : 1,
    scaleY: isDragging ? 1.02 : 1,
  };

  // Type-safe style object
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(safeTransform),
    transition: transition as string | undefined,
    zIndex: isDragging ? 999 : "auto",

    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    paddingInline: "1rem",
    borderRadius: "0.5rem",

    width: layout === "row" ? "100%" : field.width + "%",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "shadow-lg opacity-0 group  " : "group"}
    >
      <motion.div
        style={{ flex: 1, minWidth: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          onFieldClick(field.id);
        }}
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {renderField({
        ...field,
        onSubFieldClick: (subFieldLabel: string | null) =>
          onSubFieldClick && onSubFieldClick(id, subFieldLabel),
      })}
      </motion.div>
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          marginRight: "-0.5rem",
          color: "#9CA3AF",
        }}
        className="absolute right-1 opacity-0 group-hover:opacity-100 transition-all"
      >
        <GripVertical className="h-4 w-4 hover:text-gray-600" />
      </div>
      <div
        onClick={() => fieldDelete(field.id)}
        className=" opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <Trash2Icon className="h-4 w-4 hover:text-gray-600 stroke-red-400" />
      </div>
    </div>
  );
};

export default SortableField;
