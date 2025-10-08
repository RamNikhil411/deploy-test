import { useRegions } from "@/components/core/ContactQueries";
import { AppToast } from "@/components/core/customToast";
import LoadingComponent from "@/components/core/LoadingComponent";
import SearchFilter from "@/components/core/SearchFilter";
import TanStackTable from "@/components/core/TanstackTable";
import {
  AddRegionAPI,
  updateRegionAPI,
} from "@/components/https/services/contacts";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import AddRegionIcon from "@/components/ui/icons/regions/addRegionIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pagination, SearchParams } from "@/lib/interfaces/contacts";
import { APIResponse, ErrorResponse } from "@/lib/types";
import { useFixEmptyPage } from "@/utils/helpers/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import RegionColumns from "./regionColumns";

interface IRegion {
  name: string;
  id?: string | undefined;
}

const Regions = () => {
  const [selectedRegion, setSelectedRegion] = useState<IRegion | null>(null);
  const [regionName, setRegionName] = useState<string>("");
  const [searchString, setSearchString] = useState<string>("");
  const [debounceSearchString, setDebounceSearchString] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams: SearchParams = useSearch({ strict: false });
  const orderByParam = searchParams.order_by;

  const decodedOrderBy = orderByParam ? decodeURIComponent(orderByParam) : "";

  const [pagination, setPagination] = useState<pagination>({
    page: searchParams.page,
    limit: searchParams.limit || 25,
    order_by: decodedOrderBy,
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryclient = useQueryClient();

  const { mutate: createRegion, isPending: isCreating } = useMutation<
    APIResponse,
    ErrorResponse,
    IRegion
  >({
    mutationKey: ["createRegion"],
    mutationFn: async (payload: IRegion) => {
      const response = await AddRegionAPI(payload);
      return response;
    },
    onSuccess: (response) => {
      AppToast.success({ message: response?.message || "Region added." });
      queryclient.invalidateQueries({ queryKey: ["regions"] });
      setIsDialogOpen(false);
      setError("");
      setRegionName("");
    },
    onError: (response: any) => {
      setError(response?.data?.err_data?.name[0]);
    },
  });

  const { mutate: updateRegion, isPending: isUpdating } = useMutation<
    APIResponse,
    ErrorResponse,
    IRegion
  >({
    mutationKey: ["updateRegion"],
    mutationFn: async (payload: IRegion) => {
      const response = await updateRegionAPI(selectedRegion?.id, payload);
      return response;
    },
    onSuccess: (response) => {
      AppToast.success({ message: response?.message || "Region updated." });
      queryclient.invalidateQueries({ queryKey: ["regions"] });
      setIsDialogOpen(false);
      setRegionName("");
      setError("");
      setSelectedRegion(null);
    },
    onError: (response: any) => {
      setError(response?.data?.err_data?.name[0]);
    },
  });

  const keys = [
    pagination.page,
    pagination.limit,
    pagination.order_by,
    pagination.order_type,
    debounceSearchString,
  ];
  const { allRegions: regions, isLoading } = useRegions(
    {
      page: pagination.page,
      limit: pagination.limit,
      ...(pagination.order_by ? { order_by: pagination.order_by } : {}),
      ...(debounceSearchString ? { search_string: debounceSearchString } : {}),
    },
    keys
  );
  const handleEdit = (region: IRegion) => {
    setSelectedRegion(region);
    setRegionName(region.name);
    setIsDialogOpen(true);
  };
  const handleSubmit = () => {
    const payload = { name: regionName };
    if (selectedRegion) {
      updateRegion(payload);
    } else {
      createRegion(payload);
    }
  };

  const columns = RegionColumns({
    onEdit: handleEdit,
    page_size: pagination?.page || 1,
    limit: pagination?.limit || 25,
  });
  const getRegionData = async ({
    page,
    limit,
    order_by,
  }: {
    page: number;
    limit: number;
    order_by?: string;
  }) => {
    setPagination({
      page: Number(page),
      limit: Number(limit),
      order_by: order_by,
    });
  };

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
      to: "/regions",
      search: {
        page: pagination.page,
        limit: pagination.limit,
        ...(pagination.order_by ? { order_by: `${pagination.order_by}` } : {}),
        ...(debounceSearchString
          ? { search_string: debounceSearchString }
          : {}),
        ...(debounceSearchString
          ? { search_string: debounceSearchString }
          : {}),
      },
    });
  }, [
    pagination.page,
    pagination.limit,
    pagination.order_by,
    debounceSearchString,
  ]);

  useFixEmptyPage(regions, pagination, setPagination);

  return (
    <div className="h-full p-4 space-y-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h1>Regions</h1>
          {!isLoading && (
            <span className="bg-gray-100 p-1 text-xs px-3 rounded-full">
              {regions?.pagination_info?.total_records}
            </span>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <SearchFilter
            searchString={searchString}
            setSearchString={setSearchString}
            title="Search by region name"
          />
          <AlertDialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setRegionName("");
                setSelectedRegion(null);
                setError("");
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-lime-600 h-8 gap-1 hover:bg-lime-700"
              >
                <MapPin className="w-4 h-4 mr-2 " />
                Add Region
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[350px] p-2">
              <AlertDialogHeader>
                <div className="bg-gray-50">
                  <AddRegionIcon className="w-60 mx-auto" />
                </div>
              </AlertDialogHeader>
              <div className="p-2">
                <Label htmlFor="region" className="text-smd font-normal">
                  Region <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="region"
                  type="text"
                  placeholder="Region"
                  className="mt-2 text-sm"
                  value={
                    regionName?.charAt(0).toUpperCase() + regionName?.slice(1)
                  }
                  onChange={(e) => setRegionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                      e.preventDefault();
                    }
                  }}
                />
                {error && <span className="text-red-500 text-xs">{error}</span>}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  type="submit"
                  className={`bg-lime-600 hover:bg-lime-700 ${isUpdating || isCreating ? "pointer-events-none" : ""}`}
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  {selectedRegion ? (
                    isUpdating ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Update"
                    )
                  ) : isCreating ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {isLoading ? (
        <div className="h-[calc(100vh-180px)]">
          <LoadingComponent />
        </div>
      ) : regions?.records?.length === 0 || !regions ? (
        <div className="h-[calc(100vh-180px)] flex flex-col items-center justify-center">
          <AddRegionIcon className="w-60 mx-auto" />
          <p className="text-center">No regions found.</p>
        </div>
      ) : (
        <TanStackTable
          columns={columns}
          data={regions?.records || []}
          paginationDetails={regions?.pagination_info}
          removeSortingForColumnIds={["id", "actions"]}
          getData={getRegionData}
          heightClass="h-[calc(100vh-180px)]"
        />
      )}
    </div>
  );
};

export default Regions;
