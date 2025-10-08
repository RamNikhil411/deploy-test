import { getUserDetails } from "@/store/userDetails";
import { useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CreateContactIcon } from "../ui/icons/createContactIcon";
import { useQueryClient } from "@tanstack/react-query";

const UserDropdown = () => {
  const { user } = getUserDetails();

  const queryClient = useQueryClient();

  const isAdmin = user?.is_super_admin;
  const navigate = useNavigate();

  const handleLogout = () => {
    const clearCookies = ["token", "refreshToken", "userData"];
    clearCookies.forEach((cookie) => Cookies.remove(cookie, { path: "/" }));
    localStorage.removeItem("userDetails");
    queryClient.clear();
    navigate({ to: "/signin", replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white hover:bg-white rounded-full text-black flex has-[>svg]:px-1  max-w-44  justify-between px-1 h-fit py-1">
          <div className="flex items-center gap-2">
            <Avatar className="size-7 shrink-0">
              <AvatarImage src="" alt={user?.full_name} />
              <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-1 flex-1">
              <p
                title={user?.full_name}
                className="text-sm text-left font-normal w-[100px] truncate leading-none text-black"
              >
                {user?.full_name}
              </p>
              <p className="text-xs leading-none font-normal text-muted-foreground">
                {isAdmin ? "Admin" : "User"}
              </p>
            </div>
          </div>
          <ChevronDown className="!w-5 !h-5 mr-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end" forceMount>
        <div>
          {!isAdmin && (
            <>
              <DropdownMenuLabel className="font-normal cursor-pointer hover:bg-gray-100">
                <div className="flex  items-center gap-2">
                  <CreateContactIcon className="w-4 h-4" />
                  <p className="text-sm font-medium leading-none">Profile</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuLabel
            className="font-normal cursor-pointer hover:bg-gray-100"
            onClick={handleLogout}
          >
            <div className="flex gap-2 items-center">
              <LogOut className="w-4 h-4" />
              <p className="text-sm  font-medium leading-none">Logout</p>
            </div>
          </DropdownMenuLabel>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
