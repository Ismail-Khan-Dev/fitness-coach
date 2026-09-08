import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/chrome";
import { Button } from "@/components/ui/button";
import { COACH, METHOD } from "@/lib/catalog";

export const Route = createFileRoute("/method")({
  component: Method,
  head: () => ({ meta: [{ title: "The Line — Northline" }] }),
});

function Method() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">The Line</p>
        <h1 className="font-display mt-3 text-5xl tracking-tight sm:text-6xl">
          A method you can explain in a minute, and live in for a year.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Northline is not a content mill and it is not a bootcamp. It is a coaching practice: locate where you are, draw a line, stay on it, progress on purpose.
        </p>
      </section>
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          {METHOD.map((m) => (
            <article key={m.n} className="border-b border-border px-5 py-12 sm:px-10 lg:border-r lg:odd:border-r lg:[&:nth-child(2n)]:border-r-0">
              <span className="font-mono text-sm text-accent">{m.n}</span>
              <h2 className="font-display mt-3 text-3xl">{m.title}</h2>
              <p className="mt-3 max-w-md text-muted">{m.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
        <img src={COACH.image} alt={COACH.name} className="aspect-[3/4] rounded-xl object-cover" />
        <div>
          <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Elena Cho</p>
          <h2 className="font-display mt-3 text-4xl">The person on the other side of the check-in.</h2>
          <div className="mt-6 space-y-4 text-muted">
            {COACH.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>{COACH.approach}</p>
          </div>
          <p className="mt-6 text-sm text-subtle">
            Northline is a coaching practice, not a clinic. We do not diagnose, prescribe, or promise bodies.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/book">Book a consult</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/assessment">Take the assessment</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
