import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { studioSchedule } from "@/lib/server/app";
import { SERVICES } from "@/lib/catalog";

export const Route = createFileRoute("/studio/schedule")({ component: StudioSked });

function StudioSked() {
  const q = useQuery({ queryKey: ["studio-sked"], queryFn: () => studioSchedule() });
  return (
    <div>
      <h1 className="font-display text-4xl tracking-tight">Schedule</h1>
      <ul className="mt-8 space-y-3">
        {(q.data ?? []).map((a) => (
          <li key={a.id} className="flex justify-between rounded-lg border border-border p-4 text-sm">
            <div>
              <p className="font-display text-xl">
                {a.display_name || "Client"} · {SERVICES.find((s) => s.id === a.service)?.name ?? a.service}
              </p>
              <p className="text-muted">
                {format(new Date(a.starts_at), "EEEE d MMM, HH:mm")} · {a.status}
              </p>
            </div>
          </li>
        ))}
        {(q.data ?? []).length === 0 && <p className="text-sm text-muted">Empty calendar.</p>}
      </ul>
    </div>
  );
}
