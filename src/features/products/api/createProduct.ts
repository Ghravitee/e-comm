// features/products/api/createProduct.ts
import { supabase } from "../../../services/supabase/client";
import type { Product } from "../types";

export type CreateProductInput = Omit<
  Product,
  "id" | "created_at" | "updated_at"
>;

export const createProduct = async (
  productData: CreateProductInput,
): Promise<Product> => {
  console.log("createProduct API called with:", productData);

  try {
    // Get current session to verify authentication
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("Current session:", sessionData.session?.user?.email);

    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error in createProduct:", error);
      throw error;
    }

    console.log("Supabase response in createProduct:", data);
    return data as Product;
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
};
