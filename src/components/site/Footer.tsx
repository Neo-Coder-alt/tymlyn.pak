import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/tymlyn-logo.jpg.asset.json";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <img
            src={logo.url}
            alt="Tymlyn logo"
            width={56}
            height={56}
            loading="lazy"
            className="h-14 w-14 rounded-full object-cover"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Tymlyn Pak crafts gold-toned timepieces for people who value precision and
            presence. Delivered across Pakistan.
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-primary">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="transition-colors hover:text-primary">
                Collection
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-primary">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/cart" className="transition-colors hover:text-primary">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-primary">Connect</h3>
          <div className="mt-4 flex gap-3">
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-accent"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={BRAND.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-accent"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-primary hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">+92 337 2510542</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs tracking-[0.2em] text-muted-foreground">
        © {new Date().getFullYear()} TYMLYN PAK — ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}
