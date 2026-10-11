import type { Metadata } from "next";
import Link from "next/link";
import { PolicyList } from "@/components/Policies";

export const metadata: Metadata = { title: "Policies" };

export default function PoliciesPage() {
  return (
    <section className="view" aria-label="Policies">
      <div className="wrap sec">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Before your visit</span>
            <h1 className="h2" style={{ fontSize: "var(--t-hero)", lineHeight: 1 }}>policies</h1>
          </div>
          <p className="lede" style={{ maxWidth: "44ch", fontSize: "var(--t-sm)" }}>
            A few simple rules so every appointment starts on time and your set lasts as long as possible.
          </p>
        </div>
        <PolicyList />
        <div className="actions">
          <Link className="link" href="/faq">Read the FAQ</Link>
          <Link className="btn" href="/book">Book an appointment</Link>
        </div>
      </div>
    </section>
  );
}
