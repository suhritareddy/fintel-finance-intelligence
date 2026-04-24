import { notFound } from "next/navigation";
import { getAccountWithTransaction } from "@/actions/accounts";
import { Card, CardContent } from "@/components/ui/card";
import React, { Suspense } from "react";
import TransactionTable from "../_components/transaction-table";
import { BarLoader } from "react-spinners";


const AccountPage = async ({ params }) => {
  const { id } = await params;

  const accountData = await getAccountWithTransaction(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;
  const { name, type, balance, _count } = account;

  return (
    <div className="px-5 max-w-7xl mx-auto mt-8 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          {name}
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {type.charAt(0) + type.slice(1).toLowerCase()} Account
        </p>
      </div>

      {/* BALANCE CARD */}
      <Card
        className="relative overflow-hidden
        bg-white/80 dark:bg-slate-800/60
        backdrop-blur-xl
        border border-emerald-200/40 dark:border-slate-700/50
        shadow-md hover:shadow-xl 
        transition-all duration-300"
      >
        <CardContent className="p-6 flex items-center justify-between">

          {/* BALANCE */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Current Balance
            </p>

            <h2 className="text-3xl md:text-4xl font-bold 
            text-slate-900 dark:text-white mt-1">
              ₹{new Intl.NumberFormat("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(balance)}
            </h2>
          </div>

          {/* TRANSACTION COUNT */}
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Transactions
            </p>

            <p className="text-2xl font-semibold 
            text-emerald-600 dark:text-emerald-400 mt-1">
              {_count.transactions}
            </p>
          </div>

        </CardContent>

        {/* subtle glow overlay */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300
          bg-linear-to-br from-emerald-200/20 to-transparent
          dark:from-slate-700/30 pointer-events-none"
        />
      </Card>
      {/* Chart */}

      {/* Transaction table */}
      <Suspense fallback={<BarLoader color="#10B981" className="mt-4 w-full" />}>
        <div className="
  rounded-2xl
  bg-emerald-50/80 dark:bg-slate-800/60
  backdrop-blur-xl
  border border-emerald-200/40 dark:border-slate-700/50
  shadow-md 
  p-6 md:p-9
">
          <TransactionTable transactions={transactions} />
        </div>

      </Suspense>

    </div>
  );
};

export default AccountPage;