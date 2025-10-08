import { use, useEffect, useState } from "react";
import LoadingComponent from "../core/LoadingComponent";
import { useQuery } from "@tanstack/react-query";
import { getValidateUserDetailsAPI } from "../https/services/join-organization";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { AppToast } from "../core/customToast";
import { errorData } from "@/lib/interfaces/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ExpiredLinkIllustration from "../ui/icons/expiredIllustration";
import AlreadyJoinedIllustration from "../ui/icons/alreadyJoinedIllustration";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "../ui/button";

interface SearchParams {
  token: string;
}

export function OrganizationLoading() {
  const navigate = useNavigate();

  const searchParams: SearchParams = useSearch({ strict: false });
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (searchParams.token) {
      setToken(searchParams.token);
      navigate({ to: "/organization-loading" });
    }
  }, []);

  const {
    data: user,
    isError,
    error,
    isLoading,
  } = useQuery<any, errorData>({
    queryKey: ["user", token],
    queryFn: async () => {
      const response = await getValidateUserDetailsAPI({ token });
      const { user_id, email, organization_id } = response?.data?.data;
      Cookies.set("user_id", user_id);
      Cookies.set("email", email);
      Cookies.set("organization_id", organization_id);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,

    retry: false,
  });

  const isExpired = error?.data?.status_code === 400;
  const isAlreadyJoined = error?.data?.status_code === 409;

  useEffect(() => {
    if (isError) {
      return;
    }
    if (!user) return;

    if (user?.is_new_user && token) {
      navigate({ to: "/join-organization" });
    } else {
      navigate({ to: "/join-organization/verify" });
    }
  }, [user, isError, error, token, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen">
        <LoadingComponent />
      </div>
    );
  }

  if (isAlreadyJoined || isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 via-white to-lime-50 p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center space-y-6 pb-4">
              {/* SVG Illustration */}
              <div className="mx-auto w-48 h-48 transition-all duration-300 hover:scale-105">
                {isExpired && <ExpiredLinkIllustration />}
                {isAlreadyJoined && <AlreadyJoinedIllustration />}
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {isExpired && "Invitation Link Expired"}
                  {isAlreadyJoined && "Already a Member"}
                </CardTitle>

                <CardDescription className="text-base">
                  {isExpired &&
                    "This invitation link has expired and is no longer valid."}
                  {isAlreadyJoined &&
                    "You have already joined this organization."}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {isExpired && "Need a new invitation?"}
                      {isAlreadyJoined && "Access your organization"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isExpired &&
                        "Contact your organization administrator to request a new invitation link."}
                      {isAlreadyJoined &&
                        "You can access your organization by Signing in."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {isAlreadyJoined && (
                  <Button
                    className="w-full bg-lime-600 hover:bg-lime-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                    size="lg"
                  >
                    <Link to="/signin">Sign In</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a
                href="mailto:support@example.com"
                className="text-lime-600 hover:text-lime-700 font-medium underline"
              >
                Contact Support
              </a>
            </p>
          </div> */}
        </div>
      </div>
    );
  }
}
