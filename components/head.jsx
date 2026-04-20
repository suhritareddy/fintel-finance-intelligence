"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeadSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-10 pb-8 px-4 text-center w-full overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 w-125 sm:w-187.5 lg:w-250 h-125 sm:h-187.5 lg:h-250 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[60px] sm:blur-[120px]"
          style={{ animation: "pulseGlow 5s ease-in-out infinite" }}
        />
      </div>

      <div className="max-w-4xl mx-auto animate-[heroFloat_8s_ease-in-out_infinite]">

        {/* TAGLINE BADGE */}
        <div className="fade-up flex justify-center mb-6 px-2" style={{ animationDelay: "0ms" }}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide border border-emerald-500/30 bg-emerald-50/60 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Work on your finances today, for a better tomorrow
          </span>
        </div>

        {/* HEADING */}
        <h1
          className="fade-up text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] bg-linear-to-b from-black via-slate-900 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent"
          style={{ animationDelay: "220ms" }}
        >
          Manage Your Finances
          <span className="block">with Intelligence</span>
        </h1>

        {/* SUBTEXT */}
        <p
          className="fade-up mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto"
          style={{ animationDelay: "380ms" }}
        >
          Begin Today. Build Tomorrow.
        </p>

        {/* CTA BUTTON */}
        <div
          className="fade-up mt-8 sm:mt-10 flex justify-center gap-3 sm:gap-4"
          style={{ animationDelay: "520ms" }}
        >
          <Button
            asChild
            size="lg"
            className="px-8 sm:px-10 h-11 sm:h-12 rounded-xl shadow-lg bg-white text-slate-900 hover:scale-105 active:scale-95 hover:shadow-xl transition-all duration-300"
          >
            <a href="#features">Features</a>
          </Button>
          <Button
            asChild
            size="lg"
            className="px-8 sm:px-10 h-11 sm:h-12 rounded-xl shadow-lg bg-linear-to-r from-green-700 to-emerald-400 text-white hover:scale-105 active:scale-95 hover:shadow-xl transition-all duration-300"
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>

        </div>

      </div>

    </section>
  );
};

export default HeadSection;