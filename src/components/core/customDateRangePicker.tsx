import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar as CalendarIcon, XIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";
import DropDownIcon from "../ui/icons/dropDownIcon";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
interface CustomDateRangePickerProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  align?: "start" | "center" | "end";
  onChange?: (date: DateRange | undefined) => void;
  disablePast?: boolean;
  disableFuture?: boolean;
  title?: string;
}
const CustomDateRangePicker = ({
  date,
  setDate,
  align,
  title,
  onChange,
  disablePast,
  disableFuture,
}: CustomDateRangePickerProps) => {
  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(
    date
  );
  const [startTime, setStartTime] = React.useState<string | undefined>(
    undefined
  );
  const [endTime, setEndTime] = React.useState<string | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const formatLabel = () => {
    if (!date?.from) return title || "Date";
    if (date.to) {
      if (dayjs(date.from).isSame(date.to, "day")) {
        return (
          dayjs(date.from).format("DD-MM-YYYY") +
          (dayjs(date.from).format("hh:mm A") !== "00:00"
            ? ` ${dayjs(date.from).format("hh:mm A")}`
            : "")
        );
      }
      return (
        `${dayjs(date.from).format("DD-MM-YYYY")}` +
        (dayjs(date.from).format("hh:mm A") !== "00:00"
          ? ` ${dayjs(date.from).format("hh:mm A")}`
          : "") +
        ` to ${dayjs(date.to).format("DD-MM-YYYY")}` +
        (dayjs(date.to).format("hh:mm A") !== "00:00"
          ? ` ${dayjs(date.to).format("hh:mm A")}`
          : "")
      );
    }
    return (
      dayjs(date.from).format("DD-MM-YYYY") +
      (dayjs(date.from).format("hh:mm A") !== "00:00"
        ? ` ${dayjs(date.from).format("hh:mm A")}`
        : "")
    );
  };

  // compute disabled days for Calendar based on props
  const disabledDays: any = React.useMemo(() => {
    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();
    if (disablePast && disableFuture) {
      return { before: todayStart, after: todayEnd };
    }
    if (disablePast) return { before: todayStart };
    if (disableFuture) return { after: todayEnd };
    return undefined;
  }, [disablePast, disableFuture]);
  const handleSubmit = () => {
    if (selectedDate) {
      const merged: DateRange = { ...selectedDate } as DateRange;
      if (startTime && merged.from) {
        const from = dayjs(merged.from)
          .hour(parseInt(startTime.split(":")[0], 10))
          .minute(parseInt(startTime.split(":")[1], 10));
        merged.from = from.toDate();
      }
      if (endTime && merged.to) {
        const to = dayjs(merged.to)
          .hour(parseInt(endTime.split(":")[0], 10))
          .minute(parseInt(endTime.split(":")[1], 10));
        merged.to = to.toDate();
      }
      setDate(merged);
      onChange?.(merged);
    } else {
      setDate(selectedDate);
      onChange?.(selectedDate);
    }
    setOpen(false);
  };
  const resetDate = () => setDate(undefined);
  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          setSelectedDate(date);
          setStartTime(
            date?.from ? dayjs(date.from).format("hh:mm A") : undefined
          );
          setEndTime(date?.to ? dayjs(date.to).format("hh:mm A") : undefined);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button className="border w-full text-smd font-normal flex items-center justify-start border-gray-300 py-1.5 h-8 rounded-md px-2 bg-transparent hover:bg-transparent ">
          <CalendarIcon className="mr-1 h-4 w-4 shrink-0" />
          <span className=" text-sm">{formatLabel()}</span>
          {date ? (
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                resetDate();
              }}
            >
              <XIcon className="ml-1 h-5 w-5 shrink-0 cursor-pointer" />
            </button>
          ) : (
            <DropDownIcon className="ml-1 !h-4 !w-4 shrink-0 " />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={4}
        className="flex w-fit mr-2 gap-2 p-2 bg-white z-[100] border border-gray-300"
      >
        <div className="">
          <div>
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              captionLayout="dropdown"
              classNames={{
                range_middle: "bg-lime-300",
                day: "w-full flex items-center justify-center",
                weekday: "text-sm flex justify-center font-normal w-full",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 w-full p-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1">
                Start Time
              </Label>
              <Input
                type="time"
                id="start-time-picker"
                step="60"
                value={startTime || ""}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1">
                End Time
              </Label>
              <Input
                type="time"
                id="end-time-picker"
                step="60"
                value={endTime || ""}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
          {selectedDate && (
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2 text-xs items-center">
                <span className=" text-sm">Selected: </span>

                {dayjs(selectedDate.from).format("DD-MM-YYYY")}
                {startTime ? ` ${startTime}` : ""}
                {selectedDate.to
                  ? ` to ${dayjs(selectedDate.to).format("DD-MM-YYYY")}` +
                    (endTime ? ` ${endTime}` : "")
                  : ""}
              </div>
              {endTime && (
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(undefined);
                      setStartTime(undefined);
                      setEndTime(undefined);
                      setDate(undefined);
                      onChange?.(undefined);
                    }}
                    className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    disabled={!selectedDate.from || !selectedDate.to}
                    onClick={handleSubmit}
                    className="px-3 py-1 bg-lime-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default CustomDateRangePicker;
