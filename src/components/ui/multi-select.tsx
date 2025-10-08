import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  WandSparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

// Interfaces remain unchanged
export interface AnimationConfig {
  badgeAnimation?: "bounce" | "pulse" | "wiggle" | "fade" | "slide" | "none";
  popoverAnimation?: "scale" | "slide" | "fade" | "flip" | "none";
  optionHoverAnimation?: "highlight" | "scale" | "glow" | "none";
  duration?: number;
  delay?: number;
}

interface MultiSelectOption {
  id: string;
  label: string;
  name: string;
  value: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  style?: {
    badgeColor?: string;
    iconColor?: string;
    gradient?: string;
  };
}

interface MultiSelectGroup {
  heading: string;
  options: MultiSelectOption[];
}

interface MultiSelectProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "animationConfig"
    >,
    VariantProps<typeof multiSelectVariants> {
  options: MultiSelectOption[] | MultiSelectGroup[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  animation?: number;
  animationConfig?: AnimationConfig;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  hideSelectAll?: boolean;
  searchable?: boolean;
  emptyIndicator?: React.ReactNode;
  autoSize?: boolean;
  singleLine?: boolean;
  popoverClassName?: string;
  disabled?: boolean;
  responsive?:
    | boolean
    | {
        small?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
        medium?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
        large?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
        breakpoints?: {
          small: number;
          medium: number;
        };
      };
  minWidth?: string;
  maxWidth?: string; // Optional maxWidth, defaults to parent or 100%
  deduplicateOptions?: boolean;
  resetOnDefaultValueChange?: boolean;
  closeOnSelect?: boolean;
  onSave?: (ids: string[]) => void;
}

export interface MultiSelectRef {
  reset: () => void;
  getSelectedValues: () => string[];
  setSelectedValues: (values: string[]) => void;
  clear: () => void;
  focus: () => void;
}

const multiSelectVariants = cva("m-1 transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
    badgeAnimation: {
      bounce: "hover:-translate-y-1 hover:scale-110",
      pulse: "hover:animate-pulse",
      wiggle: "hover:animate-wiggle",
      fade: "hover:opacity-80",
      slide: "hover:translate-x-1",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    badgeAnimation: "bounce",
  },
});

