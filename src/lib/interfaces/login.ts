export interface LoginEmailAPIPayload {
  email: string;
  password: string;
}

export interface LoginViaOtpAPIPayload {
  phone_number: string;
}

export interface VerifyOtpAPIPayload {
  phone_number: string;
  otp: string;
}

export interface APIError {
  success: boolean;
  status_code: number;
  message: string;
  err_data?: any;
  err_code: string;
  timestamp: string;
}

export interface errorData {
  data: APIError;
}
export interface ForgotPasswordPayload {
  email: string;
}
export interface VerifyResetPasswordPayload {
  code: string | undefined;
}

export interface ResetPasswordPayload {
  code: string | undefined;
  new_password: string;
  confirm_password: string;
}
