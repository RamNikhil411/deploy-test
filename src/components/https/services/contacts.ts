import { $fetch } from "../fetch";
export const CreateContactAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/contacts", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllRegionsAPI = async (queryParams: any) => {
  try {
    const response = await $fetch.get("/regions", queryParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllOrganization = async (queryParams: any) => {
  try {
    const response = await $fetch.get("/organizations", queryParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllContacts = async (queryParams: any) => {
  try {
    const response = await $fetch.get("/contacts", queryParams);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getContactById = async (contactId: string | undefined) => {
  try {
    const response = await $fetch.get(`/contacts/${contactId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteContactAPI = async ({
  contactId,
}: {
  contactId: number[];
}) => {
  try {
    const response = await $fetch.delete(`/contacts`, {
      contact_ids: contactId,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAllRolesAPI = async (queryParams?: any) => {
  try {
    const response = await $fetch.get("/roles", queryParams);
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateContactAPI = async (
  contact_id: string | undefined,
  payload: any
) => {
  try {
    const response = await $fetch.put(`/contacts/${contact_id}`, payload);
    return response;
  } catch (err) {
    throw err;
  }
};

export const importContactAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/contacts/bulk-import", payload);
    return response;
  } catch (err) {
    throw err;
  }
};

export const AddRegionAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/regions", payload);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAllUserOrgs = async (queryParams?: any) => {
  try {
    const response = await $fetch.get("/organizations/me", queryParams);
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateRegionAPI = async (
  region_id: string | undefined,
  payload: any
) => {
  try {
    const response = await $fetch.put(`/regions/${region_id}`, payload);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAvailUsersAPI = async (organization_id: number | undefined) => {
  try {
    const response = await $fetch.get(
      `/organizations/${organization_id}/users/available`
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const inviteUserToOrgAPI = async (
  organization_id: number | undefined,
  payload: any
) => {
  try {
    const response = await $fetch.post(
      `/organizations/${organization_id}/invite`,
      payload
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAllOrgUsers = async (
  organization_id: number,
  queryParams?: any
) => {
  try {
    const response = await $fetch.get(
      `/organizations/${organization_id}/users`,
      queryParams
    );
    return response;
  } catch (err) {
    throw err;
  }
};
