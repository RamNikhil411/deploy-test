import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import FilterIcon from "@/components/ui/icons/contacts/filterIcon";
import CalendarIcon from "@/components/ui/icons/events/calendarIcon";
import CheckInIcon from "@/components/ui/icons/events/checkInIcon";
import ClockIcon from "@/components/ui/icons/events/clockIcon";
import LocationIcon from "@/components/ui/icons/events/locationIcon";
import UsersIcon from "@/components/ui/icons/events/usersIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, User, UserRound } from "lucide-react";
import { useState } from "react";
import Comments from "./Comments";
import EventFeedback from "./Feedback";
import Attendance from "./Attendence";

export default function EventDetails() {
  const [activeTab, setActiveTab] = useState("Comments");
  const tabs = [
    {
      name: "Attendance",
      count: 5,
    },
    { name: "Feedback", count: 10 },
    { name: "Comments" },
  ];
  //   const allRoles = useRoles();
  const allRoles = [
    { id: 1, label: "Coordinator" },
    { id: 2, label: "Volunteer" },
    { id: 3, label: "Member" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex items-center justify-between border w-full p-2 bg-zinc-50 rounded-lg">
        <div className="flex items-center gap-4 w-[40%]">
          <Button
            className="h-8 w-10 rounded- p-0 border hover:bg-transparent"
            variant="ghost"
          >
            <ArrowLeft />
          </Button>
          <Avatar className="h-20 w-20 rounded-full">
            <AvatarImage src={""} alt="image" />
            <AvatarFallback className="text-gray-400">
              {" "}
              <User className="w-16 h-16" />{" "}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="capitalize text-lg">
              Environmental Education Workshop
            </div>
            <div className="text-sm 3xl:text-base text-gray-500">
              A full-day of work shop aimed at educating community members on
              sustainable environmental practices
            </div>
            <div className="text-xs text-gray-500 flex gap-4">
              <div className="flex gap-1">
                <CalendarIcon className="w-4 h-4" />
                Nov 4 2025
              </div>
              <div className="flex gap-1">
                <ClockIcon className="w-4 h-4" />
                09:00 AM
              </div>
              <div className="flex gap-1">
                {" "}
                <LocationIcon className="w-4 h-4" />
                Community Center, Melbourne
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] flex space-x-6 items-center justify-center">
          <div className="flex flex-col gap-2 text-sm ">
            <div className="flex items-center gap-1 text-gray-600">
              <UsersIcon className="w-4 h-4" />
              Event Type
            </div>
            <div className="text-gray-600 capitalize text-sm">work shop</div>
          </div>
          <Separator
            orientation="vertical"
            className=" min-h-16  h-16 text-gray-600"
          />
          <div className="flex flex-col items-center gap-2 text-sm ">
            <div className="flex items-center gap-1 text-gray-60">
              <UserRound className="w-5 h-4 fill-lime-600 stroke-transparent" />
              Organizer
            </div>
            <div className="flex items-center gap-2 text-gray-600 capitalize">
              <Avatar className="h-5 w-5">
                <AvatarImage src={""} alt="image" />
                <AvatarFallback className="text-gray-400 text-xs font-bold">
                  {" "}
                  <User className="w-3 h-3" />{" "}
                </AvatarFallback>
              </Avatar>
              John Doe
            </div>
          </div>
        </div>
        <div className="w-[30%] flex gap-2">
          <div className="w-full flex gap-4 justify-end">
            <Button className=" rounded-md bg-[#F2994A1A] hover:bg-[#F2994A1A] text-[#F2994A] border border-[#F2994A1F]">
              <CheckInIcon className="w-4 h-4" />
              Check In
            </Button>
            <Button className=" rounded-md bg-lime-600 hover:bg-lime-700 text-white">
              <Mail className="w-4 h-4" />
              Sent Invite Email
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 bg-gray-100 text-sm rounded-sm p-1 w-fit">
          {tabs.map((tab) => (
            <div
              className={`flex gap-2 items-center p-1 cursor-pointer ${activeTab === tab.name && "bg-white rounded"} `}
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
              }}
            >
              <div
                className={` px-2 gap-4  ${activeTab === tab.name && "bg-white text-lime-600"}`}
              >
                {tab?.name}
              </div>
              {tab?.count && (
                <span
                  className={`  rounded-full px-2 text-xs ${activeTab === tab.name ? "bg-zinc-100 px-2 text-lime-600" : "bg-white text-gray-500"}`}
                >
                  {tab?.count}
                </span>
              )}
            </div>
          ))}
        </div>
        {activeTab === "Attendance" ? (
          <div>
            <Select>
              <SelectTrigger className="w-full">
                <FilterIcon className="h-3 w-3 text-gray-400" />
                <SelectValue placeholder="Select Role" className="text-sm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allRoles?.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : activeTab === "Feedback" ? (
          <div>
            <Button className=" rounded-md bg-transparent border text-gray-600 text-sm hover:bg-gray-50 shadow-none">
              Add Review
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="h-[calc(100vh-293px)] overflow-auto">
        {activeTab === "Attendance" ? <Attendance /> : ""}
        {activeTab === "Feedback" ? <EventFeedback /> : ""}
        {activeTab === "Comments" ? <Comments /> : ""}{" "}
      </div>
    </div>
  );
}
