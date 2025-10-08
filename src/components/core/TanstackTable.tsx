import { pageProps } from "@/lib/interfaces/table";
import { useLocation } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useState } from "react";
import Pagination from "./Pagination";

import SortAscIcon from "../ui/icons/table/sort-asc";
import SortDescIcon from "../ui/icons/table/sort-desc";

const TanStackTable: FC<pageProps> = ({
  columns,
  data,
  loading = false,
  getData,
  paginationDetails,
  removeSortingForColumnIds,
  heightClass,
  noDataLabel,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const table = useReactTable({
    columns,
    data: data?.length ? data : [],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const capturePageNum = (value: number) => {
    getData({
      ...searchParams,
      limit: searchParams.get("limit")
        ? +(searchParams.get("limit") as string)
        : 25,
      page: value,
      order_by: searchParams.get("order_by"),
      order_type: searchParams.get("order_type"),
    });
  };

  const captureRowPerItems = (value: number) => {
    getData({
      ...searchParams,
      limit: value,
      page: 1,
      order_by: searchParams.get("order_by"),
      order_type: searchParams.get("order_type"),
      //search_string:searchParams.get("search_string"),
    });
  };

  const getWidth = (id: string) => {
    const widthObj = columns.find((col) => col.id === id);
    return widthObj ? widthObj?.width || widthObj?.size || "100px" : "100px";
  };

  const sortAndGetData = (header: Header<any, unknown>) => {
    if (
      removeSortingForColumnIds &&
      removeSortingForColumnIds.includes(header.id)
    ) {
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    const currentOrder = searchParams.get("order_by");
    const [currentField, currentDir] = currentOrder
      ? currentOrder.split(":")
      : ["", ""];

    if (currentField === header.id && currentDir === "asc") {
      newSearchParams.set("order_by", `${header.id}:desc`);
    } else if (currentField === header.id && currentDir === "desc") {
      newSearchParams.delete("order_by");
    } else {
      newSearchParams.set("order_by", `${header.id}:asc`);
    }

    getData({
      ...Object.fromEntries(newSearchParams.entries()),
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 25,
    });
  };

  return (
    <div className="w-full rounded-md shadow-xs bg-white">
      <div
        className={`w-full relative bg-white ${heightClass || "h-96"} ram overflow-y-hidden rounded-t-sm border`}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center w-full h-full"></div>
        ) : !data?.length ? (
          <div className="flex justify-center items-center w-full h-full">
            <div className="flex flex-col justify-center items-center text-center">
              <img
                src={"/images/core/no-data.jpg"}
                alt="No Data"
                className="w-[300px] h-auto mx-auto"
              />
              <p className="text-[20px] text-zinc-800 font-normal mt-4">
                {noDataLabel ? noDataLabel : "No data available"}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="w-full overflow-auto custom-scrollbar">
              <table className="w-full border-collapse bg-white min-w-full table-fixed">
                <thead className="bg-gray-100 border-b">
                  {table?.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id + `-${new Date().getTime()}`}
                      className="border-b"
                    >
                      {headerGroup.headers.map(
                        (header: Header<any, unknown>, index: number) => {
                          const canSort = !(
                            removeSortingForColumnIds?.includes(header.id) ||
                            header.colSpan === 2
                          );
                          if (location.pathname.includes("/dashboard")) {
                            return (
                              <th
                                key={index + `-${new Date().getTime()}`}
                                colSpan={header.colSpan}
                                className="bg-white text-left px-3 py-3 text-sm font-medium text-gray-900 sticky top-0 z-10"
                                style={{
                                  minWidth: getWidth(header.id),
                                  width: getWidth(header.id),
                                  position: "sticky",
                                  top: 0,
                                }}
                              >
                                {header.isPlaceholder ? null : (
                                  <div
                                    {...{
                                      className: header.column.getCanSort()
                                        ? "cursor-pointer select-none"
                                        : "",
                                      onClick:
                                        header.column.getToggleSortingHandler(),
                                    }}
                                    className="flex items-center gap-2"
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    {{
                                      asc: (
                                        <img
                                          src={
                                            "/images/dashboard/table/sort-asc.svg"
                                          }
                                          height={20}
                                          width={20}
                                          alt="Asc"
                                          className={
                                            removeSortingForColumnIds?.includes(
                                              header.id
                                            ) || header.colSpan == 2
                                              ? "hidden"
                                              : ""
                                          }
                                        />
                                      ),
                                      desc: (
                                        <img
                                          src={
                                            "/images/dashboard/table/sort-desc.svg"
                                          }
                                          height={20}
                                          width={20}
                                          alt="Desc"
                                          className={
                                            removeSortingForColumnIds?.includes(
                                              header.id
                                            ) || header.colSpan == 2
                                              ? "hidden"
                                              : ""
                                          }
                                        />
                                      ),
                                    }[
                                      header.column.getIsSorted() as string
                                    ] ?? (
                                      <img
                                        src={
                                          "/images/dashboard/table/sort-norm.svg"
                                        }
                                        height={15}
                                        width={15}
                                        alt="No Sort"
                                        className={
                                          removeSortingForColumnIds?.includes(
                                            header.id
                                          ) || header.colSpan == 2
                                            ? "hidden"
                                            : ""
                                        }
                                      />
                                    )}
                                  </div>
                                )}
                              </th>
                            );
                          } else {
                            return (
                              <th
                                key={index + `-${new Date().getTime()}`}
                                colSpan={header.colSpan}
                                className="bg-gray-100 text-left px-3 py-3 text-sm font-medium text-gray-900 sticky top-0 z-10"
                                style={{
                                  minWidth: getWidth(header.id),
                                  width: getWidth(header.id),
                                  position: "sticky",
                                  top: 0,
                                }}
                              >
                                {header.isPlaceholder ? null : (
                                  <div
                                    onClick={
                                      canSort
                                        ? () => sortAndGetData(header)
                                        : undefined
                                    }
                                    className={`flex items-center gap-2 ${canSort ? "cursor-pointer" : ""}`}
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    <SortItems
                                      header={header}
                                      removeSortingForColumnIds={
                                        removeSortingForColumnIds
                                      }
                                      getData={getData}
                                    />
                                  </div>
                                )}
                              </th>
                            );
                          }
                        }
                      )}
                    </tr>
                  ))}
                </thead>

                <tbody className={`divide-y divide-gray-200`}>
                  {table?.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id + `-${new Date().getTime()}`}
                      className="bg-white hover:bg-primary-200/20 transition-colors duration-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap"
                          key={cell.id + `-${new Date().getTime()}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {!loading && data?.length && paginationDetails ? (
        <div className="border-t border-gray-200">
          <Pagination
            paginationDetails={paginationDetails}
            capturePageNum={capturePageNum}
            captureRowPerItems={captureRowPerItems}
          />
        </div>
      ) : null}
    </div>
  );
};

const SortItems = ({
  header,
  removeSortingForColumnIds,
  getData,
}: {
  header: Header<any, unknown>;
  removeSortingForColumnIds?: string[];
  getData: (params: any) => void;
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);

  const orderParam = searchParams.get("order_by");
  const [orderField, orderDir] = orderParam ? orderParam.split(":") : ["", ""];

  if (removeSortingForColumnIds?.includes(header.id)) {
    return null;
  }

  const isAscending = orderField === header.id && orderDir === "asc";
  const isDescending = orderField === header.id && orderDir === "desc";

  const handleSort = (dir: "asc" | "desc") => {
    const newSearchParams = new URLSearchParams(searchParams);

    if ((dir === "asc" && isAscending) || (dir === "desc" && isDescending)) {
      newSearchParams.delete("order_by");
    } else {
      newSearchParams.set("order_by", `${header.id}:${dir}`);
    }

    getData({
      ...Object.fromEntries(newSearchParams.entries()),
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 25,
    });
  };

  return (
    <div className="flex items-center flex-col">
      <div
        className={`[&_svg]:size-2 ${isAscending ? "text-gray-400" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          handleSort("asc");
        }}
      >
        <SortAscIcon />
      </div>
      <div
        className={`[&_svg]:size-2 ${isDescending ? "text-gray-400" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          handleSort("desc");
        }}
      >
        <SortDescIcon />
      </div>
    </div>
  );
};

export default TanStackTable;
