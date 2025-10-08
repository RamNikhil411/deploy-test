import { AppToast } from "@/components/core/customToast";
import DeleteDialog from "@/components/core/DeleteDialog";
import { deleteContactAPI } from "@/components/https/services/contacts";
import { deleteUserByIdAPI } from "@/components/https/services/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Rating from "@/components/ui/icons/rating";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { Archive, ArrowLeft, Edit, Mail, Phone, User } from "lucide-react";
import { use, useState } from "react";
interface ProfileProps {
  contact_id: string | undefined;
  getContacts: any;
}

const Profile = ({ contact_id, getContacts }: ProfileProps) => {
  const navigate = useNavigate();
  const router = useRouter();
  const pathName = useLocation().pathname;
  const isUser = pathName.includes("users");
  const { data: contactProfileUrl } = useDownloadUrl(
    isUser ? getContacts?.avatar : getContacts?.profile_pic
  );
  const profileUrl = contactProfileUrl?.target_url || undefined;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteContact, setDeleteContact] = useState<{
    id: number | null;
    isUser: boolean;
  }>({ id: null, isUser: false });

  const onCancelDelete = () => {
    setDeleteContact({ id: null, isUser: false });
    setShowDeleteDialog(false);
  };

  const { mutate: deleteEntity, isPending: isLoadingDelete } = useMutation({
    mutationFn: async ({ isUser, ids }: { isUser: boolean; ids: number[] }) => {
      if (isUser) {
        const response = await deleteUserByIdAPI(ids[0]);
        return response?.data;
      } else {
        const response = await deleteContactAPI({ contactId: ids });
        return response?.data;
      }
    },
    onSuccess: (response) => {
      AppToast.success({ message: response?.message || "Contact Archived." });
      navigate({ to: `/${isUser ? "users" : "contacts"}` });
      setShowDeleteDialog(false);
    },
    onError: (response) => {
      AppToast.error({ message: response?.message || "Failed to archive." });
    },
  });

  return (
    <div className="p-4 w-full">
      <div className="flex gap-3 items-center">
        <div
          className="border px-3 py-1 rounded-md cursor-pointer"
          onClick={() => {
            router.history.back();
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </div>
        <h1>Profile</h1>
      </div>
      <div className="mt-4 flex gap-3 items-center ">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileUrl} alt="profile" />
          <AvatarFallback className="text-gray-400 text-2xl font-bold">
            <User className="w-16 h-16" />
          </AvatarFallback>
        </Avatar>
        <h2
          className="text-xl truncate  capitalize"
          title={getContacts?.full_name}
        >
          {getContacts?.full_name}
        </h2>
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <div className="flex gap-4 items-center">
          <Phone className="w-3 h-3" />
          <span className="text-smd">{getContacts?.phone_number}</span>
        </div>
        <div className="flex gap-4 items-center">
          <Mail className="w-3 h-3" />
          <span className="text-smd truncate" title={getContacts?.email}>
            {getContacts?.email}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h2>Organisations</h2>

        <div className="space-y-1 mt-2">
          {isUser ? (
            <div className="flex flex-wrap gap-2 items-center">
              {getContacts?.organizations?.length === 0 ? (
                <span className="text-smd">No Organisation Joined</span>
              ) : (
                <div>
                  {getContacts?.organizations
                    ?.slice(0, 2)
                    .map((organization: any) => (
                      <Badge className="bg-transparent text-smd  py-1 capitalize tracking-wide  text-black border border-gray-200 ">
                        {organization?.name}
                      </Badge>
                    ))}
                  {getContacts?.organizations?.length > 2 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="bg-transparent text-xs py-1  text-black border border-gray-300 ">
                          +{getContacts?.organizations?.length - 2}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="tooltipBtn p-2 flex flex-col gap-1 bg-white text-black shadow-md border">
                        {getContacts?.organizations
                          ?.slice(2)
                          .map((organization: any) => (
                            <Badge
                              className="bg-transparent text-xs py-1 w-full flex justify-start  text-black border border-gray-300 "
                              key={organization?.id}
                            >
                              {organization?.name}
                            </Badge>
                          ))}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Badge className="bg-transparent text-smd font-light py-1  text-black border border-gray-300 ">
              {getContacts?.organization?.name}
            </Badge>
          )}
        </div>
      </div>

      {!isUser && getContacts?.contact_tags?.length > 0 && (
        <div className="mt-4">
          <h2>Tags</h2>
          <div className="flex flex-wrap gap-2 mt-1 items-center">
            {getContacts?.contact_tags?.slice(0, 2).map((tag: any) => (
              <Badge className=" text-smd font-light   text-black  border border-gray-300 bg-gray-100">
                # {tag?.name}
              </Badge>
            ))}
            {getContacts?.contact_tags?.length > 2 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge className=" text-smd font-light   text-black  border border-gray-300 bg-gray-100">
                    +{getContacts?.contact_tags?.length - 2}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="tooltipBtn p-2 flex flex-col gap-1 bg-white text-black shadow-md border">
                  {getContacts?.contact_tags?.slice(2).map((tag: any) => (
                    <Badge
                      className=" text-smd font-light w-full justify-start   text-black  border border-gray-300 bg-gray-100"
                      key={tag?.id}
                    >
                      # {tag?.name}
                    </Badge>
                  ))}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-md">Date Of Joining</h2>
        <div className="text-smd mt-1">
          {dayjs(getContacts?.created_at).format("DD MMMM YYYY")}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-md">Attendance Rating</h2>
        <Rating className=" mt-1 h-4 w-4" rating={4} />
      </div>
      <div className=" space-y-2 mt-4">
        <Button
          className="flex w-full bg-transparent hover:bg-transparent text-black border cursor-pointer"
          onClick={() =>
            navigate({
              to: `/${isUser ? "users" : "contacts"}/${contact_id}/edit`,
            })
          }
        >
          <Edit className=" h-4 w-4" /> Edit
        </Button>
        <Button
          className="flex w-full border bg-transparent hover:bg-transparent text-black cursor-pointer"
          onClick={() => {
            setDeleteContact({ id: Number(contact_id), isUser: isUser });
            setShowDeleteDialog(true);
          }}
        >
          <Archive className=" h-4 w-4" />
          Archive
        </Button>
      </div>
      <DeleteDialog
        isDeleteOpen={showDeleteDialog}
        setDeleteClose={onCancelDelete}
        onCancel={onCancelDelete}
        onConfirm={() =>
          deleteContact.id &&
          deleteEntity({
            isUser: deleteContact.isUser,
            ids: [deleteContact.id],
          })
        }
        isDeleteLoading={isLoadingDelete}
        type={isUser ? "Delete" : "Archive"}
      >
        <div className="space-y-4">
          <div>{`Are you sure you want to archive this ${isUser ? "user" : "contact"}? `}</div>
        </div>
      </DeleteDialog>
    </div>
  );
};

export default Profile;
