import React from "react";
import Transaction from "./Transaction";
import { useTransactions } from "@/hooks/useTransactions";
import Loading from "../StatusComponents/Loading";

// Example data matching the original script

export default function TransactionList({ walletId }) {
  const date = new Date();
  const {
    data: transactions,
    isLoading: transactionLoading,
    error: transactionError,
  } = useTransactions(date.getFullYear(), date.getMonth(), walletId);

  console.log("TRANSACTIONS: ", transactions);
  if (transactionLoading || transactionError) {
    return (
      <div className="flex h-56 items-center justify-center">
        <Loading textColor="text-black" />
      </div>
    );
  }

  if (transactions.length > 0)
    return (
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-bg-dark text-xl font-bold">รายการธุรกรรมล่าสุด</h2>
        <ul id="transaction-list-container">
          {transactions.map((transaction) => {
            if (transaction.status !== "PENDING")
              return <Transaction key={transaction.id} transaction={transaction} />;
          })}
        </ul>
      </div>
    );
}
