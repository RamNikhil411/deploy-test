import {
  resetPasswordAPI,
  verifyResentLinkAPI,
} from "@/components/https/services/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchParams } from "@/lib/interfaces/contacts";
import { ResetPasswordPayload } from "@/lib/interfaces/login";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff, Loader, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function VerifyPassword() {
  const navigate = useNavigate();
  const searchParams: SearchParams = useSearch({ strict: false });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expiredLink, setExpiredLink] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [error, setError] = useState({
    new_password: "",
    confirm_password: "",
  });
  const code = searchParams.code as string;
  const { mutate: verifyLink, isPending: verifying } = useMutation({
    mutationKey: ["verifyResetLink "],
    mutationFn: async () => {
      const response = await verifyResentLinkAPI({ code });
      return response;
    },
    onSuccess: () => {},
    onError: (error: any) => {
      if (error.status === 400) setExpiredLink(true);
      else if (error.status === 404) setInvalidLink(true);
    },
  });

  const { mutate: resetPassword, isPending: resetPending } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await resetPasswordAPI(payload);
      return response;
    },
    onSuccess: () => {
      navigate({ to: "/signin" });
    },
    onError: (error: any) => {
      setError(error?.data?.err_data);
    },
  });

  useEffect(() => {
    if (code) verifyLink();
  }, [code]);
  const isLinkValid = !expiredLink && !invalidLink;

  const handleSubmit = () => {
    resetPassword({
      code,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
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
          <CardContent className="flex flex-col  gap-y-2 h-full">
            {verifying ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-col justify-center items-center text-yellow-500 text-lg font-semibold">
                  <Loader2 className="animate-spin h-20 w-20" />
                  Verifying...
                </div>
              </div>
            ) : expiredLink ? (
              "Link got expired"
            ) : invalidLink ? (
              "Invalid Reset Link"
            ) : (
              <>
                <div className="space-y-2 flex flex-col justify-center items-center">
                  <div className="text-white text-smd font-normal tracking-wide">
                    Forgot Password
                  </div>
                  <div className="text-white text-xs font-light tracking-wide text-center">
                    No Worries! Enter the email you used to create your account,
                    and we will send instructions to reset your password.
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-xs font-light tracking-wide">
                    New Password
                  </Label>
                  <div id="password" className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      className={` ${showPassword ? "font-light" : "font-bold"} md:text-base placeholder:font-light placeholder:text-sm focus-visible:ring-0 text-white placeholder:text-white`}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                      {showPassword ? (
                        <Eye
                          className="w-4 h-4 text-white "
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <EyeOff
                          className="w-4 h-4 text-white "
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowPassword(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {error?.new_password && (
                    <div className="text-red-500 text-xs">
                      {error.new_password}
                    </div>
                  )}

                  <Label className="text-white text-xs font-light tracking-wide">
                    Confirm Your New Password
                  </Label>
                  <div id="confirm-password" className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={` ${showConfirmPassword ? "font-light" : "font-bold"} md:text-base placeholder:font-light placeholder:text-sm focus-visible:ring-0 text-white placeholder:text-white`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                      {showConfirmPassword ? (
                        <Eye
                          className="w-4 h-4 text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowConfirmPassword(false);
                          }}
                        />
                      ) : (
                        <EyeOff
                          className="w-4 h-4 text-white "
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowConfirmPassword(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {error?.confirm_password && (
                    <div className="text-red-500 text-xs">
                      {error.confirm_password}
                    </div>
                  )}
                </div>{" "}
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col justify-center items-center gap-y-2">
            {isLinkValid && !verifying && (
              <Button className="w-full font-light" onClick={handleSubmit}>
                {resetPending ? (
                  <span className="flex items-center">
                    <Loader className="mr-2" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            )}

            <Button
              className="w-full text-white hover:text-white hover:bg-transparent font-extralight"
              variant="ghost"
              onClick={() => navigate({ to: "/signin", replace: true })}
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
