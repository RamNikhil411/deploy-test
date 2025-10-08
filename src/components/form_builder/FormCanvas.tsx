import { FormContext } from "@/context/formContext";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useContext, useEffect, useState } from "react";
import SortableField from "./SortableField";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";

const FormCanvas = ({
  fields,
  onFieldClick,
  fieldDelete,
  onSubFieldClick,
}: {
  fields: any[];
  onFieldClick: (fieldId: string) => void;
  fieldDelete: (fieldId: string) => void;
  onSubFieldClick?: (fieldId: string, subFieldLabel: string | null) => void;
}) => {
  const { setNodeRef } = useDroppable({
    id: "form-canvas",
    data: { type: "droppable-area" },
  });
  const { formStyles } = useContext(FormContext);

  const [pagePreviewImage, setPagePreviewImage] = useState<string | undefined>(
    undefined
  );
  const [formPreviewImage, setFormPreviewImage] = useState<string | undefined>(
    undefined
  );
  const { data: pageCover } = useDownloadUrl(
    formStyles?.page_properties?.cover
  );
  const { data: formCover } = useDownloadUrl(
    formStyles?.form_properties?.cover
  );
  useEffect(() => {
    setPagePreviewImage(pageCover?.target_url ?? undefined);
  }, [pageCover]);

  useEffect(() => {
    setFormPreviewImage(formCover?.target_url ?? undefined);
  }, [formCover]);

  return (
    <div
      id="page"
      style={{
        backgroundColor: formStyles?.page_properties?.color,
        backgroundImage: pagePreviewImage ? `url(${pagePreviewImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className=" pt-5 h-full w-full overflow-auto"
    >
      <div
        id="form-canvas"
        ref={setNodeRef}
        style={{
          backgroundColor: formStyles?.form_properties?.color,
          backgroundImage: formPreviewImage
            ? `url(${formPreviewImage})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-4/5 mx-auto h-full  p-4 scrollbar-hide rounded-md shadow overflow-auto"
      >
        <SortableContext
          items={(fields ?? []).map((f) => f.id)}
          strategy={rectSortingStrategy}
        >
          <div
            className="flex flex-wrap form-wrapper items-start "
            style={
              {
                fontFamily: formStyles?.font_properties?.font_family,
                gap: formStyles?.form_properties?.question_spacing,
                "--field-bg":
                  formStyles?.form_properties.input_background_color,
                "--field-border":
                  formStyles?.form_properties?.input_border_color,
                color: formStyles?.font_properties?.font_color,
              } as any
            }
          >
            {fields?.map((field) => (
              <SortableField
                key={field.id}
                id={field.id}
                field={field}
                onFieldClick={onFieldClick}
                fieldDelete={fieldDelete}
                onSubFieldClick={onSubFieldClick}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default FormCanvas;
