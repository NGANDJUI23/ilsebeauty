import type { Metadata } from "next";
import { getCatalog } from "@/lib/api";

export const metadata: Metadata = { title: "Manage bookings" };

const POLICIES: [string, string][] = [
  ["Deposit", "A deposit secures new full sets and is taken off your final bill."],
  ["24-hour notice", "Change or cancel at least 24 hours ahead to keep your deposit."],
  ["Patch test", "New clients with sensitive eyes can book a free patch test 48 hours before."],
  ["Fills", "Fills need at least 40% of your lashes still in place, otherwise we book a full set."],
  ["Come prepared", "Arrive with clean lashes, no mascara, and contact lenses out."],
  ["Aftercare", "Keep lashes dry for 24 hours and brush them gently each morning."]
];

const FAQ: [string, string][] = [
  ["I didn't get a confirmation. Is my booking made?", "Your booking is only confirmed when Fresha emails or texts you. If nothing arrived within a few minutes, check your spam folder, then sign in to Fresha to see if it's listed."],
  ["Can I change the service I booked?", "Yes. In Fresha, open the appointment and choose reschedule, or cancel and book again. If the new service is longer we'll need a slot that fits it."],
  ["How long does a full set last?", "Most clients come back for a fill every two to three weeks, as natural lashes shed and take extensions with them."],
  ["Do I need a Fresha account?", "Fresha asks for your name, email and phone when you book. You can sign in later with the same details to manage your appointments."]
];

export default async function ManagePage() {
  const catalog = await getCatalog();
  const fresha = catalog?.freshaUrl ?? "https://www.fresha.com/";

  return (
    <section className="view" aria-label="Manage bookings">
      <div className="wrap sec">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Your appointments</span>
            <h1 className="h2" style={{ fontSize: "var(--t-hero)", lineHeight: 1 }}>manage bookings</h1>
          </div>
          <p className="lede" style={{ maxWidth: "44ch", fontSize: "var(--t-sm)" }}>
            Your booking lives in your Fresha account. Sign in with the email or phone number you booked with to see, move or cancel it.
          </p>
        </div>
        <div className="cards3">
          <article className="mcard">
            <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="6" width="20" height="18" /><path d="M4 11h20M9 3v5M19 3v5M11 17h6M14 14v6" /></svg>
            <h3>reschedule</h3>
            <p>Move your appointment to another day up to 24 hours before it starts, at no charge.</p>
            <a className="btn ghost" href={fresha} target="_blank" rel="noopener">Open Fresha</a>
          </article>
          <article className="mcard">
            <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="6" width="20" height="18" /><path d="M4 11h20M9 3v5M19 3v5M11 15l6 6M17 15l-6 6" /></svg>
            <h3>cancel</h3>
            <p>Cancel through Fresha with 24 hours&apos; notice. Later cancellations may lose the deposit.</p>
            <a className="btn ghost" href={fresha} target="_blank" rel="noopener">Open Fresha</a>
          </article>
          <article className="mcard">
            <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="14" cy="15" r="10" /><path d="M14 9v6l4 3" /></svg>
            <h3>running late</h3>
            <p>We hold your slot for 15 minutes. After that we may shorten the service or rebook you.</p>
            <a className="btn ghost" href={fresha} target="_blank" rel="noopener">Message us on Fresha</a>
          </article>
        </div>
      </div>

      <div className="wrap sec" style={{ paddingTop: 0 }}>
        <div className="sec-head"><div><span className="eyebrow">Policies</span><h2 className="h2">before your visit</h2></div></div>
        <ul className="policy">
          {POLICIES.map(([t, d]) => (
            <li key={t}><b>{t}</b><span>{d}</span></li>
          ))}
        </ul>
      </div>

      <div className="wrap sec faq" style={{ paddingTop: 0 }}>
        <div className="sec-head"><div><span className="eyebrow">Questions</span><h2 className="h2">good to know</h2></div></div>
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
