import { $fetch } from "../fetch";

export const getValidateUserDetailsAPI = async (queryParams: any) => {
  try {
    const response = await $fetch.get(`/users/validate/invite`, queryParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserDetailsAPI = async (queryParams: any) => {
  try {
    const response = await $fetch.get(`/users/invite`, queryParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserDetailsAPI = async (payload: any) => {
  try {
    const response = await $fetch.put(`/users/update`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendOtpToUserAPI = async (payload) => {
  try {
    const response = await $fetch.post(`/users/send-otp`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyUserOtpAPI = async (payload) => {
  try {
    const response = await $fetch.post(`/users/verify`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
