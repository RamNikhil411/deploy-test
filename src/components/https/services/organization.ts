import { $fetch } from "../fetch";

export const createOrganizationAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/organizations", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOrganizationByIdAPI = async (orgId: Number) => {
  try {
    const response = await $fetch.get(`/organizations/${orgId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateOrganizationByIdAPI = async (
  organizationId: string | undefined,
  payload: any
) => {
  try {
    const response = await $fetch.put(
      `/organizations/${organizationId}`,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllTagsAPI = async () => {
  try {
    const response = await $fetch.get("/tags");
    return response;
  } catch (error) {
    throw error;
  }
};

export const addSingleTagAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/tags", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOrgDocsAPI = async (orgId: string | undefined, queryParams) => {
  try {
    const response = await $fetch.get(
      `/organizations/${orgId}/documents`,
      queryParams
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadOrgDocsAPI = async (
  orgId: string | undefined,
  payload: any
) => {
  try {
    const response = await $fetch.post(
      `/organizations/${orgId}/documents`,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteOrgUserAPI = async (
  orgId: string | undefined,
  orgUserId: number | undefined
) => {
  try {
    const response = await $fetch.delete(
      `/organizations/${orgId}/users/${orgUserId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const resendInviteAPI = async (
  orgId: string | undefined,
  userId: string | undefined
) => {
  try {
    const response = await $fetch.post(
      `/organizations/${orgId}/resend-invitation/${userId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
