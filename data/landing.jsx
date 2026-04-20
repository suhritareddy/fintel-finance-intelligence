import React from "react";
import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
} from "lucide-react";

/* ================= FEATURES ================= */

export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-emerald-500" />,
    title: "Smart Analytics",
    description:
      "Visualize your spending patterns with clean and simple insights.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-emerald-500" />,
    title: "Track Transactions",
    description:
      "Log and manage your income and expenses effortlessly in one place.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-emerald-500" />,
    title: "Budget Control",
    description:
      "Set budgets and stay on track with your financial goals.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-emerald-500" />,
    title: "Multi-Account View",
    description:
      "Manage multiple accounts and keep everything organized.",
  },
];

/* ================= HOW IT WORKS (OPTIONAL) ================= */

export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-emerald-500" />,
    title: "Sign In",
    description: "Create your account and get started instantly.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-emerald-500" />,
    title: "Add Transactions",
    description: "Track your expenses and income in seconds.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-emerald-500" />,
    title: "View Insights",
    description: "Understand your finances and improve your habits.",
  },
];