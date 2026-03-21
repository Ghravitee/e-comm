/* eslint-disable @typescript-eslint/no-explicit-any */
// features/auth/context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../../services/supabase/client";

type AuthContextType = {
  user: any | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreUser = async () => {
      console.log("🔍 [Auth] Attempting to restore user session...");
      console.log("🔍 [Auth] Current URL:", window.location.href);

      try {
        // Log the current session first
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("📦 [Auth] Current session:", {
          hasSession: !!sessionData.session,
          sessionUser: sessionData.session?.user?.email,
          expiresAt: sessionData.session?.expires_at,
        });

        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("❌ [Auth] Error restoring user:", error.message);
          console.error("❌ [Auth] Error details:", error);
        }

        console.log("📦 [Auth] getUser response:", {
          user: data.user
            ? {
                id: data.user.id,
                email: data.user.email,
                role: data.user.role,
                aud: data.user.aud,
                lastSignIn: data.user.last_sign_in_at,
              }
            : null,
          error: error?.message,
        });

        if (!mounted) return;
        setUser(data.user ?? null);
        console.log(
          data.user
            ? "✅ [Auth] User restored successfully"
            : "ℹ️ [Auth] No active session found",
        );
      } catch (err) {
        console.error("💥 [Auth] Unexpected error in restoreUser:", err);
      } finally {
        setLoading(false);
        console.log("🔄 [Auth] Loading state set to false");
      }
    };

    restoreUser();

    console.log("👂 [Auth] Setting up auth state change listener");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 [Auth] Auth state changed:", {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });

      if (!mounted) {
        console.log("🚫 [Auth] Component unmounted, ignoring state change");
        return;
      }

      // Check if this is after OAuth redirect
      if (event === "SIGNED_IN" && window.location.hash) {
        console.log(
          "📍 [Auth] Signed in with hash in URL:",
          window.location.hash,
        );
      }

      setUser(session?.user ?? null);

      // Log specific events
      switch (event) {
        case "SIGNED_IN":
          console.log(
            "✅ [Auth] User signed in successfully:",
            session?.user?.email,
          );
          console.log(
            "📍 [Auth] Current URL after sign in:",
            window.location.href,
          );
          break;
        case "SIGNED_OUT":
          console.log("👋 [Auth] User signed out");
          break;
        case "TOKEN_REFRESHED":
          console.log("🔄 [Auth] Token refreshed");
          break;
        case "USER_UPDATED":
          console.log("📝 [Auth] User updated");
          break;
        default:
          console.log(`📌 [Auth] Unhandled event: ${event}`);
      }
    });

    return () => {
      console.log("🧹 [Auth] Cleaning up subscription");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Log whenever user state changes
  useEffect(() => {
    console.log("👤 [Auth] User state updated:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      loading,
      timestamp: new Date().toISOString(),
    });
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
