"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";

/**
 * Hook to check if the current user has Pro status.
 * Reads from the Convex database (isPro field on users table).
 * Falls back to false while loading or if unauthenticated.
 */
export function usePro() {
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );

  const upgradeToPro = useMutation(api.users.upgradeToPro);
  const downgradeFromPro = useMutation(api.users.downgradeFromPro);

  const hasPro = currentUser?.isPro === true;
  const isLoading = isAuthenticated && currentUser === undefined;

  return {
    hasPro,
    isLoading,
    upgradeToPro,
    downgradeFromPro,
  };
}
