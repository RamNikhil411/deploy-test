import { userStore } from "@/store/userDetails";
import { useStore } from "@tanstack/react-store";

export const useUserPermission = () => {
  const userDetails =
    typeof window !== "undefined"
      ? useStore(userStore, (state: any) => state?.user ?? null)
      : null;

  const isSuperAdmin = () => {
    return !!userDetails?.is_super_admin;
  };

  const isUser = () => {
    return !isSuperAdmin();
  };

  return { isSuperAdmin, isUser, userDetails };
};
