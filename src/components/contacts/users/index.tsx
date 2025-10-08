import { useOrganizations } from "@/components/core/ContactQueries";
import { SelectFilter } from "@/components/core/selectFilter";
import TanStackTable from "@/components/core/TanstackTable";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import UsersColumn from "./UsersColumn";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteUserByIdAPI,
  getAllUsersAPI,
} from "@/components/https/services/users";
import LoadingComponent from "@/components/core/LoadingComponent";
import NoUsersIcon from "@/components/ui/icons/noUsersIcon";
import { AppToast } from "@/components/core/customToast";
import DeleteDialog from "@/components/core/DeleteDialog";
import { pagination, SearchParams } from "@/lib/interfaces/contacts";
import SearchFilter from "@/components/core/SearchFilter";
import { useFixEmptyPage } from "@/utils/helpers/Pagination";

const Users = () => {
  const { allOrganization } = useOrganizations({ view: "dropdown" });
  const searchParams: SearchParams = useSearch({ strict: false });
  const orderByParam = searchParams.order_by;
  const [searchString, setSearchString] = useState<string>(
    searchParams.search_string || ""
  );
  const [debounceSearchString, setDebounceSearchString] = useState<string>("");
  const decodedOrderBy = orderByParam ? decodeURIComponent(orderByParam) : "";

  const [pagination, setPagination] = useState<pagination>({
    page: searchParams.page || 1,
    limit: searchParams.limit || 25,
    order_by: decodedOrderBy,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<
    number | null
  >(searchParams.organization_id || null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const {
    isLoading,
    data: users,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", pagination, selectedOrganization, debounceSearchString],
    queryFn: async () => {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...(selectedOrganization
          ? { organization_id: selectedOrganization }
          : {}),
        ...(debounceSearchString
          ? { search_string: debounceSearchString }
          : {}),
        ...(pagination.order_by ? { order_by: `${pagination.order_by}` } : {}),
      };
      const response = await getAllUsersAPI(queryParams);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  const getData = async ({
    page,
    limit,
    order_by,
  }: {
    page: number;
    limit: number;
    order_by?: string;
  }) => {
    setPagination({
      page: page,
      limit: limit,
      order_by: order_by,
    });
  };

  const { mutate: deleteUser, isPending: isDeletePending } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: async (id: number) => {
      const response = await deleteUserByIdAPI(id);
      return response;
    },
    onSuccess: (response) => {
      setOpenDeleteDialog(false);
      AppToast.success({ message: response?.data?.message || "User deleted." });
      refetchUsers();
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchString(searchString);
      if (searchString) {
        setPagination((p) => ({ ...p, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchString]);

  useEffect(() => {
    navigate({
      to: "/users",
      search: {
        page: +pagination.page,
        limit: +pagination.limit,
        ...(selectedOrganization
          ? { organization_id: selectedOrganization }
          : {}),
        ...(pagination.order_by ? { order_by: pagination.order_by } : {}),
        ...(debounceSearchString
          ? { search_string: debounceSearchString }
          : {}),
      },
      replace: true,
    });
  }, [
    pagination.page,
    pagination.limit,
    selectedOrganization,
    debounceSearchString,
    pagination.order_by,
  ]);
  const columns = UsersColumn({
    onDelete: (id: number) => {
      setSelectedUser(id);
      setOpenDeleteDialog(true);
    },
  });
  const navigate = useNavigate();
  useFixEmptyPage(users, pagination, setPagination);

  return (
    <div className=" h-full p-4 space-y-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h1>Users</h1>
          {!isLoading && (
            <span className="bg-gray-100 p-1 text-xs px-3 rounded-full">
              {users?.pagination_info?.total_records}
            </span>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <SearchFilter
            searchString={searchString}
            setSearchString={setSearchString}
            title="Search by name or email"
          />
          <SelectFilter
            options={allOrganization}
            placeholder="Select organisation"
            value={selectedOrganization}
            onChange={(value) => setSelectedOrganization(value)}
          />
          <Button
            onClick={() => {
              navigate({ to: "/users/add-user" });
            }}
            className="bg-lime-600 hover:bg-lime-600"
          >
            <UserPlus2 className="w-5 h-5" />
            Add User
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="h-[calc(100vh-180px)]">
          <LoadingComponent />
        </div>
      ) : users?.records?.length === 0 || !users ? (
        <div className="h-[calc(100vh-180px)] flex flex-col items-center justify-center">
          <NoUsersIcon className="w-90 h-90 " />
        </div>
      ) : (
        <TanStackTable
          columns={columns}
          data={users?.records}
          paginationDetails={users?.pagination_info}
          getData={getData}
          heightClass="h-[calc(100vh-180px)]"
          removeSortingForColumnIds={[
            "status",
            "role",
            "actions",
            "organizations",
          ]}
        />
      )}
      <DeleteDialog
        type="Archive"
        isDeleteOpen={openDeleteDialog}
        setDeleteClose={setOpenDeleteDialog}
        onCancel={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          if (selectedUser) {
            deleteUser(selectedUser);
          }
        }}
        isDeleteLoading={isDeletePending}
      >
        <div className="space-y-4">
          <div>{`Are you sure you want to archive this User? `}</div>
        </div>
      </DeleteDialog>
    </div>
  );
};

export default Users;
