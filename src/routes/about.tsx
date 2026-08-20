import { createFileRoute, Link } from "@tanstack/react-router";
import watch3 from "@/assets/watch-3.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Tymlyn | Pakistani Luxury Watch Brand" },
      {
        name: "description",
        content:
          "Tymlyn is a Pakistani watch brand building gold-finished, precision timepieces with honest pricing and nationwide delivery.",
      },
      { property: "og:title", content: "About Tymlyn | Luxury Watch Brand" },
      {
        property: "og:description",
        content: "The story behind Tymlyn's gold and black timepieces.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-primary">Our story</p>
      <h1 className="mt-3 font-display text-5xl">
        Built around a single <span className="text-gold-gradient">standard</span>
      </h1>
      <div className="hairline my-8" />

      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            Tymlyn started with a simple frustration: luxury-looking watches in Pakistan
            were either overpriced imports or throwaway copies. We wanted something in
            between — a gold-finished timepiece that feels serious on the wrist and honest
            on the receipt.
          </p>
          <p>
            Every case is finished in warm gold tone, every dial is deep black, and every
            movement is tested before it leaves us. Our chronographs and automatics are
            assembled to hold their accuracy for years, not months.
          </p>
          <p>
            We sell direct — through this store, WhatsApp and our social pages — so the
            price you see is the price of the watch, not the middlemen.
          </p>
          <Link
            to="/shop"
            className="inline-block rounded-full px-8 py-3 text-xs uppercase tracking-[0.25em] surface-gold"
          >
            See the collection
          </Link>
        </div>
        <div className="reveal overflow-hidden rounded-lg border border-border/70">
          <img
            src={watch3}
            alt="Tymlyn skeleton automatic watch"
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          { k: "500+", v: "Watches delivered" },
          { k: "48h", v: "Average dispatch" },
          { k: "100%", v: "Tested movements" },
        ].map((s, i) => (
          <div
            key={s.k}
            className="reveal rounded-lg border border-border/70 bg-card p-6 text-center"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <p className="font-display text-4xl text-gold-gradient">{s.k}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {s.v}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