export const MultiSelect = React.forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      animationConfig,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      hideSelectAll = false,
      searchable = true,
      emptyIndicator,
      autoSize = false,
      singleLine = false,
      popoverClassName,
      disabled = false,
      responsive,
      minWidth,
      maxWidth, // No default, will use parent width or 100% if not specified
      deduplicateOptions = false,
      resetOnDefaultValueChange = true,
      closeOnSelect = false,
      onSave,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [containerWidth, setContainerWidth] = React.useState<number>(0);

    const [politeMessage, setPoliteMessage] = React.useState("");
    const [assertiveMessage, setAssertiveMessage] = React.useState("");
    const prevSelectedCount = React.useRef(selectedValues.length);
    const prevIsOpen = React.useRef(isPopoverOpen);
    const prevSearchValue = React.useRef(searchValue);
    const prevDefaultValueRef = React.useRef<string[]>(defaultValue);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const multiSelectId = React.useId();
    const listboxId = `${multiSelectId}-listbox`;
    const triggerDescriptionId = `${multiSelectId}-description`;
    const selectedCountId = `${multiSelectId}-count`;

    const announce = React.useCallback(
      (message: string, priority: "polite" | "assertive" = "polite") => {
        if (priority === "assertive") {
          setAssertiveMessage(message);
          setTimeout(() => setAssertiveMessage(""), 100);
        } else {
          setPoliteMessage(message);
          setTimeout(() => setPoliteMessage(""), 100);
        }
      },
      []
    );

    // Measure container width dynamically
    React.useEffect(() => {
      if (typeof window === "undefined" || !containerRef.current) return;
      const observer = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        setContainerWidth(width);
      });
      observer.observe(containerRef.current);
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }, []);

    const getSizeCategory = React.useCallback(() => {
      const defaultBreakpoints = {
        small: 200,
        medium: 400,
      };
      const breakpoints =
        responsive && typeof responsive === "object" && responsive.breakpoints
          ? responsive.breakpoints
          : defaultBreakpoints;

      if (containerWidth < breakpoints.small) return "small";
      if (containerWidth < breakpoints.medium) return "medium";
      return "large";
    }, [containerWidth, responsive]);

    const sizeCategory = getSizeCategory();

    const getResponsiveSettings = React.useCallback(() => {
      if (!responsive) {
        return {
          maxCount: maxCount,
          hideIcons: false,
          compactMode: false,
        };
      }
      if (responsive === true) {
        const defaultResponsive = {
          small: { maxCount: Infinity, hideIcons: true, compactMode: true },
          medium: { maxCount: Infinity, hideIcons: false, compactMode: false },
          large: { maxCount: Infinity, hideIcons: false, compactMode: false },
        };
        const currentSettings = defaultResponsive[sizeCategory];
        return {
          maxCount: currentSettings?.maxCount ?? maxCount,
          hideIcons: currentSettings?.hideIcons ?? false,
          compactMode: currentSettings?.compactMode ?? false,
        };
      }
      const currentSettings = responsive[sizeCategory];
      return {
        maxCount: currentSettings?.maxCount ?? maxCount,
        hideIcons: currentSettings?.hideIcons ?? false,
        compactMode: currentSettings?.compactMode ?? false,
      };
    }, [responsive, sizeCategory, maxCount]);

    const responsiveSettings = getResponsiveSettings();

    // Calculate dynamic maxCount based on available width
    const calculateDynamicMaxCount = React.useCallback(() => {
      if (!containerRef.current) {
        return Math.min(responsiveSettings.maxCount, maxCount);
      }
      const availableWidth =
        containerWidth || (maxWidth ? parseInt(maxWidth) : 1000); // Default to large width if no maxWidth
      const badgeWidth = 80; // Approx width per badge including padding
      const padding = 40; // Padding for clear button, chevron, etc.
      const maxVisible = Math.floor((availableWidth - padding) / badgeWidth);
      return Math.max(
        1,
        Math.min(maxVisible, responsiveSettings.maxCount, selectedValues.length)
      );
    }, [
      containerWidth,
      responsiveSettings.maxCount,
      maxCount,
      maxWidth,
      selectedValues.length,
    ]);

    const effectiveMaxCount = React.useMemo(
      () => calculateDynamicMaxCount(),
      [calculateDynamicMaxCount]
    );

    const isGroupedOptions = React.useCallback(
      (
        opts: MultiSelectOption[] | MultiSelectGroup[]
      ): opts is MultiSelectGroup[] => {
        return opts?.length > 0 && "heading" in opts[0];
      },
      []
    );

    const getAllOptions = React.useCallback((): MultiSelectOption[] => {
      if (options?.length === 0) return [];
      let allOptions: MultiSelectOption[];
      if (isGroupedOptions(options)) {
        allOptions = options.flatMap((group) => group.options);
      } else {
        allOptions = options;
      }
      const valueSet = new Set<string>();
      const duplicates: string[] = [];
      const uniqueOptions: MultiSelectOption[] = [];
      allOptions?.forEach((option) => {
        if (valueSet.has(option.id)) {
          duplicates.push(option.id);
          if (!deduplicateOptions) {
            uniqueOptions.push(option);
          }
        } else {
          valueSet.add(option.id);
          uniqueOptions.push(option);
        }
      });
      if (duplicates.length > 0) {
        console.warn(
          `MultiSelect: Duplicate option values detected: ${duplicates.join(", ")}. ` +
            `${
              deduplicateOptions
                ? "Duplicates have been removed automatically."
                : "This may cause unexpected behavior. Consider setting 'deduplicateOptions={true}' or ensure all option values are unique."
            }`
        );
      }
      return deduplicateOptions ? uniqueOptions : allOptions;
    }, [options, deduplicateOptions, isGroupedOptions]);

    const getOptionByValue = React.useCallback(
      (value: string): MultiSelectOption | undefined => {
        const option = getAllOptions().find((option) => option.id === value);
        if (!option) {
          console.warn(
            `MultiSelect: Option with value "${value}" not found in options list`
          );
        }
        return option;
      },
      [getAllOptions]
    );

    const getBadgeAnimationClass = () => {
      if (animationConfig?.badgeAnimation) {
        switch (animationConfig.badgeAnimation) {
          case "bounce":
            return isAnimating
              ? "animate-bounce"
              : "hover:-translate-y-1 hover:scale-110";
          case "pulse":
            return "hover:animate-pulse";
          case "wiggle":
            return "hover:animate-wiggle";
          case "fade":
            return "hover:opacity-80";
          case "slide":
            return "hover:translate-x-1";
          case "none":
            return "";
          default:
            return "";
        }
      }
      return isAnimating ? "animate-bounce" : "";
    };

    const getPopoverAnimationClass = () => {
      if (animationConfig?.popoverAnimation) {
        switch (animationConfig.popoverAnimation) {
          case "scale":
            return "animate-scaleIn";
          case "slide":
            return "animate-slideInDown";
          case "fade":
            return "animate-fadeIn";
          case "flip":
            return "animate-flipIn";
          case "none":
            return "";
          default:
            return "";
        }
      }
      return "";
    };

    const renderBadges = React.useMemo(() => {
      return selectedValues
        .slice(0, effectiveMaxCount)
        .map((value) => {
          const option = getOptionByValue(value);
          const IconComponent = option?.icon;
          const customStyle = option?.style;
          if (!option) return null;
          const badgeStyle: React.CSSProperties = {
            animationDuration: `${animation}s`,
            ...(customStyle?.badgeColor && {
              backgroundColor: customStyle.badgeColor,
            }),
            ...(customStyle?.gradient && {
              background: customStyle.gradient,
              color: "white",
            }),
          };
          return (
            <Badge
              title={option.title || option.label || option.name} // Title for accessibility
              key={value}
              className={cn(
                getBadgeAnimationClass(),
                multiSelectVariants({ variant }),
                customStyle?.gradient && "text-white border-transparent",
                responsiveSettings.compactMode && "text-xs px-1 py-0.5",
                "flex-1 min-w-0 truncate", // Equal distribution with truncation
                "[&>svg]:pointer-events-auto"
              )}
              style={{
                ...badgeStyle,
                animationDuration: `${animationConfig?.duration || animation}s`,
                animationDelay: `${animationConfig?.delay || 0}s`,
                maxWidth: "100%", // Ensure badges respect container
              }}
            >
              {IconComponent && !responsiveSettings.hideIcons && (
                <IconComponent
                  className={cn(
                    "h-3 w-3 mr-1",
                    responsiveSettings.compactMode && "h-2.5 w-2.5 mr-0.5",
                    customStyle?.iconColor && "text-current"
                  )}
                  {...(customStyle?.iconColor && {
                    style: { color: customStyle.iconColor },
                  })}
                />
              )}
              <span className="truncate">
                {option.title || option.label || option.name}
              </span>
              <div
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleOption(value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleOption(value);
                  }
                }}
                aria-label={`Remove ${option.label} from selection`}
                className="ml-1 h-3 w-3 cursor-pointer hover:bg-white/20 rounded-sm -m-0.1 -mt-1 focus:outline-none focus:ring-1 focus:ring-white/50"
              >
                <XCircle
                  className={cn(
                    "h-2.5 w-2.5",
                    responsiveSettings.compactMode && "h-2 w-2"
                  )}
                />
              </div>
            </Badge>
          );
        })
        .filter(Boolean);
    }, [
      selectedValues,
      effectiveMaxCount,
      responsiveSettings,
      variant,
      animation,
      animationConfig,
      getOptionByValue,
    ]);

    const arraysEqual = React.useCallback(
      (a: string[], b: string[]): boolean => {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
      },
      []
    );

    const resetToDefault = React.useCallback(() => {
      setSelectedValues(defaultValue);
      setIsPopoverOpen(false);
      setSearchValue("");
      onValueChange(defaultValue);
    }, [defaultValue, onValueChange]);

    React.useImperativeHandle(
      ref,
      () => ({
        reset: resetToDefault,
        getSelectedValues: () => selectedValues,
        setSelectedValues: (values: string[]) => {
          setSelectedValues(values);
          onValueChange(values);
        },
        clear: () => {
          setSelectedValues([]);
          onValueChange([]);
        },
        focus: () => {
          if (buttonRef.current) {
            buttonRef.current.focus();
            const originalOutline = buttonRef.current.style.outline;
            const originalOutlineOffset = buttonRef.current.style.outlineOffset;
            buttonRef.current.style.outline = "2px solid hsl(var(--ring))";
            buttonRef.current.style.outlineOffset = "2px";
            setTimeout(() => {
              if (buttonRef.current) {
                buttonRef.current.style.outline = originalOutline;
                buttonRef.current.style.outlineOffset = originalOutlineOffset;
              }
            }, 1000);
          }
        },
      }),
      [resetToDefault, selectedValues, onValueChange]
    );

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchValue) return options;
      if (options?.length === 0) return [];
      if (isGroupedOptions(options)) {
        return options
          .map((group) => ({
            ...group,
            options: group.options.filter(
              (option) =>
                option.label
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                option.value.toLowerCase().includes(searchValue.toLowerCase())
            ),
          }))
          .filter((group) => group.options?.length > 0);
      }
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
          option.value.toLowerCase().includes(searchValue.toLowerCase())
      );
    }, [options, searchValue, searchable, isGroupedOptions]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (optionValue: string) => {
      if (disabled) return;
      const option = getOptionByValue(optionValue);
      if (option?.disabled) return;
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((value) => value !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      if (closeOnSelect) {
        setIsPopoverOpen(false);
      }
    };

    const handleClear = () => {
      if (disabled) return;
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      if (disabled) return;
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      if (disabled) return;
      const newSelectedValues = selectedValues.slice(0, effectiveMaxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (disabled) return;
      const allOptions = getAllOptions().filter((option) => !option.disabled);
      if (selectedValues?.length === allOptions?.length) {
        handleClear();
      } else {
        const allValues = allOptions.map((option) => option.id);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
      if (closeOnSelect) {
        setIsPopoverOpen(false);
      }
    };

    React.useEffect(() => {
      if (!resetOnDefaultValueChange) return;
      const prevDefaultValue = prevDefaultValueRef.current;
      if (!arraysEqual(prevDefaultValue, defaultValue)) {
        if (!arraysEqual(selectedValues, defaultValue)) {
          setSelectedValues(defaultValue);
        }
        prevDefaultValueRef.current = [...defaultValue];
      }
    }, [defaultValue, selectedValues, arraysEqual, resetOnDefaultValueChange]);

    React.useEffect(() => {
      if (!isPopoverOpen) {
        setSearchValue("");
      }
    }, [isPopoverOpen]);

    React.useEffect(() => {
      const selectedCount = selectedValues?.length;
      const allOptions = getAllOptions();
      const totalOptions = allOptions?.filter((opt) => !opt.disabled)?.length;
      if (selectedCount !== prevSelectedCount.current) {
        const diff = selectedCount - prevSelectedCount.current;
        if (diff > 0) {
          const addedItems = selectedValues.slice(-diff);
          const addedLabels = addedItems
            .map(
              (value) => allOptions.find((opt) => opt.value === value)?.label
            )
            .filter(Boolean);
          if (addedLabels?.length === 1) {
            announce(
              `${addedLabels[0]} selected. ${selectedCount} of ${totalOptions} options selected.`
            );
          } else {
            announce(
              `${addedLabels?.length} options selected. ${selectedCount} of ${totalOptions} total selected.`
            );
          }
        } else if (diff < 0) {
          announce(
            `Option removed. ${selectedCount} of ${totalOptions} options selected.`
          );
        }
        prevSelectedCount.current = selectedCount;
      }
      if (isPopoverOpen !== prevIsOpen.current) {
        if (isPopoverOpen) {
          announce(
            `Dropdown opened. ${totalOptions} options available. Use arrow keys to navigate.`
          );
        } else {
          announce("Dropdown closed.");
        }
        prevIsOpen.current = isPopoverOpen;
      }
      if (
        searchValue !== prevSearchValue.current &&
        searchValue !== undefined
      ) {
        if (searchValue && isPopoverOpen) {
          const filteredCount = allOptions.filter(
            (opt) =>
              opt.label.toLowerCase().includes(searchValue.toLowerCase()) ||
              opt.value.toLowerCase().includes(searchValue.toLowerCase())
          )?.length;
          announce(
            `${filteredCount} option${filteredCount === 1 ? "" : "s"} found for "${searchValue}"`
          );
        }
        prevSearchValue.current = searchValue;
      }
    }, [selectedValues, isPopoverOpen, searchValue, announce, getAllOptions]);

    const getWidthConstraints = () => {
      const defaultMinWidth = minWidth || "auto"; // Shrink to content
      const effectiveMaxWidth = maxWidth || "100%"; // Grow to parent or specified max
      return {
        minWidth: defaultMinWidth,
        maxWidth: effectiveMaxWidth,
        width: autoSize ? "auto" : "100%", // Allow natural growth
      };
    };

    const widthConstraints = getWidthConstraints();

    return (
      <div
        ref={containerRef}
        style={{
          width: widthConstraints.width,
          minWidth: widthConstraints.minWidth,
          maxWidth: widthConstraints.maxWidth,
          boxSizing: "border-box",
          overflow: "hidden", // Prevent overflow
        }}
      >
        <div className="sr-only">
          <div aria-live="polite" aria-atomic="true" role="status">
            {politeMessage}
          </div>
          <div aria-live="assertive" aria-atomic="true" role="alert">
            {assertiveMessage}
          </div>
        </div>

        <Popover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          modal={modalPopover}
        >
          <div id={triggerDescriptionId} className="sr-only">
            Multi-select dropdown. Use arrow keys to navigate, Enter to select,
            and Escape to close.
          </div>
          <div id={selectedCountId} className="sr-only" aria-live="polite">
            {selectedValues?.length === 0
              ? "No options selected"
              : `${selectedValues?.length} option${selectedValues?.length === 1 ? "" : "s"} selected: ${selectedValues
                  .map((value) => getOptionByValue(value)?.label)
                  .filter(Boolean)
                  .join(", ")}`}
          </div>

          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              {...props}
              onClick={handleTogglePopover}
              disabled={disabled}
              role="combobox"
              aria-expanded={isPopoverOpen}
              aria-haspopup="listbox"
              aria-controls={isPopoverOpen ? listboxId : undefined}
              aria-describedby={`${triggerDescriptionId} ${selectedCountId}`}
              aria-label={`Multi-select: ${selectedValues?.length} of ${getAllOptions()?.length} options selected. ${placeholder}`}
              className={cn(
                "flex p-1 rounded-md border min-h-9 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
                autoSize ? "w-auto" : "w-full",
                responsiveSettings.compactMode && "min-h-8 text-sm",
                disabled && "opacity-50 cursor-not-allowed",
                className,
                "overflow-hidden" // Clip overflow
              )}
              style={{
                ...widthConstraints,
                maxWidth: widthConstraints.maxWidth,
                boxSizing: "border-box",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {selectedValues.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      singleLine
                        ? "overflow-x-auto multiselect-singleline-scroll"
                        : "flex-wrap",
                      responsiveSettings.compactMode && "gap-0.5"
                    )}
                    style={singleLine ? { paddingBottom: "4px" } : {}}
                  >
                    {renderBadges}
                    {selectedValues.length > effectiveMaxCount && (
                      <Badge
                        className={cn(
                          "bg-transparent text-foreground border-foreground/10 hover:bg-transparent",
                          getBadgeAnimationClass(),
                          multiSelectVariants({ variant }),
                          responsiveSettings.compactMode &&
                            "text-xs px-1 py-0.5",
                          singleLine && "flex-shrink-0 whitespace-nowrap",
                          "[&>svg]:pointer-events-auto"
                        )}
                        style={{
                          animationDuration: `${animationConfig?.duration || animation}s`,
                          animationDelay: `${animationConfig?.delay || 0}s`,
                        }}
                        aria-label={`${selectedValues.length - effectiveMaxCount} additional items selected`}
                      >
                        {`+ ${selectedValues.length - effectiveMaxCount}`}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClear();
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          handleClear();
                        }
                      }}
                      aria-label={`Clear all ${selectedValues.length} selected options`}
                      className="flex items-center justify-center h-4 w-4 mx-1 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-sm"
                    >
                      <XIcon className="h-3 w-3" />
                    </div>
                    <Separator
                      orientation="vertical"
                      className="flex min-h-6 h-full mx-1"
                    />
                    <ChevronDown
                      className="h-4 mx-1 cursor-pointer text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full mx-auto">
                  <span className="text-sm text-muted-foreground mx-2 truncate">
                    {placeholder}
                  </span>
                  <ChevronDown className="h-4 mx-1 cursor-pointer text-muted-foreground" />
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-label="Available options"
            className={cn(
              "w-auto p-0",
              getPopoverAnimationClass(),
              popoverClassName
            )}
            style={{
              animationDuration: `${animationConfig?.duration || animation}s`,
              animationDelay: `${animationConfig?.delay || 0}s`,
              maxWidth: `min(${widthConstraints.maxWidth}, 85vw)`,
              maxHeight: "60vh",
              touchAction: "manipulation",
            }}
            align="start"
            onEscapeKeyDown={() => setIsPopoverOpen(false)}
          >
            <Command>
              {searchable && (
                <CommandInput
                  placeholder="Search options..."
                  onKeyDown={handleInputKeyDown}
                  value={searchValue}
                  onValueChange={setSearchValue}
                  aria-label="Search through available options"
                  aria-describedby={`${multiSelectId}-search-help`}
                />
              )}
              {searchable && (
                <div id={`${multiSelectId}-search-help`} className="sr-only">
                  Type to filter options. Use arrow keys to navigate results.
                </div>
              )}
              <CommandList className="max-h-[40vh] overflow-y-auto multiselect-scrollbar overscroll-behavior-y-contain">
                <CommandEmpty>
                  {emptyIndicator || "No results found."}
                </CommandEmpty>
                {!hideSelectAll && !searchValue && (
                  <CommandGroup>
                    <CommandItem
                      key="all"
                      onSelect={toggleAll}
                      role="option"
                      aria-selected={
                        selectedValues.length ===
                        getAllOptions()?.filter((opt) => !opt.disabled)?.length
                      }
                      aria-label={`Select all ${getAllOptions()?.length} options`}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedValues.length ===
                            getAllOptions()?.filter((opt) => !opt.disabled)
                              ?.length
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                        aria-hidden="true"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span>
                        (Select All{" "}
                        {getAllOptions()?.length > 20
                          ? ` - ${getAllOptions()?.length} options`
                          : ""}
                        )
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}
                {isGroupedOptions(filteredOptions) ? (
                  filteredOptions.map((group) => (
                    <CommandGroup key={group.heading} heading={group.heading}>
                      {group.options.map((option) => {
                        const isSelected = selectedValues.includes(option.id);
                        return (
                          <CommandItem
                            key={option.id}
                            role="option"
                            aria-selected={isSelected}
                            aria-disabled={option.disabled}
                            aria-label={`${option.label}${isSelected ? ", selected" : ", not selected"}${option.disabled ? ", disabled" : ""}`}
                            className={cn(
                              "cursor-pointer",
                              option.disabled && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={option.disabled}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                              aria-hidden="true"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </div>
                            {option.icon && (
                              <option.icon
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                            )}
                            <span>
                              {option.title || option.label || option.name}
                            </span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ))
                ) : (
                  <CommandGroup>
                    {filteredOptions?.map((option) => {
                      const isSelected = selectedValues.includes(option.id);
                      return (
                        <CommandItem
                          key={option.id}
                          onSelect={() => toggleOption(option.id)}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={option.disabled}
                          aria-label={`${option.label}${isSelected ? ", selected" : ", not selected"}${option.disabled ? ", disabled" : ""}`}
                          className={cn(
                            "cursor-pointer",
                            option.disabled && "opacity-50 cursor-not-allowed"
                          )}
                          disabled={option.disabled}
                          onKeyDown={(e) => e.preventDefault()}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                            aria-hidden="true"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </div>
                          {option.icon && (
                            <option.icon
                              className="mr-2 h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                          <span>
                            {option.title || option.label || option.name}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
                <CommandSeparator />
                <CommandGroup
                  className="sticky bottom-0 bg-background border-t border-border"
                  style={{ zIndex: 10 }}
                >
                  <div className="flex items-center justify-between p-2">
                    <CommandItem
                      onSelect={() => {
                        onValueChange(selectedValues);
                        onSave?.(selectedValues);
                        setIsPopoverOpen(false);
                        announce("Selections saved.", "assertive");
                      }}
                      className="flex-1 justify-center cursor-pointer hover:bg-primary hover:text-primary-foreground rounded-md mx-1"
                      role="button"
                      aria-label="Save selected options and close"
                    >
                      Save
                    </CommandItem>
                    {selectedValues.length > 0 && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="flex min-h-6 h-full"
                        />
                        <CommandItem
                          onSelect={() => {
                            handleClear();
                            announce("All selections cleared.", "assertive");
                          }}
                          className="flex-1 justify-center cursor-pointer hover:bg-destructive hover:text-destructive-foreground rounded-md mx-1"
                          role="button"
                          aria-label="Clear all selected options"
                        >
                          Clear
                        </CommandItem>
                      </>
                    )}
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
          {animation > 0 && selectedValues.length > 0 && (
            <WandSparkles
              className={cn(
                "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
                isAnimating ? "" : "text-muted-foreground"
              )}
              onClick={() => setIsAnimating(!isAnimating)}
            />
          )}
        </Popover>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
export type { MultiSelectOption, MultiSelectGroup, MultiSelectProps };
