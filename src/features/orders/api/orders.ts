import { supabase } from "../../../services/supabase/client";
import { type CartItem } from "../../cart/store/useCartStore";
import type { Order, OrderItem } from "../types";

export const createOrder = async (
  userId: string,
  items: CartItem[],
): Promise<Order> => {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{ user_id: userId, total }])
    .select()
    .single();

  if (orderError || !order)
    throw orderError ?? new Error("Failed to create order");

  const orderItems: OrderItem[] = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemsError) throw itemsError;

  return { ...order, items: orderItems };
};
