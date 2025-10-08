import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AppToast } from "../core/customToast";
import {
  sendOtpToUserAPI,
  verifyUserOtpAPI,
} from "../https/services/join-organization";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

const Verify = () => {
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const email = Cookies.get("email");
  const organization_id = Cookies.get("organization_id");

  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    onSubmit: ({ value }) => {
      verifyOTP({
        email: email,
        otp: value.otp,
        organization_id: parseInt(organization_id),
      });
    },
  });

  const { mutate: sendOtp } = useMutation({
    mutationFn: async (payload: any) => {
      const response = await sendOtpToUserAPI(payload);
      return response;
    },
    onSuccess: (data) => {
      AppToast.success({ message: "OTP sent successfully" });
    },
  });

  const { mutate: verifyOTP, isPending: isVerifying } = useMutation({
    mutationFn: async (payload: any) => {
      const response = await verifyUserOtpAPI(payload);
      return response;
    },
    onSuccess: (data) => {
      const clearCookies = ["email", "organization_id", "user_id"];
      clearCookies.forEach((cookie) => {
        Cookies.remove(cookie, { path: "/" });
      });
      AppToast.success({ message: "OTP verified successfully" });
      setTimeout(() => {
        navigate({ to: `/` });
      }, 3000);
    },
    onError: (error: any) => {
      if (error?.data) {
        form.setErrorMap({
          onSubmit: {
            form: error?.data?.message,
            fields: {
              otp: error?.data?.message || error?.message,
            },
          },
        });
      }
    },
  });
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit();
    }
  };

  const handleResendOtp = () => {
    sendOtp({ email });
    setTimer(30);
    setCanResend(false);
  };

  useEffect(() => {
    if (email) {
      sendOtp({ email });
    }
  }, []);
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
            <div>
              <div className="text-base text-center    ">
                Verify your Email Address
              </div>
              <p className=" text-smd  text-center">
                Enter the 4-digit code sent to your email address
              </p>
            </div>
          </CardContent>
          <div>
            <form.Field name="otp">
              {(field) => {
                return (
                  <div className="text-center">
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
                          className="rounded-md border [&_.caret]:bg-black"
                        />

                        <InputOTPSlot
                          index={1}
                          className=" rounded-md border [&_.caret]:bg-black"
                        />

                        <InputOTPSlot
                          index={2}
                          className=" rounded-md border [&_.caret]:bg-black"
                        />

                        <InputOTPSlot
                          index={3}
                          className=" rounded-md border [&_.caret]:bg-black"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                    {field.state.meta.errors.length > 0 && (
                      <span className="text-red-500 text-xs text-center">
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </div>
                );
              }}
            </form.Field>
          </div>
          <CardFooter className="flex flex-col justify-center items-center gap-y-0">
            <Button
              onClick={form.handleSubmit}
              className="w-full tracking-widest font-normal"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>
            <Button
              onClick={() => {
                handleResendOtp();
                form.handleSubmit;
              }}
              className={`w-fit bg-transparent text-black hover:bg-transparent shadow-none font-normal ${
                !canResend && "pointer-events-none"
              }`}
            >
              {timer > 0 ? `Resend Code in ${timer}s` : "Did not receive Code?"}
            </Button>
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

export default Verify;
