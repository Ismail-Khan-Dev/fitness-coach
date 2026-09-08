import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { AuthSlot } from "@/components/auth-slot";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const LINKS = [
  { to: "/programs" as const, label: "Programs" },
  { to: "/method" as const, label: "The Line" },
  { to: "/assessment" as const, label: "Assessment" },
  { to: "/library" as const, label: "Desk" },
];

export function SiteHeader({ inverted = false }: { inverted?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[13px] tracking-[0.04em] text-muted transition-colors hover:text-fg"
              activeProps={{ className: "text-fg" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/book">Book a consult</Link>
          </Button>
          <AuthSlot compact={inverted} />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-md text-fg md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent title="Menu" side="right">
              <Wordmark />
              <nav className="mt-10 flex flex-col gap-1">
                {LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-3 text-lg text-fg"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link to="/book" onClick={() => setOpen(false)} className="rounded-md px-2 py-3 text-lg">
                  Book a consult
                </Link>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-2 py-3 text-lg">
                  Sign in
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Personalized strength coaching for people who are done guessing.
            Lisbon, remotely worldwide.
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] text-subtle uppercase">Practice</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/programs" className="hover:text-fg">Programs</Link></li>
            <li><Link to="/method" className="hover:text-fg">The Line</Link></li>
            <li><Link to="/assessment" className="hover:text-fg">Assessment</Link></li>
            <li><Link to="/book" className="hover:text-fg">Consult</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.18em] text-subtle uppercase">Desk</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/library" className="hover:text-fg">Library</Link></li>
            <li><Link to="/login" className="hover:text-fg">Client login</Link></li>
            <li><Link to="/app" className="hover:text-fg">Today</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-subtle sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Northline Coaching. A training practice, not a medical service.</p>
          <p>No guaranteed outcomes. Do the work.</p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
