import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Tymlyn Watches" },
      {
        name: "description",
        content: "Review the Tymlyn watches in your cart and continue to checkout.",
      },
      { property: "og:title", content: "Your Cart | Tymlyn Watches" },
      { property: "og:description", content: "Review your selected Tymlyn timepieces." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="font-display text-5xl">Your cart</h1>
      <div className="hairline my-8" />

      {items.length === 0 ? (
        <div className="rounded-lg border border-border/70 bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">Your cart is empty for now.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-full px-8 py-3 text-xs uppercase tracking-[0.25em] surface-gold"
          >
            Browse watches
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {items.map(({ product, qty }, i) => (
              <li
                key={product.id}
                className="reveal flex gap-4 rounded-lg border border-border/70 bg-card p-4"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="h-24 w-24 rounded object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl">{product.name}</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {product.category}
                  </p>
                  <p className="mt-2 text-sm text-primary">{formatPKR(product.price)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border text-sm">
                      <button
                        className="px-3 py-1 text-primary"
                        onClick={() => setQty(product.id, qty - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{qty}</span>
                      <button
                        className="px-3 py-1 text-primary"
                        onClick={() => setQty(product.id, qty + 1)}
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary">
                  {formatPKR(product.price * qty)}
                </p>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-lg border border-border/70 bg-card p-6">
            <h2 className="text-xl">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary">Free</span>
              </div>
              <div className="hairline" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPKR(subtotal)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-7 block rounded-full px-8 py-3 text-center text-xs uppercase tracking-[0.25em] surface-gold transition-transform hover:scale-[1.02]"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
