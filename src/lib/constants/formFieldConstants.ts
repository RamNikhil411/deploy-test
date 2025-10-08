import AddressIcon from "@/components/ui/icons/addressIcon";
import DateIcon from "@/components/ui/icons/dateIcon";
import DescriptionIcon from "@/components/ui/icons/descriptionIcon";
import DropDownIcon from "@/components/ui/icons/dropDownIcon";
import EmailIcon from "@/components/ui/icons/emailIcon";
import fullNameIcon from "@/components/ui/icons/fullNameIcon";
import HeadingIcon from "@/components/ui/icons/headingIcon";
import ImageIcon from "@/components/ui/icons/imageIcon";
import MultiChoiceIcon from "@/components/ui/icons/multiChoiceIcon";
import NumberIcon from "@/components/ui/icons/numberIcon";
import PhoneIcon from "@/components/ui/icons/phoneIcon";
import RadioIcon from "@/components/ui/icons/radioIcon";
import TextIcon from "@/components/ui/icons/textIcon";

export const basicFields = [
  {
    label: "Dropdown",
    icon: DropDownIcon,
    type: "dropdown",
    width: 48,
    properties: {
      placeholder: "Select an option",
      options: ["Option 1", "Option 2", "Option 3"],
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Text",
    icon: TextIcon,
    type: "text",
    width: 48,
    properties: {
      placeholder: "Enter text",
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Email",
    icon: EmailIcon,
    type: "email",
    width: 48,
    properties: {
      placeholder: "Enter email",
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Full Name",
    icon: fullNameIcon,
    type: "fullName",
    width: 100,
    properties: {
      required: true,
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    subFields: [
      {
        id: "firstName",
        label: "First Name",
        type: "text",
        width: 48,
        properties: {
          placeholder: "Enter first name",
          required: true,
          value: "",
        },
      },
      {
        id: "lastName",
        label: "Last Name",
        type: "text",
        width: 48,
        properties: {
          placeholder: "Enter last name",
          required: true,
          value: "",
        },
      },
    ],
    visible: true,
    disabled: false,
  },
  {
    label: "Address",
    icon: AddressIcon,
    type: "address",
    width: 100,
    properties: {
      placeholder: "Enter address",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    subFields: [
      {
        label: "Street Address",
        type: "text",
        width: 48,
        properties: {
          placeholder: "Enter street address",
          required: false,
          value: "",
          visible: false,
        },
      },
      {
        label: "City",
        type: "dropdown",
        width: 48,
        properties: {
          placeholder: "City",
          options: ["City 1", "City 2", "City 3"],
          required: false,
          value: "",
          visible: false,
        },
      },
      {
        label: "State",
        type: "dropdown",
        width: 48,
        properties: {
          placeholder: "State",
          options: ["State 1", "State 2", "State 3"],
          required: false,
          value: "",
          visible: true,
        },
      },
      {
        label: "Postal Code",
        type: "text",
        width: 48,
        properties: {
          placeholder: "Postal code",
          required: false,
          value: "",
          visible: true,
        },
      },
      {
        label: "Country",
        type: "dropdown",
        width: 48,
        properties: {
          placeholder: "Country",
          options: ["Country 1", "Country 2", "Country 3"],
          required: false,
          value: "",
          visible: true,
        },
      },
    ],
    visible: true,
    disabled: false,
  },
  {
    label: "Radio",
    icon: RadioIcon,
    type: "radio",
    width: 48,
    properties: {
      placeholder: "Select an option",
      options: ["Option 1", "Option 2", "Option 3"],
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Number",
    icon: NumberIcon,
    type: "number",
    width: 48,
    properties: {
      placeholder: "Enter number",
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Heading",
    icon: HeadingIcon,
    type: "heading",
    width: 100,
    properties: {
      placeholder: "Enter heading",
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "20px",
        fontFamily: "Arial",
        textAlign: "left",
        subLabelFontsize: "14px",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Multi Choice",
    icon: MultiChoiceIcon,
    type: "multiChoice",
    width: 48,
    properties: {
      placeholder: "Select an option",
      options: ["Choice 1", "Choice 2", "Choice 3"],
      required: false,
      value: "",
      minSelect: 1,
      maxSelect: Infinity,
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Phone",
    icon: PhoneIcon,
    type: "phone",
    width: 48,
    properties: {
      placeholder: "Enter phone number",
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Date",
    icon: DateIcon,
    type: "date",
    width: 48,
    properties: {
      placeholder: "Enter date",
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },

  {
    label: "Image",
    icon: ImageIcon,
    type: "image",
    width: 48,
    properties: {
      placeholder: "Upload image",
      required: false,
      value: "",
      imageUrl: "",
      imageSize: "cover",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Description",
    icon: DescriptionIcon,
    type: "description",
    width: 100,
    properties: {
      placeholder: "Enter description",
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "#000000",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "left",
      },
    },
    visible: true,
    disabled: false,
  },
  {
    label: "Submit",
    // icon: SubmitIcon,
    type: "submit",
    width: 48,
    properties: {
      placeholder: "Submit",
      required: false,
      value: "",
      fieldLabelProperties: {
        color: "lime-600",
        fontsize: "12px",
        fontFamily: "Arial",
        textAlign: "center",
      },
    },
    visible: true,
    disabled: false,
  },
];

export const FONT_OPTIONS = [
  {
    label: "System Default",
    value:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  { label: "Segoe UI", value: '"Segoe UI", sans-serif' },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Helvetica Neue", value: '"Helvetica Neue", sans-serif' },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Times New Roman", value: '"Times New Roman", serif' },
  { label: "DM Sans", value: "DM Sans" },
];
