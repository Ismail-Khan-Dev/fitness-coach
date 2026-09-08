import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/lib/server/app";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { toast } from "sonner";
import { Wordmark } from "@/components/brand";

export const Route = createFileRoute("/app/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName ?? "");
  const [unit, setUnit] = useState("kg");
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      await completeOnboarding({
        data: {
          displayName: name,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          unit,
        },
      });
      await navigate({ to: "/app" });
    } catch {
      toast.error("Could not finish setup.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <Wordmark to="/" />
      <p className="mt-12 text-[12px] tracking-[0.22em] text-accent uppercase">Welcome</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight">Let’s put a name on the logbook.</h1>
      <p className="mt-3 text-muted">Then you’ll see Today — the session, the check-in, the line.</p>
      <div className="mt-10 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="n">What should Elena call you?</Label>
          <Input id="n" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <p className="text-xs tracking-[0.16em] text-muted uppercase">Load units</p>
          <div className="mt-2 flex gap-2">
            {["kg", "lb"].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`h-11 rounded-md border px-5 ${unit === u ? "border-primary" : "border-border"}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <Button size="lg" onClick={go} disabled={busy || !name.trim()}>
          {busy ? "Saving…" : "Enter the app"}
        </Button>
      </div>
    </div>
  );
}
