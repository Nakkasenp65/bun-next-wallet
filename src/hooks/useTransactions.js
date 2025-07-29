import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOCAL_API = process.env.NEXT_PUBLIC_LOCAL_API_URL;

const fetchMockTransactions = async (year, month, walletId) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${walletId}?year=${year}&month=${month}`);
  return response.data;
};

export function useTransactions(year, month, walletId) {
  return useQuery({
    queryKey: ["transactions", year, month, walletId],
    queryFn: () => fetchMockTransactions(year, month, walletId),
  });
}
