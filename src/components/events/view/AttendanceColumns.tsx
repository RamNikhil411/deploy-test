import { Switch } from "@/components/ui/switch";
import { CircleCheckBig, CircleX, Eye } from "lucide-react";

const AttendanceColumns = () => {
  return [
    {
      accessorFn: (row) => row.name,
      id: "name",
      header: "Full Name",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.email,
      id: "email",
      header: "Email",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.phone,
      id: "phone",
      header: "Phone",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.role,
      id: "role",
      header: "Role",
      cell: (info) => (
        <span className="text-xs capitalize">{info.getValue()}</span>
      ),
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.check_in,
      id: "check_in",
      header: "Check-In",
      cell: (info) => (
        <span className="text-xs bg-gray-100 p-1 rounded">
          {info.getValue() || "--"}
        </span>
      ),
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.check_out,
      id: "check_out",
      header: "Check-Out",
      cell: (info) => (
        <span className="text-xs bg-gray-100 p-1 rounded">
          {info.getValue() || "--"}
        </span>
      ),
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.duration,
      id: "duration",
      header: "Duration",
      cell: (info) => (
        <span className="text-xs">{info.getValue() || "--"}</span>
      ),
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row) => row.status,
      id: "status",
      header: "status",
      cell: (info) => {
        return (
          <span className="text-xs gap-2 flex items-center capitalize">
            <Switch checked={info.getValue() === "attended"} />
            <span
              className={`flex gap-1 items-center ${info.getValue() === "attended" ? "text-lime-600" : "text-red-500"}`}
            >
              {info.getValue() === "attended" ? (
                <CircleCheckBig className="w-3 h-3" />
              ) : (
                <CircleX className="w-3 h-3" />
              )}
              {info.getValue()}
            </span>
          </span>
        );
      },
      footer: (props) => props.column.id,
    },
  ];
};

export default AttendanceColumns;
