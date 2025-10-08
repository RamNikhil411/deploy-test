import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { eventTypes } from "@/utils/constants/Events";
import dayjs from "dayjs";
import React from "react";

type Event = {
  id: string | number;
  title: string;
  from: string;
  to: string;
  type: string;
  location: string;
};

interface DayCalendarProps {
  data: Event[];
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DayCalendar = ({
  data,
  selectedDate,
  setSelectedDate,
}: DayCalendarProps) => {
  const normalizeLocal = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const eventSet = new Set(
    data.map((event) => normalizeLocal(new Date(event.from)).getTime())
  );

  const modifiers = {
    event: (date: Date) => eventSet.has(normalizeLocal(date).getTime()),
  };

  const selectedDateEvents = React.useMemo(() => {
    if (!selectedDate) return [];
    const selectedTime = normalizeLocal(selectedDate).getTime();

    return data.filter(
      (event) => normalizeLocal(new Date(event.from)).getTime() === selectedTime
    );
  }, [selectedDate, data]);

  const DayButtonWithDot = (props: any) => {
    const day: Date = props.day.date;
    const isEvent = modifiers.event(day);

    const isSelected =
      selectedDate &&
      day.getFullYear() === selectedDate.getFullYear() &&
      day.getMonth() === selectedDate.getMonth() &&
      day.getDate() === selectedDate.getDate();

    return (
      <CalendarDayButton
        {...props}
        className="relative flex items-center justify-center"
      >
        {day instanceof Date && !isNaN(day.getTime()) ? day.getDate() : null}

        {isEvent && (
          <span
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
              isSelected ? "bg-white" : "bg-lime-700"
            }`}
          />
        )}
      </CalendarDayButton>
    );
  };

  return (
    <div className="">
      <div className="p-3">
        <Calendar
          mode="single"
          className="w-full p-4  border rounded-md"
          onDayClick={(date) => {
            setSelectedDate(date);
          }}
          classNames={{
            month: "flex gap-4 flex-col w-full",
            nav: "flex w-full items-center absolute top-0 inset-x-0 justify-between",
            week: "mt-3 flex w-full justify-around",
            day: "w-9 h-9",
            button_previous: "border px-1 py-1 rounded",
            button_next: "border px-1 py-1 rounded",
            month_caption:
              "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size) border-b",
          }}
          components={{
            DayButton: DayButtonWithDot,
          }}
          modifiers={modifiers}
        />
      </div>
      <Separator className="my-2" />
      <div className="p-3 h-[calc(100vh-600px)] scrollbar-hide overflow-auto flex-1">
        <div className="space-y-4">
          {selectedDateEvents.map((event: Event, index) => {
            const bg = eventTypes.find((et) => et.value === event.type)?.color;
            return (
              <div
                key={index}
                className="grid grid-cols-[15%_5%_80%] items-center"
              >
                <div className="text-gray-500 text-smd ">
                  {dayjs(event.from).format("hh:mm A")}
                </div>
                <div className={`h-2 w-2 rounded-full ${bg} `}></div>
                <div className="text-gray-500 font-light text-smd">
                  {event.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayCalendar;
