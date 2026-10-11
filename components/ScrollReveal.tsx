"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Fait apparaître les éléments marqués `data-reveal` quand ils entrent à l'écran. */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    // le contenu n'est masqué qu'une fois le script prêt : sans JS, tout reste visible
    root.setAttribute("data-js-reveal", "");

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    const watch = () => document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(el => io.observe(el));
    watch();
    // éléments ajoutés après coup (changement d'étape, données chargées…)
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
