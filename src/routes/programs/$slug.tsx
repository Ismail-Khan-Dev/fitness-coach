import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/chrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion } from "@/components/ui/accordion";
import { FAQS, exerciseBySlug, programBySlug } from "@/lib/catalog";

export const Route = createFileRoute("/programs/$slug")({
  component: ProgramDetail,
  loader: ({ params }) => {
    const program = programBySlug(params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.program.name ?? "Program"} — Northline` }],
  }),
});

function ProgramDetail() {
  const { program } = Route.useLoaderData();
  return (
    <MarketingShell>
      <section className="relative min-h-[28rem] overflow-hidden">
        <img src={program.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" />
        <div className="relative mx-auto flex min-h-[28rem] max-w-6xl flex-col justify-end px-5 pb-12 sm:px-8">
          <Badge className="bg-bg/80 text-fg backdrop-blur-sm" variant="bone">{program.kicker}</Badge>
          <h1 className="font-display mt-4 text-5xl tracking-tight sm:text-7xl">{program.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{program.tagline}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Who it’s for</p>
          <p className="mt-4 text-lg leading-relaxed text-fg">{program.who}</p>
          <p className="mt-4 text-muted">{program.notFor}</p>

          <p className="mt-12 text-[12px] tracking-[0.22em] text-subtle uppercase">The outcome</p>
          <p className="mt-4 text-lg leading-relaxed">{program.goal}</p>

          <div className="mt-12 space-y-8">
            {program.structure.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-2xl">{s.title}</h2>
                <p className="mt-2 text-muted">{s.body}</p>
              </div>
            ))}
          </div>

          {program.workouts.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-3xl">A week on the program</h2>
              <div className="mt-6 space-y-4">
                {program.workouts.map((w) => (
                  <div key={w.id} className="rounded-lg border border-border p-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl">{w.name}</h3>
                      <span className="text-xs text-subtle">
                        {w.focus} · {w.durationMin} min
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted">
                      {w.blocks.map((b) => (
                        <li key={b.exercise} className="flex justify-between gap-4">
                          <span>{exerciseBySlug(b.exercise)?.name ?? b.exercise}</span>
                          <span className="font-mono text-xs tabular">
                            {b.sets} × {b.reps}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-xl border border-border bg-bg-elevated p-6">
          <p className="font-display text-3xl">{program.price}</p>
          <p className="mt-2 text-sm text-muted">{program.priceNote}</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Audience</dt>
              <dd className="text-right">{program.audience}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Duration</dt>
              <dd>{program.duration}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Days</dt>
              <dd>{program.daysPerWeek} / week</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Coaching</dt>
              <dd className="text-right">{program.coaching}</dd>
            </div>
          </dl>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            {program.includes.map((i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">—</span>
                {i}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8 w-full" size="lg">
            <Link to="/enroll/$slug" params={{ slug: program.slug }}>
              Begin {program.name}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" className="mt-3 w-full">
            <Link to="/book">Book a consult first</Link>
          </Button>
          <p className="mt-4 text-xs text-subtle">
            Preview enrollment does not collect a card. Billing UI is shown for the product flow.
          </p>
        </aside>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24">
        <h2 className="font-display text-3xl">Questions</h2>
        <Accordion className="mt-6" items={FAQS.slice(0, 4)} />
      </section>
    </MarketingShell>
  );
}
