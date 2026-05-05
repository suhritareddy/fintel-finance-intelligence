import React, { Suspense } from "react";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import {BudgetProgress} from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";


async function DashboardPage() {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find(
    (account) => account.isDefault
  );

  let budgetData = null;

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData();

  return (
    <div className="mt-4">
      <div className="mb-6">

        {defaultAccount && (
          <BudgetProgress
            initialBudget={budgetData?.budget}
            currentExpenses={budgetData?.currentExpenses || 0}
          />
        )}

        {/*overview */}
<div className="mb-6">
  <Suspense fallback={"Loading Overview..."}>
    <div className="grid gap-4 ">
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />
    </div>
  </Suspense>
</div>
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Your Accounts
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          <CreateAccountDrawer>
            <Card className="group relative cursor-pointer border-2 border-dashed border-emerald-400/80 dark:border-emerald-700/40 bg-white dark:bg-slate-800/60 shadow-sm shadow-emerald-200/50 dark:shadow-none hover:bg-emerald-50/80 dark:hover:bg-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 min-h-[120px]">

              <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/70 dark:bg-slate-800/60 border border-emerald-200/60">
                  <Plus className="h-5 w-5 text-emerald-600" />
                </div>

                <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Add New Account
                </p>
              </CardContent>

            </Card>
          </CreateAccountDrawer>

          {accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;