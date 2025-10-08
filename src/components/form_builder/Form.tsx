import { getFormByIdQuery } from "@/components/core/FormQueries";
import FormPreview from "./FormPreview";

const Form = () => {
  const getFormData = getFormByIdQuery();
  return (
    <div className="h-screen">
      <FormPreview />
    </div>
  );
};

export default Form;
