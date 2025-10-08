import { $fetch } from "../fetch";

export const CreateUserAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/users", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllUsersAPI = async (queryParams: any) => {
  try {
    const response = await $fetch.get("/users", queryParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserByIdAPI = async (userId: string | undefined) => {
  try {
    const response = await $fetch.get(`/users/${userId}/public`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserByIdAPI = async (
  userId: string | number | undefined,
  payload: any
) => {
  try {
    const response = await $fetch.put(`/users/${userId}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const addNoteAPI = async (payload: any) => {
  try {
    const response = await $fetch.post(`/notes`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getNotesAPI = async (queryParams: any) => {
  try {
    const response = await $fetch.get(`/notes`, queryParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateNotesByIdAPI = async (noteId: any, payload: any) => {
  try {
    const response = await $fetch.put(`/notes/${noteId}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteNoteAPI = async (noteId: any) => {
  try {
    const response = await $fetch.delete(`/notes/${noteId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserByIdAuthAPI = async (user_id: string | undefined, queryParams?: any) => {
  try {
    const response = await $fetch.get(`/users/${user_id}`,queryParams);
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteUserByIdAPI = async (user_id: number | undefined) => {
  try {
    const response = await $fetch.delete(`/users/${user_id}`);
    return response;
  } catch (err) {
    throw err;
  }
};
