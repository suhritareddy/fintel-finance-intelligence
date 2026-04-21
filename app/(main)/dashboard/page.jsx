import React from "react";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

function DashboardPage() {
  return (
    <div className="px-5 mt-24">
      {/* Budget progress */}

      {/* Overview */}

      {/* Accounts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card
            className="group relative cursor-pointer border-2 border-dashed
            border-emerald-300/60 dark:border-emerald-700/40
            bg-linear-to-br from-green-50 via-emerald-100 to-green-100
            dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
            hover:shadow-lg hover:shadow-emerald-500/10
            dark:hover:shadow-slate-900/40
            transition-all duration-300 hover:-translate-y-1
            min-h-30"
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center">
              
              {/* ICON */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center
                bg-white/70 dark:bg-slate-800/60
                border border-emerald-200/60 dark:border-slate-700/50
                group-hover:scale-110 transition-transform duration-300"
              >
                <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              {/* TEXT */}
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Add New Account
              </p>
            </CardContent>

            {/* HOVER GLOW */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
              bg-linear-to-br from-emerald-200/20 to-transparent
              dark:from-slate-700/30 dark:to-transparent pointer-events-none"
            />
          </Card>
        </CreateAccountDrawer>
      </div>
    </div>
  );
}

export default DashboardPage;