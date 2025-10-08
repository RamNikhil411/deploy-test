import { useEffect } from "react";

export function useFixEmptyPage<T>(
  data:
    | { records: T[]; pagination_info?: { total_records: number } }
    | undefined,
  pagination: { page: number },
  setPagination: React.Dispatch<React.SetStateAction<any>>
) {
  useEffect(() => {
    if (data && data.records.length === 0 && pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  }, [data, pagination.page]);
}
