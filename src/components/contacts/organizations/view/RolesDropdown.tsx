import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RolesDropdownProps } from "@/lib/interfaces/contacts";
import { ChevronDown, X } from "lucide-react";
import React from "react";

const RolesDropdown: React.FC<RolesDropdownProps> = ({
  roles,
  selectedRoles,
  onchange,
  open,
  setOpen,
}) => {
  const selectedCount = selectedRoles?.length || 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div className="flex gap-2 items-center">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-transparent w-36 justify-between tracking-wide hover:bg-transparent gap-2 text-xs h-7 px-2 font-normal text-black"
          >
            {selectedCount > 0
              ? `(${selectedCount})  role${selectedCount > 1 ? "s" : ""} selected`
              : "Select Roles"}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <div className="flex gap-2 ">
          {selectedRoles?.slice(0, 3).map((id) => (
            <div
              key={id}
              className="text-xs flex gap-2 items-center bg-slate-100 px-2 py-1 font-light"
            >
              <div>{roles?.find((role) => role.id === id)?.name}</div>
              <button
                onClick={() => onchange(selectedRoles.filter((i) => i !== id))}
                className="cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {selectedCount > 3 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs flex gap-2  items-center bg-slate-100 px-2 py-1 font-medium">
                  +{selectedCount - 3}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white tooltipBtn text-black p-2 shadow-md border">
                {selectedRoles?.slice(3).map((id) => (
                  <div
                    key={id}
                    className="text-xs flex gap-2 items-center bg-slate-100 px-2 py-1 font-light"
                  >
                    <div>{roles?.find((role) => role.id === id)?.name}</div>
                    <button
                      onClick={() =>
                        onchange(selectedRoles.filter((i) => i !== id))
                      }
                      className="cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <DropdownMenuContent
        className="p-2 space-y-2"
        onPointerDownOutside={() => setOpen(open)}
      >
        {roles?.map((role) => (
          <div key={role.id} className="flex gap-2 items-center cursor-pointer">
            <Checkbox
              id={role.id.toString()}
              checked={selectedRoles?.includes(role.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onchange([...selectedRoles, role.id]);
                } else {
                  onchange(selectedRoles.filter((id) => id !== role.id));
                }
              }}
            />
            <Label htmlFor={role.id.toString()} className="text-smd">
              {" "}
              {role.name}
            </Label>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RolesDropdown;
