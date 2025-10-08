import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ArrowLeft, Upload, User } from "lucide-react";
import { useState } from "react";
import { useOrganizations } from "../core/ContactQueries";
import CustomDateRangePicker from "../core/customDateRangePicker";
import FileUpload from "../core/fileUpload";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CreateContactIcon } from "../ui/icons/createContactIcon";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MultiSelect } from "../ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export default function AddEvent() {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [contactAvatar, setContactAvatar] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [contactProfile, setContactProfile] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [date, setDate] = useState<any>();

  const eventTypes = [
    { id: "workshop", label: "Workshop" },
    { id: "donation", label: "Donation" },
    { id: "meeting", label: "Meeting" },
    { id: "training", label: "Training" },
    { id: "awareness", label: "Awareness Session" },
  ];
  const form = useForm({
    defaultValues: {
      event_name: "",
      event_type: "",
      description: "",
      date: Date,
      location: "",
      organizations_ids: [] as number[],
    },
    onSubmit: ({ value }) => {
      console.log("Form Submitted:", value);
    },
  });
  const { allOrganization } = useOrganizations({ view: "dropdown" });
  console.log(allOrganization,"allOrganization");
  

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="h-full flex items-center justify-center p-4"
    >
      <div className="w-3/5 flex flex-col gap-6 items-end">
        <Card className="w-full gap-0 py-0 rounded-lg border-none bg-gray-200 shadow-none">
          <CardHeader className="px-6 gap-y-0 rounded-t-lg py-2">
            <CardTitle className="flex items-center gap-2 font-normal text-gray-500">
              <ArrowLeft
                className="w-6 h-6 cursor-pointer mr-4"
                onClick={() => navigate({ to: "/events" })}
              />

              <CreateContactIcon className="w-6 h-6" />
              <span>{isEdit ? "Edit" : "Create"} Event</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-4 grid grid-cols-[25%_3%_70%] bg-white border rounded-lg">
            <div className="flex flex-col items-center">
              <Avatar className="h-36 w-36">
                <AvatarImage src={contactProfile || previewUrl} alt="image" />
                <AvatarFallback className="text-gray-400 text-2xl font-bold">
                  {" "}
                  <User className="w-16 h-16" />{" "}
                </AvatarFallback>
              </Avatar>

              <FileUpload
                crop={true}
                setImage={setPreviewUrl}
                onFileSelect={(file, fileUrl) => {
                  if (fileUrl) {
                    setContactAvatar(fileUrl);
                  }
                }}
              >
                <Button
                  type="button"
                  className="w-24 mt-2 gap-1 text-xs bg-white hover:bg-white text-black border"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
              </FileUpload>
            </div>
            <Separator orientation="vertical" />
            <div className="space-y-2">
              <div>
                <h2 className="text-lime-600 text-md">Event Details</h2>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <form.Field
                    name="event_name"
                    validators={{
                      onSubmit: ({ value }) =>
                        !value ? "Event Name is required" : undefined,
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label
                          htmlFor="event_name"
                          className="text-sm font-normal"
                        >
                          Event Name <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="event_name"
                          name="event_name"
                          placeholder="Enter event name"
                          value={
                            field.state.value.charAt(0).toUpperCase() +
                            field.state.value.slice(1)
                          }
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setSuccessMessage(null);
                          }}
                          className="mt-1"
                        />
                        {field.state.meta.errors && (
                          <p className="text-red-600 text-xs mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                  <form.Field
                    name="event_type"
                    validators={{
                      onSubmit: ({ value }) =>
                        !value ? "Event type is required" : undefined,
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label htmlFor="region" className="text-sm font-normal">
                          Event Type <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={
                            field.state.value
                              ? field.state.value.toString()
                              : ""
                          }
                          onValueChange={(val) => {
                            field.handleChange(val);
                            setSuccessMessage(null);
                          }}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select Region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {eventTypes?.map((region) => (
                                <SelectItem
                                  key={region.id}
                                  value={region.id.toString()}
                                >
                                  {region.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {field.state.meta.errors && (
                          <p className="text-red-600 text-xs mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                  <div className="col-span-2">
                    <form.Field name="description">
                      {(field) => (
                        <div>
                          <Label
                            htmlFor="description"
                            className="text-sm font-normal"
                          >
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Enter description"
                            className="mt-1 resize-none"
                            value={
                              field.state.value.charAt(0).toUpperCase() +
                              field.state.value.slice(1)
                            }
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              setSuccessMessage(null);
                            }}
                          />
                          {field.state.meta.errors && (
                            <p className="text-red-600 text-xs mt-1">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lime-600 text-md">Schedule & Location</h2>
                <div className="col-span-2">
                  <form.Field
                    name="date"
                    validators={{
                      onSubmit: ({ value }) =>
                        !value ? "Event date is required" : undefined,
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label
                          htmlFor="event_name"
                          className="text-sm capitalize mb-1 font-normal"
                        >
                          Start Date Time & end date time{" "}
                          <span className="text-red-600">*</span>
                        </Label>
                        <CustomDateRangePicker
                          date={date}
                          setDate={(d) => {
                            setDate(d);
                          }}
                          title="Select date and time"
                          disablePast={true}
                          onChange={(d) => {
                            if (d && d.from) {
                              const fromStr = dayjs(d.from).format(
                                "DD-MM-YYYY hh:mm A"
                              );
                              const toStr = d.to
                                ? dayjs(d.to).format("DD-MM-YYYY hh:mm A")
                                : undefined;
                              const formatted = toStr
                                ? `${fromStr} to ${toStr}`
                                : `${fromStr}`;
                              field.handleChange(formatted as any);
                            } else {
                              field.handleChange(undefined as any);
                            }
                            setSuccessMessage(null);
                          }}
                        />
                        {field.state.meta.errors && (
                          <p className="text-red-600 text-xs mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="location">
                    {(field) => (
                      <div>
                        <Label
                          htmlFor="location"
                          className="text-sm font-normal"
                        >
                          Location
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="Enter event location"
                          value={
                            field.state.value.charAt(0).toUpperCase() +
                            field.state.value.slice(1)
                          }
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setSuccessMessage(null);
                          }}
                          className="mt-1"
                        />
                        {field.state.meta.errors && (
                          <p className="text-red-600 text-xs mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
              <div>
                <h2 className="text-lime-600 text-md">
                  Assign to Group & Organizations
                </h2>
                <div className="col-span-2">
                  <form.Field
                    name="organizations_ids"
                    validators={{
                      onSubmit: ({ value }) =>
                        value.length === 0
                          ? "Organization is required"
                          : undefined,
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label
                          htmlFor="organization"
                          className="text-sm font-normal"
                        >
                          Organization <span className="text-red-600">*</span>
                        </Label>
                        <MultiSelect
                          value={field.state.value?.map(String)}
                          onValueChange={(val) => {
                            field.handleChange(val.map(Number));
                            setSuccessMessage(null);
                          }}
                          options={allOrganization?.records}
                          responsive={true}
                          placeholder="Select Organizations"
                          className="mt-1 h-fit"
                        />
                        {field.state.meta.errors && (
                          <p className="text-red-600 text-xs mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4">
          <Button
            type="button"
            className="bg-transparent hover:bg-transparent text-black border"
            onClick={() => {
              if (form.state.isDirty && !confirm("Discard changes?")) return;
              form.reset();
              navigate({ to: "/events" });
            }}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="bg-lime-600 hover:bg-lime-700"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            )}
          />
        </div>
      </div>
    </form>
  );
}
