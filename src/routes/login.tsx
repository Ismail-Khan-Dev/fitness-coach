import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, authClient, signIn } from "@/lib/auth/client";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return <div className="min-h-dvh bg-bg" />;
  }
  if (user) return <Navigate to="/app" />;

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || email.split("@")[0] });
        if (res.error) throw new Error(res.error.message || "Could not create account");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Could not sign in");
      }
      await navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh bg-bg lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src="/images/coach.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-12">
          <p className="font-display text-4xl tracking-tight">The work is simple. The system is not optional.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12">
        <Wordmark />
        <h1 className="font-display mt-12 text-4xl tracking-tight">
          {mode === "in" ? "Welcome back." : "Take a seat."}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Client app, check-ins, and the week in front of you.
        </p>

        {authEnabled ? (
          <div className="mt-8 flex max-w-sm flex-col gap-3">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                onClick={() => signIn(p.providerId, { callbackURL: "/app" })}
              >
                Continue with {p.label}
              </Button>
            ))}
            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs tracking-[0.16em] text-subtle uppercase">or email</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <form onSubmit={onEmail} className="flex flex-col gap-3">
              {mode === "up" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                />
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" disabled={busy}>
                {busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"}
              </Button>
            </form>
            <button
              type="button"
              className="text-left text-sm text-muted hover:text-fg"
              onClick={() => setMode(mode === "in" ? "up" : "in")}
            >
              {mode === "in" ? "Need an account? Create one." : "Already training here? Sign in."}
            </button>
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">Sign-in is disabled.</p>
        )}
        <p className="mt-10 text-sm text-subtle">
          <Link to="/" className="hover:text-fg">
            Back to Northline
          </Link>
        </p>
      </div>
    </main>
  );
}
