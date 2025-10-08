import { FormContext } from "@/context/formContext";
import { Field } from "@/lib/types";
import ConditionalRendering from "@/utils/helpers/ConditonalRendering";
import { renderField } from "@/utils/helpers/FieldRender";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { useContext, useEffect, useState } from "react";

export interface Answer {
  id: string;
  value:
    | string
    | number
    | string[]
    | { [subFieldLabel: string]: string | number };
}

const FormPreview = () => {
  const [visibleFields, setVisibleFields] = useState<Field[]>([]);

  const getAnswerByFieldId = (fieldId: string) => {
    const answerObj = answers.find((a) => a.id === fieldId);
    return answerObj?.value;
  };
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const [successMessage, setSuccessMessage] = useState<{
    text: string;
    subtext: string;
  } | null>(null);
  const {
    fields,
    formStyles,
    layout,
    viewMode,
    conditions,
    setConditions,
    answers,
    setAnswers,
  } = useContext(FormContext);

  const handleAnswerChange = (
    fieldId: string,
    value: string | number | string[],
    subFieldLabel?: string
  ) => {
    setAnswers((prev) => {
      const index = prev.findIndex((a) => a.id === fieldId);

      if (index === -1) {
        if (subFieldLabel) {
          return [
            ...prev,
            {
              id: fieldId,
              value: { [subFieldLabel]: value as string | number },
            },
          ];
        }
        return [...prev, { id: fieldId, value }];
      }

      const updated = [...prev];
      if (subFieldLabel) {
        updated[index].value = {
          ...(updated[index].value as object),
          [subFieldLabel]: value as string | number,
        };
      } else {
        updated[index].value = value;
      }
      return updated;
    });
  };

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

  useEffect(() => {
    const { visibleFields, updatedAnswers } = ConditionalRendering(
      fields,
      conditions,
      answers
    );
    setVisibleFields(visibleFields);
    setSuccessMessage(successMessage);
    if (Object.keys(updatedAnswers).length > 0) {
      setAnswers((prev) => {
        let changed = false;
        const updated = prev.map((a) => {
          if (
            updatedAnswers[a.id] !== undefined &&
            a.value !== updatedAnswers[a.id]
          ) {
            changed = true;
            return { ...a, value: updatedAnswers[a.id] };
          }
          return a;
        });

        Object.entries(updatedAnswers).forEach(([id, value]) => {
          if (!updated.find((a) => a.id === id)) {
            changed = true;
            updated.push({ id, value });
          }
        });

        return changed ? updated : prev;
      });
    }
  }, [fields, conditions, answers]);

  const handleSubmit = () => {
    conditions.forEach((cond) => {
      const answer = answers.find((a) => a.id === cond.ifField);
      if (!answer) return;
      const answerValue = answer.value;
      let conditionMet = false;

      if (Array.isArray(answerValue)) {
        conditionMet = answerValue.includes(cond.value);
      } else {
        conditionMet = answerValue === cond.value;
      }
      if (conditionMet && cond.action === "Redirect to URL") {
        if (cond.targetFields && cond.targetFields.length > 0) {
          let url = cond.targetFields[0];
          if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
          }
          window.open(url, "_blank");
        }
      }
    });
  };

  return (
    <div className="h-full">
      <div
        style={{
          backgroundColor: formStyles?.page_properties?.color,
          backgroundImage: pagePreviewImage
            ? `url(${pagePreviewImage})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className=" h-full"
      >
        <div className="h-full p-2">
          {viewMode === "phone" ? (
            <div className="ring-[24px] ring-slate-50 rounded-lg h-full mx-auto w-1/5">
              <div
                style={{
                  backgroundColor: formStyles?.form_properties?.color,
                  // backgroundImage: formStyles.form_properties.cover
                  //   ? `url(${formStyles.form_properties.cover})`
                  //   : "none",
                  backgroundImage: formPreviewImage
                    ? `url(${formPreviewImage})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="p-4 h-full  flex flex-col bg-white rounded-xl shadow-xl"
              >
                <div className="flex-1 overflow-auto scrollbar-hide">
                  <div
                    className="flex flex-col form-wrapper"
                    style={
                      {
                        fontFamily: formStyles?.font_properties?.font_family,
                        color: formStyles?.font_properties?.font_color,
                        gap: formStyles?.form_properties?.question_spacing,
                        "--field-bg":
                          formStyles?.form_properties.input_background_color,
                        "--field-border":
                          formStyles?.form_properties?.input_border_color,
                      } as any
                    }
                  >
                    {visibleFields.map((field) => (
                      <div
                        key={field.id}
                        style={{
                          width: layout === "row" ? "100%" : field.width + "%",
                          display: field?.visible ? "block" : "none",
                        }}
                      >
                        {renderField(
                          field,
                          getAnswerByFieldId(field.id),
                          (value, subFieldLabel) =>
                            handleAnswerChange(field.id, value, subFieldLabel)
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: formStyles?.form_properties?.color,
                backgroundImage: formPreviewImage
                  ? `url(${formPreviewImage})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full h-full  mx-auto lg:w-2/5 p-8 pb-4 flex flex-col  justify-between   rounded-xl shadow-xl space-y-4"
            >
              <div className="flex-1 overflow-auto scrollbar-hide">
                <div
                  className="flex-col flex lg:flex-row flex-wrap form-wrapper"
                  style={
                    {
                      fontFamily: formStyles?.font_properties?.font_family,
                      fontColor: formStyles?.font_properties?.font_color,
                      color: formStyles?.font_properties?.font_color,
                      gap: formStyles?.form_properties?.question_spacing,
                      "--field-bg":
                        formStyles?.form_properties.input_background_color,
                      "--field-border":
                        formStyles?.form_properties?.input_border_color,
                    } as any
                  }
                >
                  {visibleFields.map((field) => (
                    <div
                      key={field.id}
                      style={{
                        width: layout === "row" ? "100%" : field.width + "%",
                        display: field?.visible ? "block" : "none",
                      }}
                    >
                      {renderField(
                        field,
                        getAnswerByFieldId(field.id),
                        (value, subFieldLabel) =>
                          handleAnswerChange(field.id, value, subFieldLabel)
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
