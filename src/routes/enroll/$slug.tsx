import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/chrome";
import { Button } from "@/components/ui/button";
import { programBySlug } from "@/lib/catalog";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { enroll } from "@/lib/server/app";
import { toast } from "sonner";

export const Route = createFileRoute("/enroll/$slug")({
  component: Enroll,
  loader: ({ params }) => {
    const program = programBySlug(params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Enroll · ${loaderData?.program.name} — Northline` }],
  }),
});

function Enroll() {
  const { program } = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) {
    return (
      <MarketingShell>
        <section className="mx-auto max-w-lg px-5 py-24 text-center">
          <h1 className="font-display text-4xl">Sign in to enroll.</h1>
          <RedirectToSignIn />
        </section>
      </MarketingShell>
    );
  }

  async function pay() {
    setBusy(true);
    try {
      await enroll({ data: { programSlug: program.slug } });
      toast.success(`You’re on ${program.name}.`);
      await navigate({ to: "/app" });
    } catch {
      toast.error("Could not enroll.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Enrollment</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">{program.name}</h1>
          <p className="mt-4 text-muted">{program.tagline}</p>
          <ul className="mt-8 space-y-2 text-sm text-muted">
            {program.includes.map((i) => (
              <li key={i}>— {i}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-bg-elevated p-6">
          <p className="font-display text-3xl">{program.price}</p>
          <p className="mt-2 text-sm text-muted">{program.priceNote}</p>
          <div className="mt-8 rounded-lg border border-border p-4 text-sm text-muted">
            <p className="text-fg">Preview checkout</p>
            <p className="mt-2">
              Northline does not collect card numbers here. Confirming assigns the program to your account so you can train in the app. On a live practice this step would go through a payment processor — never through this form.
            </p>
          </div>
          <Button className="mt-6 w-full" size="lg" disabled={busy} onClick={pay}>
            {busy ? "Enrolling…" : "Confirm enrollment"}
          </Button>
          <Link to="/programs/$slug" params={{ slug: program.slug }} className="mt-4 block text-center text-sm text-muted hover:text-fg">
            Back to program
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
