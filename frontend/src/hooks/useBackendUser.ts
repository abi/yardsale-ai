import { useEffect, useRef } from "react";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { UserResponse } from "../types";

export function useBackendUser() {
  const isInitRequestInProgress = useRef(false);
  const authenticatedFetch = useAuthenticatedFetch();

  // Get information from our backend about the user (subscription status)
  useEffect(() => {
    const init = async () => {
      // Make sure there's only one request in progress
      // so that we don't create multiple users
      if (isInitRequestInProgress.current) return;
      isInitRequestInProgress.current = true;

      const user: UserResponse = await authenticatedFetch(
        "/users/create",
        "POST"
      );

      console.log("User from backend", user);

      isInitRequestInProgress.current = false;
    };

    init();
  }, []);
}
