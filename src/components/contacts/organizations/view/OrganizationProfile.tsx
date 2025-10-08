import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateContactIcon } from "@/components/ui/icons/createContactIcon";
import CalendarIcon from "@/components/ui/icons/events/calendarIcon";
import ClockIcon from "@/components/ui/icons/events/clockIcon";
import { Separator } from "@/components/ui/separator";
import { OrganizationProfileProps } from "@/lib/interfaces/contacts";
import { getAvatarLetters } from "@/utils/helpers/getAvatarLetters";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { useNavigate, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ArrowLeftIcon } from "lucide-react";

const OrganizationProfile = ({ organization }: OrganizationProfileProps) => {
  const navigate = useNavigate();
  const router = useRouter();
  const { data: organizationLogo } = useDownloadUrl(organization?.logo);
  return (
    <div className="p-2 border flex items-center">
      <div className="flex gap-3 items-center ">
        <div>
          <Button
            className="bg-transparent h-fit py-1 px-1 hover:bg-transparent border  text-black [&_svg:not([class*='size-'])]:w-5 [&_svg:not([class*='size-'])]:h-5"
            onClick={() => router.history.back()}
          >
            <ArrowLeftIcon />
          </Button>
        </div>
        <Avatar className="w-20 h-20">
          <AvatarImage src={organizationLogo?.target_url} alt="profile" />
          <AvatarFallback className="text-gray-400 text-2xl font-bold">
            {getAvatarLetters(organization?.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-4 h-full flex flex-col gap-1">
        <h1 className="text-xl font-medium">{organization?.name}</h1>
        <p className="text-sm ">{organization?.region?.name}</p>
      </div>
      <div className="flex flex-col items-start gap-2 ml-20">
        <div className="flex gap-2 items-center text-smd font-light">
          <ClockIcon className="w-4 h-4" /> Last Modified
        </div>
        <div>
          <p className="text-xs font-medium ">
            {dayjs(organization?.updated_at).format("DD-MM-YYYY hh:mm:ss ")}
          </p>
        </div>
      </div>
      <Separator
        orientation="vertical"
        className="mx-6 h-10! bg-gray-300 w-px"
      />
      <div className="flex flex-col items-start gap-2">
        <div className="flex gap-2 items-center text-smd font-light">
          <CalendarIcon className="w-4 h-4" />
          Created At
        </div>
        <div>
          <p className="text-xs font-medium">
            {dayjs(organization?.created_at).format("DD-MM-YYYY hh:mm:ss ")}
          </p>
        </div>
      </div>
      <Separator
        orientation="vertical"
        className="mx-6 h-10! bg-gray-300 w-px"
      />
      <div className="flex flex-col gap-2 items-start">
        <div className="flex gap-2 items-center text-smd font-light">
          <CreateContactIcon className="w-4 h-4 fill-lime-500" />
          Created By
        </div>
        <div>
          <p className="text-xs flex gap-1 font-medium">
            <Avatar className="size-4">
              <AvatarImage src="" alt={organization?.created_by.full_name} />
              <AvatarFallback>
                {getAvatarLetters(organization?.created_by.full_name)}
              </AvatarFallback>
            </Avatar>
            {organization?.created_by.full_name}
          </p>
        </div>
      </div>

      {/* <Separator
        orientation="vertical"
        className="mx-6 h-10! bg-gray-300 w-[0.5px] grow-0"
      />
      <div className="flex flex-col gap-2 items-start">
        <div className="flex gap-2 items-center text-smd font-light">
          <CreateContactIcon className="w-4 h-4 fill-lime-500" />
          Co-Ordinator
        </div>
        <div>
          <p className="text-xs flex gap-1 font-medium">
            <Avatar className="size-4">
              <AvatarImage src="" />
              <AvatarFallback>
                {organization?.created_by.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {organization?.created_by.full_name}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default OrganizationProfile;
