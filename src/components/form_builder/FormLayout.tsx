import { getFormByIdQuery } from "@/components/core/FormQueries";
import { updateFormById } from "@/components/https/services/form";
import { FormContext } from "@/context/formContext";
import { Condition, Field, FormStyles, APIResponse } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { Outlet, useParams } from "@tanstack/react-router";
import { useContext, useEffect, useRef, useState } from "react";
import BuilderLayout from "./FormBuilderNavBar";

type UpdateFormPayload = {
  form_fields: Field[];
  form_styles: FormStyles;
  title: string;
  layout_options: "row" | "column";
  conditions: Condition[];
};
const FormLayout = () => {
  const { form_id } = useParams({ strict: false });
  const [lastSavedTime, setLastSavedTime] = useState<number>(Date.now());
  const {
    viewMode,
    setViewMode,
    fields,
    formStyles,
    layout,
    title,
    conditions,
  } = useContext(FormContext);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasLoadedRef = useRef(false);

  const getFormData = getFormByIdQuery();

  const { mutate: UpdateForm, isPending: formUpdating } = useMutation<
    APIResponse,
    Error,
    UpdateFormPayload
  >({
    mutationKey: ["UpdateForm"],
    mutationFn: async (payload: UpdateFormPayload) => {
      const response = await updateFormById(form_id, payload);
      return response?.data;
    },
    onSuccess: () => {
      setLastSavedTime(Date.now());
    },
  });

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      UpdateForm({
        form_fields: fields,
        form_styles: formStyles,
        title: title,
        layout_options: layout,
        conditions: conditions,
      });
    }, 1000);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fields, formStyles, title, layout, conditions]);

  return (
    <div className="h-screen overflow-hidden">
      <BuilderLayout
        isUpdating={formUpdating}
        lastSavedAt={lastSavedTime}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className="h-[calc(100vh-58px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default FormLayout;
