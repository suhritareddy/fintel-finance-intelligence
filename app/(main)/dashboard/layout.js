
import React, { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

const layout = () => {
  return (
    <div className="px-5 max-w-7xl mx-auto">
      <h1 className="text-6xl font-bold text-slate-800 dark:text-white mb-5">
        Dashboard
      </h1>
      <Suspense fallback={<BarLoader color="#10B981" className="mt-4 w-full" />}>
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default layout;