import { addTransactionAction } from "@/app/dashboard/actions";
import { formatSignedAmount } from "@/lib/format";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { listTransactions } from "@/lib/django-api";

export default async function TransactionsPage() {
  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }

  const transactions = await listTransactions(token).catch(() => redirect("/login"));

  return (
    <article className="space-y-4 rounded-xl border border-[var(--color-border)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[var(--color-title)]">Recent Transactions</h2>
        <span className="text-xs text-[var(--color-soft)]">{transactions.length} total</span>
      </div>

      <form action={addTransactionAction} className="grid gap-2 rounded-xl bg-[var(--color-shell)] p-3 md:grid-cols-5">
        <input
          required
          name="name"
          placeholder="Name"
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none"
        />
        <input
          required
          name="type"
          placeholder="Type"
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none"
        />
        <input
          required
          name="txDate"
          type="date"
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            required
            type="number"
            min="1"
            name="amount"
            placeholder="Amount"
            className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none"
          />
          <select
            name="status"
            className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none"
            defaultValue="DEBIT"
          >
            <option value="DEBIT">Debit</option>
            <option value="CREDIT">Credit</option>
          </select>
        </div>
        <button type="submit" className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white">
          Add Transaction
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[660px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--color-soft)]">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((row) => (
              <tr key={row.id} className="border-t border-[var(--color-border)]">
                <td className="py-3 text-[var(--color-title)]">{row.name}</td>
                <td className="py-3 text-[var(--color-soft)]">{row.type}</td>
                <td className="py-3 text-[var(--color-soft)]">{row.txDate}</td>
                <td className="py-3 text-[var(--color-soft)]">{row.status === "CREDIT" ? "Credit" : "Debit"}</td>
                <td className={`py-3 text-right font-semibold ${row.status === "CREDIT" ? "text-emerald-600" : "text-rose-600"}`}>
                  {formatSignedAmount(row.amount, row.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
