import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ArchiveIcon from "@/components/ui/icons/contacts/archiveIcon";
import EditIcon from "@/components/ui/icons/contacts/editIcon";
import ViewIcon from "@/components/ui/icons/contacts/viewIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Role } from "@/lib/interfaces/contacts";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { RefreshCcw, User } from "lucide-react";

interface OrgUserColumnsProps {
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onResendInvite?: (id: number) => void;
}

const OrgUserColumns = ({
  onDelete,
  onResendInvite,
  onView,
  onEdit,
}: OrgUserColumnsProps) => {
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
              className="self-center flex-1 truncate text-smd font-medium  capitalize"
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
      header: () => <span className="text-sm">Name</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.email,
      id: "email",
      cell: (info: any) => {
        return (
          <div className="text-smd font-medium w-full truncate  break-words">
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
      accessorFn: (row: any) => row.roles,
      id: "roles",
      cell: (info: any) => {
        const roles = info.getValue();
        if (roles.length === 0)
          return (
            <span className="text-smd font-medium  w-full text-center">--</span>
          );
        return (
          <div className="flex gap-2">
            {roles.slice(0, 1).map((role: Role) => (
              <span
                key={role.id}
                className={`text-smd font-medium  p-1 capitalize rounded `}
              >
                {role.name}
              </span>
            ))}
            {roles.length > 1 && (
              <Tooltip>
                <TooltipTrigger className="border px-1">
                  +{roles.length - 1}
                </TooltipTrigger>
                <TooltipContent className="tooltipBtn bg-white text-black shadow-md border">
                  {roles.slice(1).map((role: Role) => (
                    <div
                      key={role.id}
                      className={`text-smd font-medium  p-1 capitalize rounded`}
                    >
                      {role.name}
                    </div>
                  ))}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      header: () => <span className="text-sm">Roles</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.status,
      id: "status",
      cell: (info: any) => {
        const isActive = info.getValue() === "active";
        const isArchived = info.getValue() === "archived";
        return (
          <div
            className={`text-smd font-medium w-20 text-center  capitalize px-3 py-1 rounded ${
              isActive
                ? "bg-emerald-100 text-emerald-600"
                : isArchived
                  ? "bg-red-100 text-red-500"
                  : "bg-yellow-100 text-yellow-500"
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
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => (
        <div className="table-action-buttons flex space-x-4 items-center cursor-pointer">
          <button
            title="View User"
            className="cursor-pointer"
            onClick={() => onView && onView(info.row.original.id)}
          >
            <ViewIcon className="size-4" />
          </button>
          <button
            title="Edit User"
            className="cursor-pointer"
            onClick={() => onEdit && onEdit(info.row.original.id)}
          >
            <EditIcon className="size-4" />
          </button>
          <span
            title="Archive User"
            onClick={() => onDelete && onDelete(info.row.original.id)}
          >
            <ArchiveIcon className="size-4" />
          </span>
          {info.row.original.status === "hold" && (
            <span
              title="Resend Invite"
              onClick={() =>
                onResendInvite && onResendInvite(info.row.original.id)
              }
            >
              <RefreshCcw className="size-4" />
            </span>
          )}
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

export default OrgUserColumns;
