import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";

export function AuthSlot({ compact = false }: { compact?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-9 animate-pulse rounded-full bg-surface-2" />;
  }
  if (user) {
    return (
      <div className="flex items-center gap-3">
        {!compact && (
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link to="/app">Today</Link>
          </Button>
        )}
        <UserButton />
      </div>
    );
  }
  return (
    <Button asChild variant="primary" size="sm">
      <Link to="/login">Sign in</Link>
    </Button>
  );
}
