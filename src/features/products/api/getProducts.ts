import { supabase } from "../../../services/supabase/client";
import { type Product } from "../types";

export const getProducts = async (): Promise<Product[]> => {
  // Let Supabase infer the type, then cast the result
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return (data as Product[]) || [];
};
