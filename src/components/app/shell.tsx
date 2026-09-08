import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Calendar,
  Dumbbell,
  LayoutGrid,
  MessageSquare,
} from "lucide-react";
import { Wordmark } from "@/components/brand";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { getMe } from "@/lib/server/app";
import { useQuery } from "@tanstack/react-query";

const NAV = [
  { to: "/app", label: "Today", icon: LayoutGrid, exact: true },
  { to: "/app/progress", label: "Progress", icon: Activity },
  { to: "/app/library", label: "Lifts", icon: Dumbbell },
  { to: "/app/messages", label: "Coach", icon: MessageSquare },
  { to: "/app/schedule", label: "Plan", icon: Calendar },
];

export function AppShell() {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    enabled: !!user,
  });

  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) return <RedirectToSignIn />;
  if (me.isLoading) return <div className="min-h-dvh bg-bg" />;
  if (me.data && !me.data.onboarding_complete && pathname !== "/app/onboarding") {
    return <Navigate to="/app/onboarding" />;
  }

  if (pathname.startsWith("/app/train")) {
    return <Outlet />;
  }

  const isCoach = me.data?.role === "coach";

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 hidden border-b border-border bg-bg/80 backdrop-blur md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Wordmark to="/app" />
          <nav className="flex items-center gap-6 text-sm text-muted">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="hover:text-fg"
                activeOptions={{ exact: !!n.exact }}
                activeProps={{ className: "text-fg" }}
              >
                {n.label}
              </Link>
            ))}
            <Link to="/app/checkin" className="hover:text-fg">
              Check-in
            </Link>
            {isCoach && (
              <Link to="/studio" className="text-accent hover:text-fg">
                Studio
              </Link>
            )}
          </nav>
          <UserButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl pb-24 md:px-6 md:pb-12">
        <Outlet />
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="App"
      >
        <ul className="grid grid-cols-5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-1 text-[10px] tracking-[0.08em] uppercase",
                    active ? "text-fg" : "text-subtle",
                  )}
                >
                  <Icon className="size-5" />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
