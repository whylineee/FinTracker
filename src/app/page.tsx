import Link from "next/link";

const highlights = [
  { title: "Smart Walleting", text: "Track balances, budgets and goals in one clean workspace." },
  { title: "Card Control", text: "Monitor card activity, usage history and recurring charges." },
  { title: "Live Insights", text: "See charted trends for income, expenses and savings growth." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-shell)]">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-6 md:px-6">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-[var(--color-accent)]" />
          <span className="text-base font-semibold text-[var(--color-title)]">Ringku</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-title)]"
          >
            Open App
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 pb-10 md:px-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-3xl bg-[var(--color-panel)] p-6 shadow-[0_18px_55px_rgba(13,16,28,0.12)] md:p-10">
          <p className="text-sm font-medium text-[var(--color-accent)]">Financial web app</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[var(--color-title)] md:text-5xl">
            Full dashboard website based on your Figma template.
          </h1>
          <p className="mt-4 max-w-[55ch] text-sm leading-7 text-[var(--color-soft)]">
            A complete multi-page finance interface on Next.js and Tailwind with separate dashboard routes, responsive
            layout, cards, charting block and transactions table.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white">
              Sign in
            </Link>
            <a
              href="https://www.figma.com/design/IwKhCWtMoKkZOsdONHWKpi/Ringku---Financial-Web-App-and-Mobile-App--Community-"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-title)]"
            >
              Open Template
            </a>
          </div>
        </section>

        <section className="grid gap-4">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <h2 className="text-lg font-semibold text-[var(--color-title)]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-soft)]">{item.text}</p>
            </article>
          ))}
          <article className="rounded-2xl bg-[var(--color-sidebar)] p-6 text-slate-100">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Status</p>
            <p className="mt-2 text-2xl font-bold">Project scaffold ready</p>
            <p className="mt-2 text-sm text-slate-300">Structure prepared for backend/API integration next.</p>
          </article>
        </section>
      </main>
    </div>
  );
}
