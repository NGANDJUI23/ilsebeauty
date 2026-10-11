import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SignatureCards } from "@/components/SignatureCards";
import { HoursTable } from "@/components/HoursTable";

export default function HomePage() {
  return (
    <div className="view">
      <HeroCarousel />

      <section className="wrap intro" aria-label="About ILSEBEAUTY">
        <span className="sparkles" aria-hidden="true">✧<small>⋆</small></span>
        <p>
          Introducing <em>ILSEBEAUTY</em>, a sophisticated and luxurious lash brand that aims to empower and inspire you to step
          outside of your creative boundaries. A studio that encourages individuality, beauty and confidence at its core.
          At <em>ILSEBEAUTY</em>, we intend to provide an experience that is unlike any other.
        </p>
      </section>

      <section className="wrap sec" style={{ paddingTop: 0 }} aria-label="Signature sets">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Signature sets</span>
            <h2 className="h2">the most requested looks</h2>
          </div>
          <Link className="link" href="/services">See the full menu</Link>
        </div>
        <SignatureCards />
      </section>

      <section className="band-brown" aria-label="How booking works">
        <div className="wrap sec">
          <div className="sec-head">
            <div>
              <span className="eyebrow">How booking works</span>
              <h2 className="h2">three steps to your chair</h2>
            </div>
          </div>
          <ol className="how">
            <li><h3>Choose your services</h3><p>Pick a full set, a fill or a lift. Add as many as you like to your booking.</p></li>
            <li><h3>Pick a day and time</h3><p>Choose a preferred slot. We open Monday to Saturday.</p></li>
            <li><h3>Confirm on Fresha</h3><p>Fresha holds your slot, sends reminders, and lets you change it any time.</p></li>
          </ol>
        </div>
      </section>

      <section className="band-blush" aria-label="The studio">
        <div className="wrap sec">
          <div className="studio">
            <div style={{ display: "grid", gap: "var(--s2)" }}>
              <span className="eyebrow">The studio</span>
              <h2 className="h2">by appointment only</h2>
              <p className="lede">
                One client at a time, a quiet room, fresh linens and a warm blanket. Arrive with clean lashes and no eye makeup so we can start right away.
              </p>
              <div><Link className="btn ghost" href="/manage">Booking policies</Link></div>
            </div>
            <HoursTable />
          </div>
        </div>
      </section>
    </div>
  );
}
