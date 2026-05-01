"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PenBox, Sun, Moon, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  // Load theme
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (!isLoaded) return null;

  return (
    <header className="fixed top-0 w-full z-50 border-b 
                     bg-white/95 dark:bg-slate-900/95 
                      backdrop-blur-md
                    border-slate-200/50 dark:border-slate-700/50">

      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center
              bg-linear-to-r from-green-800 via-green-500 to-emerald-400 shadow-lg">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                FINTEL
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Finance Intelligence
              </p>
            </div>
          </div>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {isSignedIn ? (
            <>
              {/* DASHBOARD */}
              <Link
                href="/dashboard"
                className="group flex items-center gap-1 px-3 h-10 rounded-xl shadow-md
                  bg-slate-100 dark:bg-slate-800
                  text-slate-700 dark:text-white
                  hover:scale-105 transition-all duration-300"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-xs max-w-0 opacity-0 overflow-hidden
                  group-hover:max-w-20 group-hover:opacity-100
                  transition-all duration-300">
                  Dashboard
                </span>
              </Link>

              {/* ADD TRANSACTION */}
              <Link
                href="/transaction/create"
                className="group flex items-center gap-1 px-3 h-10 rounded-xl shadow-lg
                  bg-linear-to-r from-green-700 to-emerald-400 text-white
                  hover:scale-105 transition-all duration-300"
              >
                <PenBox className="w-5 h-5 group-hover:rotate-12 transition" />
                <span className="text-xs max-w-0 opacity-0 overflow-hidden
                  group-hover:max-w-30 group-hover:opacity-100
                  transition-all duration-300">
                  Add Transaction
                </span>
              </Link>

              {/* THEME TOGGLE */}
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="p-2.5 rounded-xl
                  text-slate-600 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-slate-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-800 dark:text-white" />
                )}
              </button>

              {/* USER */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </>
          ) : (
            <>
              {/* THEME */}
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="p-2.5 rounded-xl
                  text-slate-600 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-800 dark:text-white" />
                )}
              </button>

              {/* LOGIN */}
              <SignInButton forceRedirectUrl="/dashboard">
                <button className="px-4 h-10 rounded-xl shadow-md
                  bg-linear-to-r from-green-700 to-emerald-400 text-white
                  hover:scale-105 transition-all duration-300">
                  Login
                </button>
              </SignInButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;