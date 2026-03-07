import { addBudgetAction } from "@/app/dashboard/actions";
import { formatCurrency, formatSignedAmount } from "@/lib/format";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getDashboardOverview } from "@/lib/django-api";

export default async function DashboardWalletPage() {
  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }

  const data = await getDashboardOverview(token).catch(() => redirect("/login"));
  const wallet = data.wallet;
  const budgets = data.budgets;
  const transactionsCount = data.transactionsCount;
  const lastTransactions = data.recentTransactions;

  const balance = wallet?.balance ?? 0;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-5">
        <article className="rounded-xl border border-[var(--color-border)] p-4 md:col-span-3">
          <p className="text-sm text-[var(--color-soft)]">Hi {wallet?.ownerName ?? "User"}!</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-title)]">{formatCurrency(balance)}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] p-4 text-center md:col-span-1">
          <p className="text-xs text-[var(--color-soft)]">Budgets</p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-title)]">{budgets.length}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] p-4 text-center md:col-span-1">
          <p className="text-xs text-[var(--color-soft)]">Transactions</p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-title)]">{transactionsCount}</p>
        </article>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((item) => {
          const progress = Math.min(100, Math.round(item.progressPercent));
          return (
            <article key={item.id} className="rounded-xl border border-[var(--color-border)] p-4">
              <p className="text-sm font-medium text-[var(--color-title)]">{item.name}</p>
              <p className="mt-1 text-xs text-[var(--color-soft)]">
                {formatCurrency(item.currentAmount)} / {formatCurrency(item.targetAmount)}
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${progress}%` }} />
              </div>
            </article>
          );
        })}
      </div>

      <article className="rounded-xl border border-[var(--color-border)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-title)]">Last Transactions</h2>
          <span className="text-xs text-[var(--color-soft)]">{transactionsCount} records</span>
        </div>
        <ul className="mt-3 divide-y divide-[var(--color-border)]">
          {lastTransactions.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-[var(--color-title)]">{item.name}</p>
                <p className="text-xs text-[var(--color-soft)]">{item.type}</p>
              </div>
              <div className="text-right">
                <p
                  className={
                    item.status === "CREDIT" ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"
                  }
                >
                  {formatSignedAmount(item.amount, item.status)}
                </p>
                <p className="text-xs text-[var(--color-soft)]">{item.txDate}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-shell)] p-4">
        <h3 className="text-sm font-semibold text-[var(--color-title)]">Create Budget</h3>
        <form action={addBudgetAction} className="mt-3 grid gap-2 md:grid-cols-4">
          <input
            required
            name="name"
            placeholder="Budget name"
            className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none"
          />
          <input
            required
            name="amount"
            type="number"
            min="0"
            placeholder="Current amount"
            className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none"
          />
          <input
            required
            name="total"
            type="number"
            min="1"
            placeholder="Goal amount"
            className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none"
          />
          <button type="submit" className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white">
            Save Budget
          </button>
        </form>
      </article>
    </>
  );
}
