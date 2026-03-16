import { supabase } from "../../../services/supabase/client";
import { type Product } from "../types";

export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};
