import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { listProducts } from "@/lib/catalog.functions";
import { CATEGORIES } from "@/lib/catalog";

export const Route = createFileRoute("/shop")({
  loader: () => listProducts(),
  head: () => ({
    meta: [
      { title: "Shop Watches | Tymlyn Pak Gold & Black Timepieces" },
      {
        name: "description",
        content:
          "Browse the full Tymlyn Pak watch collection: chronographs, automatics, classic dress watches and ladies gold mesh models.",
      },
      { property: "og:title", content: "Shop Watches | Tymlyn Pak" },
      {
        property: "og:description",
        content: "The full Tymlyn Pak collection of gold and black luxury watches.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center text-sm text-muted-foreground">
      The collection could not be loaded. Please refresh.
    </div>
  ),
});

const filters = ["All", ...CATEGORIES] as const;

function Shop() {
  const products = Route.useLoaderData();
  const [active, setActive] = useState<string>("All");
  const list = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-primary">Collection</p>
      <h1 className="mt-3 font-display text-5xl">Every Tymlyn piece</h1>
      <div className="hairline my-8" />

      <div className="mb-10 flex flex-wrap gap-3">
        {filters.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full border px-5 py-2 text-[0.65rem] uppercase tracking-[0.2em] transition-all ${
              active === c
                ? "border-transparent surface-gold"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No watches in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
