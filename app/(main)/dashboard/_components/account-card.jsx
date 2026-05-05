"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useEffect } from 'react';
import Link from "next/link";
import useFetch from '@/hooks/use-fetch';
import { updateDefaultAccount } from '@/actions/accounts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;
  const router = useRouter();

  const {
    loading: updateDefaultLoading,
    fn: updatedefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return;
    }
    await updatedefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
      router.refresh();
    }
  }, [updatedAccount, updateDefaultLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card
      className="group relative overflow-hidden
      bg-white dark:bg-slate-800/60
      border border-slate-200 dark:border-slate-700
      hover:border-emerald-400/60 dark:hover:border-emerald-600/50
      shadow-sm hover:shadow-lg hover:shadow-emerald-500/10
      dark:hover:shadow-slate-900/40
      transition-all duration-300 hover:-translate-y-1"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Link href={`/account/${id}`} className="flex-1">
          <CardTitle className="text-sm font-medium capitalize text-slate-800 dark:text-white">
            {name}
          </CardTitle>
        </Link>
        <Switch
          checked={isDefault}
          onClick={handleDefaultChange}
          disabled={updateDefaultLoading}
          className="data-[state=checked]:bg-emerald-500"
        />
      </CardHeader>

      <Link href={`/account/${id}`}>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ₹{new Intl.NumberFormat("en-IN", {
              maximumFractionDigits: 0,
            }).format(balance)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pb-2">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center group-hover:text-green-500 transition-colors">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            Income
          </div>
          <div className="flex items-center group-hover:text-red-500 transition-colors">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            Expense
          </div>
        </CardFooter>
      </Link>

      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-emerald-200/20 to-transparent dark:from-slate-700/30" />
    </Card>
  );
};

export default AccountCard;