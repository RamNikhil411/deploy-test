import { getAllTags, useContactById } from "@/components/core/ContactQueries";
import {
  CreateContactAPI,
  updateContactAPI,
} from "@/components/https/services/contacts";
import { CreateContactIcon } from "@/components/ui/icons/createContactIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactContext } from "@/context/contactContext";
import { APIResponse } from "@/lib/types";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Upload, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AppToast } from "../core/customToast";
import FileUpload from "../core/fileUpload";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { SelectTags } from "./organizations/SelectTags";

type FormData = {
  full_name: string;
  email: string;
  phone_number: string;
  profile_pic: string | undefined;
  organization_id: number | null;
  tags: number[];
};

const AddContact = () => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [contactAvatar, setContactAvatar] = useState<string | undefined>(
    undefined
  );

  const { activeOrganization } = useContext(ContactContext);

  const { contact_id } = useParams({ strict: false });
  const { contactByIdData } = useContactById(contact_id);

  const { data: contactAvatarUrl } = useDownloadUrl(
    contactByIdData?.profile_pic
  );

  const [avatarUploadStatus, setAvatarUploadStatus] = useState<
    "start" | "loading" | "success" | "error" | undefined
  >(undefined);

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      tags: [] as number[],
    },
    onSubmit: ({ value }) => {
      if (contact_id) {
        updateContact({ ...value, profile_pic: contactAvatar });
      } else {
        createContact({
          ...value,
          profile_pic: contactAvatar,
          organization_id: activeOrganization,
        });
      }
    },
  });

  const { allTags, refetch } = getAllTags();

  const { mutate: createContact, isPending: createContactPending } =
    useMutation<APIResponse, Error, FormData>({
      mutationKey: ["createContact"],
      mutationFn: async (payload: FormData) => {
        const response: any = await CreateContactAPI(payload);
        return response;
      },
      onSuccess: (response) => {
        setContactAvatar(undefined);
        setPreviewUrl(undefined);
        form.reset();
        AppToast.success({ message: response?.message || "Contact created." });
        router.history.back();
      },
      onError: (error: any) => {
        if (error?.data?.err_data) {
          form.setErrorMap({
            onSubmit: {
              form: error?.data?.message,
              fields: {
                full_name: error?.data?.err_data?.full_name,
                email: error?.data?.err_data?.email,
                phone_number: error?.data?.err_data?.phone_number,
                tags: error?.data?.err_data?.tags,
              },
            },
          });
        } else {
          AppToast.error({ message: error?.data?.message });
        }
      },
    });

  const { mutate: updateContact, isPending: updateContactPending } =
    useMutation<APIResponse, Error, Partial<FormData>>({
      mutationKey: ["updateContact"],
      mutationFn: async (payload: FormData) => {
        const response: any = await updateContactAPI(contact_id, payload);
        return response?.data?.message;
      },
      onSuccess: (response) => {
        setContactAvatar(undefined);
        setPreviewUrl(undefined);
        form.reset();
        AppToast.success({ message: response?.message || "Contact updated." });
        router.history.back();
      },

      onError: (error: any) => {
        if (error?.data?.err_data) {
          form.setErrorMap({
            onSubmit: {
              form: error?.data?.message,
              fields: {
                full_name: error?.data?.err_data?.full_name,
                email: error?.data?.err_data?.email,
                phone_number: error?.data?.err_data?.phone_number,
                tags: error?.data?.err_data?.tags,
              },
            },
          });
        } else {
          AppToast.error({ message: error?.data?.message });
        }
      },
    });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit();
    }
  };

  const { data: contactProfileUrl } = useDownloadUrl(
    contactByIdData?.profile_pic
  );
  const profileUrl = contactProfileUrl?.target_url || undefined;

  useEffect(() => {
    if (contactByIdData?.profile_pic) {
      setContactAvatar(contactByIdData?.profile_pic);
    }
  }, [contactByIdData?.profile_pic]);

  useEffect(() => {
    if (contactProfileUrl?.target_url) {
      setPreviewUrl(contactProfileUrl?.target_url);
    }
  }, [contactProfileUrl?.target_url]);

  useEffect(() => {
    if (contactByIdData && form) {
      form.setFieldValue("full_name", contactByIdData?.full_name);
      form.setFieldValue("email", contactByIdData?.email);
      form.setFieldValue("phone_number", contactByIdData?.phone_number);
      form.setFieldValue(
        "tags",
        contactByIdData?.contact_tags
          ? contactByIdData?.contact_tags?.map((t: any) => t?.id)
          : []
      );
    }
  }, [contactByIdData]);

  return (
    <div className="h-full flex justify-center p-4">
      <div className="w-3/5 flex flex-col gap-6 items-end">
        <Card className="w-full gap-0 py-0 rounded-lg border-none bg-gray-200 shadow-none">
          <CardHeader className="px-6 gap-y-0 rounded-t-lg py-2">
            <CardTitle className="flex items-center gap-2 font-normal text-gray-500">
              <ArrowLeft
                className="w-6 h-6 cursor-pointer mr-4"
                onClick={() => router.history.back()}
              />

              <CreateContactIcon className="w-6 h-6" />
              <span>{contact_id ? "Edit" : "Create"} Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent
            className="px-0 py-4 grid grid-cols-[25%_3%_70%] bg-white border rounded-xl"
            onKeyDown={handleKeyDown}
          >
            <div className="flex flex-col items-center">
              <Avatar
                className={`h-32 w-32 relative ${avatarUploadStatus === "loading" ? "opacity-50 ring-4 ring-green-500" : avatarUploadStatus === "error" ? "opacity-50 ring-4 ring-red-500" : ""} `}
              >
                {avatarUploadStatus === "loading" && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  </div>
                )}
                {avatarUploadStatus === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-full animate-pulse">
                    <AlertCircle className="text-red-500" size={32} />
                  </div>
                )}
                <AvatarImage
                  src={previewUrl}
                  alt={contactByIdData?.full_name}
                />
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
                uploadStatus={(status) => {
                  setAvatarUploadStatus(status);
                  if (status === "error") {
                    setPreviewUrl(contactByIdData?.target_url);
                  }
                }}
              >
                <span className="w-24 mt-2 gap-1 text-xs bg-white flex items-center p-2 rounded-md hover:bg-white text-black border">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </span>
              </FileUpload>
            </div>
            <Separator orientation="vertical" />
            <div className="space-y-2">
              <div>
                <h2 className="text-lime-600 text-md">Basic Contact Details</h2>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <form.Field name="full_name">
                    {(field) => (
                      <div>
                        <Label htmlFor="full_name" className="text-sm">
                          Full Name <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          placeholder="Enter Full Name"
                          value={
                            field.state.value.charAt(0).toUpperCase() +
                            field.state.value.slice(1)
                          }
                          onChange={(e) => {
                            field.setValue(e.target.value);
                          }}
                          className="mt-1 text-sm"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-red-600 text-xs mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="email">
                    {(field) => (
                      <div>
                        <Label htmlFor="email" className="text-sm">
                          Email <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          placeholder="Enter Email"
                          className="mt-1  text-sm"
                          value={field.state.value.toLowerCase() ?? ""}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            field.setValue(value);
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
                  <div className="col-span-2">
                    <form.Field name="phone_number">
                      {(field) => (
                        <div>
                          <Label htmlFor="phone" className="text-sm">
                            Phone <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Enter Phone"
                            className="mt-1 text-sm"
                            value={field.state.value ?? ""}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value.startsWith("+")) {
                                value =
                                  "+" + value.slice(1).replace(/[^0-9]/g, "");
                              } else {
                                value = value.replace(/[^0-9]/g, "");
                              }
                              field.handleChange(value);
                            }}
                            maxLength={
                              field.state.value.startsWith("+61") ? 12 : 10
                            }
                          />
                          {field.state.meta.errors && (
                            <p className="text-red-600 text-xs mt-1">
                              {field.state.meta.errors?.[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              </div>

              {/* <div>
                <h2 className="text-lime-600 text-md">Contact Roles</h2>
                <div className="grid grid-cols-3 gap-y-3 mt-1">
                  <form.Field name="contact_roles">
                    {(field) =>
                      roles.map((role) => {
                        const checked = field.state.value === role.id;
                        return (
                          <div
                            key={role.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={role.id}
                              className="data-[state=checked]:bg-lime-600 data-[state=checked]:border-0"
                              checked={checked}
                              onCheckedChange={() => {
                                field.handleChange(checked ? "" : role.id);
                                setSuccessMessage(null);
                              }}
                            />
                            <Label
                              htmlFor={role.id}
                              className="text-sm font-normal"
                            >
                              {role.label}
                            </Label>
                          </div>
                        );
                      })
                    }
                  </form.Field>
                </div>
              </div> */}
              <form.Field name="tags">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <SelectTags
                      placeholder="Search tags"
                      options={allTags}
                      value={field.state.value}
                      onChange={(newValue) => field.setValue(newValue)}
                      refetch={refetch}
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
          </CardContent>
        </Card>
        <div className="flex gap-4">
          <Button
            type="button"
            className="bg-transparent hover:bg-transparent text-black border"
            onClick={() => {
              form.reset();
              router.history.back();
            }}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                className={`bg-lime-600 hover:bg-lime-700 ${updateContactPending || createContactPending ? "pointer-events-none" : ""}`}
                disabled={!canSubmit || isSubmitting}
                onClick={form.handleSubmit}
              >
                {contact_id
                  ? updateContactPending
                    ? "Updating..."
                    : "Update"
                  : createContactPending
                    ? "Saving..."
                    : "Save"}
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AddContact;
