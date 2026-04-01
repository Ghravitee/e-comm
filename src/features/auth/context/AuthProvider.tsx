import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../services/supabase/client";
import { AuthContext } from "./AuthContext";
import type { User } from "@supabase/supabase-js";
import { devLog, devError } from "../../../shared/utils/logger";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Use a ref to track mounted state (more reliable)
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    let isSubscribed = true;

    const restoreUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        // Check if component is still mounted before updating state
        if (!isMountedRef.current || !isSubscribed) return;

        if (error) {
          devError("Error restoring user:", error);

          setUser(null);
        } else {
          setUser(data.user ?? null);
        }
      } catch (err) {
        if (!isMountedRef.current || !isSubscribed) return;
        devError("Exception restoring user:", err);

        setUser(null);
      } finally {
        // Only update loading if still mounted
        if (isMountedRef.current && isSubscribed) {
          setLoading(false);
        }
      }
    };

    // Start restoring user
    restoreUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Don't update if component unmounted or subscription cancelled
      if (!isMountedRef.current || !isSubscribed) return;

      devLog("Auth state changed:", event);
      setUser(session?.user ?? null);
    });

    // Cleanup function
    return () => {
      // Mark as unmounted
      isMountedRef.current = false;

      // Prevent any further state updates
      isSubscribed = false;

      // Unsubscribe from auth changes
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: null,
        isAdmin: undefined,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
