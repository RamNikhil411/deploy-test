import { User, X } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const GroupAvatar = ({
  emails,
  setEmails,
}: {
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const maxVisible = 3;
  const visibleEmails = emails.slice(0, maxVisible);
  const extraEmails = emails.slice(maxVisible);
  const extraCount = extraEmails.length;

  return (
    <TooltipProvider>
      <div className="space-x-1 flex px-2 py-1">
        {visibleEmails.map((email) => (
          <div
            title={email}
            key={email}
            className="flex px-1  group py-1 items-center rounded-full bg-gray-300"
          >
            <div className="flex gap-1 items-center  ">
              <User className="w-4 h-4" />
              <div className="text-sm w-14 truncate grow-0">{email}</div>
            </div>
            <X
              className="w-4 h-4 cursor-pointer hidden transition duration-300 group-hover:block hover:text-red-500"
              onClick={() => setEmails(emails.filter((e) => e !== email))}
            />
          </div>
        ))}

        {extraCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center border w-7 h-7 border-black bg-gray-200 text-xs font-semibold rounded-full cursor-pointer">
                +{extraCount}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black shadow-md">
              <div className="flex flex-col  gap-1">
                {extraEmails.map((email) => (
                  <div key={email} className=" flex gap-1 items-center">
                    <span className="text-sm">{email}</span>
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-red-500"
                      onClick={() =>
                        setEmails(emails.filter((e) => e !== email))
                      }
                    />
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default GroupAvatar;
