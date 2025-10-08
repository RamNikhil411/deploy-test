import DeleteDialog from "@/components/core/DeleteDialog";
import LoadingComponent from "@/components/core/LoadingComponent";
import SearchFilter from "@/components/core/SearchFilter";
import TanStackTable from "@/components/core/TanstackTable";
import {
  deleteContactAPI,
  getAllContacts,
} from "@/components/https/services/contacts";
import { Button } from "@/components/ui/button";
import AddContactIcon from "@/components/ui/icons/contacts/addContactIcon";
import ImportIcon from "@/components/ui/icons/contacts/importIcon";
import NoContactIcon from "@/components/ui/icons/contacts/NoContactsIcon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import ContactColumns from "./contactsColumns";

import { ContactContext } from "@/context/contactContext";
import { AppToast } from "../core/customToast";
import { pagination, SearchParams } from "@/lib/interfaces/contacts";
import { useFixEmptyPage } from "@/utils/helpers/Pagination";

interface ContactsSearch {
  page?: string;
  limit?: string;
  search?: string;
  organization_id?: string;
}

const Contacts = () => {
  const navigate = useNavigate();

  const searchParams: SearchParams = useSearch({ strict: false });
  const orderByParam = searchParams.order_by;

  const decodedOrderBy = orderByParam ? decodeURIComponent(orderByParam) : "";
  const { activeOrganization } = useContext(ContactContext);
  const [pagination, setPagination] = useState<pagination>({
    page: searchParams.page || 1,
    limit: searchParams.limit || 25,
    order_by: decodedOrderBy,
    organization_id: activeOrganization,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null
  );
  const [searchString, setSearchString] = useState<string>(
    searchParams?.search_string || ""
  );

  const [debounceSearchString, setDebounceSearchString] = useState<string>(
    searchParams?.search_string || ""
  );

  const {
    isLoading: isLoadingContacts,
    data: getContacts,
    refetch: refetchContacts,
  } = useQuery({
    queryKey: [
      "contacts",
      pagination?.page,
      pagination?.limit,
      activeOrganization,
      debounceSearchString,
      pagination.order_by,
    ],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      let queryParams = {
        page: pagination?.page,
        limit: pagination?.limit,
        ...(activeOrganization ? { organization_id: activeOrganization } : {}),
        ...(debounceSearchString
          ? { search_string: debounceSearchString }
          : {}),
        ...(pagination.order_by ? { order_by: `${pagination.order_by}` } : {}),
      };
      const response = await getAllContacts(queryParams);
      return response?.data?.data;
    },
    enabled: !!activeOrganization,
  });
  const { mutate: deleteContact, isPending: isLoadingDelete } = useMutation({
    mutationFn: async ({ contactId }: { contactId: number[] }) => {
      const response = await deleteContactAPI({ contactId });
      return response?.data;
    },
    onSuccess: (response) => {
      AppToast.success({ message: response?.message || "Contact Archived." });
      refetchContacts();
      setShowDeleteDialog(false);
    },
    onError: (response) => {
      AppToast.error({ message: response?.message || "Failed to archive." });
    },
  });
  const getContactsData = async ({
    page,
    limit,
    order_by,
  }: {
    page: number;
    limit: number;
    order_by?: string;
  }) => {
    setPagination({ page: page, limit: limit, order_by: order_by });
  };

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
      to: "/contacts",
      search: {
        page: +pagination?.page,
        limit: +pagination?.limit,
        ...(activeOrganization ? { organization_id: activeOrganization } : {}),
        ...(debounceSearchString ? { search: debounceSearchString } : {}),
        ...(pagination.order_by ? { order_by: `${pagination.order_by}` } : {}),
      },
      replace: true,
    });
  }, [pagination, activeOrganization, debounceSearchString]);
  const ContactsTableColumns = ContactColumns({
    onDelete: (id) => {
      setSelectedContactId(id);
      setShowDeleteDialog(true);
    },
  });
  const onCancelDeleteContact = () => {
    setShowDeleteDialog(false);
    setSelectedContactId(null);
  };
  useFixEmptyPage(getContacts, pagination, setPagination);

  return (
    <>
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className=" ">Contacts</h1>
            {!isLoadingContacts && (
              <span className="bg-gray-100 rounded-2xl text-xs p-1 px-2 font-medium">
                {getContacts?.pagination_info?.total_records}
              </span>
            )}
          </div>
          <div className="flex gap-2 items-center justify-center">
            <SearchFilter
              searchString={searchString}
              setSearchString={setSearchString}
              title="Search name or email"
            />
            <Button
              onClick={() => navigate({ to: "/contacts/add-contact" })}
              className="bg-lime-600 hover:bg-green-700  text-smd h-fit py-1.5 rounded font-normal"
            >
              <AddContactIcon className="size-4 text-white" />
              <span className="text-white">Add Contact</span>
            </Button>
            <Button
              className=" bg-transparent hover:bg-transparent h-fit py-1.5 text-smd text-black border rounded cursor-pointer"
              onClick={() => navigate({ to: "/contacts/importContact" })}
            >
              <ImportIcon className="size-4" />
              Import
            </Button>
          </div>
        </div>
        {isLoadingContacts ? (
          <div className="h-[calc(100vh-196px)] flex items-center justify-center w-full ">
            <LoadingComponent message="Loading Contacts" />
          </div>
        ) : (
          <div className="h-[calc(100vh-196px)]">
            {!isLoadingContacts && !getContacts?.records?.length ? (
              <div className="h-full flex items-center justify-center w-full ">
                <NoContactIcon />
              </div>
            ) : (
              <TanStackTable
                data={getContacts?.records || []}
                columns={ContactsTableColumns}
                getData={getContactsData}
                paginationDetails={getContacts?.pagination_info || {}}
                removeSortingForColumnIds={[
                  "phone",
                  "organization",
                  "status",
                  "actions",
                  "tags",
                ]}
                heightClass="h-[calc(100vh-175px)]"
              />
            )}
          </div>
        )}
      </div>
      <DeleteDialog
        isDeleteOpen={showDeleteDialog}
        setDeleteClose={onCancelDeleteContact}
        onCancel={onCancelDeleteContact}
        onConfirm={() =>
          selectedContactId && deleteContact({ contactId: [selectedContactId] })
        }
        isDeleteLoading={isLoadingDelete}
        type="Archive"
      >
        <div className="space-y-4">
          <div>{`Are you sure you want to archive this contact? `}</div>
        </div>
      </DeleteDialog>
    </>
  );
};

export default Contacts;
