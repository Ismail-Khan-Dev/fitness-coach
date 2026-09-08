import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { studioOverview } from "@/lib/server/app";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/studio/")({ component: StudioHome });

function StudioHome() {
  const q = useQuery({ queryKey: ["studio"], queryFn: () => studioOverview() });
  if (q.isLoading) {
    return <Skeleton className="h-40" />;
  }
  const d = q.data;
  if (!d) return <p className="text-muted">Could not load studio.</p>;

  return (
    <div>
      <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Studio</p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">The practice.</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card label="Active enrollments" value={d.activeEnroll} />
        <Card label="Sessions this week" value={d.weekSessions} />
        <Card label="Open check-ins" value={d.pendingCheckins} />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl">Clients</h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {d.clients.map((c) => (
              <li key={c.user_id}>
                <Link
                  to="/studio/clients/$id"
                  params={{ id: c.user_id }}
                  className="flex items-center justify-between py-3 hover:text-primary"
                >
                  <span>{c.display_name || c.email || "Unnamed"}</span>
                  <span className="text-xs text-subtle">{c.role}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl">Upcoming</h2>
          {d.upcoming.length === 0 && <p className="mt-3 text-sm text-muted">No sessions booked.</p>}
          <ul className="mt-4 space-y-3">
            {d.upcoming.map((a) => (
              <li key={a.id} className="rounded-lg border border-border p-3 text-sm">
                <p>{a.display_name || "Client"} · {a.service}</p>
                <p className="text-subtle">{format(new Date(a.starts_at), "EEE d MMM, HH:mm")}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <p className="font-display text-4xl tabular">{value}</p>
      <p className="mt-1 text-xs tracking-[0.14em] text-subtle uppercase">{label}</p>
    </div>
  );
}
