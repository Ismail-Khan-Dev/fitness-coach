import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/chrome";
import { resourceBySlug } from "@/lib/catalog";

export const Route = createFileRoute("/library/$slug")({
  component: Article,
  loader: ({ params }) => {
    const resource = resourceBySlug(params.slug);
    if (!resource) throw notFound();
    return { resource };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.resource.title ?? "Note"} — Northline` }],
  }),
});

function Article() {
  const { resource } = Route.useLoaderData();
  return (
    <MarketingShell>
      <article className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[12px] tracking-[0.22em] text-subtle uppercase">
          {resource.category} · {resource.minutes} min
        </p>
        <h1 className="font-display mt-4 text-4xl tracking-tight sm:text-5xl">{resource.title}</h1>
        <p className="mt-4 text-lg text-muted">{resource.excerpt}</p>
        <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-fg/90">
          {resource.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className="mt-12">
          <Link to="/library" className="text-sm text-muted hover:text-fg">
            All notes
          </Link>
        </p>
      </article>
    </MarketingShell>
  );
}
