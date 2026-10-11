"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBooking } from "./BookingProvider";
import { fmtD } from "@/lib/format";

/** Vrai tant que la première section (le carrousel) occupe encore l'écran.
    Seule la page d'accueil en a un ; ailleurs la barre s'affiche directement. */
function useOnHero(pathname: string) {
  const [onHero, setOnHero] = useState(pathname === "/");

  useEffect(() => {
    const hero = pathname === "/" ? document.querySelector(".carousel") : null;
    if (!hero) {
      setOnHero(false);
      return;
    }
    let frame = 0;
    const check = () => {
      frame = 0;
      // on quitte la première section quand son bas remonte au-dessus de la moitié de l'écran
      setOnHero(hero.getBoundingClientRect().bottom > window.innerHeight * 0.5);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return onHero;
}

/** Barre fixe en bas d'écran qui résume la sélection en cours. */
export function BookingBar() {
  const pathname = usePathname();
  const { hydrated, bag, totals, price } = useBooking();
  const onHero = useOnHero(pathname);
  const n = bag.length;
  const show = hydrated && n > 0 && pathname !== "/book" && !onHero;

  useEffect(() => {
    document.body.classList.toggle("has-bar", show);
  }, [show]);

  return (
    <div className={"bar" + (show ? " show" : "")} role="region" aria-label="Your booking" aria-hidden={!show} inert={!show}>
      <div className="sum">
        <span>{n} service{n === 1 ? "" : "s"}</span>
        {fmtD(totals.mins)} · {price(totals.price)}
      </div>
      <Link className="btn" href="/book">Choose a time</Link>
    </div>
  );
}
