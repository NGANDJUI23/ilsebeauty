"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

/* Photos Unsplash (licence Unsplash : usage commercial gratuit, sans autorisation).
   Remplace-les par tes propres photos dès que tu en as : seul l'identifiant change. */
const SLIDES = [
  { id: "1683719312734-e31de63957ab", tag: "Volume lashes", alt: "Close-up of a dark, fluffy volume lash set on an eye" },
  { id: "1629397685944-7073f5589754", tag: "Soft curls", alt: "A stylist curling a client's long hair into soft waves in a salon" },
  { id: "1589710751893-f9a6770ad71b", tag: "Lash application", alt: "A lash artist applying extensions one by one with fine tweezers" },
  { id: "1765560219023-df32aeecd57d", tag: "Braids", alt: "A woman with long braids sitting outdoors in an orange dress" },
  { id: "1639629509821-c54cdd984227", tag: "Natural lift", alt: "Close-up of an eye with long, lifted natural lashes" },
  { id: "1560869713-bf165a9cfac1", tag: "Glossy waves", alt: "Long brown hair styled in glossy, loose waves" },
  { id: "1718720410649-7524fcb0f0a5", tag: "Brow & lash care", alt: "A beauty artist shaping a client's brows with lash pads in place" },
  { id: "1573516193421-e587039fb189", tag: "Braided updo", alt: "Long copper hair in a braided style with a velvet scrunchie" }
];

const DURATION = 6000; // ms par photo
const src = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
const srcSet = (id: string) => [640, 1080, 1600, 2200].map(w => `${src(id, w)} ${w}w`).join(", ");

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // choix de l'utilisateur (bouton)
  const [held, setHeld] = useState(false); // survol des commandes ou navigation au clavier
  const touchX = useRef<number | null>(null);
  const n = SLIDES.length;

  const wrapIndex = useCallback((i: number) => ((i % n) + n) % n, [n]);
  const go = useCallback((i: number) => setIndex(wrapIndex(i)), [wrapIndex]);
  const step = useCallback((d: number) => setIndex(i => wrapIndex(i + d)), [wrapIndex]);
  const stopped = paused || held;

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label="ILSEBEAUTY looks"
      onKeyDown={e => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      onTouchStart={e => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="carousel-track" aria-live={stopped ? "polite" : "off"}>
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={"slide" + (i === index ? " is-active" : "")}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}: ${s.tag}`}
            aria-hidden={i !== index}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src(s.id, 1600)}
              srcSet={srcSet(s.id)}
              sizes="100vw"
              alt={s.alt}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      <div className="carousel-copy wrap">
        <span className="carousel-eyebrow">Lashes · Brows · Hair</span>
        <h1>shine like the gem that you are</h1>
        <div className="hero-cta">
          <Link className="btn btn-light" href="/book">Book an appointment</Link>
          <Link className="btn btn-outline-light" href="/services">Our services</Link>
        </div>
      </div>

      <div
        className="carousel-ui wrap"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={e => e.target.matches(":focus-visible") && setHeld(true)}
        onBlur={e => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
      >
        <span className="carousel-tag" aria-hidden="true">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")} · {SLIDES[index].tag}
        </span>
        <div className="carousel-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={"dot" + (i === index ? " is-active" : "") + (i < index ? " is-done" : "")}
              aria-label={`Show photo ${i + 1}: ${s.tag}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            >
              {/* la fin de l'animation fait avancer le carrousel */}
              <span
                key={i === index ? `run-${index}` : "idle"}
                style={{ animationDuration: `${DURATION}ms`, animationPlayState: stopped ? "paused" : "running" }}
                onAnimationEnd={() => i === index && step(1)}
              />
            </button>
          ))}
        </div>
        <div className="carousel-ctrl">
          <button type="button" aria-label="Previous photo" onClick={() => step(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused(p => !p)}>
            {paused ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>
            )}
          </button>
          <button type="button" aria-label="Next photo" onClick={() => step(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
