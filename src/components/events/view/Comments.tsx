import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Reply,
  SendHorizontalIcon,
  Smile,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";

type Comment = {
  id: number;
  name: string;
  time: string;
  message: string;
  repliesCount: number;
  replies: Comment[];
};
export default function Comments() {
  const [activeComment, setActiveComment] = useState<Comment | null>(null);
  const commentsData = [
    {
      id: 1,
      name: "John Doe",
      time: "2 hours ago",
      message: "This is the first comment on the thread.",
      repliesCount: 2,
      replies: [
        {
          id: 11,
          name: "Alice",
          time: "1 hour ago",
          message: "I totally agree with you, John!",
          repliesCount: 0,
          replies: [],
        },
        {
          id: 12,
          name: "Bob",
          time: "45 minutes ago",
          message: "Same here, good point.",
          repliesCount: 0,
          replies: [],
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      time: "3 hours ago",
      message: "Here’s another perspective on this topic.",
      repliesCount: 1,
      replies: [
        {
          id: 21,
          name: "Charlie",
          time: "2 hours ago",
          message: "Interesting view, thanks for sharing!",
          repliesCount: 0,
          replies: [],
        },
      ],
    },
    {
      id: 3,
      name: "Mike Johnson",
      time: "5 hours ago",
      message: "Does anyone know when the update will be released?",
      repliesCount: 0,
      replies: [],
    },
    {
      id: 4,
      name: "Jane Smith",
      time: "3 hours ago",
      message: "Here's another perspective on this topic.",
      repliesCount: 1,
      replies: [
        {
          id: 41,
          name: "Charlie",
          time: "2 hours ago",
          message: "Interesting view, thanks for sharing!",
          repliesCount: 0,
          replies: [],
        },
      ],
    },
    {
      id: 5,
      name: "Jane Smith",
      time: "3 hours ago",
      message: "Here’s another perspective on this topic.",
      repliesCount: 1,
      replies: [
        {
          id: 42,
          name: "Charlie",
          time: "2 hours ago",
          message: "Interesting view, thanks for sharing!",
          repliesCount: 0,
          replies: [],
        },
      ],
    },
    {
      id: 6,
      name: "Jane Smith",
      time: "3 hours ago",
      message: "Here’s another perspective on this topic.",
      repliesCount: 1,
      replies: [
        {
          id: 44,
          name: "Charlie",
          time: "2 hours ago",
          message: "Interesting view, thanks for sharing!",
          repliesCount: 0,
          replies: [],
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col border rounded">
      <div className="bg-white p-2 flex items-center rounded-t">Comments</div>
      <ScrollArea className="bg-gray-100 p-2 space-y-2 h-[calc(100vh-363px)] ">
        {activeComment && (
          <div
            className="flex items-center mb-2 bg-white px-2 py-1  cursor-pointer"
            onClick={() => setActiveComment(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-smd text-gray-600 flex gap-2 items-center">
              Thread by
              <Avatar className="w-6 h-6">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {activeComment.name}
            </span>
          </div>
        )}
        {!activeComment && (
          <div className="space-y-2">
            {commentsData.map((comment) => (
              <div key={comment.id} className="p-2  rounded bg-white">
                <div className="flex items-center mb-2">
                  <div className="mr-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="mr-2 text-sm">{comment.name}</span>
                  <span className="text-gray-500 text-xs ">{comment.time}</span>
                </div>
                <div className="text-sm">{comment.message}</div>
                <div className="flex justify-start items-center mt-2 gap-8">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-3 h-3" />
                    <span className="text-gray-500 text-xs">Like</span>
                  </div>
                  <div
                    className="text-xs flex text-gray-500 items-center"
                    onClick={() => setActiveComment(comment)}
                  >
                    <span className="mr-2">
                      <Reply className="w-3 h-3" />
                    </span>
                    {comment?.repliesCount > 1 ? (
                      <span>{`${comment?.repliesCount} Replies`}</span>
                    ) : comment?.repliesCount === 1 ? (
                      <span>{`${comment?.repliesCount} Reply`}</span>
                    ) : (
                      "Reply"
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeComment && (
          <div>
            <div className="p-2 bg-white space-y-2">
              <div className="flex items-center">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="mr-2 text-sm">{activeComment.name}</span>
                <span className="text-gray-500 text-xs">
                  {activeComment.time}
                </span>
              </div>
              <div className="text-sm">{activeComment.message}</div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-3 h-3" />
                <span className="text-gray-500 text-xs">Like</span>
              </div>
            </div>

            <div className="flex gap-2 my-2 items-center">
              <div className="text-xs w-14 shrink-0 text-gray-500">
                {activeComment.repliesCount} Replies
              </div>
              <div className="h-[0.5px] bg-gray-300 w-full"></div>
            </div>
            <div className="px-2 space-y-2">
              {activeComment.replies.map((reply) => (
                <div key={reply.id} className="p-2 space-y-2 rounded bg-white">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="mr-2 text-sm">{reply.name}</span>
                    <span className="text-gray-500 text-xs">{reply.time}</span>
                  </div>
                  <div className="text-sm">{reply.message}</div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-3 h-3" />
                    <span className="text-gray-500 text-xs">Like</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      <div className="relative w-full">
        <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
        <Input
          placeholder="Enter your comment here"
          className="pr-10 pl-9 h-12 focus-visible:ring-0 border-none"
        />
        <Button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2  "
        >
          <SendHorizontalIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
