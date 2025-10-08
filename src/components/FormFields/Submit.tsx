import { Field } from "@/lib/types";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { use } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";

export default function Submit({
  field,
  value,
  onChange,
}: {
  field?: Field;
  value?: string | number | string[] | { [key: string]: string | number };
  onChange?: (value: string) => void;
}) {
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  return (
    <div
      className={`flex ${
        field?.fieldLabelProperties?.textAlign === "center"
          ? "justify-center"
          : field?.fieldLabelProperties?.textAlign === "right"
            ? "justify-end"
            : "justify-start"
      }`}
    >
      <RippleButton
        type="submit"
        className={`border submit  text-white font-normal px-4 py-2 rounded-md cursor-pointer `}
        style={{
          backgroundColor: field?.fieldLabelProperties?.color || "#65A30D",
        }}
        onClick={() => {
          navigate({ to: `/forms/${params?.form_id}/success` });
        }}
      >
        {field?.title ?? field?.label ?? " "}
      </RippleButton>
    </div>
  );
}
