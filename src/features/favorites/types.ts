import { type Product } from "../products/types";
export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface FavoriteWithProduct extends Favorite {
  product: Product;
}
