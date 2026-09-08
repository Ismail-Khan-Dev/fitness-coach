import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { listCheckins, submitCheckin } from "@/lib/server/app";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/checkin")({ component: Checkin });

function Score({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-subtle uppercase">{label}</p>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "size-11 rounded-md border tabular",
              value === n ? "border-primary bg-surface" : "border-border text-muted",
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function Checkin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["checkins"], queryFn: () => listCheckins() });
  const [training, setTraining] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [stress, setStress] = useState(3);
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [questions, setQuestions] = useState("");
  const [weight, setWeight] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await submitCheckin({
        data: {
          training,
          energy,
          sleep,
          stress,
          wins,
          challenges,
          questions,
          weight: weight ? Number(weight) : undefined,
        },
      });
      toast.success("Check-in in. Elena will read it.");
      setWins("");
      setChallenges("");
      setQuestions("");
      await qc.invalidateQueries({ queryKey: ["checkins"] });
    } catch {
      toast.error("Could not submit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-5 py-8 md:px-0">
      <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Weekly check-in</p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">Five honest answers.</h1>
      <p className="mt-3 max-w-lg text-muted">
        This is how the program changes. Empty heroics help nobody.
      </p>

      <div className="mt-10 space-y-8">
        <Score label="Training quality" value={training} onChange={setTraining} />
        <Score label="Energy" value={energy} onChange={setEnergy} />
        <Score label="Sleep" value={sleep} onChange={setSleep} />
        <Score label="Stress" value={stress} onChange={setStress} />
        <div className="space-y-1.5">
          <Label>Wins</Label>
          <Textarea value={wins} onChange={(e) => setWins(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>What got in the way</Label>
          <Textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Questions for Elena</Label>
          <Textarea value={questions} onChange={(e) => setQuestions(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Weight (optional)</Label>
          <Input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <Button size="lg" onClick={submit} disabled={busy}>
          {busy ? "Sending…" : "Submit check-in"}
        </Button>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl">Previous</h2>
        {(q.data ?? []).length === 0 && <p className="mt-3 text-sm text-muted">None yet.</p>}
        <ul className="mt-4 space-y-4">
          {(q.data ?? []).map((c) => (
            <li key={c.id} className="rounded-lg border border-border p-4 text-sm">
              <p className="text-xs text-subtle">{format(new Date(c.created_at), "d MMMM yyyy")}</p>
              <p className="mt-2 text-muted">
                Training {c.training} · Energy {c.energy} · Sleep {c.sleep} · Stress {c.stress}
              </p>
              {c.wins && <p className="mt-2">{c.wins}</p>}
              {c.coach_reply && (
                <p className="mt-3 border-t border-border pt-3 text-muted">Elena: {c.coach_reply}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
