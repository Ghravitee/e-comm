/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { getCartFromBackend, saveCartToBackend } from "../api/cartApi";
import { supabase } from "../../../services/supabase/client";

export const useCartPersistence = () => {
  const items = useCartStore((s) => s.items);
  const setItems = useCartStore((s) => s.setItems);

  const [user, setUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  // Get user
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoaded(false); // Reset when user changes
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load cart once when user is available
  useEffect(() => {
    if (!user || loaded) return;

    getCartFromBackend(user.id)
      .then((backendItems) => {
        if (backendItems.length > 0) {
          setItems(backendItems);
        }
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load cart:", err);
        setLoaded(true);
      });
  }, [user, loaded, setItems]);

  // Save cart when it changes (only after loaded)
  useEffect(() => {
    if (!user || !loaded) return;

    const timer = setTimeout(() => {
      saveCartToBackend(user.id, items);
    }, 500);

    return () => clearTimeout(timer);
  }, [items, user, loaded]);
};
