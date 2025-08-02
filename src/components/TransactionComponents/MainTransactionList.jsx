import React from "react";
import { GrTransaction } from "react-icons/gr";
import Transaction from "./Transaction";
import { useSuccessTransactions, useTransactions } from "@/hooks/useTransactions";
import Loading from "../StatusComponents/Loading";
import Link from "next/link";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "../Ui/FramerLink";

// Example data matching the original script

export default function MainTransactionList({ walletId }) {
  const date = new Date();
  const {
    data: transactions,
    isLoading: transactionLoading,
    error: transactionError,
  } = useSuccessTransactions(date.getFullYear(), date.getMonth(), walletId);

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
        <header className="flex justify-between">
          <h2 className="text-bg-dark flex items-center gap-2 text-base font-semibold">
            <GrTransaction
              size={32}
              className="rounded-md bg-gray-100 p-1 text-amber-400 drop-shadow-sm drop-shadow-black/25"
            />
            รายการล่าสุด
          </h2>

          <FramerLink
            link={"/history"}
            icon={<RiExternalLinkFill size={24} />}
            backgroundColor={"bg-amber-500"}
          >
            ดูทั้งหมด
          </FramerLink>
        </header>
        <ul id="transaction-list-container">
          {transactions.map((transaction) => {
            if (transaction.status !== "PENDING")
              return <Transaction key={transaction.id} transaction={transaction} />;
          })}
        </ul>
      </div>
    );
}
