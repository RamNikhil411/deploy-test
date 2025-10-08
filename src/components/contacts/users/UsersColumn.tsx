import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ArchiveIcon from "@/components/ui/icons/contacts/archiveIcon";
import EditIcon from "@/components/ui/icons/contacts/editIcon";
import ViewIcon from "@/components/ui/icons/contacts/viewIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAvatarLetters } from "@/utils/helpers/getAvatarLetters";

import { useNavigate } from "@tanstack/react-router";

const UsersColumn = ({ onDelete }: { onDelete?: (id: number) => void }) => {
  const navigate = useNavigate();
  return [
    {
      accessorFn: (row: any) => {
        return {
          name: row.full_name,
          profile: row.avatar,
        };
      },
      id: "full_name",
      header: "Name",
      cell: (info) => (
        <div
          title={info.getValue()?.name}
          className="text-smd flex gap-2 items-center font-medium w-full  "
        >
          <Avatar className="w-7 h-7">
            <AvatarImage src={info.getValue()?.profile} alt="Profile image" />
            <AvatarFallback className="text-gray-400 text-xs font-medium">
              {getAvatarLetters(info.getValue()?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="text-smd flex-1 truncate font-medium ">
              {info.getValue()?.name}
            </span>
          </div>
        </div>
      ),
      footer: (props) => props.column.id,
      size: 180,
    },
    {
      accessorFn: (row: any) => row.email,
      id: "email",
      header: "Email",
      cell: (info) => (
        <div
          title={info.getValue()}
          className="text-smd font-medium w-full truncate "
        >
          {info.getValue()}
        </div>
      ),
      footer: (props) => props.column.id,
      size: 200,
    },
    {
      accessorFn: (row: any) => row.phone_number,
      id: "phone_number",
      header: "Phone",
      cell: (info) => (
        <span className="text-smd font-medium ">{info.getValue() || "--"}</span>
      ),
      footer: (props) => props.column.id,
      size: 140,
    },
    {
      accessorFn: (row: any) => row.organizations,
      id: "organizations",
      header: "Organisations",
      cell: (info) => {
        const organizations = info.getValue();
        if (organizations.length === 0)
          return (
            <span className="text-smd font-medium  w-full text-center">--</span>
          );
        return (
          <div className="flex gap-2">
            {organizations.slice(0, 1).map((org: any) => (
              <span
                key={org.id}
                className={`text-smd font-medium  p-1 capitalize rounded `}
              >
                {org.name}
              </span>
            ))}
            {organizations.length > 1 && (
              <Tooltip>
                <TooltipTrigger className="px-1.5 text-xs border">
                  +{organizations.length - 1}
                </TooltipTrigger>
                <TooltipContent className="tooltipBtn bg-white space-y-1 max-h-[40vh] overflow-auto text-black shadow-md border">
                  {organizations.slice(1).map((tag: any) => (
                    <ul className="">
                      <li
                        key={tag.id}
                        className={`text-smd font-medium   p-1 capitalize rounded`}
                      >
                        {tag.name}
                      </li>
                    </ul>
                  ))}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
      footer: (props) => props.column.id,
      size: 250,
    },
    {
      accessorFn: (row: any) => row.status,
      id: "status",
      header: "Status",
      cell: (info) => {
        return (
          <span
            className={`text-smd font-medium  p-1 px-2 rounded capitalize ${info.getValue() === "active" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}
          >
            {info.getValue()}
          </span>
        );
      },
      footer: (props) => props.column.id,
      size: 100,
    },
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      header: "Actions",
      cell: (info: any) => (
        <div className="table-action-buttons flex space-x-4 items-center cursor-pointer">
          <span
            title="View User"
            onClick={() => {
              navigate({ to: `/users/${info.row.original.id}` });
            }}
          >
            <ViewIcon className="size-4" />
          </span>
          <span
            title="Edit User"
            onClick={() => {
              navigate({ to: `/users/${info.row.original.id}/edit` });
            }}
          >
            <EditIcon className="size-4" />
          </span>
          <span
            title="Archive User"
            onClick={() => onDelete && onDelete(info.row.original.id)}
          >
            <ArchiveIcon className="size-4" />
          </span>
        </div>
      ),
      footer: (props) => props.column.id,
      size: 100,
    },
  ];
};

export default UsersColumn;
