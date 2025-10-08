import { AppToast } from "@/components/core/customToast";
import { forgotPasswordAPI } from "@/components/https/services/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ForgotPasswordPayload } from "@/lib/interfaces/login";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useState } from "react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { mutate: forgotPassword, isPending } = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const response = await forgotPasswordAPI(payload);
      return response;
    },
    onSuccess: (response) => {
      setEmailError("");
      setEmail("");
      AppToast.success({ message: response?.data?.message });
      navigate({ to: "/signin" });
    },
    onError: (error: any) => {
      setEmailError(error?.data?.err_data?.email);
    },
  });
  const handleSendResetLink = () => {
    forgotPassword({ email });
  };
  return (
    <div className="bg-[url(/animations/login-bg.jpg)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center h-screen">
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="w-[400px] relative z-10">
        <Card className="bg-white/20 backdrop-blur-md border border-white/80 px-8 shadow-xl">
          <CardHeader className="flex flex-col justify-center items-center gap-y-0">
            <div className="text-white text-3xl font-normal tracking-wide">
              Digital
            </div>
            <div className="text-white text-lg font-normal tracking-wide">
              Landcare
            </div>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center gap-y-2">
            <div className="text-white text-smd font-normal tracking-wide">
              Forgot Password
            </div>
            <div className="text-white text-xs font-light tracking-wide text-center">
              No Worries! Enter the email you used to create your account, and
              we will send instructions to reset your password.
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full placeholder:text-white/80 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <div className="text-red-500 text-xs">{emailError}</div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col justify-center items-center gap-y-2">
            <Button
              className={`w-full font-light ${isPending && "pointer-events-none"}`}
              onClick={handleSendResetLink}
            >
              {" "}
              {isPending && <Loader className="w-5 h-5 animate-spin" />}
              Send Password Rest Email
            </Button>
            <Button
              className="w-full text-white hover:text-white hover:bg-transparent font-extralight"
              variant="ghost"
              onClick={() => navigate({ to: "/signin" })}
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
