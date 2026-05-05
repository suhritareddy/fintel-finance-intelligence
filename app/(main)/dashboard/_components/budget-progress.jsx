"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, Wallet } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed =
    initialBudget && initialBudget.amount > 0
      ? Math.min((currentExpenses / initialBudget.amount) * 100, 100)
      : 0;

  const progressColor =
    percentUsed >= 90
      ? "bg-red-500"
      : percentUsed >= 75
      ? "bg-yellow-500"
      : "bg-emerald-500";

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
      router.refresh();
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="relative overflow-hidden mb-6 border border-emerald-200/60 dark:border-emerald-800/40 bg-white dark:bg-slate-900/70 backdrop-blur-xl shadow-lg shadow-emerald-500/10 dark:shadow-black/30">

      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-400" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/40">
              <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-800 dark:text-white">
                Monthly Budget
              </CardTitle>
              <CardDescription className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                Default Account Budget Tracker
              </CardDescription>
            </div>
          </div>

          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit budget"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-800"
            >
              <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="Enter budget amount"
              autoFocus
              disabled={isLoading}
              className="sm:max-w-xs"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateBudget}
                disabled={isLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {initialBudget ? (
              <>
                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatINR(initialBudget.amount)}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Monthly Budget
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-800 dark:text-white">
                      {formatINR(currentExpenses)}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Spent so far
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress
                    value={percentUsed}
                    className="h-2 bg-slate-200 dark:bg-slate-800"
                    indicatorClassName={progressColor}
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{percentUsed.toFixed(1)}% used</span>
                    <span>
                      {currentExpenses > initialBudget.amount
                        ? `${formatINR(currentExpenses - initialBudget.amount)} over budget`
                        : `${formatINR(initialBudget.amount - currentExpenses)} left`}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div
                className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors"
                onClick={() => setIsEditing(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(true)}
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No budget set yet.{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    + Set Budget
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}