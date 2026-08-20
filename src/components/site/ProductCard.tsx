import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPKR, type Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();

  return (
    <article
      className="reveal group overflow-hidden rounded-lg border border-border/70 bg-card hover-lift"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={`${product.name} watch by Tymlyn`}
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:[animation:shimmer-sweep_1.1s_ease]" />
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
          {product.category}
        </p>
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{product.tagline}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-primary">
            {formatPKR(product.price)}
          </span>
          <button
            onClick={() => {
              add(product.id);
              toast.success(`${product.name} added to cart`);
            }}
            className="rounded-full border border-primary/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-primary transition-all hover:surface-gold"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
