import { useRegions } from "@/components/core/ContactQueries";
import LoadingComponent from "@/components/core/LoadingComponent";
import { SelectFilter } from "@/components/core/selectFilter";
import TanStackTable from "@/components/core/TanstackTable";
import { getAllOrganization } from "@/components/https/services/contacts";
import { Button } from "@/components/ui/button";
import OrganizationsIcon from "@/components/ui/icons/OrganizationsIcon";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import OrganizationColumns from "./OrganizationColumns";
import SearchFilter from "@/components/core/SearchFilter";
import { pagination, SearchParams } from "@/lib/interfaces/contacts";
import { useFixEmptyPage } from "@/utils/helpers/Pagination";
import { MultiSelect } from "@/components/core/multiSelect";

const Organizations = () => {
  const navigate = useNavigate();

  const searchParams: SearchParams = useSearch({ strict: false });
  const orderByParam = searchParams.order_by;
  const [searchString, setSearchString] = useState<string>("");
  const [debounceSearchString, setDebounceSearchString] = useState<string>("");
  const decodedOrderBy = orderByParam ? decodeURIComponent(orderByParam) : "";

  const [pagination, setPagination] = useState<pagination>({
    page: searchParams.page || 1,
    limit: searchParams.limit || 25,
    order_by: decodedOrderBy,
  });

  const { allRegions } = useRegions({ view: "dropdown" });
  const [selectedRegion, setSelectedRegion] = useState<number[] | null>(null);

  const viewRegion = (id: number) => {
    navigate({ to: `/organisations/${id}` });
  };

  const { data: organizations, isLoading } = useQuery({
    queryKey: [
      "getOrganizations",
      pagination.page,
      pagination.limit,
      selectedRegion,
      pagination.order_by,
      debounceSearchString,
    ],
    queryFn: async () => {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        order_by: `created_at:desc`,
        ...(selectedRegion ? { region_id: selectedRegion.join(",") } : {}),
        ...(pagination.order_by ? { order_by: `${pagination.order_by}` } : {}),

        ...(debounceSearchString
          ? { search_string: debounceSearchString }
          : {}),
      };
      const response = await getAllOrganization(queryParams);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const columns = OrganizationColumns(viewRegion);

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

  useFixEmptyPage(organizations, pagination, setPagination);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchString(searchString);
      if (searchString) {
        setPagination((p) => ({ ...p, page: 1 }));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchString]);

  useEffect(() => {
    navigate({
      to: `/organisations`,
      search: {
        page: Number(pagination.page),
        limit: Number(pagination.limit),
        ...(selectedRegion ? { region_id: selectedRegion } : {}),
        ...(pagination.order_by ? { order_by: `${pagination.order_by}` } : {}),

        ...(debounceSearchString
          ? { search_string: debounceSearchString }
          : {}),
      },
      replace: true,
    });
  }, [
    pagination.page,
    pagination.limit,
    selectedRegion,
    pagination.order_by,
    debounceSearchString,
  ]);
  return (
    <div className="h-full p-4 space-y-2">
      <div className="flex justify-between ">
        <div className="flex items-center gap-2">
          <h1>Organisations</h1>
          {!isLoading && (
            <span className="bg-gray-100 p-1 text-xs px-3 rounded-full">
              {organizations?.pagination_info?.total_records}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <SearchFilter
            searchString={searchString}
            setSearchString={setSearchString}
            title="Search by Organisation Name"
            className="w-60"
          />
          <MultiSelect
            options={allRegions}
            placeholder="Select Region"
            value={selectedRegion}
            onChange={setSelectedRegion}
          />

          <Button
            onClick={() => navigate({ to: "/organisations/add-organisation" })}
            className="bg-lime-600 hover:bg-lime-700"
          >
            <Plus className="w-5 h-5" />
            Add Organisation
          </Button>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <div className="h-[calc(100vh-180px)]">
            <LoadingComponent message="Loading Organisations" />
          </div>
        ) : organizations?.records?.length === 0 || !organizations ? (
          <div className="h-[calc(100vh-180px)] flex flex-col items-center gap-4 justify-center">
            <OrganizationsIcon />
            <p>No Organisations Found</p>
          </div>
        ) : (
          <TanStackTable
            data={organizations?.records}
            columns={columns}
            paginationDetails={organizations?.pagination_info}
            heightClass="h-[calc(100vh-180px)]"
            getData={getData}
            noDataLabel="No Organizations Found"
            removeSortingForColumnIds={["actions", "status", "tags", "region"]}
          />
        )}
      </div>
    </div>
  );
};

export default Organizations;
