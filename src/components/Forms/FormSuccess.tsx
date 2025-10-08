import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CardIcon from "@/components/ui/icons/forms/CardIcon";
import CurveIcon from "@/components/ui/icons/forms/CurveIcon";
import GroupIcon from "@/components/ui/icons/forms/GroupIcon";
import MaximizeIcon from "@/components/ui/icons/forms/MaximizeIcon";
import MinimizeIcon from "@/components/ui/icons/forms/MinimizeIcon";
import SearchIcon from "@/components/ui/icons/forms/searchIcon";
import StrokesIcon from "@/components/ui/icons/forms/StrokesIcon";
import SuccessIcon from "@/components/ui/icons/forms/SuccessIcon";
import { FormContext } from "@/context/formContext";
import ConditionalRendering from "@/utils/helpers/ConditonalRendering";
import { useLocation } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useContext } from "react";

const FormSuccess = ({
  text,
  subtext,
}: {
  text?: string;
  subtext?: string;
}) => {
  const pathname = useLocation().pathname;
  console.log(pathname);

  const { fields, conditions, answers } = useContext(FormContext);
  const { successMessage } = ConditionalRendering(fields, conditions, answers);

  const defaultMessage = {
    text: "Thank You for Submitting the form!",
    subtext:
      "Your response has been recorded successfully. Our team will review it shortly.",
  };
  const finalMessage = successMessage ?? defaultMessage;

  const heading = text ?? finalMessage.text;
  const message = subtext ?? finalMessage.subtext;

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-16">
      <Card
        className={`!p-0 relative ${pathname.includes("conditions") ? "w-sm" : "w-xl"}`}
      >
        <div className=" bg-white z-10">
          <div className="absolute left-27 -top-13 z-20">
            <GroupIcon className="" />
          </div>
          <div className="absolute  -left-6 -top-6 z-20">
            <CurveIcon />
          </div>
          <div className="absolute  -right-22 -top-22 z-20">
            <StrokesIcon className="w-40 h-40" />
          </div>
          <CardHeader className="bg-lime-600 flex justify-between items-center py-1 rounded-t-xl">
            <SearchIcon />
            <div className="flex gap-4 items-center">
              <MinimizeIcon />
              <MaximizeIcon />
              <X className="stroke-white" />
            </div>
          </CardHeader>
          <CardContent className="bg-gray-50 flex flex-col justify-center items-center py-1 rounded-md space-y-4 p-8 px-12 pb-12">
            <SuccessIcon className="" />
            {/* <div className="text-2xl flex items-center justify-center">{heading}</div> */}
            <div className="text-2xl text-center break-words max-w-md mx-auto">
              {heading}
            </div>
            {/* <div className="text-center text-sm w-3/4">{message}</div> */}
            <div className="text-center text-sm max-w-md mx-auto break-words">
              {message}
            </div>
          </CardContent>
        </div>
        <div className="absolute  -right-4  -bottom-4 rounded-xl w-full h-full bg-gray-200 text-white"></div>
        <div className="absolute  -right-30 -bottom-25 z-20">
          <CardIcon className="w-40 h-40" />
        </div>
      </Card>
      {!pathname.includes("conditions") && (
        <div className="flex gap-3">
          <Button
            className={`border submit  text-gray-900 bg-white hover:bg-gray-200 font-normal   rounded-md cursor-pointer `}
          >
            Back to Home
          </Button>
          <Button
            type="submit"
            className={`border submit  text-white bg-lime-600 hover:bg-green-700 font-normal h-fit rounded-md cursor-pointer `}
          >
            Submit Another Response
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormSuccess;
