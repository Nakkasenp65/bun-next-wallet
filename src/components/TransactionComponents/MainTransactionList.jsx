import React from "react";
import { GrTransaction } from "react-icons/gr";
import Transaction from "./Transaction";
import Loading from "../StatusComponents/Loading";
import { RiExternalLinkFill } from "react-icons/ri";
import FramerLink from "../Ui/FramerLink";

// Example data matching the original script

export default function MainTransactionList({ transactions }) {
  const date = new Date();

  if (!transactions) {
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
