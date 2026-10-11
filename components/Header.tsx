"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBooking } from "./BookingProvider";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const { bag, bumpCount } = useBooking();
  const [open, setOpen] = useState(false);
  const n = bag.length;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const current = (href: string) => (pathname === href ? ("page" as const) : undefined);

  return (
    <>
      <header className="hdr">
        <div className="wrap hdr-in">
          <button
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="drawer"
            onClick={() => setOpen(o => !o)}
          >
            {/* deux traits en SVG : rendu identique sur tous les navigateurs mobiles */}
            <svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
              <line className="burger-top" x1="1" y1="15" x2="43" y2="15" />
              <line className="burger-bottom" x1="1" y1="29" x2="43" y2="29" />
            </svg>
          </button>
          <nav className="nav-l" aria-label="Primary">
            <Link href="/" aria-current={current("/")}>Home</Link>
            <Link href="/services" aria-current={current("/services")}>Our services</Link>
            <Link href="/policies" aria-current={current("/policies")}>Policies</Link>
            <Link href="/faq" aria-current={current("/faq")}>FAQ</Link>
          </nav>
          <Logo />
          <div className="right">
            <nav className="nav-r" aria-label="Secondary">
              <Link className="nl" href="/manage" aria-current={current("/manage")}>Manage bookings</Link>
              <Link className="btn" href="/book" aria-current={current("/book")}>Book now</Link>
            </nav>
            <Link className={"bag" + (bumpCount ? " bump" : "")} href="/book" aria-label={`Your booking, ${n} service${n === 1 ? "" : "s"}`}>
              {/* la clé force le redémarrage de l'animation à chaque ajout */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={bumpCount} src="/brand/cart.png" width={43} height={43} alt="" />
              <span className="n">{n}</span>
            </Link>
          </div>
        </div>
      </header>

      <nav className={"drawer" + (open ? " open" : "")} id="drawer" aria-label="Menu">
        <Link href="/">Home</Link>
        <Link href="/services">Our services</Link>
        <Link href="/book">Book an appointment</Link>
        <Link href="/policies">Policies</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/manage">Manage bookings</Link>
        <span className="eyebrow">Bookings powered by Fresha</span>
      </nav>
    </>
  );
}
