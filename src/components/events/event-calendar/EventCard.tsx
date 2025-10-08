import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { eventTypes } from "@/utils/constants/Events";
import dayjs from "dayjs";
import { MapPin } from "lucide-react";

export default function EventCard({ event }: any) {
  const eventType = eventTypes.find((type) => type.value === event.type);
  const bgClass = eventType?.bg ? `${eventType.bg}` : "";
  const borderClass = eventType?.border ? `border-l-4 ${eventType.border}` : "";
  const strokeClass = eventType?.stroke ? `${eventType.stroke}` : "";
  return (
    <Card
      className={`flex flex-col items-center justify-center w-full h-full pr-8 py-2 gap-1 rounded text-sm ${bgClass} ${borderClass}`}
    >
      <CardHeader className="w-full  px-2">{event.title}</CardHeader>
      <CardContent className="w-full h-full flex flex-col px-2 ">
        <div className="text-xs flex gap-2 capitalize items-center">
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className=" tracking-wide font-light">{event.type}</div>
        </div>
        <div className=" text-xs mt-2 tracking-wide font-light">
          {dayjs(event.from).format("h:mm A")} -{" "}
          {dayjs(event.to).format("h:mm A")}
        </div>
      </CardContent>
      <CardFooter className="px-2">
        <div className="flex gap-2 items-center ">
          <MapPin className={`w-4 h-4  ${strokeClass}`} />
          <div className=" tracking-wide font-light text-sm">
            {event.location}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
