import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      fill="none"
      aria-hidden
    >
      <path
        d="M16 5v22"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 5 L11.5 12.5 M16 5 L20.5 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  to = "/",
}: {
  className?: string;
  to?: string;
}) {
  return (
    <Link
      to={to}
      className={cn("flex items-center gap-2.5 text-fg", className)}
      aria-label="Northline home"
    >
      <Mark />
      <span className="text-[13px] font-medium tracking-[0.28em] uppercase">
        Northline
      </span>
    </Link>
  );
}
