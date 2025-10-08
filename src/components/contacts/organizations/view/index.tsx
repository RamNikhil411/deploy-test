import {
  getOrgDocs,
  useOrganizationById,
  useRoles,
} from "@/components/core/ContactQueries";
import { AppToast } from "@/components/core/customToast";
import FileUpload from "@/components/core/fileUpload";
import SearchFilter from "@/components/core/SearchFilter";
import { SelectFilter } from "@/components/core/selectFilter";
import Comments from "@/components/events/view/Comments";
import {
  getAvailUsersAPI,
  inviteUserToOrgAPI,
} from "@/components/https/services/contacts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import OrgContacts from "./contacts";
import InviteUsersDialog from "./InviteUsersDialog";
import OrganizationProfile from "./OrganizationProfile";
import OrgDocuments from "./OrgDocuments";
import OrgUsers from "./users";

interface searchParams {
  tab: string;
}

const OrganizationView = () => {
  const navigate = useNavigate();
  const searchParams: searchParams = useSearch({ strict: false });
  const { organisation_id } = useParams({ strict: false });
  const pathName = useLocation().pathname;
  const [role, setRole] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(searchParams?.tab || "users");
  const [search, setSearch] = useState("");
  const [debounceSearchString, setDebounceSearchString] = useState("");
  const queryClient = useQueryClient();

  const { organizationDetails } = useOrganizationById(Number(organisation_id));
  const orgTabs = [
    {
      value: "users",
      label: "Users",
    },
    {
      value: "contacts",
      label: "Contacts",
    },
    {
      value: "documents",
      label: "Documents",
    },
    // {
    //   value: "Comments",
    //   label: "Comments",
    // },
  ];

  const { data: availableUsersData, isLoading: isLoadingAvailableUsers } =
    useQuery({
      queryKey: ["availableUsers"],
      queryFn: async () => {
        const response = await getAvailUsersAPI(Number(organisation_id));
        return response?.data?.data;
      },
      refetchOnWindowFocus: false,
      enabled: !!organisation_id && open,
    });

  const { mutate: inviteUsers, isPending: isInviting } = useMutation({
    mutationKey: ["inviteUsers"],
    mutationFn: async (data: any) => {
      const response = await inviteUserToOrgAPI(Number(organisation_id), data);
      return response;
    },
    onSuccess: (response) => {
      AppToast.success({
        message: "Users Invited Successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["availableUsers"] });
      queryClient.invalidateQueries({ queryKey: ["org-users"] });
      setOpen(false);
    },
  });

  const handleSendInvite = (data: any) => {
    inviteUsers({ users: data });
  };

  const allRoles = useRoles();
  const { isLoadingOrgDocs, orgDocs, refetchDocs } = getOrgDocs(
    organisation_id,
    debounceSearchString,
    activeTab === "documents"
  );

  useEffect(() => {
    if (activeTab) {
      navigate({
        to: `/organisations/${organisation_id}`,
        search: { tab: activeTab },
        replace: true,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchString(search);
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="p-4">
      <div>
        <OrganizationProfile organization={organizationDetails} />
      </div>
      <div className="mt-4">
        <Tabs>
          <div className=" gap-4 items-center justify-between">
            <div className="flex justify-between items-center">
              <TabsList>
                {orgTabs.map((tab) => (
                  <TabsTrigger
                    className={`mr-2 py-1 h-fit bg-transparent rounded hover:bg-gray-300 text-gray-700 font-normal cursor-pointer shadow-none ${
                      activeTab === tab.value && tab.value
                        ? "bg-white hover:bg-white text-lime-600"
                        : "text-gray-500"
                    }`}
                    value={tab.value}
                    key={tab.value}
                    onClick={() => {
                      setActiveTab(tab.value);
                      setSearch("");
                    }}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex gap-2">
                {activeTab !== "Comments" && (
                  <SearchFilter
                    title="Search by Name"
                    searchString={search}
                    setSearchString={setSearch}
                  />
                )}
                {activeTab === "users" && (
                  <div className="flex gap-2">
                    <SelectFilter
                      options={allRoles}
                      placeholder="Select Role"
                      value={role}
                      onChange={(value) => setRole(value)}
                    />
                    <InviteUsersDialog
                      open={open}
                      setOpen={setOpen}
                      availableUsers={availableUsersData}
                      handleSendInvite={handleSendInvite}
                      isLoading={isLoadingAvailableUsers}
                      isPending={isInviting}
                    />
                  </div>
                )}
                {activeTab === "documents" && (
                  <div>
                    <FileUpload
                      fileUpload={true}
                      fileTypes={["pdf"]}
                      refetch={refetchDocs}
                    >
                      <span className="bg-transparent flex items-center justify-between p-2 gap-2 rounded text-sm font-light h-8 hover:bg-transparent border text-black shadow-none">
                        <Upload className="h-3 w-3" />
                        Upload Documents
                      </span>
                    </FileUpload>
                  </div>
                )}
              </div>
            </div>
            <ScrollArea className="mt-4 h-[calc(100vh-273px)]">
              {activeTab === "contacts" && (
                <OrgContacts search={debounceSearchString} />
              )}
              {activeTab === "users" && (
                <OrgUsers roleId={role} search={debounceSearchString} />
              )}
              {activeTab === "documents" && (
                <OrgDocuments orgDocs={orgDocs} isLoading={isLoadingOrgDocs} />
              )}
              {activeTab === "Comments" && <Comments />}
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizationView;
