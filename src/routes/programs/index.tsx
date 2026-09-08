import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/chrome";
import { Badge } from "@/components/ui/badge";
import { PROGRAMS } from "@/lib/catalog";

export const Route = createFileRoute("/programs/")({
  component: Programs,
  head: () => ({ meta: [{ title: "Programs — Northline" }] }),
});

function Programs() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Programs</p>
        <h1 className="font-display mt-3 max-w-3xl text-5xl tracking-tight sm:text-6xl">
          Choose the work. We’ll keep you on it.
        </h1>
        <p className="mt-5 max-w-xl text-muted">
          Every program is a line: days, lifts, a check-in. Private is the same idea, written for you.
        </p>
        <div className="mt-14 space-y-8">
          {PROGRAMS.map((p) => (
            <Link
              key={p.slug}
              to="/programs/$slug"
              params={{ slug: p.slug }}
              className="group grid overflow-hidden rounded-xl border border-border bg-bg-elevated lg:grid-cols-[1.2fr_1fr]"
            >
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
                <img
                  src={p.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <Badge className="absolute top-4 left-4 bg-bg/80 text-fg backdrop-blur-sm" variant="bone">
                  {p.kicker}
                </Badge>
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-10">
                <div>
                  <Badge variant="bone">{p.kicker}</Badge>
                  <h2 className="font-display mt-4 text-3xl tracking-tight sm:text-4xl">{p.name}</h2>
                  <p className="mt-3 text-muted">{p.tagline}</p>
                  <p className="mt-6 text-sm text-subtle">
                    {p.daysPerWeek} days · {p.duration} · {p.coaching}
                  </p>
                </div>
                <div className="mt-8 flex items-end justify-between">
                  <span className="text-lg">{p.price}</span>
                  <span className="text-sm text-muted group-hover:text-fg">View program</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
