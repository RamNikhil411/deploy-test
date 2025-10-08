const ContactRemainders = () => {
  const reminders = [
    {
      id: 1,
      title: "Reminder 1",
      date: "2023-10-01T10:00:00Z",
      description: "This is the first reminder for the contact.",
      status: "Pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Reminder 2",
      date: "2023-10-02T12:00:00Z",
      description: "This is a follow-up reminder for the contact.",
      status: "Completed",
      priority: "medium",
    },
    {
      id: 3,
      title: "Reminder 3",
      date: "2023-10-03T14:00:00Z",
      description: "This is a reminder reminder for the contact.",
      status: "Pending",
      priority: "low",
    },
    {
      id: 4,
      title: "Reminder 4",
      date: "2023-10-04T16:00:00Z",
      description: "This is a feedback reminder for the contact.",
      status: "Completed",
      priority: "medium",
    },
    {
      id: 5,
      title: "Reminder 5",
      date: "2023-10-05T18:00:00Z",
      description: "This is the final reminder for the contact.",
      status: "Pending",
      priority: "high",
    },
  ];
  return (
    <div className="h-calc(100vh-200px)">
      <div className="space-y-2 overflow-auto ">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="p-2 bg-gray-50 rounded flex justify-between items-center"
          >
            <div className="flex items-start ">
              <div className="flex flex-col">
                <p className="text-sm ">{reminder.title}</p>
                <p className="text-sm text-gray-600">{reminder.description}</p>
              </div>
              <p className="text-xs text-gray-800 bg-zinc-300 px-2 rounded">
                {reminder.status}
              </p>
            </div>
            <p
              className={`text-xs capitalize px-1 rounded ${
                reminder.priority === "high"
                  ? "text-red-500 bg-red-50 border border-red-300"
                  : reminder.priority === "medium"
                    ? "text-amber-500 bg-amber-50 border border-amber-400"
                    : "text-emerald-500 bg-emerald-50 border border-emerald-300"
              }`}
            >
              {reminder.priority}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactRemainders;
