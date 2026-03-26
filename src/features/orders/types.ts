// features/orders/types/index.ts
export type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "cash_on_delivery" | "bank_transfer" | "card";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Address {
  full_name: string;
  phone: string;
  email?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
}

export interface SavedAddress extends Address {
  id: string;
  user_id: string;
  is_default: boolean;
  address_type: "shipping" | "billing" | "both";
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;

  shipping_address: Address;
  billing_address?: Address;

  subtotal: number;
  shipping_fee: number;
  tax: number;
  discount: number;
  total: number;

  notes?: string;
  tracking_number?: string;
  estimated_delivery?: string;

  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Type for creating a new order - excludes fields that are auto-generated
export type CreateOrderData = Omit<
  Order,
  | "id"
  | "user_id"
  | "order_number"
  | "status"
  | "payment_status"
  | "created_at"
  | "updated_at"
> & {
  shipping_address: Address & { email: string }; // Require email in shipping address
};

// Type for creating order items
export type CreateOrderItemData = Omit<
  OrderItem,
  "id" | "order_id" | "created_at"
>;
