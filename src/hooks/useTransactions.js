import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

async function fetchTransactions(year, month, walletId) {
  const response = await axios.get(`/transaction/${walletId}?year=${year}&month=${month}`);
  return response.data;
}

async function fetchSuccessTransactions(year, month, walletId) {
  const response = await axios.get(`/transaction/success/${walletId}?year=${year}&month=${month}`);
  return response.data;
}

export function useTransactions(year, month, walletId) {
  return useQuery({
    queryKey: ["transactions", year, month, walletId],
    queryFn: () => fetchTransactions(year, month, walletId),
  });
}

export function useSuccessTransactions(year, month, walletId) {
  return useQuery({
    queryKey: ["successTransactions", year, month, walletId],
    queryFn: () => fetchSuccessTransactions(year, month, walletId),
    enabled: !!walletId,
  });
}
