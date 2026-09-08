import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/chrome";
import { RESOURCES } from "@/lib/catalog";

export const Route = createFileRoute("/library/")({
  component: Library,
  head: () => ({ meta: [{ title: "Desk — Northline" }] }),
});

function Library() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">The desk</p>
        <h1 className="font-display mt-3 text-5xl tracking-tight">Short notes. No theatre.</h1>
        <p className="mt-4 max-w-lg text-muted">
          How we think about load, rest, and a week that has a job in it. Not a blog for ranking.
        </p>
        <ul className="mt-14 divide-y divide-border border-y border-border">
          {RESOURCES.map((r) => (
            <li key={r.slug}>
              <Link
                to="/library/$slug"
                params={{ slug: r.slug }}
                className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <div>
                  <p className="font-display text-2xl">{r.title}</p>
                  <p className="mt-1 text-sm text-muted">{r.excerpt}</p>
                </div>
                <span className="shrink-0 text-xs tracking-[0.14em] text-subtle uppercase">
                  {r.category} · {r.minutes} min
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </MarketingShell>
  );
}
