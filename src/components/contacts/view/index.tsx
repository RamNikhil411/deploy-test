import { useContactById } from "@/components/core/ContactQueries";
import LoadingComponent from "@/components/core/LoadingComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";

import { getUserById } from "@/components/core/ContactQueries";

import { useQuery } from "@tanstack/react-query";
import { getUserByIdAuthAPI } from "@/components/https/services/users";
import { useEffect, useState } from "react";
import ContactNotes from "./Notes";
import Profile from "./Profile";
import ContactTimeLine from "./TimeLine";
import Appointments from "./Appointments";
import ContactRemainders from "./Remainders";
import Feedback from "./Feedback";
import ContactAttendance from "./Attendence";

interface searchParams {
  tab: string;
}

const ViewContact = () => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const { pathname } = useLocation();
  const searchParams: searchParams = useSearch({ strict: false });

  const { user_id } = useParams({ strict: false });

  const isUser = pathname.includes("users");

  const [activeTab, setActiveTab] = useState(searchParams?.tab || "timeline");
  const allTabs = [
    {
      value: "timeline",
      label: "Timeline",
      show: true,
    },
    { value: "notes", label: "Notes", show: true },
    { value: "appointments", label: "Appointments", show: true },
    { value: "attendance", label: "Attendance", show: true },
    { value: "feedback", label: "Feedback", show: true },
    { value: "reminders", label: "Reminder", show: true },
  ];
  const { isLoadingContactById, contactByIdData: getContacts } = useContactById(
    params?.contact_id
  );

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await getUserByIdAuthAPI(user_id);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!user_id,
  });

  useEffect(() => {
    if (activeTab) {
      params?.contact_id
        ? navigate({
            to: `/contacts/${params?.contact_id}`,
            search: { tab: activeTab },
            replace: true,
          })
        : navigate({
            to: `/users/${params?.user_id}`,
            search: { tab: activeTab },
            replace: true,
          });
    }
  }, [activeTab]);
  return (
    <div className="w-full flex gap-6 px-4 h-full  bg-gray-100">
      {isLoadingContactById ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="flex  rounded bg-white gap-4 w-[20%]">
            <Profile
              contact_id={params?.contact_id ?? params?.user_id}
              getContacts={isUser ? userData : getContacts}
            />
          </div>

          <div className="flex-1 bg-white p-3">
            <Tabs>
              <div className="bg-transparent gap-2 w-fit p-1 rounded ">
                <TabsList className="bbg-transparent">
                  {allTabs.map((tab) => (
                    <TabsTrigger
                      className={`mr-2 py-1 h-fit bg-transparent rounded hover:bg-gray-300 text-gray-700 font-normal cursor-pointer shadow-none ${
                        activeTab === tab.value && tab.value
                          ? "bg-white hover:bg-white text-lime-600"
                          : "text-gray-500"
                      }`}
                      value={tab.value}
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="p-2 h-[calc(100vh-150px)]">
                {activeTab === "timeline" && <ContactTimeLine />}
                {activeTab === "notes" && <ContactNotes />}
                {activeTab === "appointments" && <Appointments />}
                {activeTab === "reminders" && <ContactRemainders />}
                {activeTab === "feedback" && <Feedback />}
                {activeTab === "attendance" && <ContactAttendance />}
              </div>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};
export default ViewContact;
