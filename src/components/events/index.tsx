import { Plus } from "lucide-react";
import { useState } from "react";
import TanStackTable from "../core/TanstackTable";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import EventColumns from "./eventColumns";
import { useOrganizations } from "../core/ContactQueries";
import LoadingComponent from "../core/LoadingComponent";
import OrganizationsIcon from "../ui/icons/OrganizationsIcon";
import { useNavigate } from "@tanstack/react-router";

export const Events = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Archieved");
  const [pagination, setPagination] = useState({ page: 1, limit: 25 });
  const tabs = [
    {
      name: "Archived",
      count: 5,
    },
    { name: "Published", count: 10 },
    { name: "Draft", count: 587 },
  ];
  const columns = EventColumns();
  const { allOrganization: organizations, isLoading } = useOrganizations({
    page: pagination.page,
    limit: pagination.limit,
  });
  const getData = async ({ page, limit }: { page: number; limit: number }) => {
    setPagination({ page: page, limit: limit });
  };

  return (
    <div className="p-2">
      <div className="flex  justify-between items-center mb-2">
        <div className="flex gap-4 bg-gray-100 text-sm rounded p-1">
          {tabs.map((tab) => (
            <div
              className={`flex gap-2 items-center p-1 cursor-pointer ${activeTab === tab.name && "bg-white rounded"} `}
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
              }}
            >
              <div
                className={` px-2 gap-4  ${activeTab === tab.name && "bg-white text-lime-600"}`}
              >
                {tab?.name}
              </div>
              <span
                className={`  rounded-full px-2 text-xs ${activeTab === tab.name ? "bg-zinc-100 px-2 text-lime-600" : "bg-white text-gray-500"}`}
              >
                {tab?.count}
              </span>
            </div>
          ))}
        </div>
        <RippleButton
          className="h-fit text-smd bg-lime-600 hover:bg-lime-600 py-1.5 text-white font-normal"
          onClick={() => {
            navigate({ to: "/events/add-event" });
          }}
        >
          <Plus className="w-5 h-5" />
          Add Event
        </RippleButton>
      </div>
      <div className="">
        {isLoading ? (
          <div className="h-[calc(100vh-185px)]">
            <LoadingComponent message="Loading Organizations" />
          </div>
        ) : organizations?.records?.length === 0 || !organizations ? (
          <div className="h-[calc(100vh-185px)] flex flex-col items-center gap-4 justify-center">
            <OrganizationsIcon />
            <p>No Organizations Found</p>
          </div>
        ) : (
          <TanStackTable
            data={organizations?.records}
            columns={columns}
            paginationDetails={organizations?.pagination_info}
            heightClass="h-[calc(100vh-182px)]"
            getData={getData}
            noDataLabel="No Organizations Found"
            removeSortingForColumnIds={[
              "actions",
              "name",
              "organization",
              "address",
              "scheduled_on",
              "status",
            ]}
          />
        )}
      </div>
    </div>
  );
};
