import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { askNorthline, replyCheckin, studioCheckins } from "@/lib/server/app";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/studio/checkins")({ component: StudioCheckins });

function StudioCheckins() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["studio-checkins"], queryFn: () => studioCheckins() });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div>
      <h1 className="font-display text-4xl tracking-tight">Check-ins</h1>
      <ul className="mt-8 space-y-6">
        {(q.data ?? []).map((c) => (
          <li key={c.id} className="rounded-xl border border-border p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Link
                to="/studio/clients/$id"
                params={{ id: c.user_id }}
                className="font-display text-2xl hover:text-primary"
              >
                {c.display_name || "Client"}
              </Link>
              <span className="text-xs text-subtle">{format(new Date(c.created_at), "d MMM")}</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Training {c.training} · Energy {c.energy} · Sleep {c.sleep} · Stress {c.stress}
            </p>
            {c.wins && <p className="mt-3 text-sm">{c.wins}</p>}
            {c.challenges && <p className="mt-1 text-sm text-muted">{c.challenges}</p>}
            {c.questions && <p className="mt-1 text-sm text-muted">{c.questions}</p>}
            {c.coach_reply ? (
              <p className="mt-4 border-t border-border pt-3 text-sm text-muted">Reply: {c.coach_reply}</p>
            ) : (
              <div className="mt-4 space-y-2">
                <Textarea
                  value={drafts[c.id] ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                  placeholder="Reply"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      const reply = drafts[c.id]?.trim();
                      if (!reply) return;
                      await replyCheckin({ data: { id: c.id, reply } });
                      toast.success("Sent.");
                      await qc.invalidateQueries({ queryKey: ["studio-checkins"] });
                    }}
                  >
                    Send reply
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy === c.id}
                    onClick={async () => {
                      setBusy(c.id);
                      try {
                        const res = await askNorthline({
                          data: {
                            kind: "checkin",
                            payload: JSON.stringify(c),
                          },
                        });
                        if (res.ok) setDrafts((d) => ({ ...d, [c.id]: res.text }));
                        else toast.error(res.error);
                      } finally {
                        setBusy(null);
                      }
                    }}
                  >
                    {busy === c.id ? "Drafting…" : "Draft with assistant"}
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
        {(q.data ?? []).length === 0 && <p className="text-sm text-muted">No check-ins yet.</p>}
      </ul>
    </div>
  );
}
