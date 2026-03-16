import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../api/orders";
import { type CartItem } from "../../cart/store/useCartStore";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ({ userId, items }: { userId: string; items: CartItem[] }) =>
      createOrder(userId, items),
  });
};
