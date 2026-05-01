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
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  parseISO,
  eachDayOfInterval,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days",   days: 7   },
  "1M": { label: "Last Month",    days: 30  },
  "3M": { label: "Last 3 Months", days: 90  },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL:  { label: "All Time",      days: null },
};


const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatAxisINR = (value) => {
  const abs = Math.abs(value);
  if (abs >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
  if (abs >= 1_000)   return `₹${(value / 1_000).toFixed(0)}K`;
  return `₹${value}`;
};


const getTickInterval = (dataLength) =>
  Math.max(0, Math.floor(dataLength / 8));


const toLocalDate = (raw) => {
  if (typeof raw === "string") return parseISO(raw);
  if (raw instanceof Date)     return raw;
  return new Date(raw);
};


export function AccountChart({ transactions = [] }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    if (transactions.length === 0) return [];

    const range = DATE_RANGES[dateRange];
    const now   = new Date();

    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(
       
          transactions.reduce((earliest, t) => {
            const d = toLocalDate(t.date);
            return d < earliest ? d : earliest;
          }, toLocalDate(transactions[0].date))
        );

    const endDate = endOfDay(now);

 
    const grouped = {};
    for (const t of transactions) {
      const d = toLocalDate(t.date);

    
      if (d < startDate || d > endDate) continue;

      const key = format(d, "yyyy-MM-dd");
      if (!grouped[key]) {
        grouped[key] = {
          date:    format(d, "MMM dd"),
          sortKey: key,
          income:  0,
          expense: 0,
        };
      }

      
      const type = t.type?.toUpperCase();
      if (type === "INCOME")       grouped[key].income  += t.amount;
      else if (type === "EXPENSE") grouped[key].expense += t.amount;
    }

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days.map((day) => {
      const key = format(day, "yyyy-MM-dd");
      return grouped[key] ?? {
        date:    format(day, "MMM dd"),
        sortKey: key,
        income:  0,
        expense: 0,
      };
    });
  }, [transactions, dateRange]);


  const { totalIncome, totalExpense, net } = useMemo(
    () =>
      filteredData.reduce(
        (acc, day) => ({
          totalIncome:  acc.totalIncome  + day.income,
          totalExpense: acc.totalExpense + day.expense,
          net:          acc.net          + day.income - day.expense,
        }),
        { totalIncome: 0, totalExpense: 0, net: 0 }
      ),
    [filteredData]
  );

  const rangeLabel    = DATE_RANGES[dateRange].label;
  const tickInterval  = getTickInterval(filteredData.length); // FIX #3

  return (
    <Card
      className="relative overflow-hidden
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
        {/* TOTALS — FIX #5: range label makes numbers unambiguous */}
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Income <span className="text-xs opacity-60">({rangeLabel})</span>
            </p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatINR(totalIncome)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Expenses <span className="text-xs opacity-60">({rangeLabel})</span>
            </p>
            <p className="text-lg font-bold text-red-500 dark:text-red-400">
              {formatINR(totalExpense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400">Net</p>
            {/* FIX #7 — uses memoised net */}
            <p className={`text-lg font-bold ${
              net >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
            }`}>
              {formatINR(net)}
            </p>
          </div>
        </div>

        {/* CHART */}
        <div className="w-full h-[320px]" style={{ minWidth: 0, minHeight: 320 }}>
          {filteredData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
              No transactions in this range
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
              <LineChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#166534" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                  <linearGradient id="expenseLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#991b1b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(148,163,184,0.2)"
                />

                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8" }}
                  interval={tickInterval}
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
                  dot={false}
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
                  dot={false}
                  activeDot={{ r: 6, fill: "#dc2626" }}
                  animationEasing="ease-in-out"
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>

      
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-emerald-200/10 to-transparent dark:from-slate-700/20 pointer-events-none" />
    </Card>
  );
}