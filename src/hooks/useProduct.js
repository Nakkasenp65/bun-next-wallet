import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";

export const useGetProducts = (mode, minPrice, maxPrice) => {
  return useQuery({
    queryKey: ["products", mode, minPrice, maxPrice],
    queryFn: async () => {
      console.log(mode, minPrice, maxPrice);
      const { data } = await axios.get("/product", {
        params: {
          mode,
          minPrice,
          maxPrice,
        },
      });
      return data;
    },
    staleTime: 60 * 1000 * 60,
  });
};

export const useGetWelcomeProduct = (maxPrice) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const topPerBrand = false;
      const { data } = await axios.get("/product", {
        params: {
          max: maxPrice,
        },
      });
      return data;
    },
    staleTime: 60 * 1000 * 60,
    enabled: !!maxPrice,
  });
};
