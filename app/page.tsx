import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SignatureCards } from "@/components/SignatureCards";
import { HoursTable } from "@/components/HoursTable";

/** Nom de marque écrit comme sur le logo : ILSE en noir, BEAUTY en rose. */
function Wordmark() {
  return (
    <span className="wordmark">
      ILSE<span>BEAUTY</span>
    </span>
  );
}

/** Décalage d'apparition : les éléments d'un même bloc arrivent l'un après l'autre. */
const delay = (i: number) => ({ "--d": `${i * 110}ms` }) as React.CSSProperties;

export default function HomePage() {
  return (
    <div className="view">
      <HeroCarousel />

      <section className="wrap intro" aria-label="About ILSEBEAUTY">
        <div className="intro-text" data-reveal="left">
          <span className="sparkles" aria-hidden="true" data-reveal style={delay(1)}>✧<small>⋆</small></span>
          <p data-reveal style={delay(2)}>
            Introducing <Wordmark />, a sophisticated and luxurious lash brand that aims to empower and inspire you to step
            outside of your creative boundaries. A studio that encourages individuality, beauty and confidence at its core.
            At <Wordmark />, we intend to provide an experience that is unlike any other.
          </p>
        </div>
        <figure className="intro-photo" data-reveal="right" style={delay(1)}>
          {/* Photo extraite du flyer ILSEBEAUTY */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/flyer-lash-artist.jpg"
            width={306}
            height={382}
            alt="The ILSEBEAUTY lash artist applying classic lash extensions to a client"
            loading="lazy"
          />
        </figure>
      </section>

      <section className="wrap sec" style={{ paddingTop: 0 }} aria-label="Signature sets">
        <div className="sec-head" data-reveal>
          <div>
            <span className="eyebrow" data-reveal style={delay(1)}>Signature sets</span>
            <h2 className="h2" data-reveal style={delay(2)}>The most requested looks</h2>
          </div>
          <Link className="link" href="/services" data-reveal style={delay(3)}>See the full menu</Link>
        </div>
        <SignatureCards />
      </section>

      <section className="band-brown" aria-label="How booking works" data-reveal="zoom">
        <div className="wrap sec">
          <div className="sec-head">
            <div>
              <span className="eyebrow" data-reveal style={delay(1)}>How booking works</span>
              <h2 className="h2" data-reveal style={delay(2)}>Three steps to your chair</h2>
            </div>
          </div>
          <ol className="how">
            <li data-reveal style={delay(3)}><h3>Choose your services</h3><p>Pick a full set, a fill or a lift. Add as many as you like to your booking.</p></li>
            <li data-reveal style={delay(4)}><h3>Pick a day and time</h3><p>Choose a preferred slot. We open Monday to Saturday.</p></li>
            <li data-reveal style={delay(5)}><h3>Confirm on Fresha</h3><p>Fresha holds your slot, sends reminders, and lets you change it any time.</p></li>
          </ol>
        </div>
      </section>

      <section className="band-blush" aria-label="The studio" data-reveal="zoom">
        <div className="wrap sec">
          <div className="studio">
            <div style={{ display: "grid", gap: "var(--s2)" }} data-reveal="left">
              <span className="eyebrow" data-reveal style={delay(1)}>The studio</span>
              <h2 className="h2" data-reveal style={delay(2)}>By appointment only</h2>
              <p className="lede" data-reveal style={delay(3)}>
                One client at a time, a quiet room, fresh linens and a warm blanket. Arrive with clean lashes and no eye makeup so we can start right away.
              </p>
              <div data-reveal style={delay(4)}><Link className="btn ghost" href="/manage">Booking policies</Link></div>
            </div>
            <div data-reveal="right" style={delay(2)}>
              <HoursTable />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
