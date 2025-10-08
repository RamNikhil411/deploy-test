import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field } from "@/lib/types";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

export function DateSelect({
  field,
  value,
  onChange,
}: {
  field?: Field;
  value?:
    | string
    | number
    | string[]
    | { [subFieldLabel: string]: string | number };
  onChange?: (value: string | number) => void;
}) {
  const [date, setDate] = React.useState<Date>();

  useEffect(() => {
    if (value) {
      setDate(new Date(value as string));
    }
  }, [value]);

  return (
    <div className="flex flex-col ">
      <Label
        className={` text-sm ${
          field?.fieldLabelProperties?.textAlign === "center"
            ? "justify-center"
            : field?.fieldLabelProperties?.textAlign === "right"
              ? "justify-end"
              : "justify-start"
        }`}
      >
        {field?.title ?? field?.label ?? " "}
        {field?.required && <span className="text-red-500">&#42;</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
            disabled={field?.disabled}
          >
            <CalendarIcon />
            {date ? (
              dayjs(date).format("MMM D, YYYY")
            ) : (
              <span>
                {` ${
                  field?.placeholder?.trim() ? field?.placeholder : "Enter Date"
                }`}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              onChange && onChange(String(date));
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
