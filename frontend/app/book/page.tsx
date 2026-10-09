import type { Metadata } from "next";
import { BookingFlow } from "@/components/BookingFlow";

export const metadata: Metadata = { title: "Book an appointment" };

export default function BookPage() {
  return (
    <section className="view" aria-label="Book an appointment">
      <div className="wrap sec">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Book an appointment</span>
            <h1 className="h2" style={{ fontSize: "var(--t-hero)", lineHeight: 1 }}>reserve your time</h1>
          </div>
        </div>
        <BookingFlow />
      </div>
    </section>
  );
}
