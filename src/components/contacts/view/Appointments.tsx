import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";
import { CustomCalendar } from "./customCalendar";
import { Badge } from "@/components/ui/badge";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const Appointments = [
    {
      title: "Appointment 1",
      date: "2025-09-20T10:00:00Z",
      type: "Field Work",
    },
    {
      title: "Appointment 2",
      date: "2025-09-20T12:00:00Z",
      type: "Meeting",
    },
    {
      title: "Appointment 3",
      date: "2025-09-21T14:00:00Z",
      type: "Phone Call",
    },
    {
      title: "Appointment 4",
      date: "2025-09-22T16:00:00Z",
      type: "Meeting",
    },
    {
      title: "Appointment 5",
      date: "2025-09-23T18:00:00Z",
      type: "Field Work",
    },
  ];

  return (
    <div className="grid grid-cols-2 h-full">
      <div className="p-4 h-full">
        <CustomCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          appointments={Appointments}
        />
      </div>
      <div className="p-2 h-full">
        <div className="p-2 shadow-md rounded-md h-full">
          <h2 className="text-md ">Upcoming Appointments</h2>
          <div className="mt-4 space-y-2">
            <div className="mt-4 space-y-2">
              {Appointments.filter(
                (appt) =>
                  selectedDate &&
                  new Date(appt.date).toDateString() ===
                    selectedDate.toDateString()
              ).map((appt, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 p-2 rounded-md flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-medium">{appt.title}</div>
                    <div className="text-xs">
                      {new Date(appt.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(appt.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <Badge className="bg-white h-fit text-black border border-gray-200 rounded font-light">
                    {appt.type}
                  </Badge>
                </div>
              ))}

              {selectedDate &&
                Appointments.filter(
                  (appt) =>
                    new Date(appt.date).toDateString() ===
                    selectedDate.toDateString()
                ).length === 0 && (
                  <div className="text-xs text-gray-500">
                    No appointments on this date.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
