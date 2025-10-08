import { ResponseData, UserDetails } from "@/lib/types";
import { Store, useStore } from "@tanstack/react-store";

function loadUserDetails() {
  if (typeof window === "undefined") {
    return { user: null };
  }
  try {
    const userDetails = localStorage.getItem("userDetails");
    return userDetails ? JSON.parse(userDetails) : null;
  } catch (error) {
    return { user: null };
  }
}

const initialState: UserDetails = loadUserDetails();

export const userStore = new Store<UserDetails>(initialState);

export const updateUserDetails = (userDetails: UserDetails) => {
  userStore.setState((prevState) => ({
    ...prevState,
    ...userDetails,
  }));
  localStorage.setItem("userDetails", JSON.stringify(userStore.state));
};

export const getUserDetails = (): UserDetails => {
  return useStore(userStore, (state) => state);
};
