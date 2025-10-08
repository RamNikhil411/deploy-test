import { Input } from "@/components/ui/input";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState, useMemo } from "react";
import { DynamicPaginationProps } from "@/lib/interfaces/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

const Pagination = ({
  capturePageNum,
  captureRowPerItems,
  initialPage = 1,
  limitOptionsFromProps,
  paginationDetails,
}: DynamicPaginationProps) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageValue, setPageValue] = useState<string>(initialPage.toString());
  const [limitOptions, setLimitOptions] = useState<
    { title: string; value: number }[]
  >([]);
  const [pageNumFocused, setPageNumFocused] = useState(false);

  const totalPages = paginationDetails?.total_pages ?? 1;
  const selectedValue = paginationDetails?.page_size ?? 25;
  const totalRecords = paginationDetails?.total_records ?? 0;

  useEffect(() => {
    setLimitOptions(
      limitOptionsFromProps?.length
        ? limitOptionsFromProps
        : [
            { title: "25", value: 25 },
            { title: "50", value: 50 },
          ]
    );
  }, [limitOptionsFromProps]);

  useEffect(() => {
    if (paginationDetails?.current_page) {
      setPageValue(paginationDetails.current_page.toString());
      setCurrentPage(paginationDetails.current_page);
    }
  }, [paginationDetails]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageValue(page.toString());
      capturePageNum(page);
    }
  };

  const handleRowChange = (newLimit: string) => {
    captureRowPerItems(Number(newLimit));
  };

  const onKeyDownInPageChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNumber = Number(pageValue) || 1;
      const page = Math.max(1, Math.min(Number(pageNumber) || 1, totalPages));
      handlePageChange(page);
    }
  };

  const onChangeInPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPageValue(value);
    }
  };

  const pageNumbers = useMemo(() => {
    const numbers: (number | null)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          numbers.push(i);
        }
        numbers.push(null);
        numbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        numbers.push(1);
        numbers.push(null);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          numbers.push(i);
        }
      } else {
        numbers.push(1);
        numbers.push(null);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          numbers.push(i);
        }
        numbers.push(null);
        numbers.push(totalPages);
      }
    }
    return numbers;
  }, [currentPage, totalPages]);

  return (
    <div className="flex justify-between items-center px-4 py-2 shadow-inner">
      <PaginationContent className="flex items-center gap-2">
        <p className="font-normal text-xs">
          Showing {1 + (currentPage - 1) * selectedValue} to{" "}
          {Math.min(currentPage * selectedValue, totalRecords)} of{" "}
          {totalRecords} items
        </p>
      </PaginationContent>

      <PaginationContent className="flex items-center gap-4">
        <PaginationItem>
          <a
            href={currentPage === 1 ? undefined : "#"}
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              handlePageChange(1);
            }}
            className={`flex items-center justify-center w-6 h-6 rounded border border-lime-600 text-lime-700 ${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }`}
            aria-disabled={currentPage === 1}
          >
            <ChevronsLeftIcon className="w-4 h-4" />
          </a>
        </PaginationItem>

        <PaginationItem>
          <a
            href={currentPage === 1 ? undefined : "#"}
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className={`flex items-center justify-center w-6 h-6 rounded border border-lime-600 text-lime-700 ${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }`}
            aria-disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </a>
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === null ? (
            <PaginationItem
              key={`ellipsis-${index}`}
              className="flex items-center"
            >
              <PaginationEllipsis className="flex items-center h-6 text-xs" />
            </PaginationItem>
          ) : (
            <PaginationItem
              key={`page-${pageNumber}`}
              className="flex items-center"
            >
              <PaginationLink
                href="#"
                isActive={pageNumber === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageNumber);
                }}
                className={`flex items-center justify-center w-6 h-6 text-xs font-normal rounded hover:no-underline ${
                  pageNumber === currentPage
                    ? "border border-lime-600 bg-lime-50 text-lime-700"
                    : "text-black"
                }`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <a
            href={currentPage === totalPages ? undefined : "#"}
            onClick={(e) => {
              if (currentPage === totalPages) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className={`flex items-center justify-center w-6 h-6 rounded border border-lime-600 text-lime-700 ${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }`}
            aria-disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </a>
        </PaginationItem>

        <PaginationItem>
          <a
            href={currentPage === totalPages ? undefined : "#"}
            onClick={(e) => {
              if (currentPage === totalPages) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            className={`flex items-center justify-center w-6 h-6 rounded border border-lime-600 text-lime-700 ${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }`}
            aria-disabled={currentPage === totalPages}
          >
            <ChevronsRightIcon className="w-4 h-4" />
          </a>
        </PaginationItem>
      </PaginationContent>

      <div className="flex items-center gap-2">
        <PaginationContent className="flex items-center">
          <div className="flex items-center font-normal text-xs pr-1">
            GoTo
            <Input
              type="number"
              id="pageInput"
              autoComplete="off"
              value={pageValue}
              autoFocus={pageNumFocused}
              onFocus={() => setPageNumFocused(true)}
              onBlur={() => setPageNumFocused(false)}
              onChange={onChangeInPageChange}
              onKeyDown={onKeyDownInPageChange}
              className="h-6 w-16 py-1 mx-2 text-center text-xs font-normal bg-gray-200 bg-opacity-80 border-lime-600 focus:outline-none focus:ring-0"
              placeholder="Page"
              aria-label="Go to page number"
            />
          </div>
        </PaginationContent>

        <PaginationContent className="flex items-center">
          <div className="flex items-center gap-2">
            <Select
              value={selectedValue?.toString()}
              onValueChange={handleRowChange}
            >
              <SelectTrigger className="data-[size=default]:h-6 px-2 py-1 border border-lime-600 text-lime-600 [&_svg]:stroke-lime-600 text-xs">
                <SelectValue
                  placeholder="Items per page"
                  className="font-normal text-xs"
                />
              </SelectTrigger>
              <SelectContent className="w-24 bg-white">
                {limitOptions.map((item, index) => (
                  <SelectItem
                    value={item.value?.toString()}
                    key={`limit-${item.value}-${index}`}
                    className="cursor-pointer font-normal text-xs"
                  >
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs">Items per page</span>
          </div>
        </PaginationContent>
      </div>
    </div>
  );
};

export default Pagination;
