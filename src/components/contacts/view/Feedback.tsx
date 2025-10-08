import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Rating from "@/components/ui/icons/rating";
import { formatDate } from "@/utils/helpers/formatDate";
import { AvatarFallback } from "@radix-ui/react-avatar";

import React from "react";

const Feedback = () => {
  const feedback = [
    {
      author: "John Doe",
      date: "2023-10-01T10:00:00Z",
      event: "Initial Feedback",
      content: "This is the first feedback for the contact.",
      rating: 4.5,
    },
    {
      author: "Jane Smith",
      date: "2023-10-02T12:00:00Z",
      event: "Follow-up Feedback",
      content: "This is a follow-up feedback for the contact.",
      rating: 3.8,
    },
    {
      author: "Bob Johnson",
      date: "2023-10-03T14:00:00Z",
      event: "Reminder Feedback",
      content: "This is a reminder feedback for the contact.",
      rating: 4.2,
    },
  ];

  return (
    <div className="space-y-2">
      {feedback.map((item, index) => (
        <div
          key={index}
          className="bg-blue-50 border-l-[3px] rounded-l-md border-blue-500 p-3"
        >
          <div className="flex gap-2 items-center">
            <Avatar className="size-6">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-xs font-medium">{item.author}</div>
            <div className="text-xs"> {formatDate(item.date)}</div>
            <div>
              <Rating rating={item.rating} className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-smd font-medium">{item.event}</p>
            <p className="text-smd text-gray-500 font-light">
              "{item.content}"
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feedback;
