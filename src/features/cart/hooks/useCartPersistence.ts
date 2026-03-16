/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { getCartFromBackend, saveCartToBackend } from "../api/cartApi";
import { supabase } from "../../../services/supabase/client";

export const useCartPersistence = () => {
  const items = useCartStore((s) => s.items);
  const setItems = useCartStore((s) => s.setItems);

  const [user, setUser] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);

  // -----------------------------
  // Get Supabase session
  // -----------------------------
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // -----------------------------
  // Load + merge cart once when user logs in
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    const loadCart = async () => {
      try {
        const backendItems = await getCartFromBackend(user.id);

        // Merge guest cart with backend cart
        const merged = [...backendItems];
        items.forEach((guestItem) => {
          const existing = merged.find((i) => i.id === guestItem.id);
          if (existing) {
            existing.quantity += guestItem.quantity;
          } else {
            merged.push(guestItem);
          }
        });

        setItems(merged);

        await saveCartToBackend(user.id, merged);

        setHydrated(true);
      } catch (error) {
        console.error("Cart merge failed:", error);
        setHydrated(true);
      }
    };

    loadCart();
  }, [user]); // ✅ only runs once per login

  // -----------------------------
  // Save cart to backend when items change
  // -----------------------------
  useEffect(() => {
    if (!user || !hydrated) return;
    saveCartToBackend(user.id, items).catch(console.error);
  }, [items, hydrated, user]);
};
