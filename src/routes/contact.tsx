import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BRAND, whatsappOrderLink } from "@/lib/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Tymlyn | WhatsApp, Instagram & Facebook" },
      {
        name: "description",
        content:
          "Reach the Tymlyn team on WhatsApp at +92 337 2510542, or message us on Instagram and Facebook for orders and support.",
      },
      { property: "og:title", content: "Contact Tymlyn Watches" },
      {
        property: "og:description",
        content: "Talk to the Tymlyn team about orders, sizing and delivery.",
      },
    ],
  }),
  component: Contact,
});

const field =
  "w-full rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-primary">Contact</p>
      <h1 className="mt-3 font-display text-5xl">We're one message away</h1>
      <div className="hairline my-8" />

      <div className="grid gap-10 md:grid-cols-2">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message ready — opening WhatsApp");
            window.open(
              whatsappOrderLink(
                `Hi Tymlyn,\nName: ${form.name}\nPhone: ${form.phone}\n${form.message}`,
              ),
              "_blank",
            );
          }}
        >
          <input
            required
            className={field}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            className={field}
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <textarea
            required
            className={`${field} min-h-36`}
            placeholder="How can we help?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button
            type="submit"
            className="w-full rounded-full px-8 py-3 text-xs uppercase tracking-[0.25em] surface-gold transition-transform hover:scale-[1.02]"
          >
            Send message
          </button>
        </form>

        <div className="space-y-4">
          {[
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: "+92 337 2510542",
              href: BRAND.whatsappUrl,
            },
            {
              icon: Instagram,
              label: "Instagram",
              value: "@tymlyn_pak",
              href: BRAND.instagram,
            },
            {
              icon: Facebook,
              label: "Facebook",
              value: "Tymlyn",
              href: BRAND.facebook,
            },
          ].map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="reveal flex items-center gap-4 rounded-lg border border-border/70 bg-card p-5 hover-lift"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 text-primary">
                <c.icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {c.label}
                </span>
                <span className="block text-base text-foreground">{c.value}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
