import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  addCoachNote,
  assignProgram,
  coachMessage,
  studioClient,
} from "@/lib/server/app";
import { PROGRAMS } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/studio/clients/$id")({
  component: ClientDetail,
});

function ClientDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["studio-client", id],
    queryFn: () => studioClient({ data: { id } }),
  });
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [program, setProgram] = useState("strength");

  const d = q.data;
  if (q.isLoading) return <p className="text-muted">Loading…</p>;
  if (!d) return <p className="text-muted">Client not found.</p>;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Client</p>
        <h1 className="font-display mt-2 text-4xl">{d.profile.display_name || "Unnamed"}</h1>
        <p className="mt-2 text-sm text-muted">
          {d.profile.email} · {d.profile.goal || "no goal set"} · {d.enrollment?.program_slug ?? "no program"}
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Sessions</h2>
          {d.sessions.length === 0 && <p className="mt-2 text-sm text-muted">None logged.</p>}
          <ul className="mt-3 space-y-2 text-sm">
            {d.sessions.map((s) => (
              <li key={s.id} className="flex justify-between border-b border-border py-2">
                <span>
                  W{s.week}D{s.day} {s.completed_at ? "done" : "open"}
                </span>
                <span className="text-subtle">{format(new Date(s.started_at), "d MMM")}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Check-ins</h2>
          {d.checkins.length === 0 && <p className="mt-2 text-sm text-muted">None yet.</p>}
          <ul className="mt-3 space-y-3">
            {d.checkins.map((c) => (
              <li key={c.id} className="rounded-lg border border-border p-3 text-sm">
                <p className="text-xs text-subtle">{c.week_of}</p>
                <p className="mt-1 text-muted">
                  T{c.training} E{c.energy} S{c.sleep} R{c.stress}
                </p>
                {c.wins && <p className="mt-2">{c.wins}</p>}
                {c.questions && <p className="mt-1 text-muted">{c.questions}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">Assign program</p>
          <select
            className="mt-3 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          >
            {PROGRAMS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          <Button
            className="mt-3 w-full"
            variant="secondary"
            onClick={async () => {
              await assignProgram({ data: { clientId: id, programSlug: program } });
              toast.success("Assigned.");
              await qc.invalidateQueries({ queryKey: ["studio-client", id] });
            }}
          >
            Assign
          </Button>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">Message</p>
          <Textarea className="mt-3" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              await coachMessage({ data: { clientId: id, body: msg } });
              setMsg("");
              toast.success("Sent.");
              await qc.invalidateQueries({ queryKey: ["studio-client", id] });
            }}
          >
            Send
          </Button>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">Private notes</p>
          <Textarea className="mt-3" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button
            className="mt-3 w-full"
            variant="secondary"
            onClick={async () => {
              await addCoachNote({ data: { clientId: id, body: note } });
              setNote("");
              await qc.invalidateQueries({ queryKey: ["studio-client", id] });
            }}
          >
            Save note
          </Button>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {d.notes.map((n) => (
              <li key={n.id}>{n.body}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
