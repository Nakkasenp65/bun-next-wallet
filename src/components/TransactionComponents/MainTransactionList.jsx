import React from "react";
import Transaction from "./Transaction";
import TransactionSkeleton from "../Ui/TransactionSkeleton";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MainTransactionList({
  transactions,
  transactionLoading,
  transactionError,
}) {
  if (!transactions) {
    return (
      <div className="grid h-max w-full grid-cols-1 items-center justify-center">
        {transactionLoading ? (
          <>
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
        <Link href={"/history"} className={"flex w-full"}>
          <header className="flex w-full justify-between">
            <h2 className="text-bg-dark flex items-center gap-2 text-lg font-bold">
              <div className="h-10 w-1 rounded-full bg-yellow-500" />
              รายการล่าสุด
            </h2>
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 1000, damping: 20 }}
              className={`rounded-full bg-amber-500/5 p-3`}
            >
              <FaArrowRightLong className={`text-amber-500`} size={16} />
            </motion.div>
          </header>
        </Link>
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
