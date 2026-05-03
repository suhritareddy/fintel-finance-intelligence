import React, { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

const layout = () => {
  return (
    <div className="px-5 max-w-7xl mx-auto">
      <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-4 md:mb-5 leading-tight">
        Dashboard
      </h1>
      <Suspense
        fallback={<BarLoader color="#10B981" className="mt-4 w-full" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default layout;
