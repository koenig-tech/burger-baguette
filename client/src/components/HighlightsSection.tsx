import { BRAND_IMAGES } from "@/lib/brand";
import { Flame, MapPin, Leaf, Star } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

export default function HighlightsSection() {
  return (
    <section id="highlights" className="bb-section bb-section--soft">
      <div className="bb-inner container mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="bb-eyebrow mb-6">Highlights</div>
            <h2 className="lux-head text-4xl sm:text-5xl xl:text-6xl">
              Alles, was zählt —{" "}
              <span className="lux-accent">auf einen Blick.</span>
            </h2>
          </div>
          <p className="bb-copy max-w-md lg:text-right">
            Produkt, Marke und Betrieb greifen ineinander. Die wichtigsten
            Stärken in einem ruhigen Raster zusammengefasst.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid auto-rows-[minmax(190px,1fr)] grid-cols-2 gap-3 lg:grid-cols-4">
          {/* A — large signature image */}
          <figure className="bb-image-tile group relative col-span-2 row-span-2 overflow-hidden rounded-2xl border border-[var(--bb-border)]">
            <ResponsiveImage
              src={BRAND_IMAGES.burgerBox}
              sizes="(max-width: 1024px) calc(100vw - 3rem), 48vw"
              alt="Burger & Baguette Signature Smash Burger"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#080502] via-[#080502]/65 to-transparent p-7 pt-16">
              <div className="bb-number mb-2">Signature</div>
              <div className="lux-head text-2xl text-[#F4F1EA] sm:text-3xl">
                Smash Burger &amp;{" "}
                <span className="lux-accent">Gourmet Baguettes.</span>
              </div>
            </figcaption>
          </figure>

          {/* B — gold accent stat */}
          <div
            className="flex flex-col justify-between rounded-2xl p-6"
            style={{ backgroundColor: "#C9A84C", color: "#1A1A1A" }}
          >
            <Flame size={22} />
            <div>
              <div
                className="font-bold leading-none"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "2.75rem",
                }}
              >
                100%
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] opacity-80">
                Rindfleisch
              </div>
            </div>
          </div>

          {/* C — dark stat */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-ink-soft)] p-6">
            <Star size={22} className="text-[var(--bb-gold)]" />
            <div>
              <div
                className="font-bold leading-none text-[var(--bb-gold)]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "2.75rem",
                }}
              >
                4–5
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--bb-text-soft)]">
                Signatures
              </div>
            </div>
          </div>

          {/* D — wide text feature */}
          <div className="col-span-2 flex flex-col justify-center rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-7">
            <Leaf size={22} className="mb-4 text-[var(--bb-gold)]" />
            <h3 className="lux-head text-2xl">Täglich frisch gegrillt.</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--bb-text-muted)]">
              Kurze Karte, klare Stationen und vorbereitete Zutaten halten
              Qualität und Tempo konstant.
            </p>
          </div>

          {/* E — image */}
          <figure className="bb-image-tile group relative overflow-hidden rounded-2xl border border-[var(--bb-border)]">
            <ResponsiveImage
              src={BRAND_IMAGES.friesDrinks}
              sizes="(max-width: 1024px) 50vw, 24vw"
              alt="Burger & Baguette Fries, Drinks und Saucen"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </figure>

          {/* F — icon feature */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-ink-soft)] p-6">
            <MapPin size={22} className="text-[var(--bb-gold)]" />
            <div>
              <h3 className="lux-head text-lg">Mobil &amp; flexibel</h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--bb-text-muted)]">
                Lunch, Feierabend und Events als planbare Route.
              </p>
            </div>
          </div>

          {/* G — quote */}
          <div className="col-span-2 flex flex-col justify-center rounded-2xl border border-[var(--bb-border-strong)] bg-[var(--bb-surface)] p-7">
            <p
              className="text-[var(--bb-gold)]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "1.9rem",
                lineHeight: 1.2,
              }}
            >
              „Real Food. Good People. Great Taste.“
            </p>
            <div className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--bb-text-soft)]">
              Burger &amp; Baguette
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
