import React from "react";
import Transaction from "./Transaction";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "../Ui/FramerLink";
import TransactionSkeleton from "../Ui/TransactionSkeleton";

export default function MainTransactionList({
  transactions,
  transactionLoading,
  transactionError,
}) {
  if (!transactions) {
    return (
      <div className="grid h-56 w-full grid-cols-1 items-center justify-center">
        {transactionLoading ? (
          <>
            <TransactionSkeleton />
            <TransactionSkeleton />
            <TransactionSkeleton />
            <TransactionSkeleton />
          </>
        ) : transactionError ? (
          <p className="p-8 text-center text-red-500">
            เกิดข้อผิดพลาดในการโหลดข้อมูล
          </p>
        ) : transactions && transactions.length > 0 ? (
          transactions.map((t) => <Transaction key={t.id} transaction={t} />)
        ) : (
          <p className="p-8 text-center text-gray-500">ไม่พบรายการในเดือนนี้</p>
        )}
      </div>
    );
  }

  if (transactions.length > 0)
    return (
      <div className="flex w-full flex-col gap-2">
        <header className="flex justify-between">
          <h2 className="text-bg-dark flex items-center gap-2 text-lg font-bold">
            <div className="h-6 w-1 rounded-full bg-yellow-500" />
            รายการล่าสุด
          </h2>

          <FramerLink
            link={"/history"}
            icon={<RiExternalLinkFill size={16} />}
            backgroundColor={"bg-amber-500"}
          >
            ดูทั้งหมด
          </FramerLink>
        </header>
        <ul id="transaction-list-container">
          {transactions.slice(0, 5).map((transaction) => {
            if (transaction.status !== "PENDING")
              return (
                <Transaction key={transaction.id} transaction={transaction} />
              );
          })}
        </ul>
      </div>
    );
}
