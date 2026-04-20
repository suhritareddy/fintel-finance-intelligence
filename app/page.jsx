import HeadSection from "@/components/head";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData } from "@/data/landing";

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* HERO */}
      <div className="flex items-center justify-center">
        <HeadSection />
      </div>

      {/* FEATURES */}
      <section id="features" className="pt-4 pb-20 sm:py-20 px-4 animate-[fadeUp_0.6s_ease_0.2s_forwards] opacity-0">
        <div className="max-w-6xl mx-auto">

          {/* SECTION HEADER */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide border border-emerald-500/30 bg-emerald-50/60 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight
              bg-linear-to-b from-black via-slate-900 to-slate-700
              dark:from-white dark:via-slate-200 dark:to-slate-400
              bg-clip-text text-transparent mt-3">
              Everything you need to
              <span className="block">manage your finances</span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              Powerful tools built to give you complete clarity over your finances.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuresData.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border border-slate-200/70 dark:border-slate-700/50
                  bg-white dark:bg-slate-800
                  hover:border-emerald-400/50 dark:hover:border-emerald-700/40
                  hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-700/10
                  transition-all duration-300 hover:-translate-y-1"
              >
                {/* CARD GLOW ON HOVER */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  bg-linear-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/30 dark:to-transparent
                  pointer-events-none" />

                <CardContent className="p-6 flex flex-col gap-4 relative">
                  {/* ICON */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center
                    bg-emerald-50 dark:bg-emerald-950/50
                    border border-emerald-200/60 dark:border-emerald-800/40
                    group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  {/* TEXT */}
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-base mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}