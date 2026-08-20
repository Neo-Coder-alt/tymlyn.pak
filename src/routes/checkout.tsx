import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/products";
import { whatsappOrderLink } from "@/lib/brand";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Tymlyn Watches" },
      {
        name: "description",
        content:
          "Place your Tymlyn watch order with cash on delivery or bank transfer, delivered anywhere in Pakistan.",
      },
      { property: "og:title", content: "Checkout | Tymlyn Watches" },
      { property: "og:description", content: "Complete your Tymlyn watch order." },
    ],
  }),
  component: Checkout,
});

const field =
  "w-full rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [placed, setPlaced] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
    payment: "cod",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const orderMessage = `New Tymlyn order\nName: ${form.name}\nPhone: ${form.phone}\nCity: ${form.city}\nAddress: ${form.address}\nItems:\n${items
    .map((i) => `- ${i.product.name} x${i.qty}`)
    .join("\n")}\nTotal: ${formatPKR(subtotal)}`;

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="reveal rounded-lg border border-border/70 bg-card p-12">
          <h1 className="font-display text-4xl">
            Order <span className="text-gold-gradient">confirmed</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Thank you {form.name || "for your order"}. Your order reference is{" "}
            <span className="text-primary">{placed}</span>. Our team will call you shortly
            to confirm delivery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappOrderLink(`Order ${placed} — ${orderMessage}`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-7 py-3 text-xs uppercase tracking-[0.25em] surface-gold"
            >
              Send on WhatsApp
            </a>
            <Link
              to="/shop"
              className="rounded-full border border-primary/50 px-7 py-3 text-xs uppercase tracking-[0.25em] text-primary"
            >
              Keep shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Nothing to checkout</h1>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full px-8 py-3 text-xs uppercase tracking-[0.25em] surface-gold"
        >
          Browse watches
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="font-display text-5xl">Checkout</h1>
      <div className="hairline my-8" />

      <form
        className="grid gap-10 lg:grid-cols-[1fr_320px]"
        onSubmit={(e) => {
          e.preventDefault();
          const ref = `TYM-${Math.floor(100000 + Math.random() * 899999)}`;
          setPlaced(ref);
          clear();
          toast.success("Order placed successfully");
        }}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              className={field}
              placeholder="Full name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            <input
              required
              className={field}
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <input
            type="email"
            className={field}
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <input
            required
            className={field}
            placeholder="Delivery address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
          <input
            required
            className={field}
            placeholder="City"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
          <textarea
            className={`${field} min-h-28`}
            placeholder="Order notes (optional)"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />

          <fieldset className="pt-2">
            <legend className="text-xs uppercase tracking-[0.25em] text-primary">
              Payment method
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { id: "cod", label: "Cash on delivery" },
                { id: "bank", label: "Bank transfer" },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`cursor-pointer rounded-md border px-4 py-3 text-sm transition-colors ${
                    form.payment === p.id
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={form.payment === p.id}
                    onChange={() => set("payment", p.id)}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="h-fit rounded-lg border border-border/70 bg-card p-6">
          <h2 className="text-xl">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {product.name} × {qty}
                </span>
                <span>{formatPKR(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="hairline my-5" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatPKR(subtotal)}</span>
          </div>
          <button
            type="submit"
            className="mt-7 w-full rounded-full px-8 py-3 text-xs uppercase tracking-[0.25em] surface-gold transition-transform hover:scale-[1.02]"
          >
            Place order
          </button>
        </aside>
      </form>
    </div>
  );
}
