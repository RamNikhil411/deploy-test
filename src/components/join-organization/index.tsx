import { APIResponse } from "@/lib/types";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserById } from "../core/ContactQueries";
import { AppToast } from "../core/customToast";
import { updateUserDetailsAPI } from "../https/services/join-organization";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { passwordSchema } from "@/utils/constants/passWordSchema";
import PasswordFieldWithTooltip from "./passwordWithTooltip";

interface Formdata {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  password: string;
  id: number;
}

const JoinOrganization = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const userId = Cookies.get("user_id");
  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
    },
    onSubmit: ({ value }) => {
      const payload = { ...value, id: Number(userId), address: "" };
      updateUserDetails(payload);
    },
  });
  const { userById } = getUserById(userId);

  const { mutate: updateUserDetails } = useMutation<
    APIResponse,
    Error,
    Partial<Formdata>
  >({
    mutationKey: ["updateUserDetails"],
    mutationFn: async (payload: Formdata) => {
      const response: any = await updateUserDetailsAPI(payload);
      return response;
    },
    onSuccess: (data) => {
      navigate({ to: "/join-organization/verify" });
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
              password: error?.data?.err_data?.password,
            },
          },
        });
      } else {
        AppToast.error({ message: error?.data?.message });
      }

      console.log(form.getFieldInfo("password").instance?.state);
    },
  });
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit();
    }
  };
  useEffect(() => {
    if (userById) {
      form.setFieldValue("full_name", userById?.full_name);
      form.setFieldValue("email", userById?.email);
      form.setFieldValue("phone_number", userById?.phone_number);
      form.setFieldValue("address", userById?.address);
      form.setFieldValue("password", userById?.password);
    }
  }, [userById]);
  return (
    <div className="p-4 flex h-screen ">
      <div
        className="w-[36%] flex flex-col justify-center"
        onKeyDown={handleKeyDown}
      >
        <Card className="  shadow-none mx-auto gap-4 ">
          <CardHeader className="flex flex-col justify-center items-center gap-y-0">
            <div className="text-lime-600 text-3xl font-normal tracking-wide">
              Digital
            </div>
            <div className="text-lime-600 text-lg font-normal tracking-wide">
              Landcare
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center ">
            <div className="text-base  ">Join in Our Organization</div>
            <p className=" text-smd  text-center">
              You have been invited to join our conservation efforts. <br />{" "}
              Completed your registration to get started.
            </p>
          </CardContent>

          <div className="space-y-2">
            <form.Field name="full_name">
              {(field) => {
                return (
                  <div className="">
                    <Label htmlFor="name" className="mb-1 text-smd font-normal">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter name"
                      className=" font-light  focus-visible:ring-0 placeholder:text-sm"
                      value={
                        field.state.value.charAt(0).toUpperCase() +
                        field.state.value.slice(1)
                      }
                      onChange={(e) => {
                        field.setValue(e.target.value);
                      }}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className="text-red-500 text-xs">
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                return (
                  <div id="email" className="">
                    <Label htmlFor="email" className=" mb-2 font-normal">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      placeholder="Enter email"
                      value={field.state.value.toLowerCase()}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        field.setValue(value);
                      }}
                      readOnly
                      className=" font-light md:text-base  placeholder:font-light focus-visible:ring-0 placeholder:text-sm pointer-events-auto "
                    />
                    {field?.state?.meta?.errors?.[0] && (
                      <p className="text-red-500 px-1 text-xs mt-1">
                        {field?.state?.meta?.errors?.[0]}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const result = passwordSchema.safeParse(value);
                  if (!result.success) {
                    return result.error.errors[0].message;
                  }
                  return undefined;
                },
                onMount: ({ value }) => {
                  const result = passwordSchema.safeParse(value);
                  if (!result.success) {
                    return result.error.errors[0].message;
                  }
                  return undefined;
                },
              }}
            >
              {(field) => <PasswordFieldWithTooltip field={field} />}
            </form.Field>
            <form.Field name="phone_number">
              {(field) => {
                return (
                  <div className="">
                    <Label
                      htmlFor="phone"
                      className="mb-2 text-smd font-normal"
                    >
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter  number"
                      className=" font-light  placeholder:font-light placeholder:text-sm focus-visible:ring-0"
                      value={field.state.value}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.startsWith("+")) {
                          value = "+" + value.slice(1).replace(/[^0-9]/g, "");
                        } else {
                          value = value.replace(/[^0-9]/g, "");
                        }
                        field.handleChange(value);
                      }}
                      maxLength={field.state.value.startsWith("+61") ? 12 : 10}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className="text-red-500 text-xs">
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </div>
                );
              }}
            </form.Field>
            <form.Field name="address">
              {(field) => {
                return (
                  <div className="">
                    <Label
                      htmlFor="address"
                      className="mb-1 font-normal text-smd"
                    >
                      Address
                    </Label>

                    <Textarea
                      placeholder="Enter  address"
                      className=" font-light  placeholder:font-light placeholder:text-sm h-16 resize-none focus-visible:ring-0"
                      value={field.state.value}
                      onChange={(e) => {
                        field.setValue(e.target.value);
                      }}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className="text-red-500 text-xs">
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </div>
                );
              }}
            </form.Field>
          </div>

          <CardFooter className="flex flex-col gap-y-2 px-0">
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => {
                return (
                  <Button
                    disabled={!canSubmit}
                    onClick={() => {
                      form.handleSubmit();
                    }}
                    className="w-full tracking-widest font-normal"
                  >
                    Create Account
                  </Button>
                );
              }}
            </form.Subscribe>
          </CardFooter>
        </Card>
      </div>
      <div className="flex-1">
        <img
          src="/animations/CreateUser-bg.jpg"
          alt="Join Organization"
          className="h-full rounded-xl"
        />
      </div>
    </div>
  );
};

export default JoinOrganization;
