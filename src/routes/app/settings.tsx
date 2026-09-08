import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/server/app";
import { UserButton } from "@/lib/auth/gates";

export const Route = createFileRoute("/app/settings")({ component: Settings });

function Settings() {
  const q = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
  const d = q.data;
  return (
    <div className="px-5 py-8 md:px-0">
      <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Account</p>
      <h1 className="font-display mt-2 text-4xl tracking-tight">Settings</h1>
      <div className="mt-8 max-w-lg space-y-6">
        <div className="rounded-xl border border-border p-5">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">Profile</p>
          <p className="mt-3">{d?.profile.display_name}</p>
          <p className="text-sm text-muted">{d?.profile.email}</p>
          <p className="mt-2 text-sm text-muted">Units: {d?.profile.unit}</p>
          <div className="mt-4">
            <UserButton />
          </div>
        </div>
        <div className="rounded-xl border border-border p-5">
          <p className="text-xs tracking-[0.16em] text-subtle uppercase">Billing</p>
          {d?.enrollment ? (
            <>
              <p className="mt-3 font-display text-2xl">{d.program?.name}</p>
              <p className="text-sm text-muted">{d.enrollment.plan_label}</p>
              <p className="mt-2 text-sm text-muted">
                Status {d.enrollment.billing_status}
                {d.enrollment.renewal_at ? ` · renews ${d.enrollment.renewal_at}` : ""}
              </p>
              <p className="mt-4 text-xs text-subtle">
                Preview enrollment does not charge a card. A live practice would show invoices from the payment processor here.
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">
              No active plan. <Link to="/programs">View programs</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
