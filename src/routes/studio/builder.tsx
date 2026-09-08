import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { EXERCISES, PROGRAMS, exerciseBySlug } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/studio/builder")({ component: Builder });

type Block = { exercise: string; sets: number; reps: string; restSec: number };

function Builder() {
  const [name, setName] = useState("Custom session");
  const [focus, setFocus] = useState("Strength");
  const [blocks, setBlocks] = useState<Block[]>([
    { exercise: "back-squat", sets: 5, reps: "5", restSec: 180 },
  ]);
  const [saved, setSaved] = useState(false);

  const preview = useMemo(() => blocks, [blocks]);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Workout builder</p>
        <h1 className="font-display mt-2 text-4xl tracking-tight">Write the session.</h1>
        <p className="mt-3 text-sm text-muted">
          Templates live in the catalog. This builder drafts a session you can assign from a client page — saved to this practice for the preview.
        </p>
        <div className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Focus</Label>
            <Input value={focus} onChange={(e) => setFocus(e.target.value)} />
          </div>
          {blocks.map((b, i) => (
            <div key={i} className="grid grid-cols-12 items-end gap-2">
              <div className="col-span-5 space-y-1.5">
                <Label>Lift</Label>
                <select
                  className="h-11 w-full rounded-md border border-border bg-surface px-2 text-sm"
                  value={b.exercise}
                  onChange={(e) =>
                    setBlocks((rows) => rows.map((r, j) => (j === i ? { ...r, exercise: e.target.value } : r)))
                  }
                >
                  {EXERCISES.map((ex) => (
                    <option key={ex.slug} value={ex.slug}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Sets</Label>
                <Input
                  value={b.sets}
                  onChange={(e) =>
                    setBlocks((rows) =>
                      rows.map((r, j) => (j === i ? { ...r, sets: Number(e.target.value) || 0 } : r)),
                    )
                  }
                />
              </div>
              <div className="col-span-3 space-y-1.5">
                <Label>Reps</Label>
                <Input
                  value={b.reps}
                  onChange={(e) =>
                    setBlocks((rows) => rows.map((r, j) => (j === i ? { ...r, reps: e.target.value } : r)))
                  }
                />
              </div>
              <Button
                variant="ghost"
                className="col-span-2"
                onClick={() => setBlocks((rows) => rows.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              setBlocks((rows) => [...rows, { exercise: "plank", sets: 3, reps: "45s", restSec: 60 }])
            }
          >
            Add lift
          </Button>
          <Button
            onClick={() => {
              setSaved(true);
            }}
          >
            Save template
          </Button>
          {saved && <p className="text-sm text-accent">Template kept in this session. Assign from a client file.</p>}
        </div>
      </div>
      <aside className="rounded-xl border border-border p-6">
        <p className="text-xs tracking-[0.16em] text-subtle uppercase">Preview</p>
        <h2 className="font-display mt-2 text-3xl">{name}</h2>
        <p className="text-sm text-muted">{focus}</p>
        <ul className="mt-6 space-y-2 text-sm">
          {preview.map((b, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span>{exerciseBySlug(b.exercise)?.name}</span>
              <span className="tabular text-subtle">
                {b.sets} × {b.reps}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">Existing programs</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {PROGRAMS.map((p) => (
              <li key={p.slug}>
                {p.name} · {p.workouts.length} sessions
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
