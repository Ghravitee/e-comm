/* eslint-disable @typescript-eslint/no-explicit-any */
// features/orders/store/useOrderStore.ts
import { create } from "zustand";
import type {
  OrderWithItems,
  SavedAddress,
  CreateOrderData,
  CreateOrderItemData,
} from "../types";
import {
  getUserOrders,
  getAllOrders, // Add this import
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrderStatusAdmin, // Add this import
  getSavedAddresses,
  saveAddress,
  updateAddress,
  deleteAddress,
} from "../api/ordersApi";
import { sendOrderStatusSMS } from "../api/smsApi";

interface OrderState {
  orders: OrderWithItems[];
  currentOrder: OrderWithItems | null;
  savedAddresses: SavedAddress[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;

  // Actions
  loadOrders: (userId: string, isAdmin?: boolean) => Promise<void>; // Add isAdmin param
  loadOrder: (orderId: string, userId: string) => Promise<void>;
  placeOrder: (
    userId: string,
    orderData: CreateOrderData,
    items: CreateOrderItemData[],
  ) => Promise<OrderWithItems>;
  updateOrderStatus: (
    orderId: string,
    userId: string,
    status: any,
    isAdmin?: boolean, // Add isAdmin param
  ) => Promise<void>;

  loadAddresses: (userId: string) => Promise<void>;
  addAddress: (
    userId: string,
    address: Omit<SavedAddress, "id" | "user_id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  updateAddress: (
    addressId: string,
    userId: string,
    updates: Partial<SavedAddress>,
  ) => Promise<void>;
  removeAddress: (addressId: string, userId: string) => Promise<void>;

  clearOrders: () => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  savedAddresses: [],
  isLoading: false,
  error: null,
  hasLoaded: false,

  // Updated to handle both user and admin orders
  loadOrders: async (userId: string, isAdmin: boolean = false) => {
    if (get().hasLoaded) return;

    set({ isLoading: true, error: null });
    try {
      let orders;
      if (isAdmin) {
        // Admin sees ALL orders
        orders = await getAllOrders();
      } else {
        // Regular user sees only their orders
        orders = await getUserOrders(userId);
      }
      set({ orders, isLoading: false, hasLoaded: true });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadOrder: async (orderId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await getOrderById(orderId, userId);
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  placeOrder: async (
    userId: string,
    orderData: CreateOrderData,
    items: CreateOrderItemData[],
  ) => {
    set({ isLoading: true, error: null });
    try {
      const order = await createOrder(userId, orderData, items);
      set((state) => ({
        orders: [order, ...state.orders],
        currentOrder: order,
        isLoading: false,
      }));
      return order;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Updated to handle both user and admin status updates
  updateOrderStatus: async (
    orderId: string,
    userId: string,
    status: any,
    isAdmin: boolean = false,
  ) => {
    try {
      if (isAdmin) {
        await updateOrderStatusAdmin(orderId, status);
      } else {
        await updateOrderStatus(orderId, userId, status);
      }

      // Update local state
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
        currentOrder:
          state.currentOrder?.id === orderId
            ? { ...state.currentOrder, status }
            : state.currentOrder,
      }));

      // Get the order to send SMS
      const order = get().orders.find((o) => o.id === orderId);
      if (order && order.shipping_address.phone) {
        await sendOrderStatusSMS({
          to: order.shipping_address.phone,
          orderNumber: order.order_number,
          status: status,
          customerName: order.shipping_address.full_name,
        });
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      throw error;
    }
  },

  loadAddresses: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const addresses = await getSavedAddresses(userId);
      set({ savedAddresses: addresses, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addAddress: async (
    userId: string,
    address: Omit<SavedAddress, "id" | "user_id" | "created_at" | "updated_at">,
  ) => {
    try {
      const newAddress = await saveAddress(userId, address);
      set((state) => ({
        savedAddresses: [newAddress, ...state.savedAddresses],
      }));
    } catch (error) {
      console.error("Failed to add address:", error);
      throw error;
    }
  },

  updateAddress: async (
    addressId: string,
    userId: string,
    updates: Partial<SavedAddress>,
  ) => {
    try {
      await updateAddress(addressId, userId, updates);
      set((state) => ({
        savedAddresses: state.savedAddresses.map((addr) =>
          addr.id === addressId ? { ...addr, ...updates } : addr,
        ),
      }));
    } catch (error) {
      console.error("Failed to update address:", error);
      throw error;
    }
  },

  removeAddress: async (addressId: string, userId: string) => {
    try {
      await deleteAddress(addressId, userId);
      set((state) => ({
        savedAddresses: state.savedAddresses.filter(
          (addr) => addr.id !== addressId,
        ),
      }));
    } catch (error) {
      console.error("Failed to delete address:", error);
      throw error;
    }
  },

  clearOrders: () => {
    set({ orders: [], savedAddresses: [], hasLoaded: false });
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));
