import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOCAL_API = process.env.NEXT_PUBLIC_LOCAL_API_URL;

const generateInitialMockTransactions = () => {
  const transactions = [];
  const now = Date.now();
  for (let i = 0; i < 50; i++) {
    const date = new Date(now - i * 3 * 86400000); // ย้อนหลังไป 3 วันต่อ 1 รายการ
    const newTransaction = {
      id: `TX${date.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
      type: i % 3 === 0 ? "received" : "sent",
      name: i % 3 === 0 ? `เงินเข้า ${i}` : `จ่ายออก ${i}`,
      amount: parseFloat((Math.random() * 2000 + 50).toFixed(2)),
      timestamp: date.getTime(),
      from: i % 2 === 0 ? "บริษัท A" : "เพื่อน B",
      to: i % 2 === 0 ? "คุณ" : "ร้านค้า C",
    };
    transactions.push(newTransaction);
  }
  return transactions;
};

let currentMockTransactions = generateInitialMockTransactions();

const fetchMockTransactions = async (year, month, walletId) => {
  // const userId = "U5d2998909721fdea596f8e9e91e7bf85";
  const response = await axios.get(`${API_URL}/transaction/${walletId}?year=${year}&month=${month}`);
  return response.data;
  // console.log(`[MOCK] Fetching transactions for ${year}-${month + 1}`);
  // await new Promise((resolve) => setTimeout(resolve, 100));
  // const filtered = generateInitialMockTransactions().filter((transaction) => {
  //   const txDate = new Date(transaction.timestamp);
  //   return txDate.getFullYear() === year && txDate.getMonth() === month;
  // });
  // console.log("Filtered: ", filtered);
  // return filtered.sort((a, b) => b.timestamp - a.timestamp);
};

export function useTransactions(year, month, walletId) {
  return useQuery({
    queryKey: ["transactions", year, month, walletId],
    queryFn: () => fetchMockTransactions(year, month, walletId),
  });
}

export const mockUtils = {
  addTransaction: (transaction, queryClient) => {
    currentMockTransactions.push(transaction);
    const date = new Date(transaction.timestamp);
    queryClient.invalidateQueries({ queryKey: ["transactions", date.getFullYear(), date.getMonth()] });
    console.log("[MOCK UTIL] Added transaction:", transaction.name);
  },

  resetTransactions: (queryClient) => {
    currentMockTransactions = generateInitialMockTransactions();
    queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Invalidate all transaction queries
    console.log("[MOCK UTIL] Reset all transactions.");
  },

  setAllTransactions: (newTransactions, queryClient) => {
    currentMockTransactions = newTransactions;
    queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Invalidate all transaction queries
    console.log("[MOCK UTIL] Set all transactions to custom data.");
  },

  getTransactions: () => {
    return [...currentMockTransactions]; // Return a copy
  },
};
