import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/chrome";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PROGRAMS, programBySlug, recommendProgram } from "@/lib/catalog";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { saveAssessment } from "@/lib/server/app";
import { toast } from "sonner";

export const Route = createFileRoute("/assessment")({
  component: Assessment,
  head: () => ({ meta: [{ title: "Assessment — Northline" }] }),
});

const STEPS = [
  {
    id: "goal",
    q: "What are you actually here for?",
    hint: "Pick the one that would make the next six months feel like it worked.",
    options: [
      { v: "strength", l: "Get stronger on the big lifts" },
      { v: "composition", l: "Change how I look, without a circus" },
      { v: "return", l: "Get back on the wagon" },
      { v: "sport", l: "Support a sport I already play" },
      { v: "custom", l: "I need this written around my life" },
    ],
  },
  {
    id: "experience",
    q: "How long have you trained — honestly?",
    hint: "Count the years you actually trained, not the years you meant to.",
    options: [
      { v: "new", l: "I’m new, or close to it" },
      { v: "inconsistent", l: "I know the shapes. I keep stopping." },
      { v: "intermediate", l: "1–3 years, with some structure" },
      { v: "advanced", l: "I have a history under the bar" },
    ],
  },
  {
    id: "days",
    q: "How many days can you protect?",
    hint: "Not the fantasy week. The week that survives Thursday.",
    options: [
      { v: "2", l: "Two" },
      { v: "3", l: "Three" },
      { v: "4", l: "Four" },
      { v: "5", l: "Five or more" },
      { v: "varies", l: "It changes every week" },
    ],
  },
  {
    id: "equipment",
    q: "Where do you train?",
    options: [
      { v: "full", l: "A gym with a bar, rack, and cables" },
      { v: "dumbbells", l: "Dumbbells, maybe a bench" },
      { v: "home", l: "A corner of the apartment" },
      { v: "mixed", l: "It depends on the week" },
    ],
  },
  {
    id: "challenge",
    q: "What usually knocks you off?",
    options: [
      { v: "plan", l: "I don’t know what to do next" },
      { v: "time", l: "The calendar eats the session" },
      { v: "progress", l: "I work hard and the bar doesn’t move" },
      { v: "alone", l: "Nobody is watching, so I drift" },
    ],
  },
  {
    id: "coaching",
    q: "How close do you want the coach?",
    options: [
      { v: "program", l: "A program and a weekly check-in is enough" },
      { v: "hybrid", l: "Program, plus someone in the messages" },
      { v: "private", l: "Write it for me. Stay in the week." },
    ],
  },
];

function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const current = STEPS[step];
  const recommended = useMemo(() => recommendProgram(answers), [answers]);
  const program = programBySlug(recommended);

  function pick(v: string) {
    const next = { ...answers, [current.id]: v };
    setAnswers(next);
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  }

  async function persist() {
    if (!user) {
      await navigate({ to: "/login" });
      return;
    }
    setSaving(true);
    try {
      await saveAssessment({ data: { answers } });
      toast.success("Assessment saved.");
      await navigate({ to: "/enroll/$slug", params: { slug: recommended } });
    } catch {
      toast.error("Could not save. Sign in and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <MarketingShell>
      <section className="mx-auto min-h-[70dvh] max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
        {!done ? (
          <>
            <div className="flex items-center justify-between text-xs tracking-[0.16em] text-subtle uppercase">
              <span>Assessment</span>
              <span>
                {step + 1} / {STEPS.length}
              </span>
            </div>
            <Progress value={((step + 1) / STEPS.length) * 100} className="mt-4" />
            <h1 className="font-display mt-10 text-4xl tracking-tight sm:text-5xl">{current.q}</h1>
            {current.hint && <p className="mt-4 text-muted">{current.hint}</p>}
            <div className="mt-10 flex flex-col gap-3">
              {current.options.map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => pick(o.v)}
                  className="rounded-lg border border-border bg-bg-elevated px-5 py-4 text-left text-[16px] transition-colors hover:border-border-strong hover:bg-surface"
                >
                  {o.l}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                type="button"
                className="mt-8 text-sm text-muted hover:text-fg"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
          </>
        ) : (
          <div>
            <p className="text-[12px] tracking-[0.22em] text-accent uppercase">A line for you</p>
            <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
              {program?.name}
            </h1>
            <p className="mt-4 text-lg text-muted">{program?.tagline}</p>
            <p className="mt-6 leading-relaxed text-muted">
              This is a recommendation, not a diagnosis and not a promise. If it doesn’t fit, take the consult — that’s what it’s for.
            </p>
            <div className="mt-8 overflow-hidden rounded-xl border border-border">
              <img src={program?.image} alt="" className="aspect-[16/8] w-full object-cover" />
              <div className="p-6">
                <p className="text-sm text-subtle">
                  {program?.daysPerWeek} days · {program?.duration} · {program?.price}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={persist} disabled={saving || isPending} size="lg">
                {user ? "Continue to enrollment" : "Sign in to continue"}
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/programs/$slug" params={{ slug: recommended }}>
                  Read the program
                </Link>
              </Button>
            </div>
            <button
              type="button"
              className="mt-6 text-sm text-muted hover:text-fg"
              onClick={() => {
                setDone(false);
                setStep(0);
              }}
            >
              Start over
            </button>
            <p className="mt-10 text-xs text-subtle">
              Other programs:{" "}
              {PROGRAMS.filter((p) => p.slug !== recommended)
                .map((p) => p.name)
                .join(" · ")}
            </p>
          </div>
        )}
      </section>
    </MarketingShell>
  );
}
