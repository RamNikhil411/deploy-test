import EditIcon from "@/components/ui/icons/contacts/editIcon";
import dayjs from "dayjs";

const RegionColumns = ({
  onEdit,
  page_size,
  limit,
}: {
  onEdit: (row: any) => void;
  page_size: number;
  limit: number;
}) => {
  return [
    {
      accessorFn: (row: any, index: number) =>
        (page_size - 1) * limit + index + 1,
      id: "id",
      header: "S.No",
      cell: (info: any) => <span className="text-smd">{info.getValue()}</span>,
      footer: (props) => props.column.id,
      size: 50,
    },
    {
      accessorFn: (row: any) => row.name,
      id: "name",
      header: "Name",
      cell: (info: any) => {
        return (
          <span className="text-smd font-medium capitalize">
            {info.getValue()}
          </span>
        );
      },
      footer: (props) => props.column.id,
      size: 180,
    },
    {
      accessorFn: (row: any) => row.created_at,
      id: "created_at",
      header: "Created At",
      cell: (info: any) => {
        return (
          <span className="text-smd">
            {dayjs(info.getValue()).format("DD/MM/YYYY")}
          </span>
        );
      },
      footer: (props) => props.column.id,
      size: 180,
    },
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      header: "Actions",
      cell: (info: any) => {
        const row = info.row.original;
        return (
          <div className="table-action-buttons flex space-x-4 items-center cursor-pointer">
            <span title="Edit region" onClick={() => onEdit(row)}>
              <EditIcon className="size-4" />
            </span>
          </div>
        );
      },
      footer: (props) => props.column.id,
      size: 100,
    },
  ];
};

export default RegionColumns;
