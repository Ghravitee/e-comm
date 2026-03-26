import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];

  setItems: (items: CartItem[]) => void;

  addItem: (item: CartItem) => void;

  removeItem: (id: string) => void;

  clearCart: () => void;

  increaseQty: (id: string) => void;

  decreaseQty: (id: string) => void;

  total: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        // Only update if quantity actually changes
        const newQuantity = existing.quantity + item.quantity;
        if (newQuantity === existing.quantity) return state;

        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i,
          ),
        };
      }

      return { items: [...state.items, item] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ items: [] }),

  increaseQty: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      // Only update if quantity is less than max
      if (item.quantity >= 99) return state;

      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    }),

  decreaseQty: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      // Only update if quantity is greater than 1
      if (item.quantity <= 1) {
        // Remove item if quantity would become 0
        return {
          items: state.items.filter((i) => i.id !== id),
        };
      }

      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        ),
      };
    }),

  total: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
