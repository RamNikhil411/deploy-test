import { useQuery } from "@tanstack/react-query";
import {
  getAllOrganization,
  getAllRegionsAPI,
  getAllRolesAPI,
  getAllUserOrgs,
  getContactById,
} from "../https/services/contacts";
import {
  getAllTagsAPI,
  getOrganizationByIdAPI,
  getOrgDocsAPI,
} from "../https/services/organization";
import { getNotesAPI, getUserByIdAPI } from "../https/services/users";

interface queryParams {
  page?: number;
  limit?: number;
  order_by?: string;
  view?: string;
  region_id?: number | null;
  user_id?: number | null;
  search_string?: string;
}

export const useOrganizations = (queryParams: queryParams, keys?: any[]) => {
  const {
    data: allOrganization,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["organizations", queryParams, ...(keys || [])],
    queryFn: async () => {
      const response = await getAllOrganization(queryParams);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return { allOrganization, isLoading, refetch };
};

export const useRegions = (queryParams: queryParams, keys?: any[]) => {
  const { data: allRegions, isLoading } = useQuery({
    queryKey: ["regions", ...(keys || [])],
    queryFn: async () => {
      const response = await getAllRegionsAPI(queryParams);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return { allRegions, isLoading };
};

export const useRoles = () => {
  const { data: allRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await getAllRolesAPI();
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return allRoles;
};

export const useContactById = (contact_id: string | undefined) => {
  const { isLoading: isLoadingContactById, data: contactByIdData } = useQuery({
    queryKey: ["contactById", contact_id],
    queryFn: async () => {
      const response = await getContactById(contact_id);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!contact_id,
  });
  return { isLoadingContactById, contactByIdData };
};

export const userOrganization = () => {
  const { data: allUserOrganization } = useQuery({
    queryKey: ["allUserOrganization"],
    queryFn: async () => {
      const response = await getAllUserOrgs();
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return allUserOrganization;
};

export const useOrganizationById = (organization_id: Number) => {
  const { data: organizationDetails } = useQuery({
    queryKey: ["organizationDetails", organization_id],
    queryFn: async () => {
      const response = await getOrganizationByIdAPI(organization_id);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!organization_id,
  });
  return { organizationDetails };
};

export const getUserById = (user_id: string | undefined) => {
  const { data: userById } = useQuery({
    queryKey: ["userById", user_id],
    queryFn: async () => {
      const response = await getUserByIdAPI(user_id);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!user_id,
  });
  return { userById };
};

export const getAllTags = () => {
  const { data: allTags, refetch } = useQuery({
    queryKey: ["allTags"],
    queryFn: async () => {
      const response = await getAllTagsAPI();
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return { allTags, refetch };
};

export const getOrgDocs = (
  organization_id: string | undefined,
  search?: string,
  enabled?: boolean
) => {
  const {
    isLoading: isLoadingOrgDocs,
    data: orgDocs,
    refetch: refetchDocs,
  } = useQuery({
    queryKey: ["OrgDocuments", organization_id, search],
    queryFn: async () => {
      let queryParams = {};
      queryParams = {
        ...(search ? { search_string: search } : {}),
      };
      const response = await getOrgDocsAPI(organization_id, queryParams);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!organization_id && enabled,
  });
  return { orgDocs, refetchDocs, isLoadingOrgDocs };
};

export const getAllNotes = (queryParams: queryParams) => {
  const {
    isLoading: isLoadingNotes,
    data: allNotes,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ["allNotes"],
    queryFn: async () => {
      const response = await getNotesAPI(queryParams);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
  });
  return { isLoadingNotes, allNotes, refetchNotes };
};
