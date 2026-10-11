"use client";

import { useEffect, useRef, type RefObject } from "react";

/* Vagues qui se forment au défilement.
   Le tracé est recalculé selon la position de la vague à l'écran : presque plate en entrant,
   pleine amplitude au milieu de l'écran, avec des crêtes qui glissent pendant le défilement. */

type Shape = { freq: number; phase: number; amp: number };
export const SHAPES = {
  a: { freq: 1, phase: 0.6, amp: 34 },
  b: { freq: 1.15, phase: 3.6, amp: 32 },
  hero: { freq: 0.9, phase: 2.2, amp: 26 }
} satisfies Record<string, Shape>;

const W = 1440, MID = 48, BOTTOM = 96, POINTS = 9;

/** Tracé d'une vague lisse (Catmull-Rom converti en courbes de Bézier). `t` va de 0 à 1. */
export function wavePath({ freq, phase, amp }: Shape, t: number): string {
  const a = amp * (0.25 + 0.75 * Math.sin(Math.PI * t)); // amplitude max au centre de l'écran
  const shift = phase + t * 2.4; // les crêtes glissent avec le défilement
  const pts = Array.from({ length: POINTS }, (_, i) => {
    const x = (i / (POINTS - 1)) * W;
    return [x, MID + a * Math.sin(2 * Math.PI * freq * (x / W) + shift)] as const;
  });
  let d = `M${pts[0][0]},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1].toFixed(1)}`;
  }
  return `${d} L${W},${BOTTOM} L0,${BOTTOM} Z`;
}

/** Recalcule le tracé de `path` pendant le défilement, d'après la position de `box` à l'écran. */
export function useScrollWave(box: RefObject<Element | null>, path: RefObject<SVGPathElement | null>, shape: Shape) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = box.current, p = path.current;
      if (!el || !p) return;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < -50 || r.top > vh + 50) return; // hors écran : rien à faire
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      p.setAttribute("d", wavePath(shape, t));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [box, path, shape]);
}

/** Séparation courbe entre deux sections : `from` est la couleur au-dessus, `to` celle en dessous. */
export function Wave({ from, to, variant = "a", className = "" }: { from: string; to: string; variant?: keyof typeof SHAPES; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  useScrollWave(box, path, SHAPES[variant]);

  return (
    <div ref={box} className={"wave " + className} aria-hidden="true" style={{ background: from }}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" focusable="false">
        {/* tracé de départ identique côté serveur et navigateur ; le défilement l'anime ensuite */}
        <path ref={path} d={wavePath(SHAPES[variant], 0.5)} fill={to} />
      </svg>
    </div>
  );
}
