import AttendedIcon from "@/components/ui/icons/contacts/attendedIcon";
import AttendIcon from "@/components/ui/icons/contacts/attendIcon";
import MissedIcon from "@/components/ui/icons/contacts/missedIcon";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const ContactAttendance = () => {
  const attendance = [
    {
      id: 1,
      date: "2023-01-01",
      status: "attended",
      eventTitle: "Event 1",
    },
    {
      id: 2,
      date: "2023-02-01",
      status: "missed",
      eventTitle: "Event 2",
    },
    {
      id: 3,
      date: "2023-03-01",
      status: "attended",
      eventTitle: "Event 3",
    },
    {
      id: 4,
      date: "2023-04-01",
      status: "missed",
      eventTitle: "Event 4",
    },
    {
      id: 5,
      date: "2023-05-01",
      status: "attended",
      eventTitle: "Event 5",
    },
  ];
  return (
    <div className="space-y-2">
      <div className="flex gap-4 justify-between w-full border-b py-2">
        <div className=" w-1/2 border space-y-1 bg-gray-100 rounded-lg p-2">
          <div className="flex justify-between">
            <span className="text-sm">Overall Attendance</span>
            <span>50%</span>
          </div>
          <div className="relative">
            <Progress
              value={70}
              className="bg-gray-300 rounded-full overflow-hidden "
              indicatorClassName="bg-linear-to-r from-red-500 from-0% to-green-700 to-100%"
            />

            <div className="flex justify-between text-xs mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        <div className=" w-1/2 p-2 items-center flex justify-between">
          <div className="w-full justify-evenly grid grid-cols-3 gap-4">
            <div className="flex flex-col p-2 justify-between items-center bg-emerald-50 border border-emerald-200 rounded">
              <div>5</div>
              <div>Events Attended</div>
            </div>
            <div className="flex flex-col p-2 justify-between border items-center bg-blue-50 border-blue-200 rounded">
              <div>10</div>
              <div>Total Events</div>
            </div>
            <div className="flex flex-col p-2 justify-between border items-center bg-amber-50 border-amber-200 rounded">
              <span>5</span>
              <span>Missed Events</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3>Recent Events</h3>
        <div className="w-1/2">
          {attendance.map((event) => (
            <div
              key={event?.id}
              className="flex gap-2 justify-between items-center p-2 border-b mt-2"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs ">{event?.date}</span>
                <div className="text-sm">{event?.eventTitle}</div>
              </div>
              <span
                className={`text-xs capitalize px-1 rounded flex gap-1 items-center ${
                  event.status === "missed"
                    ? "text-red-500 bg-red-50 border border-red-300"
                    : "text-emerald-500 bg-emerald-50 border border-emerald-300"
                }`}
              >
                {event?.status === "missed" ? (
                  <MissedIcon className="w-3 h-2.5" />
                ) : (
                  <AttendedIcon className="w-3 h-3" />
                )}
                {event?.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactAttendance;
