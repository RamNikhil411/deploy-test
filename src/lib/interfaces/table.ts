export interface DynamicPaginationProps {
  paginationDetails: any;

  totalItems?: number;
  capturePageNum: (value: number) => void;
  captureRowPerItems: (value: number) => void;
  initialPage?: number;
  limitOptionsFromProps?: { title: string; value: number }[];
}

export interface pageProps {
  columns: any[];
  data: any[];
  loading?: boolean;
  heightClass?: string;
  getData?: any;
  paginationDetails: any;
  removeSortingForColumnIds?: string[];
  noDataLabel?: string;
}
