import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarColorConst } from "@/lib/constants/calendarConstants";
import { eventTypes } from "@/utils/constants/Events";
import dayjs from "dayjs";
import { Map, MapPin } from "lucide-react";
import React, { useState } from "react";

type Event = {
  id: string | number;
  title: string;
  from: string; // ISO string "YYYY-MM-DDTHH:mm"
  to: string; // ISO string
  type: string;
  location: string;
};

interface DayTimelineProps {
  data: Event[];
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DayTimeline = ({ data, selectedDate }: DayTimelineProps) => {
  const slotHeight = 30;
  const minGap = 10;

  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  if (!selectedDate) return null;

  // Generate half-hour slots
  const slots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? 0 : 30;
    return dayjs(selectedDate).hour(hour).minute(minute).second(0);
  });

  // Filter events for the selected date and sort
  const events = data
    .filter((e) => dayjs(e.from).isSame(selectedDate, "day"))
    .sort((a, b) => dayjs(a.from).diff(dayjs(b.from)));

  const overlaps = (a: Event, b: Event) =>
    dayjs(a.from).isBefore(b.to) && dayjs(b.from).isBefore(a.to);

  // Group overlapping events
  const groups: Event[][] = [];
  events.forEach((event) => {
    let placed = false;
    for (const group of groups) {
      if (group.some((e) => overlaps(e, event))) {
        group.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([event]);
  });

  const dayStart = dayjs(selectedDate).hour(0).minute(0);

  const calculateTopOffset = (start: dayjs.Dayjs) =>
    (start.diff(dayStart, "minute") / 30) * slotHeight +
    Math.floor(start.diff(dayStart, "minute") / 30) * minGap +
    slotHeight / 2;

  const calculateHeight = (start: dayjs.Dayjs, end: dayjs.Dayjs) =>
    (end.diff(start, "minute") / 30) * slotHeight +
    Math.floor(end.diff(start, "minute") / 30) * minGap;

  const toggleGroup = (groupIndex: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupIndex)) newSet.delete(groupIndex);
      else newSet.add(groupIndex);
      return newSet;
    });
  };

  const assignColumns = (group: Event[]) => {
    const columns: Event[][] = [];
    group.forEach((event) => {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].some((e) => overlaps(e, event))) {
          columns[i].push(event);
          (event as any).col = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([event]);
        (event as any).col = columns.length - 1;
      }
    });
    return columns.length;
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="bg-gray-50 border border-gray-300 px-3 py-2 flex gap-3 items-center">
        <div className="text-xl">{dayjs(selectedDate).format("DD")}</div>
        <div>
          <div className="text-sm">{dayjs(selectedDate).format("dddd")}</div>
          <div className="text-xs font-light">
            {dayjs(selectedDate).format("MMMM DD, YYYY")}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <ScrollArea className="mt-4 h-[calc(100vh-253px)] pr-4 relative scroll-smooth">
        <div className="flex flex-col gap-4">
          {events?.map((event, index) => {
            const eventType = eventTypes.find(
              (type) => type.value === event.type
            );
            const bgClass = eventType?.bg ? `${eventType.bg}` : "";
            const borderClass = eventType?.border
              ? `border-l-4 ${eventType.border}`
              : "";
            return (
              <div
                className={`p-2 text-sm capitalize space-y-1  rounded-l ${bgClass} ${borderClass} `}
                key={index}
              >
                <div>{event.title}</div>
                <div className="text-xs flex gap-2 items-center">
                  <Avatar className="size-5">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {event.type}
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-xs">
                    {dayjs(event.from).format("hh:mm A")}
                    {" - "}
                    {dayjs(event.to).format("hh:mm A")}
                  </div>
                  <div className="flex gap-2 items-center">
                    <MapPin
                      className={`w-4 h-4 stroke-gray-50 ${eventType?.fill}  `}
                    />
                    {event.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DayTimeline;
