import EditIcon from "@/components/ui/icons/contacts/editIcon";
import ViewIcon from "@/components/ui/icons/contacts/viewIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tags } from "@/lib/interfaces/contacts";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";

const OrganizationColumns = (viewRegion: (id: number) => void) => {
  const navigate = useNavigate();
  return [
    {
      accessorFn: (row) => row.name,
      id: "name",
      header: "Name",
      cell: (info) => (
        <div className="text-smd font-medium truncate w-full capitalize">
          {info.getValue()}
        </div>
      ),
      footer: (props) => props.column.id,
      size: 180,
    },
    {
      accessorFn: (row) => row.region.name,
      id: "region",
      header: "Region",
      cell: (info) => (
        <div className="text-smd font-medium w-full truncate capitalize ">
          {info.getValue()}
        </div>
      ),
      footer: (props) => props.column.id,
      size: 180,
    },
    {
      accessorFn: (row) => row.tags,
      id: "tags",
      header: "Tags",
      cell: (info) => {
        const tags = info.getValue();
        if (tags.length === 0)
          return (
            <span className="text-smd font-medium  w-full text-center">--</span>
          );
        return (
          <div className="flex gap-2">
            {tags.slice(0, 2).map((tag: Tags) => (
              <span
                key={tag.id}
                className={`text-smd font-medium text-slate-700  bg-gray-100  p-1 capitalize rounded `}
              >
                #{tag.name}
              </span>
            ))}
            {tags.length > 2 && (
              <Tooltip>
                <TooltipTrigger>+{tags.length - 2}</TooltipTrigger>
                <TooltipContent className="tooltipBtn px-1 py-1 bg-white text-black shadow-md border">
                  {tags.slice(2).map((tag: Tags) => (
                    <div
                      key={tag.id}
                      className={`text-smd font-medium text-slate-700  bg-gray-100  p-1 capitalize rounded`}
                    >
                      #{tag.name}
                    </div>
                  ))}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
      footer: (props) => props.column.id,
      size: 180,
    },
    {
      accessorFn: (row) => row.created_at,
      id: "created_at",
      header: "Created Date",
      cell: (info) => {
        const date = info.getValue();
        return (
          <span className="text-smd font-medium ">
            {dayjs(date).format("DD-MM-YYYY")}
          </span>
        );
      },
      footer: (props) => props.column.id,
      size: 120,
    },
    {
      accessorFn: (row) => row.status,
      id: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <span
            className={`text-smd font-medium  p-1 capitalize rounded ${status === "active" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}
          >
            {status}
          </span>
        );
      },
      footer: (props) => props.column.id,
      size: 100,
    },
    {
      accessorFn: (row) => row.actions,
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <span className="text-smd font-medium ">
          <div>
            <button
              onClick={() => viewRegion(info.row.original.id)}
              className=" py-1 px-2 rounded mr-2 cursor-pointer"
            >
              <ViewIcon className="w-4 h-4" />
            </button>

            <button
              className=" py-1 px-2 rounded cursor-pointer"
              onClick={() => {
                navigate({ to: `/organisations/${info.row.original.id}/edit` });
              }}
            >
              <EditIcon className="w-4 h-4" />
            </button>
          </div>
        </span>
      ),
      footer: (props) => props.column.id,
      size: 100,
    },
  ];
};

export default OrganizationColumns;
