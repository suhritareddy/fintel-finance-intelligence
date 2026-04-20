import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { checkUser } from "@/lib/checkUser";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fintel",
  description: "Work on Finances today, for better tomorrow",
};

export default async function RootLayout({ children }) {
  await checkUser();
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body
          className="min-h-full flex flex-col 
                     bg-linear-to-br
                   from-green-50 via-emerald-100 to-green-100
                   dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 
                     transition-all duration-500"
        >
          <Header />
          <main className="flex-1 pt-20">{children}</main>

          <footer
            className="mt-auto border-t 
                    bg-white/60 dark:bg-slate-900/60 
                      backdrop-blur-xl
                    border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="container mx-auto px-4 py-8 text-center">
              <p className="text-slate-700 dark:text-slate-300 text-sm">
                © {new Date().getFullYear()} FINTEL • Built by Suhrita Reddy
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
