import { APIResponse } from "@/lib/types";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from "react";
import { getUserByIdAuthAPI, updateUserByIdAPI } from "../https/services/users";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { CreateContactIcon } from "../ui/icons/createContactIcon";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useRoles } from "./ContactQueries";
import { AppToast } from "./customToast";
import FileUpload from "./fileUpload";

const EditDialog = ({
  isDeleteOpen,
  setDeleteClose,
  onCancel,
  user_id,
}: {
  isDeleteOpen: boolean;
  setDeleteClose: Dispatch<SetStateAction<boolean>>;
  onCancel: () => void;
  onConfirm: () => void;
  deleteError?: string;
  isDeleteLoading?: boolean;
  user_id?: number | null;
}) => {
  const { organisation_id } = useParams({ strict: false });
  const [OrganizationAvatar, setOrganizationAvatar] = useState<
    string | undefined
  >();
  const [OrganizationPreviewUrl, setOrganizationPreviewUrl] = useState<
    string | undefined
  >();
  const queryClient = useQueryClient();
  const allRoles = useRoles();
  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      address: "",
      avatar: "",
      roles: [] as number[],
    },
    onSubmit: ({ value }) => {
      const payload: any = {
        ...value,
        avatar: OrganizationAvatar,
        organization_id: organisation_id,
      };
      if (!value.address) {
        delete payload.address;
      }
      updateUser(payload);
    },
  });

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      let queryParams = {
        organization_id: organisation_id,
      };
      const response = await getUserByIdAuthAPI(String(user_id), queryParams);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!user_id,
  });

  const { mutate: updateUser } = useMutation<APIResponse, Error, FormData>({
    mutationKey: ["createUser"],
    mutationFn: async (payload: FormData) => {
      const response: any = await updateUserByIdAPI(String(user_id), payload);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["org-users"] });
      setOrganizationAvatar(undefined);
      setOrganizationPreviewUrl(undefined);
      setDeleteClose(true);
      form.reset();
      AppToast.success({
        message: response?.data?.message || "User updated Successfully.",
      });
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
  useEffect(() => {
    if (userData) {
      form.setFieldValue("full_name", userData?.full_name);
      form.setFieldValue("email", userData?.email);
      form.setFieldValue("phone_number", userData?.phone_number);
      form.setFieldValue("address", userData?.address);
      form.setFieldValue(
        "roles",
        userData?.roles?.map((role: any) => role.id)
      );
    }
  }, [userData]);

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setDeleteClose}>
      <DialogContent
        className="sm:max-w-3xl rounded-2xl gap-2 p-3"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-[17px] font-normal tracking-wide">
            Edit
          </DialogTitle>
        </DialogHeader>
        <div className="text-[16px] flex flex-col font-normal justify-between w-full">
          <div className="p-4">
            <div className="w-2xl mx-auto">
              <Card className="bg-gray-100 py-0 gap-0">
                <CardHeader className="flex px-4 py-2 items-center text-gray-500">
                  <CreateContactIcon className="w-5 h-5" />
                  <h1 className="text-lg ">Update User</h1>
                </CardHeader>
                <CardContent className="p-4 bg-white">
                  <div className="grid grid-cols-[25%_3%_70%]">
                    <div className="flex flex-col gap-1 items-center">
                      <Avatar className="size-32">
                        <AvatarImage
                          src={OrganizationPreviewUrl || OrganizationAvatar}
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <FileUpload
                        crop={true}
                        setImage={setOrganizationPreviewUrl}
                        onFileSelect={(file, fileUrl) => {
                          if (fileUrl) {
                            setOrganizationAvatar(fileUrl);
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
                                Full Name{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="full_name"
                                autoComplete="off"
                                value={
                                  field.state.value.charAt(0).toUpperCase() +
                                  field.state.value.slice(1)
                                }
                                placeholder="Enter Full Name"
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
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
                                autoComplete="email"
                                value={field.state.value.toLowerCase()}
                                placeholder="Enter Email"
                                readOnly
                                onChange={(e) =>{
                                  const value = e.target.value.trim();
                                  field.handleChange(value)
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
                            <Label
                              htmlFor="phone"
                              className="text-sm font-normal"
                            >
                              Phone <span className="text-red-600">*</span>
                            </Label>
                            <Input
                              id="phone"
                              autoComplete="phone"
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
                      <form.Field name="roles">
                        {(field) => (
                          <div>
                            <div className="text-sm font-normal">Role</div>
                            <div className="grid grid-cols-3 gap-2 ">
                              {allRoles &&
                                allRoles?.map((role) => (
                                  <div
                                    className="flex gap-2 items-center"
                                    key={role.id}
                                  >
                                    <Checkbox
                                      id={role.id}
                                      checked={field.state.value?.includes(
                                        role.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.handleChange([
                                            ...field.state.value,
                                            role.id,
                                          ]);
                                        } else {
                                          field.handleChange(
                                            field.state.value.filter(
                                              (id) => id !== role.id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                    <Label
                                      htmlFor={role.id}
                                      className="text-sm font-normal"
                                    >
                                      {role.name}
                                    </Label>
                                  </div>
                                ))}
                            </div>
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
                              autoComplete="address"
                              placeholder="Enter Address"
                              value={
                                field.state.value
                                  ? field.state.value.charAt(0).toUpperCase() +
                                    field.state.value.slice(1)
                                  : ""
                              }
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              className="mt-2 h-28 resize-none text-sm"
                            />
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className=" flex justify-end gap-2 mt-2">
          <Button
            type="submit"
            onClick={onCancel}
            className="bg-transparent hover:bg-gray-50 text-gray-500 border border-gray-200"
          >
            Cancel
          </Button>
          <Button type="submit" onClick={() => form.handleSubmit()}>
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
