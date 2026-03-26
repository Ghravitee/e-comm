// features/orders/api/ordersApi.ts
import { supabase } from "../../../services/supabase/client";
import type {
  Order,
  OrderWithItems,
  SavedAddress,
  CreateOrderData,
  CreateOrderItemData,
} from "../types";

// Existing function - for customers to get their own orders
export const getUserOrders = async (
  userId: string,
): Promise<OrderWithItems[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(*)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// NEW: For admins - get ALL orders
export const getAllOrders = async (): Promise<OrderWithItems[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Keep other functions as they are...
export const getOrderById = async (
  orderId: string,
  userId: string,
): Promise<OrderWithItems | null> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(*)
    `,
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
};

// For admin to get any order by ID (without user filter)
export const getOrderByIdAdmin = async (
  orderId: string,
): Promise<OrderWithItems | null> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(*)
    `,
    )
    .eq("id", orderId)
    .single();

  if (error) throw error;
  return data;
};

export const createOrder = async (
  userId: string,
  orderData: CreateOrderData,
  items: CreateOrderItemData[],
): Promise<OrderWithItems> => {
  const insertData = {
    user_id: userId,
    status: "pending" as const,
    payment_status: "pending" as const,
    ...orderData,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(insertData)
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({
    order_id: order.id,
    ...item,
  }));

  const { data: orderItemsData, error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)
    .select();

  if (itemsError) throw itemsError;

  return {
    ...order,
    items: orderItemsData || [],
  };
};

export const updateOrderStatus = async (
  orderId: string,
  userId: string,
  status: Order["status"],
): Promise<void> => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("user_id", userId);

  if (error) throw error;
};

// Admin version - update any order without user filter
export const updateOrderStatusAdmin = async (
  orderId: string,
  status: Order["status"],
): Promise<void> => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw error;
};

// Addresses API (same as before)
export const getSavedAddresses = async (
  userId: string,
): Promise<SavedAddress[]> => {
  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const saveAddress = async (
  userId: string,
  address: Omit<SavedAddress, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<SavedAddress> => {
  if (address.is_default) {
    await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", userId);
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .insert({ user_id: userId, ...address })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAddress = async (
  addressId: string,
  userId: string,
  updates: Partial<SavedAddress>,
): Promise<void> => {
  if (updates.is_default) {
    await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", userId);
  }

  const { error } = await supabase
    .from("user_addresses")
    .update(updates)
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) throw error;
};

export const deleteAddress = async (
  addressId: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("user_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) throw error;
};
