import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ShieldCheck, Truck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tymlyn | Gold & Black Luxury Watches in Pakistan" },
      {
        name: "description",
        content:
          "Tymlyn crafts gold-toned luxury watches for men and women. Shop chronographs, automatics and classics with nationwide delivery in Pakistan.",
      },
      { property: "og:title", content: "Tymlyn | Gold & Black Luxury Watches" },
      {
        property: "og:description",
        content:
          "Chronographs, automatics and classic dress watches finished in gold. Order online with cash on delivery across Pakistan.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Gold Tymlyn chronograph watch on a black background"
          width={1920}
          height={1088}
          className="h-[85vh] w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="max-w-xl">
              <p className="reveal text-[0.7rem] uppercase tracking-[0.45em] text-primary">
                Est. Pakistan
              </p>
              <h1
                className="reveal mt-5 font-display text-5xl leading-[1.05] md:text-7xl"
                style={{ animationDelay: "120ms" }}
              >
                Time worn <span className="text-gold-gradient">in gold</span>
              </h1>
              <p
                className="reveal mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
                style={{ animationDelay: "240ms" }}
              >
                Precision movements, gold-finished cases and deep black dials. Tymlyn
                timepieces are made for people who arrive on time and stay remembered.
              </p>
              <div
                className="reveal mt-9 flex flex-wrap gap-4"
                style={{ animationDelay: "340ms" }}
              >
                <Link
                  to="/shop"
                  className="rounded-full px-8 py-3 text-xs uppercase tracking-[0.25em] surface-gold glow-gold transition-transform hover:scale-105"
                >
                  Shop collection
                </Link>
                <Link
                  to="/about"
                  className="rounded-full border border-primary/50 px-8 py-3 text-xs uppercase tracking-[0.25em] text-primary transition-colors hover:bg-accent"
                >
                  Our story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "1–2 year warranty", copy: "Every Tymlyn is covered against movement faults." },
            { icon: Truck, title: "Nationwide delivery", copy: "Cash on delivery available all across Pakistan." },
            { icon: Clock, title: "Precision assured", copy: "Quartz and automatic movements, tested before shipping." },
          ].map((f, i) => (
            <div
              key={f.title}
              className="reveal rounded-lg border border-border/70 bg-card p-6 hover-lift"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <f.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-primary">
              Featured
            </p>
            <h2 className="mt-3 font-display text-4xl">The collection</h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary md:block"
          >
            View all
          </Link>
        </div>
        <div className="hairline my-8" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="reveal overflow-hidden rounded-lg border border-border/70 bg-card p-10 text-center">
          <h2 className="font-display text-4xl">
            Need help choosing <span className="text-gold-gradient">your watch?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Message us on WhatsApp and our team will guide you to the right piece.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full px-8 py-3 text-xs uppercase tracking-[0.25em] surface-gold transition-transform hover:scale-105"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </div>
  );
}
