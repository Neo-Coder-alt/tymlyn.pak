import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPKR, getProduct, products } from "@/lib/products";
import { whatsappOrderLink } from "@/lib/brand";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Watch"} | Tymlyn Watches` },
      {
        name: "description",
        content: loaderData?.description ?? "A Tymlyn luxury timepiece.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Watch"} | Tymlyn` },
      {
        property: "og:description",
        content: loaderData?.tagline ?? "Tymlyn luxury timepiece.",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Link
        to="/shop"
        className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
      >
        ← Back to collection
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="reveal overflow-hidden rounded-lg border border-border/70 bg-card">
          <img
            src={product.image}
            alt={`${product.name} luxury watch`}
            width={1024}
            height={1024}
            className="w-full object-cover"
          />
        </div>

        <div className="reveal" style={{ animationDelay: "120ms" }}>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-primary">
            {product.category}
          </p>
          <h1 className="mt-3 font-display text-5xl">{product.name}</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          <p className="mt-6 text-2xl font-semibold text-primary">
            {formatPKR(product.price)}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-primary"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-3 text-primary"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                add(product.id, qty);
                toast.success(`${product.name} added to cart`);
              }}
              className="flex-1 rounded-full px-8 py-3 text-xs uppercase tracking-[0.25em] surface-gold transition-transform hover:scale-[1.02]"
            >
              Add to cart
            </button>
          </div>

          <a
            href={whatsappOrderLink(
              `Hi Tymlyn, I want to order the ${product.name} (${formatPKR(product.price)}).`,
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block rounded-full border border-primary/50 px-8 py-3 text-center text-xs uppercase tracking-[0.25em] text-primary transition-colors hover:bg-accent"
          >
            Order on WhatsApp
          </a>

          <dl className="mt-10 divide-y divide-border/60 border-y border-border/60">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between py-3 text-sm">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="font-display text-3xl">You may also like</h2>
        <div className="hairline my-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
