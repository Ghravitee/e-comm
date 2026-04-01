/* eslint-disable @typescript-eslint/no-explicit-any */
// features/products/api/createProduct.ts
import { supabase } from "../../../services/supabase/client";
import type { Product } from "../types";

export type CreateProductInput = Omit<
  Product,
  "id" | "created_at" | "updated_at"
>;

// Development-only logger
const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

const devError = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
};

export const createProduct = async (
  productData: CreateProductInput,
): Promise<Product> => {
  devLog("createProduct API called with:", productData);

  try {
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (error) {
      devError("Supabase error in createProduct:", error);
      throw error;
    }

    devLog("Supabase response in createProduct:", data);
    return data as Product;
  } catch (error) {
    devError("Error in createProduct:", error);
    throw error;
  }
};
