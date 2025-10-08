import { useRoles } from "@/components/core/ContactQueries";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AddContactIcon from "@/components/ui/icons/contacts/addContactIcon";
import InviteIcon from "@/components/ui/icons/contacts/inviteIcon";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddUser, InviteUserDialogProps } from "@/lib/interfaces/contacts";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAvatarLetters } from "@/utils/helpers/getAvatarLetters";

import { Loader2, X } from "lucide-react";
import { useState } from "react";
import RolesDropdown from "./RolesDropdown";
import NoUsersIcon from "@/components/ui/icons/noUsersIcon";

const InviteUsersDialog = ({
  open,
  setOpen,
  availableUsers,
  handleSendInvite,
  isLoading,
  isPending,
}: InviteUserDialogProps) => {
  const [invitedUsers, setInvitedUsers] = useState<AddUser[]>([]);
  const [send, setSend] = useState(false);

  const [search, setSearch] = useState("");
  const [openDropdownFor, setOpenDropdownFor] = useState<number | null>(null);

  const filteredAvailableUsers = availableUsers
    ?.filter(
      (user) =>
        user.full_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = invitedUsers.some((u) => u.user_id === a.id);
      const bSelected = invitedUsers.some((u) => u.user_id === b.id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  const selectedUsers = availableUsers?.filter((user) =>
    invitedUsers.some((invitedUser) => invitedUser.user_id === user.id)
  );

  const allRoles = useRoles();

  const noRolesSelected = invitedUsers.some((user) => user.roles.length === 0);

  const handleRemove = (user_id: number) => {
    setInvitedUsers(invitedUsers.filter((user) => user.user_id !== user_id));
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setInvitedUsers([]);
        setSend(false);
        setSearch("");
      }}
    >
      <AlertDialogTrigger asChild>
        <Button className="h-8  text-sm">
          {" "}
          <InviteIcon className="mr-2 w-4 h-4" /> Invite Users
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="p-4 lg:max-w-2xl"
        aria-describedby={undefined}
      >
        <AlertDialogHeader className="flex flex-row  items-center justify-between">
          <AlertDialogTitle className="font-medium text-md flex items-center">
            {" "}
            <AddContactIcon className="w-5 h-5 mr-2 fill-black" /> Invite to
            Organization
          </AlertDialogTitle>
          <AlertDialogCancel className="border-0">
            <X className="w-4 h-4" />
          </AlertDialogCancel>
        </AlertDialogHeader>
        <div>
          {send ? null : (
            <div>
              <Label htmlFor="search" className="">
                Search
              </Label>
              <div className="flex gap-2  items-center mt-1">
                <div className="flex flex-1  items-center gap-1 border rounded px-2 py-1 bg-gray-100">
                  {invitedUsers.slice(0, 2).map((user) => {
                    const selectedUser = availableUsers.find(
                      (u) => u.id === user.user_id
                    );
                    if (!selectedUser) return null;
                    return (
                      <div
                        key={user.user_id}
                        className="flex items-center gap-1 px-1 py-0.5 bg-gray-300 rounded text-xs"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={selectedUser.avatar as string}
                            alt="profile"
                          />
                          <AvatarFallback className=" text-xs font-medium">
                            {getAvatarLetters(selectedUser.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="w-10 truncate">
                          {selectedUser.full_name.split(" ")[0]}
                        </span>
                        <button
                          type="button"
                          className="ml-1 text-gray-600 cursor-pointer hover:text-gray-800"
                          onClick={() => handleRemove(user.user_id)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}

                  {invitedUsers.length > 2 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs  px-1 font-medium   text-gray-600 cursor-pointer">
                          +{invitedUsers.length - 2}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs tooltipBtn bg-white text-black shadow-md">
                        <div className="space-y-1">
                          {invitedUsers.slice(2).map((user) => {
                            const selectedUser = availableUsers.find(
                              (u) => u.id === user.user_id
                            );
                            if (!selectedUser) return null;
                            return (
                              <div
                                key={user.user_id}
                                className="flex items-center justify-between gap-1"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage
                                      src={selectedUser.avatar as string}
                                      alt="profile"
                                    />
                                    <AvatarFallback className="text-gray-400 text-xs font-medium">
                                      {getAvatarLetters(selectedUser.full_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">
                                    {selectedUser.full_name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="ml-1 text-gray-600 cursor-pointer hover:text-gray-800"
                                  onClick={() => handleRemove(user.user_id)}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <input
                    type="text"
                    placeholder="Search by name or email"
                    className="flex-1 border-none outline-none bg-transparent text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  className="px-3 rounded h-8"
                  onClick={() => setSend(true)}
                  disabled={selectedUsers?.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          <div className="text-sm mt-2">Users</div>
          <ScrollArea className="h-[45vh] px-2">
            {send ? (
              <div className="space-y-3 w-full mt-2">
                {selectedUsers?.map((user) => (
                  <div className="border px-4 py-2 space-y-2">
                    <div
                      key={user.id}
                      className="flex items-center gap-2  rounded-md  justify-between w-full"
                    >
                      <div className="">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={user.avatar as string}
                              alt="profile"
                            />
                            <AvatarFallback className="text-gray-400 text-lg font-medium">
                              {getAvatarLetters(user?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm Capitalize tracking-wide">
                              {user.full_name}
                            </span>
                            <p className="text-xs font-light  tracking-wide">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleRemove(user.id)}
                          variant="ghost"
                          className="text-red-500 px-1 h-8 font-normal text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <RolesDropdown
                      roles={allRoles}
                      selectedRoles={
                        invitedUsers.find(
                          (invitedUser) => invitedUser.user_id === user.id
                        )?.roles ?? []
                      }
                      onchange={(roles) => {
                        setInvitedUsers(
                          invitedUsers.map((invitedUser) => {
                            if (invitedUser.user_id === user.id) {
                              return {
                                ...invitedUser,
                                roles,
                              };
                            }
                            return invitedUser;
                          })
                        );
                      }}
                      open={openDropdownFor === user.id}
                      setOpen={(open) => {
                        if (open) {
                          setOpenDropdownFor(user.id);
                        } else {
                          setOpenDropdownFor(null);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-[40vh]">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {!filteredAvailableUsers ||
                filteredAvailableUsers.length === 0 ? (
                  <div className="text-center h-[calc(100vh-433px)] flex items-center justify-center">
                    <NoUsersIcon className="w-90 h-90" />
                  </div>
                ) : (
                  filteredAvailableUsers?.map((user) => (
                    <div key={user.id} className="flex items-center gap-4">
                      <Checkbox
                        className="bg-slate-100 w-4 h-4"
                        id={user.id.toString()}
                        checked={invitedUsers.some(
                          (selectedUser) => selectedUser.user_id === user.id
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setInvitedUsers([
                              ...invitedUsers,
                              {
                                user_id: user.id,
                                roles: [],
                              },
                            ]);
                          } else {
                            setInvitedUsers(
                              invitedUsers.filter(
                                (selectedUser) =>
                                  selectedUser.user_id !== user.id
                              )
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={user.id.toString()}
                        className="flex items-center gap-4 w-xl "
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={user.avatar as string}
                            alt="profile"
                          />
                          <AvatarFallback className="text-gray-400 text-base font-medium">
                            {getAvatarLetters(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="w-3xs">
                          <div
                            title={user.full_name}
                            className="text-sm w-full truncate Capitalize tracking-wide"
                          >
                            {user.full_name}
                          </div>
                          <div
                            title={user.email}
                            className="text-xs font-light  truncate tracking-wide"
                          >
                            {user.email}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </div>
        {send && (
          <AlertDialogFooter className="flex justify-end border-t pt-2">
            <Button onClick={() => setSend(false)} variant={"outline"}>
              Back
            </Button>
            <Button
              onClick={() => handleSendInvite(invitedUsers)}
              variant={"default"}
              disabled={noRolesSelected || isPending}
            >
              {isPending ? "Sending..." : "Send Invite"}
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InviteUsersDialog;
