import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { effectivePrice, formatPKR, type Product } from "@/lib/catalog";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const onSale = effectivePrice(product) !== product.price;

  return (
    <article
      className="reveal group overflow-hidden rounded-lg border border-border/70 bg-card hover-lift"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <Link to="/product/$id" params={{ id: product.slug }} className="block">
        <div className="relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={`${product.name} watch by Tymlyn`}
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-secondary/40 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Photo coming soon
            </div>
          )}
          {onSale && (
            <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] surface-gold">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="absolute right-4 top-4 rounded-full border border-border bg-background/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              Sold out
            </span>
          )}
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:[animation:shimmer-sweep_1.1s_ease]" />
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
          {product.category}
        </p>
        <Link to="/product/$id" params={{ id: product.slug }}>
          <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{product.tagline}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="flex items-baseline gap-2 text-sm font-semibold text-primary">
            {formatPKR(effectivePrice(product))}
            {onSale && (
              <span className="text-xs font-normal text-muted-foreground line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </span>
          <button
            disabled={!product.inStock}
            onClick={() => {
              add(product);
              toast.success(`${product.name} added to cart`);
            }}
            className="rounded-full border border-primary/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-primary transition-all hover:surface-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
