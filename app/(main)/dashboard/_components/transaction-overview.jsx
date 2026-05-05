"use client";

import { useState } from "react";
import {
  PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const COLORS = [
  "#10b981", "#3b82f6", "#f59e0b",
  "#ef4444", "#8b5cf6", "#06b6d4", "#f97316",
];

/* ─── Custom Tooltip ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, totalExpenses }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  const color = payload[0].fill;
  const pct = totalExpenses ? Math.round((value / totalExpenses) * 100) : 0;
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "rounded-xl border border-slate-200 dark:border-slate-700/80",
        "bg-white dark:bg-slate-900",
        "shadow-lg shadow-slate-900/10 dark:shadow-black/30",
        "px-3.5 py-2.5 min-w-[148px]",
      )}
    >
      <span className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: color }} />
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 pl-1 capitalize" style={{ color }}>
        {name}
      </p>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 pl-1 tabular-nums">
        ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 ml-3">
          · {pct}%
        </span>
      </p>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = [...accountTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const d = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      d.getMonth() === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({ name: category, value: amount })
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">

      {/* ── RECENT TRANSACTIONS ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm p-5 flex flex-col">

        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
            Recent Transactions
          </h3>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[130px] h-8 text-xs bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-xl">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1">
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Wallet className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-400 dark:text-slate-500">No recent transactions</p>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0",
                      transaction.type === "EXPENSE"
                        ? "bg-red-50 dark:bg-red-900/20"
                        : "bg-emerald-50 dark:bg-emerald-900/20"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                    )}
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-none tracking-[-0.01em]">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-[11px] font-normal text-slate-400 dark:text-slate-500 capitalize tracking-wide">
                      {transaction.category} · {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums tracking-[-0.02em]",
                    transaction.type === "EXPENSE" ? "text-red-500" : "text-emerald-500"
                  )}
                >
                  {transaction.type === "EXPENSE" ? "−" : "+"}
                  ₹{transaction.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── PIE CHART ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm p-5 flex flex-col">

        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
            Monthly Expense Breakdown
          </h3>
          {totalExpenses > 0 && (
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
              ₹{totalExpenses.toLocaleString("en-IN", { maximumFractionDigits: 0 })} total
            </span>
          )}
        </div>

        {pieChartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10">
            <div className="h-16 w-16 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-700" />
            <p className="text-sm text-slate-400 dark:text-slate-500">No expenses this month</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 flex-1">

            {/* Donut */}
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={88}
                    innerRadius={54}
                    dataKey="value"
                    paddingAngle={3}
                    strokeWidth={0}
                    isAnimationActive={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                        style={{ outline: "none", cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip totalExpenses={totalExpenses} />}
                    wrapperStyle={{ outline: "none" }}
                    position={{ x: 0, y: 0 }}
                    allowEscapeViewBox={{ x: true, y: true }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend — dot · name · bar · amount */}
            <div className="w-full space-y-2 pb-1">
              {pieChartData.map((entry, index) => {
                const color = COLORS[index % COLORS.length];
                const pct = totalExpenses
                  ? Math.round((entry.value / totalExpenses) * 100)
                  : 0;
                return (
                  <div key={entry.name} className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 capitalize w-24 truncate">
                      {entry.name}
                    </span>
                    <div className="flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums text-slate-700 dark:text-slate-300 w-20 text-right">
                      ₹{entry.value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}