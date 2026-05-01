"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    data,
    error,
    fn: createAccountFn,
    loading: createAccountLoading,
  } = useFetch(createAccount);

  const onSubmit = async (formData) => {
    await createAccountFn(formData);
  };

  useEffect(() => {
    if (data) {
      toast.success("Account created successfully");
      setTimeout(() => reset(), 0); // avoids hydration mismatch
      setOpen(false);
    }
  }, [data, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      
      
      <DrawerTrigger asChild>
        <button className="w-full text-left">
          {children}
        </button>
      </DrawerTrigger>

      <DrawerContent className="bg-white dark:bg-slate-900 border-t border-emerald-200/50 dark:border-slate-700/50">

        {/* drag handle */}
        <div className="mx-auto mt-2 w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />

        <DrawerHeader className="px-6 pt-4 pb-2">
          <DrawerTitle className="text-xl font-semibold text-slate-800 dark:text-white">
            Create New Account
          </DrawerTitle>

          {/* ✅ FIX: accessibility warning */}
          <DrawerDescription className="text-sm text-slate-500 dark:text-slate-400">
            Fill in the details to create a new account.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-8 max-w-md mx-auto w-full">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Account Name
              </label>
              <Input
                placeholder="e.g., Main Checking"
                {...register("name")}
                className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700
                focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:border-emerald-400"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* TYPE */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* BALANCE */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Initial Balance
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
            </div>

            {/* SWITCH */}
            <div className="flex items-center justify-between rounded-xl border
              border-slate-200 dark:border-slate-700
              bg-slate-50 dark:bg-slate-800/60 p-3.5"
            >
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  Default Account
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Auto-select for transactions
                </p>
              </div>
              <Switch
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-2">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                type="submit"
                disabled={createAccountLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>

          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;