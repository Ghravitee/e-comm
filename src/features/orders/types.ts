export type OrderItem = {
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  created_at: string;
  items: OrderItem[];
};
