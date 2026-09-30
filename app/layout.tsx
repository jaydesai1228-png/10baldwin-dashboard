import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "10 Baldwin | Punch List & Burndown Dashboard",
  description: "Mobile-first residential construction punch list, burndown, and dependency-tracking dashboard for 10 Baldwin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
        {children}
      </body>
    </html>
  );
}
