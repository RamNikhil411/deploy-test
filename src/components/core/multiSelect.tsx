import { ChevronDownIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import FilterIcon from "../ui/icons/contacts/filterIcon";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface MultiSelectProps {
  options: {
    id: number;
    name?: string;
    description?: string;
    region_id?: number;
  }[];
  placeholder?: string;

  onChange?: (organizationId: number[] | null) => void;
  value?: number[] | null;
}

export function MultiSelect({
  options,
  placeholder,
  onChange,
  value,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<number[]>(value || []);

  const selectedOrg = useMemo(
    () => options?.filter((org) => tempValue?.includes(org.id)) || [],
    [options, tempValue]
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();

    onChange?.(null);
    setTempValue([]);
  };

  const handleApply = () => {
    onChange?.(tempValue);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempValue([]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] h-8  py-1.5 justify-between text-smd font-normal bg-gray-100"
        >
          <div className="flex text-smd truncate gap-1 items-center">
            <FilterIcon className="!h-3" />
            <div className="flex-1 ">
              {selectedOrg?.length ? (
                <div className="flex gap-1 items-center">
                  <div
                    title={selectedOrg[0].name}
                    className="w-[90px] truncate"
                  >
                    {" "}
                    {selectedOrg[0].name}
                  </div>

                  {selectedOrg.length > 1 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-muted-foreground cursor-pointer">
                            +{selectedOrg.length - 1}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white tooltipBtn text-black shadow-md">
                          {selectedOrg.slice(1).map((item) => (
                            <div
                              key={item.id}
                              className="text-smd  font-medium  p-1 capitalize rounded"
                            >
                              {item.name}
                            </div>
                          ))}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ) : (
                placeholder || "Select Option"
              )}
            </div>
          </div>
          {selectedOrg.length > 0 ? (
            <button onClick={handleClear} className="cursor-pointer ">
              <X className="w-4 h-4  transition-transform duration-200 ease-in-out group-hover:rotate-90" />
            </button>
          ) : (
            <ChevronDownIcon className="opacity-50 shrink-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0  bg-white">
        <Command>
          <CommandInput
            placeholder={placeholder || "Search..."}
            className="h-9 "
          />
          <CommandList className="max-h-[35vh] overflow-y-auto">
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem key={option.id} value={option.name} className="">
                  <Checkbox
                    className=""
                    id={option.id.toString()}
                    value={option.id}
                    checked={tempValue?.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTempValue([...tempValue, option.id]);
                      } else {
                        setTempValue(
                          tempValue.filter((id) => id !== option.id)
                        );
                      }
                    }}
                  />

                  <Label htmlFor={option.id.toString()}>{option.name}</Label>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="border-t flex justify-end gap-2 px-2 py-2 ">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply} className="text-xs">
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
