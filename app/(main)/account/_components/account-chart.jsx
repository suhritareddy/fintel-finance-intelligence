"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatAxisINR = (value) => {
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const rawDate = new Date(transaction.date);
      const key = format(rawDate, "yyyy-MM-dd");
      const label = format(rawDate, "MMM dd");

      if (!acc[key]) {
        acc[key] = { date: label, sortKey: key, income: 0, expense: 0 };
      }

      if (transaction.type === "INCOME") {
        acc[key].income += transaction.amount;
      } else if (transaction.type === "EXPENSE") {
        acc[key].expense += transaction.amount;
      }

      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.sortKey) - new Date(b.sortKey)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(
    () =>
      filteredData.reduce(
        (acc, day) => ({
          income: acc.income + day.income,
          expense: acc.expense + day.expense,
        }),
        { income: 0, expense: 0 }
      ),
    [filteredData]
  );

  return (
    <Card className="relative overflow-hidden
      bg-white/80 dark:bg-slate-800/60
      backdrop-blur-xl
      border border-emerald-200/40 dark:border-slate-700/50
      shadow-md transition-all duration-300"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-xl md:text-2xl font-semibold tracking-tight 
  text-slate-900 dark:text-white flex items-center gap-3">

  <span className="h-6 w-1.5 rounded-full bg-emerald-500/80" />

  Transaction Overview
</CardTitle>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] bg-emerald-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-emerald-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {/* TOTALS */}
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400">Total Income</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatINR(totals.income)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400">Total Expenses</p>
            <p className="text-lg font-bold text-red-500 dark:text-red-400">
              {formatINR(totals.expense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400">Net</p>
            <p className={`text-lg font-bold ${
              totals.income - totals.expense >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
            }`}>
              {formatINR(totals.income - totals.expense)}
            </p>
          </div>
        </div>

        {/* CHART */}
        <div style={{ width: "100%", height: 320 }}>
          {filteredData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
              No transactions in this range
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <LineChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#166534" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                  <linearGradient id="expenseLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#991b1b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8" }}
                />

                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatAxisINR}
                  width={55}
                  tick={{ fill: "#94a3b8" }}
                />

                <Tooltip
                  formatter={(value, name) => [formatINR(value), name]}
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ color: "#334155", fontWeight: 500 }}
                  itemStyle={{ color: "#334155" }}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="url(#incomeLineGradient)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6, fill: "#059669" }}
                  animationEasing="ease-in-out"
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="url(#expenseLineGradient)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#ef4444" }}
                  activeDot={{ r: 6, fill: "#dc2626" }}
                  animationEasing="ease-in-out"
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>

      {/* SUBTLE GLOW */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-emerald-200/10 to-transparent dark:from-slate-700/20 pointer-events-none" />
    </Card>
  );
}