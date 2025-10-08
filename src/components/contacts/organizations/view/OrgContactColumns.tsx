import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ArchiveIcon from "@/components/ui/icons/contacts/archiveIcon";
import EditIcon from "@/components/ui/icons/contacts/editIcon";
import ViewIcon from "@/components/ui/icons/contacts/viewIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tags } from "@/lib/interfaces/contacts";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";

const OrgContactColumns = () => {
  const navigate = useNavigate();
  return [
    {
      accessorFn: (row: any) => {
        const name = row.full_name;
        const profile = row.contact_profile;
        return { name, profile };
      },
      id: "full_name",
      cell: (info: any) => {
        const { data: contactProfileUrl } = useDownloadUrl(
          info.row.original.contact_profile
        );
        const profileUrl = contactProfileUrl?.target_url || undefined;

        return (
          <span className="flex gap-3 items-center">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage src={profileUrl} alt="Profile image" />
              <AvatarFallback className="text-gray-400 text-2xl font-bold">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div
              title={info.getValue()?.name}
              className="self-center flex-1 w-full truncate text-smd font-medium  capitalize"
            >
              {info.getValue()?.name || "--"}
            </div>
          </span>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span className="text-sm">Name</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.email,
      id: "email",
      cell: (info: any) => {
        return (
          <div
            title={info.getValue()}
            className="text-smd font-medium w-full truncate  break-words"
          >
            {info.getValue() || "--"}
          </div>
        );
      },
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      header: () => <span className="text-sm">Email</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) =>
        row.phone_number
          ? row.phone_number.replace(/^(\+91)(\d{5})(\d{5})$/, "$1 $2$3")
          : "--",
      id: "phone",
      cell: (info: any) => {
        return (
          <span className="text-smd font-medium ">
            {info.getValue() ?? "--"}
          </span>
        );
      },
      width: "100px",
      maxWidth: "150px",
      minWidth: "100px",
      header: () => <span className="text-sm">Phone</span>,
      footer: (props: any) => props.column.id,
    },

    {
      accessorFn: (row: any) => row.contact_tags,
      id: "tags",
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
                <TooltipContent className="tooltipBtn  px-1 py-1 bg-white text-black shadow-md border">
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
      width: "250px",
      maxWidth: "250px",
      minWidth: "250px",
      header: () => <span className="text-sm">Tags</span>,
      footer: (props: any) => props.column.id,
    },

    {
      accessorFn: (row: any) => row.status,
      id: "status",
      cell: (info: any) => {
        const isActive = info.getValue() === "active";
        return (
          <div
            className={`text-smd font-medium w-20 text-center capitalize px-3 py-1 rounded ${
              isActive
                ? "bg-emerald-600/20 text-emerald-600"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {info.getValue() || "--"}
          </div>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span className="text-sm">Status</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.user,
      id: "created_by",
      cell: (info: any) => {
        return (
          <span className="text-smd font-medium  break-words">
            {info.getValue()?.full_name || "--"}
          </span>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span className="text-sm">Created By</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => (
        <div className="table-action-buttons flex space-x-4 items-center cursor-pointer">
          <span
            title="View Contact"
            onClick={() =>
              navigate({ to: `/contacts/${info.row.original.id}` })
            }
          >
            <ViewIcon className="size-4" />
          </span>
        </div>
      ),
      header: () => <span className="text-sm">Actions</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      minWidth: "120px",
      maxWidth: "140px",
    },
  ];
};

export default OrgContactColumns;
