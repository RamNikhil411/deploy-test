import AttendIcon from "@/components/ui/icons/contacts/attendIcon";
import CallIcon from "@/components/ui/icons/contacts/callIcon";
import DonationIcon from "@/components/ui/icons/contacts/donationIcon";
import { useState } from "react";

const ContactTimeLine = () => {
  const [timelineEvents, setTimelineEvents] = useState([
    {
      id: 1,
      date: "July 8, 2025",
      title: "Monthly Donation Received",
      description: "$500 donation for native plant restoration.",
      icon: DonationIcon,
    },
    {
      id: 2,
      date: "July 02, 2025",
      title: "Attended Community Planting Day",
      description: "Participated in tree planting at Boorowa Reserve",
      icon: AttendIcon,
    },
    {
      id: 3,
      date: "Jun 22, 2025",
      title: "Phone Call - Project Discussion",
      description: "Discussed upcoming restoration initiatives",
      icon: CallIcon,
    },
  ]);

  return (
    <div className="timeline">
      <h3 className=" ">Activity Timeline</h3>
      {timelineEvents.map((event, idx) => (
        <div key={event?.id} className="timeline-event flex gap-2 p-1 ">
          <div className="flex flex-col items-center">
            {event.icon && <event.icon className="w-5 h-5" />}
            {idx < timelineEvents.length - 1 && (
              <div className="w-px bg-gray-300 h-12"></div>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm 2xl:text-base 3xl:!text-lg">
              {event.title}
            </span>
            <span className="text-xs 2xl:text-sm 3xl:!text-base text-gray-500">
              {event.description}
            </span>
            <span className="text-[10px]">{event.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ContactTimeLine;
