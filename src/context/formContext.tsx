import { Answer } from "@/components/form_builder/FormPreview";
import { createContext, useState } from "react";
import { Condition, Field, FormStyles } from "../lib/types";

interface FormContextProps {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  formStyles: FormStyles;
  setFormStyles: React.Dispatch<React.SetStateAction<FormStyles>>;
  layout: "row" | "column";
  setLayout: React.Dispatch<React.SetStateAction<"row" | "column">>;
  conditions: Condition[];
  setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
  viewMode: "phone" | "desktop";
  setViewMode: React.Dispatch<React.SetStateAction<"phone" | "desktop">>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  activeField: Field | null;
  setActiveField: React.Dispatch<React.SetStateAction<Field | null>>;
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
}

export const FormContext = createContext<FormContextProps>({
  fields: [],
  setFields: () => {},
  formStyles: {
    page_properties: { color: "#f4f4f4", cover: "" },
    form_properties: {
      color: "#ffffff",
      cover: "",
      question_spacing: 16,
      label_width: 0,
      input_background_color: "transparent",
      input_border_color: "#b3b3b3",
    },
    font_properties: {
      font_family: "DM Sans",
      font_size: 14,
      font_color: "#b3b3b3",
    },
  },
  setFormStyles: () => {},
  layout: "row",
  setLayout: () => {},
  conditions: [],
  setConditions: () => {},
  viewMode: "desktop",
  setViewMode: () => {},
  title: "",
  setTitle: () => {},
  activeField: null,
  setActiveField: () => {},
  answers: [],
  setAnswers: () => {},
});

const CreateFormContext = ({ children }: { children: React.ReactNode }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [formStyles, setFormStyles] = useState<FormStyles>({
    page_properties: { color: "#f4f4f4", cover: "" },
    form_properties: {
      color: "#ffffff",
      cover: "",
      question_spacing: 16,
      label_width: 0,
      input_background_color: "transparent",
      input_border_color: "#b3b3b3",
    },
    font_properties: {
      font_family: "DM Sans",
      font_size: 14,
      font_color: "#000000",
    },
  });
  const [layout, setLayout] = useState<"row" | "column">("row");
  const [title, setTitle] = useState("Untitled Form");
  const [viewMode, setViewMode] = useState<"phone" | "desktop">("desktop");
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  return (
    <FormContext.Provider
      value={{
        fields,
        setFields,
        formStyles,
        setFormStyles,
        layout,
        setLayout,
        conditions,
        setConditions,
        viewMode,
        setViewMode,
        title,
        setTitle,
        activeField,
        setActiveField,
        answers,
        setAnswers,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default CreateFormContext;
