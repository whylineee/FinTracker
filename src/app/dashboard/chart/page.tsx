import { formatCurrency } from "@/lib/format";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { listTransactions } from "@/lib/django-api";

function buildPolyline(values: number[]): string {
  const width = 640;
  const height = 220;
  const maxValue = Math.max(...values, 1);
  const stepX = width / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = 20 + index * stepX;
      const normalized = value / maxValue;
      const y = 20 + (1 - normalized) * (height - 20);
      return `${x},${y}`;
    })
    .join(" ");
}

export default async function ChartPage() {
  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }

  const transactions = await listTransactions(token).catch(() => redirect("/login"));
  const trendSource = [...transactions].reverse();

  const income = transactions.filter((item) => item.status === "CREDIT").reduce((acc, item) => acc + item.amount, 0);
  const expense = transactions.filter((item) => item.status === "DEBIT").reduce((acc, item) => acc + item.amount, 0);
  const savings = income - expense;

  const trend = trendSource.slice(-8).map((item) => item.amount);
  const chartPoints = buildPolyline(trend.length > 0 ? trend : [100, 120, 80, 140, 110, 190, 170, 210]);

  return (
    <article className="rounded-xl border border-[var(--color-border)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--color-title)]">Finance Chart</h2>
        <p className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-soft)]">
          Real-time from SQLite
        </p>
      </div>

      <svg viewBox="0 0 700 260" className="mt-4 h-[260px] w-full rounded-xl bg-[var(--color-shell)] p-4">
        <polyline fill="none" stroke="var(--color-accent)" strokeWidth="4" points={chartPoints} />
      </svg>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] p-3">
          <p className="text-xs text-[var(--color-soft)]">Income</p>
          <p className="text-lg font-semibold text-[var(--color-title)]">{formatCurrency(income)}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] p-3">
          <p className="text-xs text-[var(--color-soft)]">Expense</p>
          <p className="text-lg font-semibold text-[var(--color-title)]">{formatCurrency(expense)}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] p-3">
          <p className="text-xs text-[var(--color-soft)]">Savings</p>
          <p className="text-lg font-semibold text-[var(--color-title)]">{formatCurrency(savings)}</p>
        </div>
      </div>
    </article>
  );
}
