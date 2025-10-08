import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import EventCard from "./EventCard";

type Event = {
  id: string | number;
  title: string;
  from: string;
  to: string;
  type: string;
  location: string;
};
interface MonthCalendarProps {
  data: Event[];
  month: Date;
  setMonth: (month: Date) => void;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}
export default function MonthCalendar({
  data,
  selectedDate,
  setSelectedDate,
  month,
  setMonth,
  setActiveTab,
}: MonthCalendarProps) {
  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    data.forEach((e) => {
      const key = dayjs(e.from).format("YYYY-MM-DD");
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [data]);

  return (
    <div className="w-full">
      <Calendar
        mode="single"
        selected={selectedDate ?? undefined}
        onSelect={(d) => d && setSelectedDate(d)}
        formatters={{
          formatWeekdayName: (date) => dayjs(date).format("ddd"),
        }}
        month={month}
        onMonthChange={setMonth}
        className="w-full p-1"
        fixedWeeks={true}
        components={{
          Day: (props) => {
            const date = props.day.date;
            const key = dayjs(date).format("YYYY-MM-DD");
            const events = eventsByDate[key] || [];
            const isOutside = props.modifiers.outside;
            const isSelected = props.modifiers.selected;

            return (
              <td
                onClick={() => {
                  setSelectedDate(date);
                  setActiveTab("day");
                }}
              >
                <div
                  className={cn(
                    "relative flex flex-col items-start justify-start p-1 border border-gray-200 min-h-[80px] w-full",
                    isOutside && "bg-gray-50 text-gray-400"
                  )}
                >
                  <div className="text-xs font-semibold">{date.getDate()}</div>

                  <div className="flex  flex-wrap gap-1 mt-1 w-full">
                    {events.slice(0, 2).map((e, index) => (
                      <Tooltip key={e.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "text-[11px] font-light tracking-wide truncate rounded px-1 py-0.5 text-white",
                              e.type === "meeting" && "bg-blue-500",
                              e.type === "donation" && "bg-orange-500",
                              e.type === "training" && "bg-purple-500",
                              e.type === "workshops" && "bg-green-500",
                              e.type === "awareness-session" &&
                                "bg-emerald-500",
                              index === 1 && "flex-1"
                            )}
                          >
                            {dayjs(e.from).format("hh:mma")} {e.title}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="tooltipBtn bg-transparent">
                          <EventCard event={e} />
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[11px] tracking-wide bg-green-500 text-white px-1 rounded w-fit">
                        +{events.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              </td>
            );
          },
        }}
        classNames={{
          month: "flex flex-col w-full",
          weekdays:
            "grid grid-cols-7 w-full bg-gray-100 p-2 text-center h-[50px]",
          weekday: "text-xs",
          week: "grid grid-cols-7 w-full",
          day: "w-full h-full",
          nav: "flex items-center justify-between p-2",
          caption: "text-lg font-semibold ",
          button_previous: "hidden",
          button_next: "hidden",
          month_caption: "text-lg hidden font-semibold",
        }}
      />
    </div>
  );
}
