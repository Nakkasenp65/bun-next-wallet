import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Wallet } from "@/types/prisma";

export function useGetWallet(line_user_id: string | undefined) {
  return useQuery({
    queryKey: ["wallet", line_user_id],
    queryFn: async () => {
      const { data } = await axios.get<Wallet>(`/wallet/${line_user_id}`);
      return data;
    },
    staleTime: 1000 * 30,
    enabled: !!line_user_id,
  });
}
