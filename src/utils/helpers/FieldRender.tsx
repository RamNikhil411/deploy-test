import Address from "@/components/FormFields/Address";
import { DateSelect } from "@/components/FormFields/DateSelect";
import Description from "@/components/FormFields/Description";
import DropDown from "@/components/FormFields/DropDown";
import EmailField from "@/components/FormFields/EmailField";
import FullName from "@/components/FormFields/FullName";
import Heading from "@/components/FormFields/Heading";
import ImageUpload from "@/components/FormFields/ImageUpload";
import { MultiChoice } from "@/components/FormFields/MultiChoice";
import Number from "@/components/FormFields/Number";
import Phone from "@/components/FormFields/Phone";
import { RadioButtons } from "@/components/FormFields/Radio";
import Submit from "@/components/FormFields/Submit";
import TextField from "@/components/FormFields/TextField";
import { Field } from "@/lib/types";

export const renderField = (
  field: Field & { onSubFieldClick?: (subFieldLabel: string | null) => void },
  value?:
    | string
    | number
    | string[]
    | { [subFieldLabel: string]: string | number },
  onChange?: (value: string | number | string[], subFieldLabel?: string) => void
) => {
  switch (field.label) {
    case "Dropdown":
      return <DropDown field={field} value={value} onChange={onChange} />;
    case "Text":
      return <TextField field={field} value={value} onChange={onChange} />;
    case "Email":
      return <EmailField field={field} value={value} onChange={onChange} />;
    case "Full Name":
      return <FullName field={field} value={value} onChange={onChange} />;
    case "Address":
      return (
        <Address
          field={field}
          onSubFieldClick={field?.onSubFieldClick}
          value={value}
          onChange={onChange}
        />
      );
    case "Radio":
      return <RadioButtons field={field} value={value} onChange={onChange} />;
    case "Number":
      return <Number field={field} value={value} onChange={onChange} />;
    case "Heading":
      return <Heading field={field} />;
    case "Multi Choice":
      return <MultiChoice field={field} value={value} onChange={onChange} />;
    case "Phone":
      return <Phone field={field} value={value} onChange={onChange} />;
    case "Date":
      return <DateSelect field={field} value={value} onChange={onChange} />;
    case "Image":
      return <ImageUpload field={field} value={value} onChange={onChange} />;
    case "Description":
      return <Description field={field} value={value} onChange={onChange} />;
    case "Submit":
      return <Submit field={field} value={value} onChange={onChange} />;
    default:
      return null;
  }
};
