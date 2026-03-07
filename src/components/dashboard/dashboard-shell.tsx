"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { dashboardNavItems } from "@/lib/dashboard-data";

const pageTitles: Record<string, string> = {
  "/dashboard": "My Wallet",
  "/dashboard/cards": "My Card",
  "/dashboard/chart": "Finance Chart",
  "/dashboard/transactions": "Recent Transactions",
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageTitle = useMemo(() => pageTitles[pathname] ?? "Dashboard", [pathname]);

  return (
    <div className="min-h-screen bg-[var(--color-shell)]">
      <main className="flex min-h-screen w-full flex-col overflow-hidden border-[var(--color-border)] bg-[var(--color-panel)] md:flex-row md:border-l md:border-r">
        <aside className="flex w-full shrink-0 flex-col bg-[var(--color-sidebar)] text-slate-200 md:w-[215px]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
            <div className="size-7 rounded-full bg-[var(--color-accent)]" />
            <span className="text-sm font-semibold tracking-wide">Ringku</span>
          </div>

          <nav className="grid grid-cols-2 gap-2 p-3 md:grid-cols-1 md:p-4">
            {dashboardNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-3 text-left text-xs transition md:text-sm ${
                  isActive(pathname, item.href)
                    ? "bg-white/12 text-white"
                    : "text-slate-300 hover:bg-white/7 hover:text-white"
                }`}
              >
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.shortLabel}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/10 p-3 md:p-4">
            <a href="/logout" className="block w-full rounded-xl px-3 py-3 text-left text-xs hover:bg-white/7 md:text-sm">
              Logout
            </a>
            <button type="button" className="w-full rounded-xl px-3 py-3 text-left text-xs hover:bg-white/7 md:text-sm">
              Settings
            </button>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/7 p-2">
              <div className="size-8 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-500" />
              <div>
                <p className="text-xs font-semibold text-white">Admin Pro</p>
                <p className="text-[11px] text-slate-300">Owner</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex w-full flex-col border-t border-[var(--color-border)] md:border-t-0 md:border-l">
          <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4 md:px-6">
            <div>
              <p className="text-[11px] text-[var(--color-soft)]">Dashboard</p>
              <h1 className="text-xl font-bold text-[var(--color-title)]">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="size-9 rounded-full border border-[var(--color-border)] text-sm text-[var(--color-soft)]">
                ?
              </button>
              <button type="button" className="size-9 rounded-full bg-[var(--color-accent)] text-sm text-white">
                +
              </button>
            </div>
          </header>

          <div className="space-y-4 p-4 md:p-6">{children}</div>
        </section>
      </main>
    </div>
  );
}
