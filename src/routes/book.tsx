import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { MarketingShell } from "@/components/marketing/chrome";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES } from "@/lib/catalog";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { bookAppointment } from "@/lib/server/app";
import { toast } from "sonner";

export const Route = createFileRoute("/book")({
  component: Book,
  head: () => ({ meta: [{ title: "Book — Northline" }] }),
});

function slotsForDay(day: Date) {
  const hours = [7, 8, 9, 10, 16, 17, 18];
  return hours.map((h) => setMinutes(setHours(day, h), 0));
}

function Book() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [service, setService] = useState<(typeof SERVICES)[number]>(SERVICES[0]);
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const days = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => addDays(new Date(), i + 1)).filter(
        (d) => d.getDay() !== 0 && d.getDay() !== 6,
      ),
    [],
  );
  const day = days[dayIndex] ?? days[0];
  const slots = slotsForDay(day);

  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) {
    return (
      <MarketingShell>
        <section className="mx-auto max-w-lg px-5 py-24 text-center">
          <h1 className="font-display text-4xl">Sign in to book.</h1>
          <p className="mt-3 text-muted">Consults, sessions, and form reviews live on your account.</p>
          <RedirectToSignIn />
        </section>
      </MarketingShell>
    );
  }

  async function confirm() {
    if (!time) return;
    setBusy(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await bookAppointment({
        data: {
          service: service.id,
          startsAt: time.toISOString(),
          timezone: tz,
          notes,
          duration: service.minutes,
        },
      });
      setDone(service.name);
      toast.success("Booked.");
    } catch {
      toast.error("Could not book that slot.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <MarketingShell>
        <section className="mx-auto max-w-lg px-5 py-24">
          <p className="text-[12px] tracking-[0.22em] text-accent uppercase">Confirmed</p>
          <h1 className="font-display mt-3 text-4xl">You’re on the calendar.</h1>
          <p className="mt-4 text-muted">
            {done}
            {time ? ` · ${format(time, "EEEE d MMMM, HH:mm")}` : ""}. We’ll send the reminder in the app.
          </p>
          <Button className="mt-8" onClick={() => navigate({ to: "/app/schedule" })}>
            View schedule
          </Button>
        </section>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">Booking</p>
        <h1 className="font-display mt-3 text-5xl tracking-tight">A conversation, or a session.</h1>
        <p className="mt-4 text-muted">Lisbon time-adjacent, remote by default. Times shown in your local clock.</p>

        <h2 className="mt-12 text-xs tracking-[0.18em] text-subtle uppercase">Service</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setService(s)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                service.id === s.id ? "border-primary bg-surface" : "border-border hover:border-border-strong"
              }`}
            >
              <p className="font-display text-xl">{s.name}</p>
              <p className="mt-1 text-xs text-subtle">
                {s.minutes} min · {s.price}
              </p>
              <p className="mt-2 text-sm text-muted">{s.blurb}</p>
            </button>
          ))}
        </div>

        <h2 className="mt-12 text-xs tracking-[0.18em] text-subtle uppercase">Day</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {days.map((d, i) => (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => {
                setDayIndex(i);
                setTime(null);
              }}
              className={`min-w-16 rounded-md border px-3 py-3 text-center ${
                i === dayIndex ? "border-primary bg-surface" : "border-border"
              }`}
            >
              <div className="text-[10px] tracking-[0.14em] text-subtle uppercase">{format(d, "EEE")}</div>
              <div className="font-display text-xl tabular">{format(d, "d")}</div>
            </button>
          ))}
        </div>

        <h2 className="mt-10 text-xs tracking-[0.18em] text-subtle uppercase">Time</h2>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((s) => (
            <button
              key={s.toISOString()}
              type="button"
              onClick={() => setTime(s)}
              className={`h-11 rounded-md border text-sm tabular ${
                time?.getTime() === s.getTime() ? "border-primary bg-surface" : "border-border"
              }`}
            >
              {format(s, "HH:mm")}
            </button>
          ))}
        </div>

        <h2 className="mt-10 text-xs tracking-[0.18em] text-subtle uppercase">Notes</h2>
        <Textarea
          className="mt-3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything Elena should know before you speak."
        />

        <Button className="mt-8" size="lg" disabled={!time || busy} onClick={confirm}>
          {busy ? "Booking…" : "Confirm"}
        </Button>
      </section>
    </MarketingShell>
  );
}
