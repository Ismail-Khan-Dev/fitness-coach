import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { completeWorkout, getSession, logSet } from "@/lib/server/app";
import { exerciseBySlug } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/train/$id")({
  component: Train,
});

function Train() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["session", id],
    queryFn: () => getSession({ data: { id } }),
  });
  const [exIndex, setExIndex] = useState(0);
  const [rest, setRest] = useState<number | null>(null);
  const [feeling, setFeeling] = useState<number>(3);
  const [notes, setNotes] = useState("");
  const [finishing, setFinishing] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  const restActive = rest !== null;
  useEffect(() => {
    if (!restActive) return;
    timerRef.current = window.setInterval(() => {
      setRest((r) => {
        if (r === null || r <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          return null;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [restActive]);

  const data = q.data;
  const template = data?.template;
  const blocks = template?.blocks ?? [];
  const block = blocks[exIndex];
  const exercise = block ? exerciseBySlug(block.exercise) : undefined;
  const logs = useMemo(() => {
    if (!data || !block) return [];
    return data.logs
      .filter((l) => l.exercise_slug === block.exercise)
      .sort((a, b) => a.set_index - b.set_index);
  }, [data, block]);

  const totalSets = data?.logs.length ?? 0;
  const doneSets = data?.logs.filter((l) => l.completed).length ?? 0;

  async function toggleSet(
    logId: string,
    current: { weight: string | null; reps: number | null; completed: boolean },
    nextWeight: number | null,
    nextReps: number | null,
    complete: boolean,
  ) {
    await logSet({
      data: {
        id: logId,
        weight: nextWeight,
        reps: nextReps,
        completed: complete,
      },
    });
    await qc.invalidateQueries({ queryKey: ["session", id] });
    if (complete && !current.completed && block) setRest(block.restSec);
  }

  async function finish() {
    setFinishing(true);
    try {
      await completeWorkout({ data: { sessionId: id, feeling, notes } });
      setDone(true);
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch {
      toast.error("Could not complete the session.");
    } finally {
      setFinishing(false);
    }
  }

  if (q.isLoading) return <div className="min-h-dvh bg-bg" />;
  if (!data || !template) {
    return (
      <div className="px-5 py-16">
        <p className="text-muted">Session not found.</p>
        <Link to="/app" className="mt-4 inline-block text-sm">
          Back to today
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <p className="text-[12px] tracking-[0.22em] text-accent uppercase">Session in the book</p>
        <h1 className="font-display mt-3 text-4xl">That’s the line.</h1>
        <p className="mt-3 max-w-sm text-muted">
          {doneSets} sets logged. Rest, eat, show up next time.
        </p>
        <Button className="mt-8" onClick={() => nav({ to: "/app" })}>
          Back to today
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg md:min-h-0">
      <header className="flex items-center justify-between px-2 py-2">
        <button
          type="button"
          className="grid size-11 place-items-center rounded-md text-muted hover:text-fg"
          onClick={() => nav({ to: "/app" })}
          aria-label="Close session"
        >
          <X className="size-5" />
        </button>
        <div className="text-center">
          <p className="text-xs tracking-[0.14em] text-subtle uppercase">{template.name}</p>
          <p className="text-sm text-muted">
            {exIndex + 1} / {blocks.length}
          </p>
        </div>
        <div className="w-11" />
      </header>
      <Progress value={totalSets ? (doneSets / totalSets) * 100 : 0} className="rounded-none" />

      {block && exercise && (
        <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
          <p className="text-[12px] tracking-[0.18em] text-accent uppercase">{exercise.muscle}</p>
          <h1 className="font-display mt-1 text-4xl tracking-tight">{exercise.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {block.sets} × {block.reps}
            {block.rpe ? ` · RPE ${block.rpe}` : ""} · rest {block.restSec}s
          </p>
          {block.notes && <p className="mt-2 text-sm text-muted">{block.notes}</p>}

          <ul className="mt-6 space-y-2">
            {logs.map((log) => (
              <SetRow
                key={log.id}
                log={log}
                prescribed={block.reps}
                onSave={(w, r, c) =>
                  toggleSet(log.id, log, w, r, c)
                }
              />
            ))}
          </ul>

          <details className="mt-6 text-sm text-muted">
            <summary className="cursor-pointer text-fg">Cues</summary>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {exercise.cues.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs tracking-[0.14em] text-subtle uppercase">Common misses</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {exercise.mistakes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </details>

          <div className="mt-auto flex items-center justify-between pt-8">
            <Button
              variant="ghost"
              disabled={exIndex === 0}
              onClick={() => setExIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            {exIndex < blocks.length - 1 ? (
              <Button variant="secondary" onClick={() => setExIndex((i) => i + 1)}>
                Next lift
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={() => document.getElementById("finish")?.scrollIntoView({ behavior: "smooth" })}>
                Finish
              </Button>
            )}
          </div>

          {exIndex === blocks.length - 1 && (
            <div id="finish" className="mt-10 rounded-xl border border-border p-5">
              <p className="font-display text-2xl">How did it go?</p>
              <div className="mt-4 flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFeeling(n)}
                    className={cn(
                      "size-11 rounded-md border text-sm tabular",
                      feeling === n ? "border-primary bg-surface" : "border-border",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <Textarea
                className="mt-4"
                placeholder="Anything Elena should see."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button className="mt-4 w-full" onClick={finish} disabled={finishing}>
                {finishing ? "Saving…" : "Complete session"}
              </Button>
            </div>
          )}
        </div>
      )}

      {rest !== null && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg/90 px-6">
          <p className="text-[12px] tracking-[0.2em] text-subtle uppercase">Rest</p>
          <p className="font-display mt-2 text-7xl tabular">{formatRest(rest)}</p>
          <Button className="mt-8" variant="secondary" onClick={() => setRest(null)}>
            Skip rest
          </Button>
        </div>
      )}
    </div>
  );
}

function formatRest(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function SetRow({
  log,
  prescribed,
  onSave,
}: {
  log: { id: string; set_index: number; weight: string | null; reps: number | null; completed: boolean };
  prescribed: string;
  onSave: (w: number | null, r: number | null, c: boolean) => Promise<void>;
}) {
  const [w, setW] = useState(log.weight ?? "");
  const [r, setR] = useState(log.reps?.toString() ?? prescribed.replace(/[^0-9].*/, "") ?? "");
  const [busy, setBusy] = useState(false);

  async function complete() {
    setBusy(true);
    try {
      await onSave(w === "" ? null : Number(w), r === "" ? null : Number(r), !log.completed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2",
        log.completed ? "border-accent/40 bg-accent/10" : "border-border",
      )}
    >
      <span className="w-8 font-mono text-xs text-subtle tabular">{log.set_index}</span>
      <label className="sr-only" htmlFor={`w-${log.id}`}>
        Weight
      </label>
      <Input
        id={`w-${log.id}`}
        inputMode="decimal"
        className="h-10 w-20"
        value={w}
        onChange={(e) => setW(e.target.value)}
        placeholder="kg"
      />
      <span className="text-xs text-subtle">×</span>
      <label className="sr-only" htmlFor={`r-${log.id}`}>
        Reps
      </label>
      <Input
        id={`r-${log.id}`}
        inputMode="numeric"
        className="h-10 w-16"
        value={r}
        onChange={(e) => setR(e.target.value)}
      />
      <button
        type="button"
        onClick={complete}
        disabled={busy}
        className={cn(
          "ml-auto grid size-11 place-items-center rounded-md border",
          log.completed ? "border-accent bg-accent text-accent-fg" : "border-border text-muted",
        )}
        aria-label={log.completed ? "Undo set" : "Complete set"}
      >
        <Check className="size-4" />
      </button>
    </li>
  );
}
