import TanStackTable from "@/components/core/TanstackTable";
import { getAllContacts } from "@/components/https/services/contacts";
import NoContactIcon from "@/components/ui/icons/contacts/NoContactsIcon";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import OrgContactColumns from "./OrgContactColumns";

export default function OrgContacts({ search }: { search?: string }) {
  const columns = OrgContactColumns();

  const [pagination, setPagination] = useState({ page: 1, limit: 25 });

  const { organisation_id } = useParams({ strict: false });

  const { data: getAllOrgContactsData, isLoading } = useQuery({
    queryKey: ["org-contacts", pagination, organisation_id, search],
    queryFn: async () => {
      let queryParams = {};
      queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        organization_id: organisation_id,
        ...(search ? { search_string: search } : {}),
      };
      const response = await getAllContacts(queryParams);
      return response?.data?.data;
    },
  });

  const getData = async ({ page, limit }: { page: number; limit: number }) => {
    setPagination({ page: page, limit: limit });
  };

  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [search]);

  return (
    <div className="px-2">
      {isLoading ? (
        <div className="text-center h-[calc(100vh-314px)] flex justify-center items-center">
          Loading...
        </div>
      ) : getAllOrgContactsData?.records?.length === 0 ? (
        <div>
          <div className="text-center h-[calc(100vh-314px)] flex justify-center items-center">
            <NoContactIcon />
          </div>
        </div>
      ) : (
        <TanStackTable
          columns={columns}
          data={getAllOrgContactsData?.records}
          paginationDetails={getAllOrgContactsData?.pagination_info}
          heightClass="h-[calc(100vh-314px)]"
          removeSortingForColumnIds={[
            "actions",
            "status",
            "full_name",
            "tags",
            "email",
            "phone",
            "organization",
            "role",
            "created_by",
          ]}
          getData={getData}
        />
      )}
    </div>
  );
}
