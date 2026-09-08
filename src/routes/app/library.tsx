import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { EQUIP_LABEL, EXERCISES, MUSCLE_LABEL, type MuscleGroup } from "@/lib/catalog";
import { getFavorites, toggleFavorite } from "@/lib/server/app";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/library")({ component: LiftLibrary });

function LiftLibrary() {
  const qc = useQueryClient();
  const favs = useQuery({ queryKey: ["favorites"], queryFn: () => getFavorites() });
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    return EXERCISES.filter((e) => {
      if (muscle !== "all" && e.muscle !== muscle) return false;
      if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, muscle]);

  const favSet = new Set(favs.data ?? []);

  return (
    <div className="px-5 py-8 md:px-0">
      <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Exercise library</p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">The lifts.</h1>
      <Input
        className="mt-6"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <Chip on={muscle === "all"} onClick={() => setMuscle("all")}>
          All
        </Chip>
        {(Object.keys(MUSCLE_LABEL) as MuscleGroup[]).map((m) => (
          <Chip key={m} on={muscle === m} onClick={() => setMuscle(m)}>
            {MUSCLE_LABEL[m]}
          </Chip>
        ))}
      </div>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {list.map((e) => {
          const isOpen = open === e.slug;
          const loved = favSet.has(e.slug);
          return (
            <li key={e.slug} className="py-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="flex-1 text-left"
                  onClick={() => setOpen(isOpen ? null : e.slug)}
                >
                  <p className="font-display text-xl">{e.name}</p>
                  <p className="text-xs text-subtle">
                    {MUSCLE_LABEL[e.muscle]} · {EQUIP_LABEL[e.equipment]} · {e.difficulty}
                  </p>
                </button>
                <button
                  type="button"
                  className="grid size-11 place-items-center"
                  aria-label={loved ? "Unfavourite" : "Favourite"}
                  onClick={async () => {
                    await toggleFavorite({ data: { slug: e.slug } });
                    await qc.invalidateQueries({ queryKey: ["favorites"] });
                  }}
                >
                  <Heart className={cn("size-5", loved ? "fill-accent text-accent" : "text-muted")} />
                </button>
              </div>
              {isOpen && (
                <div className="mt-4 space-y-3 text-sm text-muted">
                  <ol className="list-decimal space-y-1 pl-5">
                    {e.instructions.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ol>
                  <p className="text-xs tracking-[0.14em] text-subtle uppercase">Cues</p>
                  <p>{e.cues.join(" · ")}</p>
                  <p className="text-xs tracking-[0.14em] text-subtle uppercase">Common misses</p>
                  <p>{e.mistakes.join(" · ")}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full border px-3 text-xs tracking-[0.08em] uppercase",
        on ? "border-primary bg-surface text-fg" : "border-border text-muted",
      )}
    >
      {children}
    </button>
  );
}
