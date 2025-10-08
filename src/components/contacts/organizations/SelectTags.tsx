import { cn } from "@/lib/utils";
import { Check, X, ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Command,
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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APIResponse } from "@/lib/types";
import { addSingleTagAPI } from "@/components/https/services/organization";
import { useMutation } from "@tanstack/react-query";

interface TagOption {
  id: number;
  name: string;
}

interface SelectFilterProps {
  options: TagOption[];
  placeholder?: string;
  value?: number[];
  onChange?: (selectedIds: number[]) => void;
  refetch?: () => void;
}

export function SelectTags({
  options,
  placeholder,
  value = [],
  onChange,
  refetch,
}: SelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<TagOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(value);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setSelectedIds(value || []);
  }, [value]);

  const { mutateAsync: addTag } = useMutation<
    APIResponse,
    Error,
    { tag: string }
  >({
    mutationKey: ["createTag"],
    mutationFn: async (payload) => {
      const response: any = await addSingleTagAPI(payload);
      return response?.data?.data || response?.data || response;
    },
    onSuccess: () => {
      refetch?.();
    },
  });

  const handleSelect = (id: number) => {
    const isSelected = selectedIds.includes(id);
    const newLocal = isSelected
      ? selectedIds.filter((v) => v !== id)
      : [...selectedIds, id];
    setSelectedIds(newLocal);
    const newValue = isSelected
      ? (value || []).filter((v) => v !== id)
      : [...(value || []), id];
    onChange?.(newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };
  const mergedOptions = [
    ...(options || []),
    ...tags?.filter((t) => !(options || []).some((a) => a?.id === t?.id)),
  ];

  const filteredOptions = mergedOptions?.filter((o) =>
    o?.name?.toLowerCase().includes(search?.toLowerCase().trim())
  );
  const selectedOptions = mergedOptions?.filter((o) => value?.includes(o.id));
  const visibleTags = selectedOptions?.slice(0, 3);
  const hiddenTags = selectedOptions?.slice(3);

  const handleAddNewTag = async () => {
    const term = search.trim();
    if (!term) return;
    setIsCreating(true);
    try {
      let createdTag: any = null;
      createdTag = await addTag({ tag: term });
      if (createdTag && createdTag.id) {
        setTags((prev) => [...prev, createdTag]);
        const newValue = value.includes(createdTag.id)
          ? value.filter((v) => v !== createdTag.id)
          : [...value, createdTag.id];
        onChange?.(newValue);
      }
    } catch (err) {
      console.error("Failed to create tag", err);
    } finally {
      setIsCreating(false);
      setSearch("");
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="flex items-center gap-1 w-full border rounded-sm p-3 cursor-pointer h-9"
          onClick={() => setOpen(true)}
        >
          {value?.length === 0 && visibleTags?.length === 0 && (
            <span className="text-gray-500 text-sm">
              {placeholder || "Select tags"}
            </span>
          )}

          {visibleTags?.map((tag) => (
            <Badge
              key={tag.id}
              className="bg-gray-100 text-gray-700 text-xs flex items-center gap-1 px-2 py-1 rounded capitalize"
            >
              #{tag.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(tag.id);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          {hiddenTags?.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-gray-100 text-gray-600 text-xs border rounded font-normal cursor-pointer">
                    +{hiddenTags?.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-white border shadow-lg p-2 rounded max-w-xs">
                  <div className="flex flex-col gap-1">
                    {hiddenTags?.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex justify-between items-center gap-2 p-1 px-2 rounded hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700 text-sm capitalize">
                          #{tag.name}
                        </span>
                        <button
                          type="button"
                          className="cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={() => handleSelect(tag.id)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {value?.length > 0 ? (
            <button
              type="button"
              className="ml-auto opacity-50 w-4 h-4 cursor-pointer"
              onClick={handleClear}
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <ChevronDownIcon className="ml-auto opacity-50 w-4 h-4" />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0 max-h-[40vh] ">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder || "Search..."}
            className="h-9 capitalize"
            value={search.trim()}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-[calc(40vh-40px)] overflow-y-auto">
            <CommandGroup>
              {filteredOptions?.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => handleSelect(option.id)}
                  className="cursor-pointer capitalize"
                >
                  {option.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value.includes(option.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {!filteredOptions?.length &&
              search.trim() &&
              !mergedOptions?.some(
                (o) => o.name?.toLowerCase() === search.trim().toLowerCase()
              ) && (
                <CommandGroup>
                  <CommandItem
                    onSelect={!isCreating ? handleAddNewTag : undefined}
                    className="cursor-pointer"
                  >
                    {isCreating ? (
                      <>
                        <span>Adding</span>{" "}
                        <span className="font-semibold capitalize">
                          "{search.trim()}"
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Add</span>{" "}
                        <span className="font-semibold capitalize">
                          "{search.trim()}"
                        </span>
                      </>
                    )}
                  </CommandItem>
                </CommandGroup>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
