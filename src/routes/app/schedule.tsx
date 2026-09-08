import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { cancelAppointment, listAppointments } from "@/lib/server/app";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/app/schedule")({ component: Schedule });

function Schedule() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["appointments"], queryFn: () => listAppointments() });

  return (
    <div className="px-5 py-8 md:px-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Schedule</p>
          <h1 className="font-display mt-2 text-4xl tracking-tight">Appointments</h1>
        </div>
        <Button asChild variant="secondary">
          <Link to="/book">Book</Link>
        </Button>
      </div>
      {(q.data ?? []).length === 0 && (
        <p className="mt-10 text-sm text-muted">Nothing on the calendar. Consults are free.</p>
      )}
      <ul className="mt-8 space-y-3">
        {(q.data ?? []).map((a) => {
          const svc = SERVICES.find((s) => s.id === a.service);
          return (
            <li key={a.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="font-display text-xl">{svc?.name ?? a.service}</p>
                <p className="text-sm text-muted">
                  {format(new Date(a.starts_at), "EEEE d MMM, HH:mm")} · {a.duration_min} min · {a.status}
                </p>
              </div>
              {a.status === "confirmed" && new Date(a.starts_at) > new Date() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await cancelAppointment({ data: { id: a.id } });
                    toast.success("Cancelled.");
                    await qc.invalidateQueries({ queryKey: ["appointments"] });
                  }}
                >
                  Cancel
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
