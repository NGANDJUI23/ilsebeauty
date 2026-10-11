import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/Faq";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <section className="view" aria-label="Frequently asked questions">
      <div className="wrap sec">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Questions</span>
            <h1 className="h2" style={{ fontSize: "var(--t-hero)", lineHeight: 1 }}>FAQ</h1>
          </div>
          <p className="lede" style={{ maxWidth: "44ch", fontSize: "var(--t-sm)" }}>
            Bookings, changes and aftercare. If your question isn&apos;t here, message us on Fresha.
          </p>
        </div>
        <FaqList />
        <div className="actions">
          <Link className="link" href="/policies">See our policies</Link>
          <Link className="btn" href="/book">Book an appointment</Link>
        </div>
      </div>
    </section>
  );
}
