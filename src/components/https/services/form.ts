import { $fetch } from "../fetch";
export const createFormAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/forms", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllFormsAPI = async (queryParams: any) => {
  try {
    const response = await $fetch.get("/forms", queryParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getFormById = async (id: string | undefined) => {
  try {
    const response = await $fetch.get(`/forms/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateFormById = async (id: string | undefined, payload: any) => {
  try {
    const response = await $fetch.put(`/forms/${id}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const SendInviteAPI = async (id: string | undefined, payload: any) => {
  try {
    const response = await $fetch.post(`/forms/${id}/invite`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
