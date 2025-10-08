import { Eye } from "lucide-react";

const EventColumns = () => {
  return [
    {
      accessorFn: (row) => row.name,
      id: "name",
      header: "Name",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.organizations,
      id: "organization",
      header: "Organizations",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.address,
      id: "address",
      header: "Address",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.scheduled_on,
      id: "scheduled_on",
      header: "Date & Time",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.status,
      id: "status",
      header: "Status",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.actions,
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <span className="text-xs">
          <div>
            <button className=" py-1 px-2 rounded mr-2">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </span>
      ),
      footer: (props) => props.column.id,
    },
  ];
};

export default EventColumns;
