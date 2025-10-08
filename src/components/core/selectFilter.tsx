import { cn } from "@/lib/utils";
import { Check, ChevronDownIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import FilterIcon from "../ui/icons/contacts/filterIcon";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface SelectFilterProps {
  options: {
    id: number;
    name?: string;
    description?: string;
    region_id?: number;
  }[];
  placeholder?: string;

  onChange?: (organizationId: number | null) => void;
  value?: number | null;
}

export function SelectFilter({
  options,
  placeholder,
  onChange,
  value,
}: SelectFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedOrg = options?.find((org) => org.id === value);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();

    onChange?.(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] h-8  py-1.5 justify-between text-smd font-normal bg-gray-100"
        >
          <div className="flex text-smd truncate gap-1 items-center">
            <FilterIcon className="!h-3" />
            <div className="flex-1 truncate">
              {selectedOrg ? selectedOrg.name : placeholder || "Select Option"}
            </div>
          </div>
          {selectedOrg ? (
            <button onClick={handleClear} className="cursor-pointer ">
              <X className="w-4 h-4  transition-transform duration-200 ease-in-out group-hover:rotate-90" />
            </button>
          ) : (
            <ChevronDownIcon className="opacity-50 shrink-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0 max-h-[40vh]">
        <Command>
          <CommandInput
            placeholder={placeholder || "Search..."}
            className="h-9 "
          />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    const newValue = option.id === value ? null : option.id;
                    onChange?.(newValue);
                    setOpen(false);
                  }}
                >
                  {option.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
