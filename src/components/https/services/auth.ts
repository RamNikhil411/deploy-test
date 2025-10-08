import {
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyResetPasswordPayload,
} from "@/lib/interfaces/login";
import { $fetch } from "../fetch";
export const signInWithEmailAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/auth/signin", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const signInWithPhoneAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/auth/signin/phone", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyOtpAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/auth/signin/verify", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordAPI = async (payload: ForgotPasswordPayload) => {
  try {
    const response = await $fetch.post("/auth/forgot-password", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyResentLinkAPI = async (
  payload: VerifyResetPasswordPayload
) => {
  try {
    const response = await $fetch.post("/auth/forgot-password/verify", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPasswordAPI = async (payload: ResetPasswordPayload) => {
  try {
    const response = await $fetch.post("/auth/reset-password", payload);
    return response;
  } catch (error) {
    throw error;
  }
};