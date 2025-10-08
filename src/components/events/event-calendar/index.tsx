import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventTypes } from "@/utils/constants/Events";
import React, { useState } from "react";
import DayCalendar from "./DayCalendar";
import DayTimeline from "./DayTimeline";
import MonthCalendar from "./MonthCalendar";
import MonthYearSelect from "./MonthYearSelect";

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTab, setSelectedTab] = useState("day");
  const [month, setMonth] = useState(new Date());
  const events = [
    {
      id: 1,
      title: "Environmental Education Workshop",
      from: "2025-09-20T09:00:00",
      to: "2025-09-20T12:00:00",
      type: "workshops",
      location: "Sydney Botanical Gardens, Sydney",
    },
    {
      id: 9,
      title: "Environmental Education Workshop",
      from: "2025-09-20T09:00:00",
      to: "2025-09-20T12:00:00",
      type: "workshops",
      location: "Sydney Botanical Gardens, Sydney",
    },
    {
      id: 2,
      title: "Monthly Donation Drive",
      from: "2025-09-20T10:00:00",
      to: "2025-09-20T14:00:00",
      type: "donation",
      location: "Green Earth NGO Center, Melbourne",
    },
    {
      id: 3,
      title: "Volunteer Training on Waste Management",
      from: "2025-09-21T13:00:00",
      to: "2025-09-21T16:00:00",
      type: "training",
      location: "Community Hall, Brisbane",
    },
    {
      id: 4,
      title: "Tree Plantation Awareness Session",
      from: "2025-09-22T08:30:00",
      to: "2025-09-22T11:30:00",
      type: "awareness-session",
      location: "Royal Botanic Gardens, Adelaide",
    },
    {
      id: 5,
      title: "Community Clean-Up Meeting",
      from: "2025-09-21T09:30:00",
      to: "2025-09-21T12:30:00",
      type: "meeting",
      location: "Town Hall, Perth",
    },
    {
      id: 6,
      title: "Plastic-Free Awareness Campaign",
      from: "2025-09-22T10:00:00",
      to: "2025-09-22T13:00:00",
      type: "awareness-session",
      location: "Lake Burley Griffin, Canberra",
    },
    {
      id: 7,
      title: "Climate Change Workshop",
      from: "2025-09-23T14:00:00",
      to: "2025-09-23T17:00:00",
      type: "workshops",
      location: "NGO Training Center, Hobart",
    },
    {
      id: 8,
      title: "Fundraising Donation Event",
      from: "2025-09-20T11:00:00",
      to: "2025-09-20T15:00:00",
      type: "donation",
      location: "City Auditorium, Darwin",
    },
    {
      id: 10,
      title: "Environmental Education Workshop",
      from: "2025-09-20T09:00:00",
      to: "2025-09-20T12:00:00",
      type: "donation",
      location: "Sydney Botanical Gardens, Sydney",
    },
    {
      id: 11,
      title: "Environmental Education Workshop",
      from: "2025-09-20T09:00:00",
      to: "2025-09-20T12:00:00",
      type: "awareness-session",
      location: "Sydney Botanical Gardens, Sydney",
    },
    {
      id: 12,
      title: "Environmental Education Workshop",
      from: "2025-09-20T09:00:00",
      to: "2025-09-20T12:00:00",
      type: "training",
      location: "Sydney Botanical Gardens, Sydney",
    },
    {
      id: 13,
      title: "Environmental Education Workshop",
      from: "2025-09-20T09:00:00",
      to: "2025-09-20T12:00:00",
      type: "workshops",
      location: "Sydney Botanical Gardens, Sydney",
    },
    {
      id: 14,
      title: "Environmental Education Workshop",
      from: "2025-09-20T09:00:00",
      to: "2025-09-20T12:00:00",
      type: "donation",
      location: "Sydney Botanical Gardens, Sydney",
    },
    {
      id: 1,
      title: "Environmental Education Workshop",
      from: "2025-09-20T09:00:00",
      to: "2025-09-20T12:00:00",
      type: "meeting",
      location: "Sydney Botanical Gardens, Sydney",
    },
  ];

  return (
    <div className="p-3">
      <Tabs
        defaultValue="day"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="gap-1"
      >
        <div className="flex items-center gap-4">
          <TabsList className="rounded-md">
            <TabsTrigger
              value="day"
              className="font-normal px-4 py-0 text-sm rounded  data-[state=active]:text-lime-600"
            >
              Day
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="font-normal py-0 rounded data-[state=active]:text-lime-600 px-4 text-sm"
            >
              Month
            </TabsTrigger>
          </TabsList>
          {selectedTab === "month" && (
            <MonthYearSelect month={month} setMonth={setMonth} />
          )}
        </div>
        <div className="flex gap-4">
          <div className="text-sm font-medium">Event Types :</div>
          {eventTypes.map((event, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3  ${event.color} `}></div>
              <div className="text-sm ">{event.label}</div>
            </div>
          ))}
        </div>

        <TabsContent value="day">
          <div className="grid grid-cols-12 h-[calc(100vh-180px)] ">
            <div className=" col-span-8 h-full">
              <DayTimeline
                data={events}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
            <div className=" col-span-4 h-full border-l ">
              <DayCalendar
                data={events}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="month">
          <MonthCalendar
            data={events}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            month={month}
            setMonth={setMonth}
            setActiveTab={setSelectedTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventCalendar;
