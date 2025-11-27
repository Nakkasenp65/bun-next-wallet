import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";

export type Product = {
  id: string;
  brand: string;
  model: string;
  capacity: string;
  color: string;
  downPaymentAmount: number;
  imageUrl: string;
  uniqueId: string;
};

export const useGetProducts = (
  mode: "affordable" | "upgrade" | "all",
  minPrice: number,
  maxPrice: number,
) => {
  return useQuery({
    queryKey: ["products", mode, minPrice, maxPrice],
    queryFn: async () => {
      console.log(mode, minPrice, maxPrice);
      const { data } = await axios.get<Product[]>("/product", {
        params: {
          mode,
          minPrice,
          maxPrice,
        },
      });

      return data;
    },
    staleTime: "static",
  });
};

export const useGetWelcomeProduct = (maxPrice: number) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get<Product[]>("/product", {
        params: {
          max: maxPrice,
        },
      });

      return data;
    },
    staleTime: "static",
    enabled: !!maxPrice,
  });
};
