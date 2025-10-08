import TanStackTable from "@/components/core/TanstackTable";
import { getAllOrgUsers } from "@/components/https/services/contacts";
import NoUsersIcon from "@/components/ui/icons/noUsersIcon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import OrgUserColumns from "./OrgUserColumns";
import DeleteDialog from "@/components/core/DeleteDialog";
import {
  deleteOrgUserAPI,
  resendInviteAPI,
} from "@/components/https/services/organization";
import { AppToast } from "@/components/core/customToast";
import AddUser from "../../users/AddUser";
import EditDialog from "@/components/core/EditDialog";
import { useFixEmptyPage } from "@/utils/helpers/Pagination";

export default function OrgUsers({
  roleId,
  search,
}: {
  roleId: number | null;
  search?: string;
}) {
  const { organisation_id } = useParams({ strict: false });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null
  );
  const [selectResendInviteId, setSelectedResendInviteId] = useState<
    number | null
  >(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 25 });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [search]);

  const handleViewUser = (id: number) => {
    navigate({ to: `/users/${id}` });
  };

  const handleEditUser = (id: number) => {
    setShowEditDialog(true);
    setSelectedUser(id);
  };

  const columns = OrgUserColumns({
    onDelete: (id) => {
      setSelectedContactId(id);
      setShowDeleteDialog(true);
    },
    onView(id) {
      handleViewUser(id);
    },
    onEdit(id) {
      handleEditUser(id);
    },
    onResendInvite: (id) => {
      setShowDeleteDialog(true);
      setSelectedResendInviteId(id);
    },
  });
  const navigate = useNavigate();

  const {
    isLoading,
    data: orgUsersData,
    refetch,
  } = useQuery({
    queryKey: ["org-users", pagination, roleId, search],
    queryFn: async () => {
      let queryParams = {};
      queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...(roleId ? { role_id: roleId } : {}),
        ...(search ? { search_string: search } : {}),
      };
      const response = await getAllOrgUsers(
        Number(organisation_id),
        queryParams
      );
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { mutate: deleteOrgUser, isPending: isDeletingOrgUser } = useMutation({
    mutationKey: ["deleteOrgUser"],
    mutationFn: async (id: number) => {
      const response = await deleteOrgUserAPI(organisation_id, id);
      return response;
    },
    onSuccess: () => {
      refetch();
      setShowDeleteDialog(false);
      setSelectedContactId(null);
    },
    onError: (response) => {
      AppToast.error({ message: response?.message });
      setShowDeleteDialog(false);
      setSelectedContactId(null);
    },
  });

  const { mutate: resendInviteUser, isPending: isResendingInvite } =
    useMutation({
      mutationKey: ["resendInviteUser"],
      mutationFn: async (id: string) => {
        const response = await resendInviteAPI(organisation_id, id);
        return response;
      },
      onSuccess: (response) => {
        AppToast.success({ message: response?.data?.message });
        refetch();
        setShowDeleteDialog(false);
        setSelectedResendInviteId(null);
      },
      onError: (response) => {
        AppToast.error({ message: response?.message });
        setShowDeleteDialog(false);
        setSelectedResendInviteId(null);
      },
    });

  const getData = async ({ page, limit }: { page: number; limit: number }) => {
    setPagination({ page: page, limit: limit });
  };

  const onCancelDeleteContact = () => {
    setShowDeleteDialog(false);
    setSelectedContactId(null);
    setSelectedResendInviteId(null);
  };
  const onCancelEditUser = () => {
    setShowEditDialog(false);
    setSelectedUser(null);
  };
  useFixEmptyPage(orgUsersData, pagination, setPagination);

  return (
    <div className="px-2">
      {isLoading ? (
        <div className="text-center h-[calc(100vh-314px)] flex justify-center items-center">
          Loading...
        </div>
      ) : orgUsersData?.records.length === 0 ? (
        <div className="text-center h-[calc(100vh-314px)] flex-col flex justify-center items-center">
          <NoUsersIcon className="h-60" />
        </div>
      ) : (
        <TanStackTable
          columns={columns}
          data={orgUsersData?.records}
          paginationDetails={orgUsersData?.pagination_info}
          heightClass="h-[calc(100vh-314px)]"
          removeSortingForColumnIds={[
            "actions",
            "status",
            "full_name",
            "roles",
            "email",
            "phone",
          ]}
          getData={getData}
        />
      )}
      <DeleteDialog
        isDeleteOpen={showDeleteDialog}
        setDeleteClose={onCancelDeleteContact}
        onCancel={onCancelDeleteContact}
        onConfirm={() =>
          selectedContactId
            ? deleteOrgUser(selectedContactId)
            : selectResendInviteId &&
              resendInviteUser(String(selectResendInviteId))
        }
        isDeleteLoading={isDeletingOrgUser}
        type={selectResendInviteId ? "Resend Invite" : "Archive"}
      >
        <div className="space-y-4">
          <div>{` ${selectResendInviteId ? "Are you sure you want to resend invitation for this user?" : "Are you sure you want to archive this user?"}`}</div>
        </div>
      </DeleteDialog>
      <EditDialog
        isDeleteOpen={showEditDialog}
        setDeleteClose={onCancelEditUser}
        onCancel={onCancelEditUser}
        user_id={selectedUser}
        onConfirm={onCancelDeleteContact}
      />
    </div>
  );
}
