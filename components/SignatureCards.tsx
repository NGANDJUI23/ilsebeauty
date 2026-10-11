"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "./BookingProvider";
import { fmtD } from "@/lib/format";

/* Photos Unsplash (usage commercial autorisé). Remplace l'identifiant par tes propres photos. */
const LOOK_PHOTOS: Record<string, { id: string; alt: string }> = {
  hybrid: { id: "1736319550323-057478f01980", alt: "Close-up of a woman's brown eyes with soft, defined lashes" },
  volume: { id: "1657271516922-6eab2182f17d", alt: "Close-up of a woman's face with full, fluffy lashes" },
  wet: { id: "1715195060250-b321e5cd5171", alt: "Close-up of an eye with long, spiky lashes in warm light" }
};
const FALLBACK = { id: "1683719312734-e31de63957ab", alt: "Close-up of a lash set" };
const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 1.25)}&q=72`;

export function SignatureCards() {
  const router = useRouter();
  const { catalog, add, price } = useBooking();

  return (
    <div className="looks">
      {catalog.services.filter(s => s.sig).map((s, i) => {
        const p = LOOK_PHOTOS[s.id] || FALLBACK;
        return (
          <article
            key={s.id}
            className="look"
            data-reveal
            style={{ "--d": `${i * 120}ms` } as React.CSSProperties}
            // halo qui suit le pointeur : on écrit des variables CSS, sans re-rendu React
            onPointerMove={e => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
              e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
            }}
          >
            <div className="look-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo(p.id, 800)} srcSet={`${photo(p.id, 480)} 480w, ${photo(p.id, 800)} 800w, ${photo(p.id, 1200)} 1200w`} sizes="(min-width: 900px) 33vw, 100vw" alt={p.alt} loading="lazy" />
              <span className="look-badge">{fmtD(s.mins)} · {price(s.price)}</span>
              <div className="look-overlay">
                <div className="look-more">
                  <div className="look-more">
                  <p>{s.desc}</p>
                </div>
                </div>
                <span className="look-cta" aria-hidden="true">Book this look <span>→</span></span>
              </div>
            </div>
            <h3>
              {/* le bouton couvre toute la carte (voir .look h3 button::after) */}
              <button
                type="button"
                onClick={() => {
                  add(s.id);
                  router.push("/book");
                }}
              >
                {s.name}
                <span className="sr-only">: book this look</span>
              </button>
            </h3>
          </article>
        );
      })}
    </div>
  );
}
