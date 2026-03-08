import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { registerAction } from "@/app/register/actions";

type RegisterPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const errorMap: Record<string, string> = {
  backend: "Backend is unavailable. Start Django server on http://127.0.0.1:8000.",
  invalid: "Could not create account. Check details and try again.",
  missing: "Fill in all required fields.",
  password_mismatch: "Passwords must match.",
  username: "This username is already taken.",
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const token = await getAccessToken();
  if (token) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const errorKey = params?.error ?? "";
  const hasError = Boolean(errorMap[errorKey]);
  const errorMessage = errorMap[errorKey] ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-shell)] p-4">
      <section className="w-full max-w-[440px] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-[0_18px_55px_rgba(13,16,28,0.12)]">
        <div className="bg-gradient-to-r from-[var(--color-sidebar)] via-[#11225e] to-[var(--color-accent)] px-6 py-5 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Account setup</p>
          <h1 className="mt-2 text-2xl font-bold">Create account</h1>
          <p className="mt-1 text-sm text-slate-200">Join FinTracker and start your dashboard.</p>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-shell)] p-1 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-center font-medium text-[var(--color-soft)] transition hover:bg-white hover:text-[var(--color-title)]"
              >
                Sign in
              </Link>
              <span className="rounded-lg bg-white px-3 py-2 text-center font-semibold text-[var(--color-title)]">Register</span>
            </div>
          </div>

          {hasError && (
            <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">{errorMessage}</p>
          )}

          <form action={registerAction} className="mt-4 space-y-3">
            <input
              name="username"
              required
              placeholder="Username"
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            />
            <input
              name="email"
              type="email"
              placeholder="Email (optional)"
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            />
            <input
              name="password"
              required
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            />
            <input
              name="confirmPassword"
              required
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            />
            <button type="submit" className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white">
              Create account
            </button>
          </form>

          <Link href="/" className="mt-4 inline-block text-sm text-[var(--color-soft)] hover:underline">
            Back to landing
          </Link>
        </div>
      </section>
    </main>
  );
}
