import { FormContext } from "@/context/formContext";

import { renderField } from "@/utils/helpers/FieldRender";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FieldPalette from "./FieldPalette";
import FieldSettings from "./FieldSettings";
import FormCanvas from "./FormCanvas";

interface Field {
  id: string;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  title?: string;
  type: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  subFields?: {
    id: string;
    label: string;
    type: string;
    visible: boolean;
    properties?: {
      options?: string[];
    };
  };
  properties?: {
    placeholder?: string;
    options?: string[];
    required?: boolean;
    value?: string | number;
    fieldLabelProperties?: {
      color?: string;
      fontsize?: string;
      fontFamily?: string;
      textAlign?: string;
    };
  };
  width?: number;
  disable?: boolean;
  fieldLabelProperties?: {
    color?: string;
    fontsize?: string;
    fontFamily?: string;
    textAlign?: string;
  };
}

const FormBuilder = () => {
  const { fields, activeField, setActiveField, setFields } =
    useContext(FormContext);

  const [activeSubFieldLabel, setActiveSubFieldLabel] = useState<string | null>(
    null
  );
  const [draggedFromPalette, setDraggedFromPalette] = useState<Field | null>(
    null
  );
  const [draggedFromCanvas, setDraggedFromCanvas] = useState<Field | null>(
    null
  );
  const [title, setTitle] = useState("Untitled Form");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const fieldData = active.data.current?.field;
    const isFromPalette = active.data.current?.isFromPalette;

    if (isFromPalette && fieldData) {
      setDraggedFromPalette(fieldData);
    } else if (fieldData) {
      setDraggedFromCanvas(fieldData);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setDraggedFromPalette(null);
      setDraggedFromCanvas(null);
      return;
    }

    if (draggedFromPalette) {
      const newField: Field = {
        id: uuidv4(),
        label: draggedFromPalette.label || "Untitled Field",
        title:
          draggedFromPalette.title ||
          draggedFromPalette.label ||
          "Untitled Field",
        type: draggedFromPalette.type || "text",
        placeholder: draggedFromPalette?.properties?.placeholder,
        options: draggedFromPalette?.properties?.options,
        required: draggedFromPalette?.properties?.required,
        subFields: draggedFromPalette?.subFields,
        width: draggedFromPalette.width,
        fieldLabelProperties:
          draggedFromPalette?.properties?.fieldLabelProperties,
      };

      // Insert at the hovered field's index
      const insertIndex = fields?.findIndex((field) => field.id === over.id);

      const updatedFields = [...fields];

      if (insertIndex === -1) {
        updatedFields.push(newField);
      } else {
        updatedFields.splice(insertIndex, 0, newField);
      }

      setFields(updatedFields);
      setActiveField(newField);
    } else if (draggedFromCanvas) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const updated = arrayMove(fields, oldIndex, newIndex);
        setFields(updated);
      }
    }

    setDraggedFromPalette(null);
    setDraggedFromCanvas(null);
  };

  const handleFieldClick = (fieldId: string) => {
    const clickedField = fields.find((f) => f.id === fieldId) || null;
    setActiveField(clickedField);
    setActiveSubFieldLabel(null);
  };

  const handleSubFieldClick = (
    fieldId: string,
    subFieldLabel: string | null
  ) => {
    const clickedField = fields.find((f) => f.id === fieldId) || null;
    if (clickedField && clickedField.id !== activeField?.id) {
      setActiveField(clickedField);
    }
    setActiveSubFieldLabel(subFieldLabel);
  };
  const handleDeleteField = (fieldId: string) => {
    const updatedFields = fields.filter((f) => f.id !== fieldId);
    setFields(updatedFields);
    if (activeField?.id === fieldId) {
      setActiveField(null);
      setActiveSubFieldLabel(null);
    }
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="h-screen">
        <div>
          <div className="grid grid-cols-[23%_54%_23%] h-[calc(100vh-60px)]">
            <FieldPalette title={title} setTitle={setTitle} />
            <FormCanvas
              fields={fields}
              onFieldClick={handleFieldClick}
              fieldDelete={handleDeleteField}
              onSubFieldClick={handleSubFieldClick}
            />
            <FieldSettings
              activeField={activeField}
              setActiveField={setActiveField}
              activeSubFieldLabel={activeSubFieldLabel}
              setActiveSubFieldLabel={setActiveSubFieldLabel}
              setFields={setFields}
              fields={fields}
            />
          </div>

          <DragOverlay dropAnimation={null}>
            {draggedFromPalette ? (
              <div className="border border-gray-300 rounded-md p-2 flex justify-between items-center bg-white shadow-md opacity-80 relative">
                <div className="font-normal text-[15px] text-slate-800">
                  {draggedFromPalette.label}
                </div>
                <div>
                  {draggedFromPalette.icon && (
                    <draggedFromPalette.icon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            ) : draggedFromCanvas ? (
              <div className="border border-blue-300 rounded-md p-4 bg-white opacity-80 shadow-lg w-full">
                {renderField(draggedFromCanvas)}
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </div>
    </DndContext>
  );
};

export default FormBuilder;
