import { formatCurrency } from "@/lib/format";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { getDashboardOverview } from "@/lib/django-api";

export default async function CardsPage() {
  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }

  const data = await getDashboardOverview(token).catch(() => redirect("/login"));
  const wallet = data.wallet;
  const activity = data.cardActivity;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border border-[var(--color-border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--color-title)]">Main Card</h2>
        <div className="mt-3 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-500 to-sky-400 p-5 text-white shadow-lg">
          <p className="text-xs opacity-80">Balance</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(wallet?.balance ?? 0)}</p>
          <div className="mt-7 flex items-end justify-between text-xs">
            <p>**** **** **** 4201</p>
            <p>09/31</p>
          </div>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--color-soft)]">Card holder</dt>
            <dd className="font-medium text-[var(--color-title)]">{wallet?.ownerName ?? "User"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-soft)]">Card type</dt>
            <dd className="font-medium text-[var(--color-title)]">Platinum</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-soft)]">Monthly limit</dt>
            <dd className="font-medium text-[var(--color-title)]">$25,000</dd>
          </div>
        </dl>
      </article>

      <article className="rounded-xl border border-[var(--color-border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--color-title)]">Card Activity</h2>
        <ul className="mt-3 divide-y divide-[var(--color-border)]">
          {activity.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-[var(--color-title)]">{item.label}</p>
                <p className="text-xs text-[var(--color-soft)]">{item.txDate}</p>
              </div>
              <span className="font-medium text-[var(--color-title)]">{formatCurrency(item.value)}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
