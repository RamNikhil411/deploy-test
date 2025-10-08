export interface Field {
  id: string;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  width?: number;
  countryCode?: boolean;
  inputMask?: string;
  subFields?: any;
  properties?: {
    placeholder?: string;
    value?: string | number;
  };
  fieldLabelProperties?: {
    color?: string;
    fontsize?: string;
    fontFamily?: string;
    textAlign?: string;
    subLabelFontSize?: string;
  };
  visible?: boolean;
  disabled?: boolean;
}
export interface FieldTemplate {
  label: string;
  type: string;
}

export interface FormStyles {
  page_properties: {
    color: string;
    cover: string | null;
  };
  form_properties: {
    color: string;
    cover: string | null;
    question_spacing: number;
    label_width: number;
    input_background_color: string;
    input_border_color: string;
  };
  font_properties: {
    font_family: string;
    font_size: number;
    font_color: string;
  };
}

export interface APIResponse {
  success: boolean;
  message?: string;
  status_code?: number;
  data?: any;
}

export interface Condition {
  id: number;
  ifField: string;
  operator: string;
  value: string;
  action: string;
  targetFields: string[];
  fromFields?: string[];
  successSubtext?: string;
  successText?: string;
}

export interface conditionOption {
  label: string;
  value: string;
  icon: React.ComponentType<{ className: string }> | null;
  action: string[];
}

export type Contact = {
  full_name: string;
  email: string;
  phone_number: string;
  contact_profile: string | null;
  region_id: number;
  contact_roles: string;
  status: "Active" | "Inactive" | string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export interface ErrorResponse {
  success: boolean;
  status_code: number;
  message: string;
  err_data?: any;
  err_code: string;
  timestamp: string;
}

export interface ResponseData {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  status: string;
  avatar: string | null;
  address: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  access_token: string;
  refresh_token: string;
  refresh_token_expires_at: number;
  is_super_admin: boolean;
}

export interface UserDetails {
  user: Partial<ResponseData>;
}
