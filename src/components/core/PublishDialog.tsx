import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Globe, Link, LockIcon, Mail, X } from "lucide-react";
import { useState } from "react";
import { SendInviteAPI } from "../https/services/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import TickIcon from "../ui/icons/tick";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import GroupAvatar from "./groupAvatar";

const PublishDialog = ({
  handleCopyLink,
  linkCopied,
}: {
  handleCopyLink: () => void;
  linkCopied: boolean;
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [validOnEnter, setValidOnEnter] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const { form_id } = useParams({ strict: false });

  const { mutate: SendInvite } = useMutation({
    mutationKey: ["SendInvite"],
    mutationFn: async (payload: any) => {
      const response = await SendInviteAPI(form_id, payload);
      return response;
    },
  });

  const handleSend = () => {
    SendInvite({
      user_emails: emails,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-lime-600 font-normal text-sm px-4 h-fit py-1 hover:bg-green-700 text-white rounded">
        Publish
      </AlertDialogTrigger>
      <AlertDialogContent className="px-6 py-4 sm:max-w-xl">
        <AlertDialogHeader className="border-b py-1 border-gray-300">
          <div className="flex justify-between items-center">
            <div>Form Link</div>
            <div>
              <Button
                className={`h-fit text-blue-500 text-xs font-light bg-transparent hover:bg-gray-100 shadow-none ${linkCopied ? "pointer-events-none" : "cursor-pointer"}`}
                onClick={handleCopyLink}
              >
                <Link className="w-4 h-4" />
                {linkCopied ? "Copied!" : "Copy Link"}
              </Button>
              <AlertDialogCancel className="border-none hover:text-red-500 [&_svg:not([class*='size-'])]:size-5 shadow-none has-[>svg]:px-0 py-0 h-fit">
                <X className="w-5 h-5" />
              </AlertDialogCancel>
            </div>
          </div>
        </AlertDialogHeader>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return "Email is required";
              }
              const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!regex.test(value)) {
                return "Invalid email address";
              }
              if (emails.includes(value)) {
                return "Email already exists";
              }
              return undefined;
            },
          }}
          children={(field) => (
            <div>
              <div className="flex items-center gap-2 ">
                <div className="flex items-center p-1 border flex-1">
                  {emails.length > 0 && (
                    <GroupAvatar emails={emails} setEmails={setEmails} />
                  )}
                  <Input
                    placeholder={emails.length > 0 ? "" : "Enter Email address"}
                    className=" focus-visible:ring-0 h-fit px-0 border-0"
                    value={field.state.value}
                    onChange={(e) => {
                      field.setValue(e.target.value);
                      setValidOnEnter(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        field.handleChange(e.currentTarget.value);
                        setValidOnEnter(true);
                        if (field.state.meta.isValid) {
                          setEmails([...emails, field.state.value]);
                          field.setValue("");
                          setValidOnEnter(false);
                        }
                      }
                      if (e.key === "Backspace") {
                        setValidOnEnter(false);
                        if (!field.state.value) {
                          field.setValue(emails[emails.length - 1]);
                          setEmails(emails.slice(0, emails.length - 1));
                        }
                      }
                    }}
                  />
                </div>

                <Button
                  onClick={handleSend}
                  className=" bg-lime-600 font-light text-xs px-2 rounded-md py-1 hover:bg-green-700 text-white h-8"
                >
                  <Mail className="w-4 h-4" />
                  Send Invite
                </Button>
              </div>
              {!field.state.meta.isValid && validOnEnter && (
                <div className="text-xs text-red-500">
                  {field.state.meta.errors}
                </div>
              )}
            </div>
          )}
        />
        <div>
          <h2 className="mb-2">Who has access</h2>
          <div
            onClick={() => setIsPublic(false)}
            className={`p-3 border rounded  flex items-center cursor-pointer  justify-between ${!isPublic && "bg-blue-100"}`}
          >
            <div className="flex items-center gap-2">
              <LockIcon
                className={`w-4 h-4 ${!isPublic && "stroke-blue-600"}`}
              />
              <div>
                <div
                  className={`text-sm font-normal ${!isPublic && "text-blue-600"}`}
                >
                  Private Form
                </div>
                <div className="text-sm font-light">
                  Only available to invited people
                </div>
              </div>
            </div>
            <div>
              {!isPublic && <TickIcon className="w-5 h-5  text-blue-500" />}
            </div>
          </div>
          <div
            onClick={() => setIsPublic(true)}
            className={`p-3 border rounded flex items-center justify-between cursor-pointer mt-4 ${isPublic && "bg-blue-100"}`}
          >
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${isPublic && "stroke-blue-600"}`} />
              <div>
                <div
                  className={`text-sm font-light ${isPublic && "text-blue-600"}`}
                >
                  Public Form
                </div>
                <div className="text-sm font-light">Available to anyone</div>
              </div>
            </div>
            {isPublic && <TickIcon className="w-5 h-5  text-blue-500" />}
          </div>
        </div>
        <div className="space-y-2">
          <h2>Permissions</h2>
          <RadioGroup>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="submit" id="submit" />
              <Label
                htmlFor="submit"
                className="flex flex-col items-start gap-0"
              >
                <div className="font-normal text-sm">Submit Only</div>
                <div className="text-sm font-extralight tracking-wide">
                  Users can only submit response cannot view their response
                </div>
              </Label>
            </div>
            <div className="flex items-center gap-1">
              <RadioGroupItem value="submit_view" id="submit_view" />
              <Label
                htmlFor="submit_view"
                className="flex flex-col items-start gap-0"
              >
                <div className="font-normal text-sm">Submit and View later</div>
                <div className="text-sm font-extralight tracking-wide">
                  Users can submit and view their response later
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishDialog;
