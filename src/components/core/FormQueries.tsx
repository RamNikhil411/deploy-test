import { FormContext } from "@/context/formContext";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useContext, useState } from "react";
import { getFormById } from "../https/services/form";

export const getFormByIdQuery = () => {
  const { form_id } = useParams({ strict: false });
  const [lastSavedTime, setLastSavedTime] = useState<number>(Date.now());
  const { setFields, setFormStyles, setLayout, setTitle, setConditions } =
    useContext(FormContext);

  const {} = useQuery({
    queryKey: ["form", form_id],
    queryFn: async () => {
      if (!form_id) return;
      const response = await getFormById(form_id);
      if (response?.data?.status_code === 200) {
        setFields(response?.data?.data?.form_fields || []);
        setTitle(response?.data?.data?.title);
        setLayout(response?.data?.data?.layout_options);
        setLastSavedTime(response?.data?.data?.updated_at);
        setConditions(response?.data?.data?.conditions || []);
        if (
          response?.data?.data?.form_styles &&
          typeof response.data.data.form_styles === "object" &&
          Object.keys(response.data.data.form_styles).length > 0
        ) {
          setFormStyles(response.data.data.form_styles);
        }
        return response?.data?.data;
      }
    },
    enabled: !!form_id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return getFormByIdQuery;
};
