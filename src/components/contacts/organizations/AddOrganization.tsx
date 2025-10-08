import {
  getAllTags,
  useOrganizationById,
  useRegions,
} from "@/components/core/ContactQueries";
import { AppToast } from "@/components/core/customToast";
import FileUpload from "@/components/core/fileUpload";
import {
  createOrganizationAPI,
  updateOrganizationByIdAPI,
} from "@/components/https/services/organization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import OrganizationIcon from "@/components/ui/icons/organizationIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { APIResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDownloadUrl } from "@/utils/helpers/useDownloadUrl";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { CommandEmpty } from "cmdk";
import { AlertCircle, Check, Loader, Upload, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectTags } from "./SelectTags";

interface FormData {
  name: string;
  region_id: number | null;
  tags: number[];
  logo: string | undefined;
}

const AddOrganization = () => {
  const { organisation_id } = useParams({ strict: false });
  const router = useRouter();
  const regions = useRegions({ view: "dropdown" }).allRegions;
  const [OrganizationAvatar, setOrganizationAvatar] = useState<
    string | undefined
  >(undefined);
  const [OrganizationPreviewUrl, setOrganizationPreviewUrl] = useState<
    string | undefined
  >(undefined);
  const [avatarUploadStatus, setAvatarUploadStatus] = useState<
    "start" | "loading" | "success" | "error" | undefined
  >(undefined);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      region_id: "",
      tags: [] as number[],
      logo: "",
    },
    onSubmit: ({ value }) => {
      const payload: FormData = {
        ...value,
        region_id: value.region_id ? Number(value.region_id) : null,
        logo: OrganizationAvatar ?? "",
      } as FormData;

      if (organisation_id) {
        updateOrganization(payload);
      } else {
        createOrganization(payload);
      }
    },
  });

  const { organizationDetails } = useOrganizationById(Number(organisation_id));
  const { allTags, refetch } = getAllTags();

  const { data: organizationLogo } = useDownloadUrl(organizationDetails?.logo);
  const { mutate: createOrganization, isPending: isCreating } = useMutation<
    APIResponse,
    Error,
    FormData
  >({
    mutationKey: ["createOrganization"],
    mutationFn: async (payload: FormData) => {
      const response: any = await createOrganizationAPI(payload);
      return response;
    },
    onSuccess: async (response) => {
      setOrganizationAvatar(undefined);
      setOrganizationPreviewUrl(undefined);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      AppToast.success({
        message: response?.data?.message || "Organisation created.",
      });
      navigate({ to: "/organisations" });
    },
    onError: (error: any) => {
      if (error?.data?.err_data) {
        form.setErrorMap({
          onSubmit: {
            form: error?.data?.message,
            fields: {
              name: error?.data?.err_data?.name,
              region_id: error?.data?.err_data?.region_id,
              tags: error?.data?.err_data?.tags,
              logo: error?.data?.err_data?.avatar,
            },
          },
        } as any);
      } else {
        AppToast.error({ message: error?.data?.message });
      }
    },
  });

  const { mutate: updateOrganization, isPending: isUpdating } = useMutation<
    APIResponse,
    Error,
    FormData
  >({
    mutationKey: ["updateOrganization"],
    mutationFn: async (payload: FormData) => {
      const response: any = await updateOrganizationByIdAPI(
        organisation_id,
        payload
      );
      return response;
    },
    onSuccess: async (response) => {
      setOrganizationAvatar(undefined);
      setOrganizationPreviewUrl(undefined);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      AppToast.success({
        message: response?.data?.message || "Organisation updated.",
      });
      router.history.back();
    },
    onError: (error: any) => {
      if (error?.data?.err_data) {
        form.setErrorMap({
          onSubmit: {
            form: error?.data?.message,
            fields: {
              name: error?.data?.err_data?.name,
              region_id: error?.data?.err_data?.region_id,
              tags: error?.data?.err_data?.tags,
              logo: error?.data?.err_data?.avatar,
            },
          },
        } as any);
      } else {
        AppToast.error({ message: error?.data?.message });
      }
    },
  });
  const handleRemoveLogo = () => {
    setOrganizationAvatar(undefined);
    setOrganizationPreviewUrl(undefined);
  };

  useEffect(() => {
    if (organizationDetails?.logo) {
      setOrganizationAvatar(organizationDetails?.logo);
    }
  }, [organizationDetails]);
  useEffect(() => {
    if (organizationLogo) {
      setOrganizationPreviewUrl(organizationLogo?.target_url);
    }
  }, [organizationLogo]);
  useEffect(() => {
    if (organizationDetails) {
      form.setFieldValue("name", organizationDetails.name || "");
      form.setFieldValue(
        "region_id",
        organizationDetails.region?.id
          ? organizationDetails.region?.id.toString()
          : ""
      );
      form.setFieldValue("logo", organizationDetails.logo || "");
      form.setFieldValue(
        "tags",
        organizationDetails.tags
          ? organizationDetails.tags.map((t: any) => t.id)
          : []
      );
    }
  }, [organizationDetails]);
  return (
    <div className="p-4">
      <div className="flex flex-col items-end w-3xl  mx-auto">
        <Card className="w-full   py-0 gap-0 rounded-lg bg-gray-100">
          <CardHeader className=" text-gray-500 py-2 rounded-t-lg flex gap-2 items-center">
            <OrganizationIcon />
            <h1 className="text-lg  ">
              {organisation_id ? "Update" : "Create"} Organisation
            </h1>
          </CardHeader>
          <CardContent className="px-0 py-5  rounded-xl bg-white">
            <form
              className="grid grid-cols-[25%_3%_70%] "
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="space-y-2 flex flex-col items-center relative ">
                {OrganizationPreviewUrl && (
                  <X
                    onClick={() => handleRemoveLogo()}
                    className="absolute right-6 top-1 cursor-pointer rounded-full w-4 h-4"
                  />
                )}
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
                    alt={organizationDetails?.name}
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
                      setOrganizationPreviewUrl(organizationLogo?.target_url);
                    }
                  }}
                >
                  <div className="space-y-1">
                    <p className="text-gray-500 font-normal">
                      Max file size: 2MB
                    </p>
                    <span className="w-24 mt-2 gap-1 text-xs bg-white flex items-center p-2 rounded-md hover:bg-white text-black border">
                      <Upload className="mr-2 h-4 w-4" /> Upload
                    </span>
                  </div>
                </FileUpload>
              </div>
              <Separator orientation="vertical" />
              <div>
                <div className="space-y-4">
                  <form.Field name="name">
                    {(field) => (
                      <div>
                        <Label htmlFor="name">
                          Organisation <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          className="mt-2 placeholder:text-sm text-sm"
                          placeholder="Enter Organisation Name"
                          value={
                            field.state.value.charAt(0).toUpperCase() +
                            field.state.value.slice(1)
                          }
                          onChange={(e) => {
                            const value = e.target.value.trimStart();
                            field.setValue(value);
                          }}
                        />
                        {field.state.meta.errors && (
                          <span className="text-red-500 text-xs">
                            {field.state.meta.errors[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="region_id">
                    {(field) => (
                      <div className="">
                        <Label>Region</Label>
                        <Popover>
                          <PopoverTrigger
                            asChild
                            className="hover:bg-transparent"
                          >
                            <Button
                              variant="outline"
                              className="mt-2 w-full flex justify-start text-gray-600 hover:text-gray-600 "
                            >
                              {field.state.value
                                ? regions?.find(
                                    (r) =>
                                      r.id.toString() ===
                                      field.state.value.toString()
                                  )?.name
                                : "Select Region"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full h-[40vh] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search regions..."
                                className="placeholder:text-sm"
                              />
                              <CommandList>
                                <CommandEmpty>No regions found.</CommandEmpty>
                                <CommandGroup>
                                  {regions?.map((region) => (
                                    <CommandItem
                                      key={region.id}
                                      value={region.name}
                                      onSelect={() => field.setValue(region.id)}
                                    >
                                      {region.name}
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.state.value === region.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {field.state.meta.errors && (
                          <span className="text-red-500 text-xs">
                            {field.state.meta.errors[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="tags">
                    {(field) => (
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <SelectTags
                          placeholder="Search tags"
                          options={allTags}
                          value={field.state.value}
                          onChange={(newValue) => field.handleChange(newValue)}
                          refetch={refetch}
                        />
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            onClick={() => {
              form.reset();
              router.history.back();
            }}
            className="border bg-transparent hover:bg-transparent cursor-pointer text-black font-normal"
          >
            Cancel
          </Button>
          <Button
            className={`bg-lime-600 hover:bg-lime-700 ${isCreating || isUpdating ? `pointer-events-none` : ""}`}
            type="submit"
            onClick={() => {
              form.handleSubmit();
            }}
          >
            {organisation_id ? (
              isUpdating ? (
                <span className="flex gap-2 items-center">
                  <Loader className="mr-2 animate-spin" />
                  Updating..
                </span>
              ) : (
                "Update"
              )
            ) : isCreating ? (
              <span className="flex gap-2">
                <Loader className="mr-2 animate-spin items-center" />
                Creating..
              </span>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddOrganization;
