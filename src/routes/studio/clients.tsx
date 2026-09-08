import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { studioOverview } from "@/lib/server/app";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/studio/clients")({ component: Clients });

function Clients() {
  const q = useQuery({ queryKey: ["studio"], queryFn: () => studioOverview() });
  const [s, setS] = useState("");
  const list = useMemo(() => {
    const rows = q.data?.clients ?? [];
    const t = s.toLowerCase();
    return rows.filter(
      (c) =>
        (c.display_name ?? "").toLowerCase().includes(t) ||
        (c.email ?? "").toLowerCase().includes(t),
    );
  }, [q.data, s]);

  return (
    <div>
      <h1 className="font-display text-4xl tracking-tight">Clients</h1>
      <Input className="mt-6 max-w-sm" placeholder="Search" value={s} onChange={(e) => setS(e.target.value)} />
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {list.map((c) => (
          <li key={c.user_id}>
            <Link
              to="/studio/clients/$id"
              params={{ id: c.user_id }}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p>{c.display_name || "Unnamed"}</p>
                <p className="text-sm text-subtle">{c.email}</p>
              </div>
              <span className="text-xs tracking-[0.14em] text-subtle uppercase">{c.role}</span>
            </Link>
          </li>
        ))}
        {list.length === 0 && <li className="py-8 text-sm text-muted">No clients match.</li>}
      </ul>
    </div>
  );
}
