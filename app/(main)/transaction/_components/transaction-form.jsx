"use client";

import { createTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { CalendarIcon, Loader2, TrendingDown, TrendingUp, Info } from "lucide-react";
import { format } from "date-fns";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import CreateAccountDrawer from "@/components/create-account-drawer";

const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((a) => a.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/*  S1: Basic Info */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-emerald-500">
            1
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
            Basic Info
          </span>
        </div>

        {/* Type toggle */}
        <div className="space-y-2 mb-5">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Type
          </label>
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-11">
            <button
              type="button"
              onClick={() => setValue("type", "EXPENSE")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200",
                type === "EXPENSE"
                  ? "bg-red-500 text-white shadow-inner"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-700"
              )}
            >
              <TrendingDown className="h-4 w-4" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "INCOME")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200",
                type === "INCOME"
                  ? "bg-emerald-500 text-white shadow-inner"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-700"
              )}
            >
              <TrendingUp className="h-4 w-4" />
              Income
            </button>
          </div>
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        {/* Amount + Account */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium text-sm select-none">
                ₹
              </span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount")}
                className="pl-7 h-11 bg-white/70 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
              Account
            </label>
            <Select
              onValueChange={(value) => setValue("accountId", value)}
              defaultValue={getValues("accountId")}
            >
              <SelectTrigger className="h-11 bg-white/70 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} (₹{parseFloat(account.balance).toLocaleString("en-IN")})
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <div className="px-3 py-2 text-sm cursor-pointer text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-md font-medium">
                    + Create Account
                  </div>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-red-500">{errors.accountId.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* S2: Details  */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-emerald-500">
            2
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
            Details
          </span>
        </div>

        {/* Category + Date */}
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
              Category
            </label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              defaultValue={getValues("category")}
            >
              <SelectTrigger className="h-11 bg-white/70 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 w-full justify-between bg-white/70 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : "Pick a date"}
                  <CalendarIcon className="h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => setValue("date", date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Description
          </label>
          <Input
            placeholder="What was this for?"
            {...register("description")}
            className="h-11 bg-white/70 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* S3: Schedule */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-emerald-500">
            3
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
            Schedule
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              Recurring Transaction
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automatically repeat this transaction
            </p>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(checked) => setValue("isRecurring", checked)}
          />
        </div>

        {isRecurring && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
              Repeat Every
            </label>
            <Select
              onValueChange={(value) => setValue("recurringInterval", value)}
              defaultValue={getValues("recurringInterval")}
            >
              <SelectTrigger className="h-11 bg-white/70 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="text-sm text-red-500">
                {errors.recurringInterval.message}
              </p>
            )}
            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
              <span>
                This transaction will be automatically added on the selected schedule.
              </span>
            </div>
          </div>
        )}
      </div>

      {/*  ACTIONS */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={transactionLoading}
          className={cn(
            "h-11 rounded-xl text-white font-semibold transition-all duration-200",
            type === "INCOME"
              ? "bg-emerald-500 hover:bg-emerald-600"
              : "bg-emerald-700 hover:bg-emerald-800"
          )}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;