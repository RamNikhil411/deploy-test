import { getUserById } from "@/components/core/ContactQueries";
import { AppToast } from "@/components/core/customToast";
import FileUpload from "@/components/core/fileUpload";
import {
  CreateUserAPI,
  getUserByIdAuthAPI,
  updateUserByIdAPI,
} from "@/components/https/services/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreateContactIcon } from "@/components/ui/icons/createContactIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { APIResponse } from "@/lib/types";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Upload, AlertCircle, User } from "lucide-react";
import { useEffect, useState } from "react";

type FormData = {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  avatar: string | undefined;
};

const AddUser = () => {
  const { user_id } = useParams({ strict: false });

  const router = useRouter();
  const queryclient = useQueryClient();
  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      address: "",
      avatar: "",
    },
    onSubmit: ({ value }) => {
      const payload: any = {
        ...value,
        avatar: OrganizationAvatar,
      };

      if (!value.address) {
        delete payload.address;
      }

      if (user_id) {
        updateUser(payload);
      } else {
        createUser(payload);
      }
    },
  });

  const [OrganizationAvatar, setOrganizationAvatar] = useState<
    string | undefined
  >();
  const [OrganizationPreviewUrl, setOrganizationPreviewUrl] = useState<
    string | undefined
  >();
  const [avatarUploadStatus, setAvatarUploadStatus] = useState<
    "start" | "loading" | "success" | "error" | undefined
  >(undefined);

  const { data: userData } = useQuery({
    queryKey: ["userData", user_id],
    queryFn: async () => {
      const response = await getUserByIdAuthAPI(user_id);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!user_id,
  });

  const { mutate: createUser, isPending: isCreateUserPending } = useMutation<
    APIResponse,
    Error,
    FormData
  >({
    mutationKey: ["createUser"],
    mutationFn: async (payload: FormData) => {
      const response: any = await CreateUserAPI(payload);
      return response;
    },
    onSuccess: (response) => {
      queryclient.invalidateQueries({ queryKey: ["users"] });
      setOrganizationAvatar(undefined);
      setOrganizationPreviewUrl(undefined);
      form.reset();
      AppToast.success({ message: response?.data.message || "User created." });
      router.history.back();
    },
    onError: (error: any) => {
      if (error?.data?.err_data) {
        form.setErrorMap({
          onSubmit: {
            form: error?.data?.message,
            fields: {
              email: error?.data?.err_data?.email,
              full_name: error?.data?.err_data?.full_name,
              phone_number: error?.data?.err_data?.phone_number,
              address: error?.data?.err_data?.address,
              avatar: error?.data?.err_data?.avatar,
            },
          },
        });
      } else {
        AppToast.error({ message: error?.data?.message });
      }
    },
  });

  const { mutate: updateUser, isPending: isUpdatePending } = useMutation<
    APIResponse,
    Error,
    FormData
  >({
    mutationKey: ["createUser"],
    mutationFn: async (payload: FormData) => {
      const response: any = await updateUserByIdAPI(user_id, payload);
      return response;
    },
    onSuccess: (response) => {
      setOrganizationAvatar(undefined);
      setOrganizationPreviewUrl(undefined);
      form.reset();
      queryclient.invalidateQueries({ queryKey: ["users"] });
      AppToast.success({
        message: response?.data?.message || "User updated Successfully.",
      });
      router.history.back();
    },
    onError: (error: any) => {
      if (error?.data?.err_data) {
        form.setErrorMap({
          onSubmit: {
            form: error?.data?.message,
            fields: {
              email: error?.data?.err_data?.email,
              full_name: error?.data?.err_data?.full_name,
              phone_number: error?.data?.err_data?.phone_number,
              address: error?.data?.err_data?.address,
              avatar: error?.data?.err_data?.avatar,
            },
          },
        });
      } else {
        AppToast.error({ message: error?.data?.message });
      }
    },
  });
  const { data: contactProfileUrl } = useDownloadUrl(userData?.avatar);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit();
    }
  };

  useEffect(() => {
    if (userData?.avatar) {
      setOrganizationAvatar(userData?.avatar);
    }
  }, [userData]);

  useEffect(() => {
    if (contactProfileUrl) {
      setOrganizationPreviewUrl(contactProfileUrl?.target_url);
    }
  }, [contactProfileUrl]);

  useEffect(() => {
    if (!user_id) return;

    if (userData) {
      form.setFieldValue("full_name", userData?.full_name);
      form.setFieldValue("email", userData?.email);
      form.setFieldValue("phone_number", userData?.phone_number);
      form.setFieldValue("address", userData?.address);
    }
  }, [userData]);
  return (
    <div className="p-4">
      <div className="w-3xl mx-auto">
        <Card className="bg-gray-100 py-0 gap-0 ">
          <CardHeader className="flex px-4 py-2 items-center text-gray-500">
            <ArrowLeft
              className="w-6 cursor-pointer h-4"
              onClick={() => {
                router.history.back();
              }}
            />
            <CreateContactIcon className="w-5 h-5" />
            <h1 className="text-lg ">{user_id ? "Update" : "Create"} User</h1>
          </CardHeader>
          <CardContent
            className=" bg-white rounded-xl"
            onKeyDown={handleKeyDown}
          >
            <div className="p-4">
              <div className="grid grid-cols-[25%_3%_70%]">
                <div className="flex flex-col gap-1 items-center">
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
                      src={OrganizationPreviewUrl}
                      alt={userData?.full_name}
                    />
                    {avatarUploadStatus !== "loading" &&
                      avatarUploadStatus !== "error" && (
                        <AvatarFallback className="text-gray-500">
                          <User className="w-20 h-20" />
                        </AvatarFallback>
                      )}
                  </Avatar>
                  <FileUpload
                    crop={true}
                    setImage={setOrganizationPreviewUrl}
                    onFileSelect={(file, fileUrl) => {
                      if (fileUrl) {
                        setOrganizationAvatar(fileUrl);
                      }
                    }}
                    uploadStatus={(status) => {
                      setAvatarUploadStatus(status);
                      if (status === "error") {
                        setOrganizationPreviewUrl(
                          contactProfileUrl?.target_url
                        );
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
                  <div className="grid grid-cols-2 gap-2">
                    <form.Field name="full_name">
                      {(field) => (
                        <div>
                          <Label
                            htmlFor="full_name"
                            className="text-sm font-normal"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="full_name"
                            value={
                              field.state.value.charAt(0).toUpperCase() +
                              field.state.value.slice(1)
                            }
                            placeholder="Enter Full Name"
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="text-sm"
                          />
                          {field.state.meta.errors && (
                            <span className="text-xs text-red-500">
                              {field.state.meta.errors[0]}
                            </span>
                          )}
                        </div>
                      )}
                    </form.Field>
                    <form.Field name="email">
                      {(field) => (
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-normal"
                          >
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            value={field.state.value.toLowerCase()}
                            placeholder="Enter Email"
                            readOnly={user_id ? true : false}
                            onChange={(e) => {
                              const value = e.target.value.trim();
                              field.handleChange(value);
                            }}
                            className="text-sm"
                          />
                          {field.state.meta.errors && (
                            <span className="text-xs text-red-500">
                              {field.state.meta.errors[0]}
                            </span>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>
                  <form.Field name="phone_number">
                    {(field) => (
                      <div>
                        <Label htmlFor="phone" className="text-sm font-normal">
                          Phone <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="phone"
                          value={field.state.value}
                          placeholder="Enter Phone Number"
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
                          className="text-sm"
                        />
                        {field.state.meta.errors && (
                          <span className="text-xs text-red-500">
                            {field.state.meta.errors[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="address">
                    {(field) => (
                      <div>
                        <Label
                          htmlFor="address"
                          className="text-sm font-normal"
                        >
                          Address
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Enter Address"
                          value={
                            field.state.value
                              ? field.state.value.charAt(0).toUpperCase() +
                                field.state.value.slice(1)
                              : ""
                          }
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="mt-2 h-28 resize-none text-sm"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className=" flex justify-end gap-2 mt-4">
          <Button
            type="submit"
            className="bg-transparent hover:bg-gray-50 text-gray-500 border border-gray-200"
            onClick={() => router.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => form.handleSubmit()}
            onKeyDown={(e) => e.key === "Enter" && form.handleSubmit()}
            className={`${isCreateUserPending || isUpdatePending ? `pointer-events-none` : ``}`}
          >
            {user_id
              ? isUpdatePending
                ? "Updating..."
                : "Update"
              : isCreateUserPending
                ? "Creating..."
                : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
