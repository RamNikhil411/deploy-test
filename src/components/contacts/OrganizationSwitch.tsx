import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ContactContext } from "@/context/contactContext";
import { useContext, useEffect } from "react";
import { userOrganization } from "../core/ContactQueries";
import { Badge } from "../ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function OrganizationSwitch({}) {
  const [open, setOpen] = React.useState(false);
  const allUserOrganization = userOrganization();
  const navigate = useNavigate();
  const { activeOrganization, setActiveOrganization } =
    useContext(ContactContext);
  useEffect(() => {
    if (!activeOrganization) {
      setActiveOrganization(allUserOrganization?.[0]?.id);
    }
  }, [allUserOrganization]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-40 justify-between text-smd hover:bg-white font-normal"
        >
          <div className="flex-1 truncate">
            {activeOrganization
              ? allUserOrganization?.find(
                  (org) => org.id === activeOrganization
                )?.name
              : "Select Organisation"}
          </div>
          <ChevronsUpDown className="opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[280px] p-0 bg-white hover:bg-gray-200"
      >
        <Command>
          <CommandInput placeholder="Search Organization..." className="h-9 " />
          <CommandList>
            <CommandEmpty>No Organisation found.</CommandEmpty>
            <CommandGroup>
              {allUserOrganization?.map((organization) => (
                <CommandItem
                  key={organization.id}
                  value={organization.name}
                  onSelect={() => {
                    setActiveOrganization(organization.id);
                    setOpen(false);
                    navigate({
                      to: `/contacts`,
                      search: {
                        page: 1,
                        limit: 25,
                        organization_id: organization.id,
                      },
                      replace: true,
                    });
                  }}
                  className={cn(
                    "data-[selected=true]:!text-foreground cursor-pointer"
                  )}
                >
                  {organization.name}
                  <Badge
                    className={`ml-auto rounded-full text-[10px] ${
                      activeOrganization === organization.id
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {activeOrganization === organization.id
                      ? "Active"
                      : "Switch"}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
