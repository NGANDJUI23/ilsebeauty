import type { Metadata } from "next";
import { getCatalog } from "@/lib/api";
import { PolicyList } from "@/components/Policies";
import { FaqList } from "@/components/Faq";

export const metadata: Metadata = { title: "Manage bookings" };

export default async function ManagePage() {
  const catalog = await getCatalog();
  const fresha = catalog?.freshaUrl ?? "https://www.fresha.com/";

  return (
    <section className="view" aria-label="Manage bookings">
      <div className="wrap sec">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Your appointments</span>
            <h1 className="h2" style={{ fontSize: "var(--t-hero)", lineHeight: 1 }}>Manage bookings</h1>
          </div>
          <p className="lede" style={{ maxWidth: "44ch", fontSize: "var(--t-sm)" }}>
            Your booking lives in your Fresha account. Sign in with the email or phone number you booked with to see, move or cancel it.
          </p>
        </div>
        <div className="cards3">
          <article className="mcard">
            <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="6" width="20" height="18" /><path d="M4 11h20M9 3v5M19 3v5M11 17h6M14 14v6" /></svg>
            <h3>Reschedule</h3>
            <p>Move your appointment to another day up to 24 hours before it starts, at no charge.</p>
            <a className="btn ghost" href={fresha} target="_blank" rel="noopener">Open Fresha</a>
          </article>
          <article className="mcard">
            <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="6" width="20" height="18" /><path d="M4 11h20M9 3v5M19 3v5M11 15l6 6M17 15l-6 6" /></svg>
            <h3>Cancel</h3>
            <p>Cancel through Fresha with 24 hours&apos; notice. Later cancellations may lose the deposit.</p>
            <a className="btn ghost" href={fresha} target="_blank" rel="noopener">Open Fresha</a>
          </article>
          <article className="mcard">
            <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="14" cy="15" r="10" /><path d="M14 9v6l4 3" /></svg>
            <h3>Running late</h3>
            <p>We hold your slot for 15 minutes. After that we may shorten the service or rebook you.</p>
            <a className="btn ghost" href={fresha} target="_blank" rel="noopener">Message us on Fresha</a>
          </article>
        </div>
      </div>

      <div className="wrap sec" style={{ paddingTop: 0 }}>
        <div className="sec-head"><div><span className="eyebrow">Policies</span><h2 className="h2">Before your visit</h2></div></div>
        <PolicyList />
      </div>

      <div className="wrap sec" style={{ paddingTop: 0 }}>
        <div className="sec-head"><div><span className="eyebrow">Questions</span><h2 className="h2">Good to know</h2></div></div>
        <FaqList />
      </div>
    </section>
  );
}
