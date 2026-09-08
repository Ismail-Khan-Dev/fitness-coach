import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageSquare } from "lucide-react";
import { getDashboard, startWorkout } from "@/lib/server/app";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { exerciseBySlug } from "@/lib/catalog";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/app/")({ component: Today });

function Today() {
  const nav = useNavigate();
  const q = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
  const [starting, setStarting] = useState(false);
  const d = q.data;

  async function go() {
    if (!d?.today || !d.enrollment) return;
    setStarting(true);
    try {
      const res = await startWorkout({
        data: {
          programSlug: d.enrollment.program_slug,
          workoutId: d.today.template.id,
          week: d.today.week,
          day: d.today.day,
        },
      });
      await nav({ to: "/app/train/$id", params: { id: res.id } });
    } catch {
      toast.error("Could not start the session.");
    } finally {
      setStarting(false);
    }
  }

  if (q.isLoading) {
    return (
      <div className="space-y-4 p-5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!d) {
    return <p className="p-5 text-muted">Could not load today.</p>;
  }

  const name = d.profile.display_name?.split(" ")[0] ?? "there";

  return (
    <div className="px-5 py-8 md:px-0">
      <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">
        {format(new Date(), "EEEE d MMMM")}
      </p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">Today, {name}.</h1>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="overflow-hidden rounded-xl border border-border bg-bg-elevated">
          {d.today ? (
            <>
              <div className="relative aspect-[16/8]">
                <img
                  src={d.program?.image ?? "/images/hero.jpg"}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated to-transparent" />
              </div>
              <div className="p-6">
                <p className="text-xs tracking-[0.16em] text-accent uppercase">
                  Week {d.today.week} · Day {d.today.day}
                </p>
                <h2 className="font-display mt-2 text-3xl">{d.today.template.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {d.today.template.focus} · {d.today.template.durationMin} min · {d.program?.name}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-muted">
                  {d.today.template.blocks.map((b) => (
                    <li key={b.exercise} className="flex justify-between gap-3">
                      <span>{exerciseBySlug(b.exercise)?.name}</span>
                      <span className="font-mono text-xs tabular">
                        {b.sets} × {b.reps}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full sm:w-auto" size="lg" onClick={go} disabled={starting}>
                  {d.today.sessionId ? "Continue session" : "Start workout"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="p-8">
              <h2 className="font-display text-3xl">No session on the line yet.</h2>
              <p className="mt-3 text-muted">
                Enroll in a program, or take the assessment if you want us to point.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/assessment">Take the assessment</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/programs">View programs</Link>
                </Button>
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-border p-5">
            <p className="text-xs tracking-[0.16em] text-subtle uppercase">This week</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat label="Sessions" value={d.stats.weekDone} />
              <Stat label="Streak" value={d.stats.streak} />
              <Stat label="Logged" value={d.stats.completed} />
            </div>
            <Progress
              className="mt-5"
              value={Math.min(100, (d.stats.weekDone / Math.max(1, d.program?.daysPerWeek ?? 3)) * 100)}
            />
          </section>

          <section className="rounded-xl border border-border p-5">
            <p className="text-xs tracking-[0.16em] text-subtle uppercase">Coach</p>
            {d.latestMessage ? (
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">{d.latestMessage.body}</p>
            ) : (
              <p className="mt-3 text-sm text-muted">No messages yet.</p>
            )}
            <Link
              to="/app/messages"
              className="mt-4 inline-flex items-center gap-2 text-sm text-fg hover:underline"
            >
              <MessageSquare className="size-4" />
              Open thread
              {d.stats.unread > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-fg">
                  {d.stats.unread}
                </span>
              )}
            </Link>
          </section>

          <section className="rounded-xl border border-border p-5">
            <p className="text-xs tracking-[0.16em] text-subtle uppercase">Goals</p>
            {d.goals.length === 0 && <p className="mt-3 text-sm text-muted">No goals yet.</p>}
            <ul className="mt-3 space-y-3">
              {d.goals.map((g) => {
                const cur = Number(g.current ?? 0);
                const tgt = Number(g.target ?? 0);
                const pct = tgt ? Math.min(100, (cur / tgt) * 100) : 0;
                return (
                  <li key={g.id}>
                    <div className="flex justify-between text-sm">
                      <span>{g.title}</span>
                      <span className="tabular text-subtle">
                        {cur}/{tgt || "—"}
                      </span>
                    </div>
                    <Progress value={pct} className="mt-2" />
                  </li>
                );
              })}
            </ul>
          </section>

          {d.stats.checkinDue && (
            <Link
              to="/app/checkin"
              className="rounded-xl border border-accent/40 bg-accent/10 p-5 text-sm"
            >
              Weekly check-in is due. Five honest answers.
            </Link>
          )}

          {d.upcoming && (
            <div className="rounded-xl border border-border p-5 text-sm">
              <p className="text-xs tracking-[0.16em] text-subtle uppercase">Upcoming</p>
              <p className="mt-2">
                {d.upcoming.service} · {format(new Date(d.upcoming.starts_at), "EEE d MMM, HH:mm")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-3xl tabular">{value}</p>
      <p className="text-[11px] tracking-[0.12em] text-subtle uppercase">{label}</p>
    </div>
  );
}
