import enableRequireIcon from "@/components/ui/icons/conditions/enableRequireIcon";
import showHideIcon from "@/components/ui/icons/conditions/showHideIcon";
import ThankyouIcon from "@/components/ui/icons/conditions/ThankyouIcon";
import updateCalculateIcon from "@/components/ui/icons/conditions/updateCalculateIcon";
import EmailIcon from "@/components/ui/icons/emailIcon";
import { conditionOption } from "../types";

export const conditionItemConstants: conditionOption[] = [
  {
    label: "SHOW/HIDE FIELD",
    value: "Change Visibility Of Specific Form Fields",
    icon: showHideIcon,
    action: ["Hide", "Show", "Hide Multiple", "Show Multiple"],
  },
  {
    label: "UPDATE/CALCULATE FIELD",
    value: "Copy a field's value or perform complex calculations",
    icon: updateCalculateIcon,
    action: [
      "Copy Field Value",
      "Copy Multiple Field Values",
      "Calculate Field value",
    ],
  },
  {
    label: "ENABLE/REQUIRE/MASK FIELD",
    value: "Require or disable a field, or set a mask",
    icon: enableRequireIcon,
    action: [
      "Require",
      "Don't Require",
      "Require Multiple",
      "Don't Require Multiple",
      "Disable",
      "Enable",
      "Set Mask",
    ],
  },
  {
    label: "CHANGE THANK YOU PAGE",
    value: "Customize your Thank You page action",
    icon: ThankyouIcon,
    action: ["Show Custom Message", "Redirect to URL"],
  },
  {
    label: "CHANGE EMAIL RECIPIENT",
    value: "Send emails to specific people",
    icon: EmailIcon,
    action: ["Add Recipient", "Remove Recipient"],
  },
];
