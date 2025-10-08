import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "@tanstack/react-router";
import { useUserPermission } from "@/lib/usePermission";
import AppLogo from "favicon.svg?url";

const Home = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, isUser } = useUserPermission();
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      if (isSuperAdmin()) {
        navigate({ to: "/regions", replace: true });
      } else if (isUser()) {
        navigate({ to: "/contacts", replace: true });
      }
    } else {
      navigate({ to: "/signin", replace: true });
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <img src={AppLogo} alt="" className="w-40 h-40" />
    </div>
  );
};

export default Home;
