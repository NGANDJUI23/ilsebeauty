"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useBooking } from "./BookingProvider";
import { fmtD } from "@/lib/format";

/** Barre fixe en bas d'écran qui résume la sélection en cours. */
export function BookingBar() {
  const pathname = usePathname();
  const { hydrated, bag, totals, price } = useBooking();
  const n = bag.length;
  const show = hydrated && n > 0 && pathname !== "/book";

  useEffect(() => {
    document.body.classList.toggle("has-bar", show);
  }, [show]);

  return (
    <div className={"bar" + (show ? " show" : "")} role="region" aria-label="Your booking">
      <div className="sum">
        <span>{n} service{n === 1 ? "" : "s"}</span>
        {fmtD(totals.mins)} · {price(totals.price)}
      </div>
      <Link className="btn" href="/book">Choose a time</Link>
    </div>
  );
}
