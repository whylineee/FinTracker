import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/login/actions";
import { getAccessToken } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string; registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const token = await getAccessToken();
  if (token) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const hasError = params?.error === "invalid" || params?.error === "missing" || params?.error === "backend";
  const isRegistered = params?.registered === "1";
  const errorMessage =
    params?.error === "backend"
      ? "Backend is unavailable. Start Django server on http://127.0.0.1:8000."
      : "Invalid username or password.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-shell)] p-4">
      <section className="w-full max-w-[420px] rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_55px_rgba(13,16,28,0.12)]">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-shell)] p-1 text-sm">
          <div className="grid grid-cols-2 gap-1">
            <span className="rounded-lg bg-white px-3 py-2 text-center font-semibold text-[var(--color-title)]">Sign in</span>
            <Link
              href="/register"
              className="rounded-lg px-3 py-2 text-center font-medium text-[var(--color-soft)] transition hover:bg-white hover:text-[var(--color-title)]"
            >
              Register
            </Link>
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[var(--color-title)]">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--color-soft)]">Use your account credentials.</p>

        {isRegistered && (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Account created. You can sign in now.
          </p>
        )}

        {hasError && (
          <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {errorMessage}
          </p>
        )}

        <form action={loginAction} className="mt-4 space-y-3">
          <input
            name="username"
            required
            placeholder="Username"
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none"
          />
          <input
            name="password"
            required
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none"
          />
          <button type="submit" className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white">
            Sign in
          </button>
        </form>

        <Link href="/" className="mt-4 inline-block text-sm text-[var(--color-soft)] hover:underline">
          Back to landing
        </Link>
      </section>
    </main>
  );
}
