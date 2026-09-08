import { useState } from "react";
import { createFileRoute, Link, Navigate, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Wordmark } from "@/components/brand";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMe } from "@/lib/server/app";

export const Route = createFileRoute("/studio")({
  component: StudioRoot,
});

function StudioRoot() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <StudioShell />
    </QueryClientProvider>
  );
}

const LINKS = [
  { to: "/studio", label: "Board", exact: true },
  { to: "/studio/clients", label: "Clients" },
  { to: "/studio/checkins", label: "Check-ins" },
  { to: "/studio/schedule", label: "Schedule" },
  { to: "/studio/builder", label: "Builder" },
];

function StudioShell() {
  const { user, isPending } = useCurrentUserState();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe(), enabled: !!user });

  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) return <RedirectToSignIn />;
  if (me.isLoading) return <div className="min-h-dvh bg-bg" />;
  if (me.data && me.data.role !== "coach") {
    return <Navigate to="/app" />;
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-6">
            <Wordmark to="/studio" />
            <span className="hidden text-[11px] tracking-[0.2em] text-subtle uppercase sm:inline">
              Studio
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-muted">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: !!l.exact }}
                activeProps={{ className: "text-fg" }}
                className="hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/app" className="text-accent hover:text-fg">
              Client app
            </Link>
            <UserButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </div>
    </div>
  );
}
