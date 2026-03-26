/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase/client";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (!mounted) return;
        setUser(data.user ?? null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile: null, isAdmin: undefined, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
