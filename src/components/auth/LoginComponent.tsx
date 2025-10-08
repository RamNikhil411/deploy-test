import {
  errorData,
  LoginEmailAPIPayload,
  LoginViaOtpAPIPayload,
  VerifyOtpAPIPayload,
} from "@/lib/interfaces/login";
import { ResponseData } from "@/lib/types";
import { updateUserDetails } from "@/store/userDetails";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Cookies from "js-cookie";
import { EditIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AppToast } from "../core/customToast";
import {
  signInWithEmailAPI,
  signInWithPhoneAPI,
  verifyOtpAPI,
} from "../https/services/auth";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [LoginViaOTP, setLoginViaOTP] = useState(false);
  const [otpScreen, setOtpScreen] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      phone_number: "",
      otp: "",
    },
    onSubmit: ({ value }) => {
      if (otpScreen) {
        return verifyOTP({ phone_number: value.phone_number, otp: value.otp });
      }
      if (LoginViaOTP) {
        return sendOTP({ phone_number: value.phone_number });
      }
      return signInWithEmail({
        email: value.email,
        password: value.password,
      });
    },
  });

  const { mutate: signInWithEmail, isPending: isSignUpLoading } = useMutation({
    mutationKey: ["signInWithEmail"],
    mutationFn: async (payload: LoginEmailAPIPayload) => {
      const response = await signInWithEmailAPI(payload);
      return response.data;
    },
    onSuccess: (response: any) => {
      const { data } = response;
      handleSuccess(data);
      AppToast.success({ message: response?.message });
    },
    onError: (error: errorData) => {
      if (error?.data?.status_code === 422) {
        form.setErrorMap({
          onSubmit: {
            form: error?.data?.message,
            fields: {
              email: error?.data?.err_data?.email,
              password: error?.data?.err_data?.password,
            },
          },
        });
      } else {
        AppToast.error({ message: error?.data?.message });
      }
    },
  });

  const { mutate: sendOTP, isPending: isSendOtpLoading } = useMutation({
    mutationKey: ["sendOTP"],
    mutationFn: async (payload: LoginViaOtpAPIPayload) => {
      const response = await signInWithPhoneAPI(payload);
      return response;
    },

    onSuccess: (response) => {
      setOtpScreen(true);
      setTimer(30);
      AppToast.success({ message: response?.data?.message });
    },
    onError: (error: errorData) => {
      if (error?.data?.status_code === 422) {
        form.setErrorMap({
          onSubmit: {
            form: error?.data?.message,
            fields: {
              phone_number: error?.data?.err_data?.phone_number,
            },
          },
        });
      } else {
        AppToast.error({ message: error?.data?.message });
      }
    },
  });

  const { mutate: verifyOTP, isPending: isVerifyOtpLoading } = useMutation({
    mutationKey: ["verifyOTP"],
    mutationFn: async (payload: VerifyOtpAPIPayload) => {
      const response = await verifyOtpAPI(payload);
      return response.data;
    },

    onSuccess: (response: any) => {
      handleSuccess(response?.data);
      AppToast.success({ message: response?.message });
    },
    onError: (error: any) => {
      console.log(error?.data?.status_code, "error");

      if (error?.data?.status_code === 422) {
        form.setErrorMap({
          onSubmit: {
            form: error?.data?.message,
            fields: {
              otp: error?.data?.err_data?.otp,
            },
          },
        });
      } else {
        AppToast.error({ message: error?.data?.message });
      }
    },
  });

  const handleSuccess = (response: ResponseData) => {
    const { access_token, refresh_token, ...rest } = response;
    Cookies.set("token", access_token);
    Cookies.set("refresh_token", refresh_token);
    updateUserDetails({ user: rest });
    if (rest?.is_super_admin === true) {
      navigate({ to: "/regions", replace: true });
    } else {
      navigate({ to: "/contacts", replace: true });
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit();
    }
  };
  const handleResendOtp = () => {
    sendOTP({ phone_number: form.getFieldValue("phone_number") });
    setTimer(30);
    setCanResend(false);
  };
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="bg-[url(/animations/login-bg.jpg)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center h-screen">
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="w-[400px] relative z-10" onKeyDown={handleKeyDown}>
        <Card className="bg-white/20 backdrop-blur-md border border-white/80 px-8 shadow-xl">
          <CardHeader className="flex flex-col justify-center items-center gap-y-0">
            <div className="text-white text-3xl font-normal tracking-wide">
              Digital
            </div>
            <div className="text-white text-lg font-normal tracking-wide">
              Landcare
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center text-white">
            <div className="text-base  ">
              {otpScreen ? "Verify OTP" : "Sign in"}
            </div>
            <p className="font-extralight text-smd tracking-wider flex items-center gap-2">
              {otpScreen
                ? `Enter the OTP sent to  ${form.getFieldValue("phone_number")} `
                : "Sign in to access your account"}
              {otpScreen ? (
                <button
                  onClick={() => {
                    setOtpScreen(false);
                    form.setFieldValue("otp", "");
                  }}
                  className="cursor-pointer"
                >
                  <EditIcon className="w-3 h-3" />
                </button>
              ) : null}
            </p>
          </CardContent>

          {LoginViaOTP && !otpScreen ? (
            <div className="">
              <form.Field name="phone_number">
                {(field) => {
                  return (
                    <div className="text-white">
                      <Label
                        htmlFor="phone"
                        className="mb-2 font-light text-smd tracking-wider"
                      >
                        Mobile Number
                      </Label>
                      <Input
                        placeholder="Enter  number"
                        className="placeholder:text-white font-light  placeholder:font-light placeholder:tracking-wide"
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
                        maxLength={
                          field.state.value.startsWith("+61") ? 12 : 10
                        }
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span className="text-red-500 font-medium text-xs">
                          {field.state.meta.errors[0]}
                        </span>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>
          ) : otpScreen && LoginViaOTP ? (
            <form.Field name="otp">
              {(field) => {
                return (
                  <div className="items-center text-center space-y-2">
                    <InputOTP
                      maxLength={4}
                      containerClassName="justify-center "
                      autoFocus
                      inputMode="numeric"
                      pattern={REGEXP_ONLY_DIGITS}
                      value={field.state.value}
                      onChange={(otp) => field.setValue(otp)}
                    >
                      <InputOTPGroup className="flex items-center gap-2 justify-center">
                        <InputOTPSlot
                          index={0}
                          className="text-white rounded-md border [&_.caret]:bg-white "
                        />

                        <InputOTPSlot
                          index={1}
                          className="text-white rounded-md border [&_.caret]:bg-white"
                        />

                        <InputOTPSlot
                          index={2}
                          className="text-white rounded-md border [&_.caret]:bg-white"
                        />

                        <InputOTPSlot
                          index={3}
                          className="text-white rounded-md border [&_.caret]:bg-white"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                    {field?.state?.meta?.errors?.[0] && (
                      <p className="text-red-500 px-1 text-xs mt-1 text-center">
                        {field?.state?.meta?.errors?.[0]}
                      </p>
                    )}
                    <Button
                      onClick={() => {
                        handleResendOtp();
                        form.handleSubmit;
                      }}
                      className={`w-fit bg-transparent text-white hover:bg-transparent shadow-none font-normal text-center ${
                        !canResend && "pointer-events-none"
                      }`}
                    >
                      {timer > 0
                        ? `Resend Code in ${timer}s`
                        : "Did not receive Code?"}
                    </Button>
                  </div>
                );
              }}
            </form.Field>
          ) : (
            <div className="space-y-4">
              <form.Field name="email">
                {(field) => {
                  return (
                    <div id="email" className="text-white">
                      <Label htmlFor="email" className="mb-2 font-normal">
                        Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="Enter email"
                        value={field.state.value.toLowerCase()}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          field.setValue(value);
                        }}
                        className="placeholder:text-white font-light md:text-base tracking-wider  placeholder:font-light "
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
              <form.Field name="password">
                {(field) => {
                  return (
                    <div className="text-white">
                      <Label
                        htmlFor="password"
                        className="mb-2 font-normal tracking-wider text-sm "
                      >
                        Password
                      </Label>
                      <div id="password" className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={field.state.value}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            field.setValue(value);
                          }}
                          className={`placeholder:text-white ${showPassword ? "font-light" : "font-bold"} tracking-wider md:text-base placeholder:font-light `}
                        />

                        <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                          {showPassword ? (
                            <Eye
                              className="w-4 h-4 text-white"
                              onClick={() => setShowPassword(false)}
                            />
                          ) : (
                            <EyeOff
                              className="w-4 h-4 text-white"
                              onClick={() => setShowPassword(true)}
                            />
                          )}
                        </div>
                      </div>
                      {field?.state?.meta?.errors?.[0] && (
                        <p className="text-red-500 px-1 text-xs mt-1">
                          {field?.state?.meta?.errors?.[0]}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
              {/* <div
                className="text-right text-sm text-white cursor-pointer"
                onClick={() => navigate({ to: "/forgot-password" })}
              >
                Forgot Password
              </div> */}
            </div>
          )}

          <CardFooter className="flex flex-col gap-y-2 px-0 mt-3">
            {LoginViaOTP ? (
              <>
                <form.Subscribe selector={(state) => state.canSubmit}>
                  {(canSubmit) => {
                    return (
                      <>
                        {otpScreen ? (
                          <Button
                            onClick={form.handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full tracking-widest font-normal disabled:pointer-events-auto disabled:cursor-not-allowed `}
                          >
                            {isVerifyOtpLoading ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              "Verify OTP"
                            )}
                          </Button>
                        ) : (
                          <Button
                            onClick={form.handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full tracking-widest font-normal disabled:pointer-events-auto disabled:cursor-not-allowed `}
                          >
                            {isSendOtpLoading ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              "Send OTP"
                            )}
                          </Button>
                        )}
                      </>
                    );
                  }}
                </form.Subscribe>
                <div className="text-white font-light text-center">or</div>
                <Button
                  onClick={() => {
                    setOtpScreen(false);
                    setLoginViaOTP(false);
                    form.reset();
                  }}
                  className="bg-transparent border font-normal border-white/40 text-white tracking-wide hover:bg-white/10 w-full h-fit py-2"
                >
                  Sign in With Password
                </Button>
              </>
            ) : (
              <>
                <form.Subscribe selector={(state) => state.canSubmit}>
                  {(canSubmit) => {
                    return (
                      <Button
                        onClick={form.handleSubmit}
                        disabled={!canSubmit}
                        className="w-full tracking-widest font-normal disabled:pointer-events-auto disabled:cursor-not-allowed"
                      >
                        {isSignUpLoading ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    );
                  }}
                </form.Subscribe>
                <div className="text-white font-light text-center">or</div>
                <Button
                  onClick={() => {
                    setLoginViaOTP(true);
                    form.reset();
                  }}
                  className="bg-transparent border font-normal border-white/40 text-white tracking-wide hover:bg-white/10 w-full h-fit py-2"
                >
                  Sign in With OTP
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginComponent;
