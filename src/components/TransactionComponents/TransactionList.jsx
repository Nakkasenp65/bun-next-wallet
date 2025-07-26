import React from "react";
import Transaction from "./Transaction";
import { useTransactions } from "@/hooks/useTransactions";
import Loading from "../Loading";

// Example data matching the original script

export default function TransactionList() {
  const { data: transactions, isLoading, error } = useTransactions(2025, 6);

  if (isLoading || error) {
    return (
      <div className="h-56 flex items-center justify-center">
        <Loading textColor="text-black" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h2 className="text-bg-dark text-xl font-bold">รายการธุรกรรมล่าสุด</h2>
      <ul id="transaction-list-container">
        {transactions.slice(0, 5).map((transaction) => {
          if (transaction.status !== "PENDING") return <Transaction key={transaction.id} transaction={transaction} />;
        })}
      </ul>
    </div>
  );
}
