import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addProgress, addGoal, getProgress } from "@/lib/server/app";
import { exerciseBySlug } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/app/progress")({ component: ProgressPage });

function ProgressPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["progress"], queryFn: () => getProgress() });
  const [kind, setKind] = useState("bodyweight");
  const [value, setValue] = useState("");
  const [goal, setGoal] = useState("");

  if (q.isLoading) {
    return (
      <div className="space-y-4 p-5">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }
  const d = q.data;
  if (!d) return null;

  const chart = d.volume.map((v) => ({
    day: v.day.slice(5),
    sets: v.sets,
    volume: Number(v.volume),
  }));

  async function logMetric() {
    if (!value) return;
    await addProgress({ data: { kind, value: Number(value), unit: kind === "bodyweight" ? "kg" : undefined } });
    setValue("");
    toast.success("Logged.");
    await qc.invalidateQueries({ queryKey: ["progress"] });
  }

  async function saveGoal() {
    if (!goal.trim()) return;
    await addGoal({ data: { title: goal, target: 12, unit: "sessions" } });
    setGoal("");
    await qc.invalidateQueries({ queryKey: ["progress"] });
  }

  return (
    <div className="px-5 py-8 md:px-0">
      <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Progress</p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">The boring graph that matters.</h1>

      <section className="mt-8 rounded-xl border border-border p-5">
        <p className="text-xs tracking-[0.16em] text-subtle uppercase">Sets logged</p>
        <div className="mt-4 h-56">
          {chart.length === 0 ? (
            <p className="pt-16 text-center text-sm text-muted">Complete a session to see the line.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <CartesianGrid stroke="rgba(241,239,232,0.08)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#9a9a91", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9a9a91", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{ background: "#1a1c17", border: "1px solid rgba(241,239,232,0.12)", borderRadius: 12 }}
                />
                <Area type="monotone" dataKey="sets" stroke="#a8b5a4" fill="rgba(168,181,164,0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl">Best logged loads</h2>
        {d.lifts.length === 0 && <p className="mt-3 text-sm text-muted">No loads logged yet.</p>}
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {d.lifts.map((l) => (
            <li key={l.exercise_slug} className="flex items-center justify-between py-3">
              <span>{exerciseBySlug(l.exercise_slug)?.name ?? l.exercise_slug}</span>
              <span className="font-mono text-sm tabular">{l.best}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl">Sessions</h2>
        {d.sessions.filter((s) => s.completed_at).length === 0 && (
          <p className="mt-3 text-sm text-muted">None completed yet.</p>
        )}
        <ul className="mt-4 space-y-2">
          {d.sessions
            .filter((s) => s.completed_at)
            .slice(0, 12)
            .map((s) => (
              <li key={s.id} className="flex justify-between rounded-lg border border-border px-4 py-3 text-sm">
                <span>
                  Week {s.week} · Day {s.day}
                </span>
                <span className="text-subtle">{format(new Date(s.completed_at!), "d MMM")}</span>
              </li>
            ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-border p-5">
        <h2 className="font-display text-2xl">Log a metric</h2>
        <p className="mt-1 text-sm text-muted">Voluntary. Never required.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select
            className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="bodyweight">Bodyweight</option>
            <option value="sleep">Sleep hours</option>
            <option value="waist">Waist</option>
          </select>
          <Input
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
          />
          <Button onClick={logMetric}>Save</Button>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-muted">
          {d.entries.slice(0, 6).map((e) => (
            <li key={e.id} className="flex justify-between">
              <span>
                {e.kind}
                {e.label ? ` · ${e.label}` : ""}
              </span>
              <span className="tabular">
                {e.value} {e.unit ?? ""}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 mb-8 rounded-xl border border-border p-5">
        <h2 className="font-display text-2xl">Add a goal</h2>
        <div className="mt-4 flex gap-3">
          <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Train 12 sessions this month" />
          <Button variant="secondary" onClick={saveGoal}>
            Add
          </Button>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {d.goals.map((g) => (
            <li key={g.id} className="flex justify-between">
              <span>{g.title}</span>
              <span className="text-subtle">
                {g.current}/{g.target ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
