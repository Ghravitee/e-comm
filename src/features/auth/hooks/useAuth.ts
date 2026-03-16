import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabase/client";
import { type User } from "@supabase/auth-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
};
