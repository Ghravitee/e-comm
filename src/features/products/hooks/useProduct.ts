import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/getProductById";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};
