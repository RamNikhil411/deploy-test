import { useUserPermission } from "@/lib/usePermission";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import BellIcon from "../ui/icons/BellIcon";
import { CreateContactIcon } from "../ui/icons/createContactIcon";
import OrganizationIcon from "../ui/icons/organizationIcon";
import RegionIcon from "../ui/icons/regionIcon";
import { OrganizationSwitch } from "./OrganizationSwitch";
import UserDropdown from "./UserDropdown";

const ContactNavbar = () => {
  const pathName = useLocation().pathname;

  const { isSuperAdmin, isUser } = useUserPermission();

  const NavItems = [
    { name: "Regions", path: "/regions", icon: RegionIcon },
    {
      name: "Organisations",
      path: "/organisations",
      icon: OrganizationIcon,
    },
    { name: "Users", path: "/users", icon: CreateContactIcon },
  ];

  const isActive = (tab: string) => {
    if (pathName.includes(tab)) {
      return true;
    }
    return false;
  };

  return (
    <div className="h-screen">
      <div className="bg-gray-100 px-8 py-3 flex relative justify-between items-center">
        <div className="flex gap-10 items-center ">
          <div>
            <div className="font-medium text-lime-600 text-xl">Digital</div>
            <div className=" text-lime-600 text-md font-light ">Landcare</div>
          </div>
          {isUser() && <OrganizationSwitch />}
        </div>
        {isSuperAdmin() && (
          <div className="flex gap-6 absolute left-1/2 transform -translate-x-1/2 items-center ">
            {NavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-black flex gap-2 hover:text-gray-800 items-center py-2 px-4 font-medium rounded-md text-sm ${
                  isActive(item.path)
                    ? "bg-lime-600 text-white hover:text-white"
                    : ""
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                {item.name}
              </Link>
            ))}
          </div>
        )}
        <div className="flex gap-3 items-center">
          {/* <Button
            className="bg-lime-600 hover:bg-green-700 "
            onClick={() => navigate({ to: "/forms" })}
          >
            Create Form
          </Button> */}
          <BellIcon className="w-5 h-5" />
          <div>
            <UserDropdown />
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-83px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default ContactNavbar;
