"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

/* Photos Unsplash (licence Unsplash : usage commercial gratuit, sans autorisation).
   Remplace-les par tes propres photos dès que tu en as : seul l'identifiant change. */
const SLIDES = [
  { id: "1783013951101-2d9ed3eac234", tag: "Brow shaping", alt: "A beauty artist shaping a client's brows with a fine brow razor" },
  { id: "1741774397357-91dcb4a889cd", tag: "Make up", alt: "A makeup artist drawing eyeliner on a client's closed eye" },
  { id: "1550005869-5fca7db35ddb", tag: "Lashes", alt: "A lash artist applying mascara to a client lying back with eyes closed" },
  { id: "1758739010986-cbcd556b34ec", tag: "Eye make up", alt: "A makeup artist blending eyeshadow on a client's eyelid" },
  { id: "1677091508080-d6ee28356318", tag: "Hair", alt: "A stylist in gloves working on a client's hair in a salon" },
  { id: "1713861331150-0f562882ba93", tag: "Full glam", alt: "A makeup artist applying makeup to a client's face with a brush" },
  { id: "1788779413503-2f35218d2b65", tag: "Braids", alt: "Stylists braiding clients' hair in a busy salon" }
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
        <span className="carousel-eyebrow">Brows · Lashes · Make up · Wax</span>
        <h1>Shine like the gem that you are</h1>
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
