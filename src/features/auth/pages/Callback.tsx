// pages/auth/Callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabase/client";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          toast.error("Authentication failed. Please try again.");
          navigate("/signin");
          return;
        }

        if (data.session) {
          toast.success("Successfully signed in with Google!");
          setTimeout(() => navigate("/"), 500);
          return;
        }

        // Neither error nor session — URL visited directly or token expired
        toast.error("Session not found. Please sign in again.");
        navigate("/signin");
      } catch {
        toast.error("Something went wrong. Please try again.");
        navigate("/signin");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // Timeout fallback — if nothing resolves in 10 seconds, bail out
  useEffect(() => {
    const timeout = setTimeout(() => {
      toast.error("Sign in timed out. Please try again.");
      navigate("/signin");
    }, 10000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

// Added the missing else branch — if data.session is null and there's no error,
//  the user probably landed on /auth/callback directly with no OAuth params.
// Instead of spinning forever, they get redirected to /signin with a clear message
// Wrapped everything in try/catch for unexpected failures
// Added a 10 second timeout fallback as a second useEffect —
// if the callback hangs for any reason, the user is never stuck on a spinning screen forever
