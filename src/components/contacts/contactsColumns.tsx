import ArchiveIcon from "@/components/ui/icons/contacts/archiveIcon";
import ViewIcon from "@/components/ui/icons/contacts/viewIcon";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import EditIcon from "../ui/icons/contacts/editIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Tags } from "@/lib/interfaces/contacts";

interface ContactColumnsProps {
  onDelete?: (id: number) => void;
}

const ContactColumns = ({ onDelete }: ContactColumnsProps) => {
  const navigate = useNavigate();

  return [
    {
      accessorFn: (row: any) => {
        const name = row.full_name;
        const profile = row.profile_pic;
        return { name, profile };
      },
      id: "full_name",
      cell: (info: any) => {
        return (
          <span className="flex gap-3 items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={info.row.original?.profile_pic}
                alt="Profile image"
              />
              <AvatarFallback className="text-gray-400 text-2xl font-bold">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div
              className="self-center text-xs capitalize truncate"
              title={info.getValue()?.name}
            >
              {info.getValue()?.name || "--"}
            </div>
          </span>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span className="text-sm">Full Name</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.email,
      id: "email",
      cell: (info) => (
        <div
          title={info.getValue()}
          className="text-smd font-medium w-full truncate "
        >
          {info.getValue()}
        </div>
      ),
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      header: () => <span className="text-sm">Email</span>,
      footer: (props) => props.column.id,
    },
    {
      accessorFn: (row: any) =>
        row.phone_number
          ? row.phone_number.replace(/^(\+91)(\d{5})(\d{5})$/, "$1 $2$3")
          : "--",
      id: "phone",
      cell: (info: any) => {
        return <span className="text-xs">{info.getValue() ?? "--"}</span>;
      },
      width: "100px",
      maxWidth: "150px",
      minWidth: "100px",
      header: () => <span className="text-sm">Phone</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row) => row.contact_tags,
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
                key={tag?.id}
                className={`text-smd font-medium text-slate-700  bg-gray-100 p-1 capitalize rounded `}
              >
                #{tag?.name}
              </span>
            ))}
            {tags.length > 2 && (
              <Tooltip>
                <TooltipTrigger>+{tags.length - 2}</TooltipTrigger>
                <TooltipContent className="tooltipBtn px-1 space-y-1 max-h-[40vh] overflow-auto bg-white text-black shadow-md border">
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
      accessorFn: (row: any) => row.status,
      id: "status",
      cell: (info: any) => {
        const isActive = info.getValue() === "active";
        return (
          <span
            className={`text-xs capitalize px-3 py-1 rounded ${
              isActive
                ? "bg-emerald-600/20 text-emerald-600"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {info.getValue() || "--"}
          </span>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span className="text-sm">Status</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => (
        <div className="table-action-buttons flex space-x-4 items-center cursor-pointer">
          <span
            title="View Contact"
            onClick={() => {
              navigate({ to: `/contacts/${info.row.original.id}` });
            }}
          >
            <ViewIcon className="size-4" />
          </span>
          <span
            title="Edit Contact"
            onClick={() => {
              navigate({ to: `/contacts/${info.row.original.id}/edit` });
            }}
          >
            <EditIcon className="size-4" />
          </span>
          <span
            title="Archive Contact"
            onClick={() => onDelete && onDelete(info.row.original.id)}
          >
            <ArchiveIcon className="size-4" />
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

export default ContactColumns;
