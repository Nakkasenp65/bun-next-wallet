import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

const fetchTransactions = async (year, month, walletId) => {
  const response = await axios.get(
    `${BACKEND_API}/transaction/${walletId}?year=${year}&month=${month}`,
  );
  return response.data;
};

const fetchSuccessTransactions = async (year, month, walletId) => {
  const response = await axios.get(
    `${BACKEND_API}/transaction/success/${walletId}?year=${year}&month=${month}`,
  );
  return response.data;
};

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
