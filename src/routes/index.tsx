import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/chrome";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  COACH,
  EXPERIENCE,
  FAQS,
  METHOD,
  PROBLEMS,
  PROGRAMS,
} from "@/lib/catalog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = PROGRAMS.filter((p) => p.slug !== "performance");
  return (
    <MarketingShell>
      <section className="relative min-h-[min(92dvh,52rem)] overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Athlete standing with a barbell in a quiet gym at dawn"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />
        <div className="relative mx-auto flex min-h-[min(92dvh,52rem)] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-24">
          <p className="reveal text-[12px] tracking-[0.28em] text-accent uppercase">
            Strength coaching · Lisbon / remote
          </p>
          <h1 className="reveal-2 font-display mt-5 max-w-3xl text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.95] tracking-[-0.04em] text-fg">
            Get stronger
            <br />
            <em className="font-display italic font-normal text-primary/90">without guessing.</em>
          </h1>
          <p className="reveal-3 mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Northline is personalized coaching for people who are serious about
            becoming stronger — and done collecting programs they never finish.
          </p>
          <div className="reveal-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl">
              <Link to="/assessment">
                Start your transformation
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="xl">
              <Link to="/programs">View programs</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-subtle">
            A system. A coach. A week you can actually complete.
          </p>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="mx-auto grid max-w-6xl gap-px bg-border sm:grid-cols-3">
          {[
            ["The Line", "One plan. Next session already written."],
            ["A coach who reads", "Weekly check-ins with a reply, not a template."],
            ["Progress you can see", "Load, consistency, the boring graph that matters."],
          ].map(([t, b]) => (
            <div key={t} className="bg-bg px-6 py-8 sm:px-8">
              <p className="font-display text-xl text-fg">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">The usual mess</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl tracking-tight sm:text-5xl">
          You don’t need more workouts. You need a line to follow.
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <article key={p.title}>
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="font-display mt-3 text-2xl tracking-tight">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[22rem]">
            <img
              src="/images/method.jpg"
              alt="Coach observing an athlete during a press"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="px-5 py-16 sm:px-12 sm:py-20">
            <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">The Line</p>
            <h2 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
              Four moves. Then we repeat them on purpose.
            </h2>
            <ol className="mt-10 space-y-8">
              {METHOD.map((m) => (
                <li key={m.n} className="grid grid-cols-[auto_1fr] gap-5">
                  <span className="font-mono text-sm text-accent">{m.n}</span>
                  <div>
                    <p className="font-display text-2xl">{m.title}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild variant="secondary" className="mt-10">
              <Link to="/method">
                Read the method
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Programs</p>
            <h2 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
              Pick a line. Or have one written for you.
            </h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/programs">All programs</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {featured.map((p) => (
            <Link
              key={p.slug}
              to="/programs/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-xl border border-border bg-bg-elevated"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={p.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-bg/80 text-fg backdrop-blur-sm" variant="bone">
                  {p.kicker}
                </Badge>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl tracking-tight">{p.name}</h3>
                  <span className="shrink-0 text-sm text-muted">{p.price}</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.tagline}</p>
                <p className="mt-5 text-sm text-subtle">
                  {p.daysPerWeek} days · {p.duration}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-bg-elevated">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Inside the week</p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl tracking-tight sm:text-5xl">
            After you join, the app answers one question: what do I do today?
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERIENCE.map((e) => (
              <article key={e.n}>
                <span className="font-mono text-xs text-accent">{e.n}</span>
                <h3 className="font-display mt-3 text-2xl">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{e.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative">
          <img
            src={COACH.image}
            alt={`${COACH.name}, ${COACH.role}`}
            className="aspect-[3/4] w-full rounded-xl object-cover"
          />
        </div>
        <div>
          <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Coach</p>
          <h2 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">{COACH.name}</h2>
          <p className="mt-2 text-sm text-muted">{COACH.role} · {COACH.location}</p>
          <div className="mt-8 space-y-4 text-[16px] leading-relaxed text-muted">
            {COACH.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>{COACH.approach}</p>
          </div>
          <Button asChild className="mt-8" variant="secondary">
            <Link to="/method">Meet the practice</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Questions</p>
          <h2 className="font-display mt-3 text-4xl tracking-tight">Before you start.</h2>
          <Accordion className="mt-10" items={FAQS} />
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border">
        <img
          src="/images/lifestyle.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-bg/70" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:py-32">
          <h2 className="font-display text-4xl tracking-tight sm:text-6xl">
            The next session is already waiting.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-muted">
            Take the assessment. We’ll point you at a program — or at a conversation.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link to="/assessment">Start your transformation</Link>
            </Button>
            <Button asChild variant="secondary" size="xl">
              <Link to="/book">Book a consult</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
