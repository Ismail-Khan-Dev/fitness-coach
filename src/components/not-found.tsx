import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div>
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">404</p>
        <h1 className="font-display mt-3 text-4xl tracking-tight">That page isn’t on the line.</h1>
        <Link to="/" className="mt-6 inline-block text-sm text-muted hover:text-fg">
          Back to Northline
        </Link>
      </div>
    </main>
  );
}
