import type { Metadata } from "next";
import { ServicesMenu } from "@/components/ServicesMenu";

export const metadata: Metadata = { title: "Our services" };

export default function ServicesPage() {
  return (
    <section className="view" aria-label="Our services">
      <div className="wrap sec">
        <div className="sec-head">
          <div>
            <span className="eyebrow">The menu</span>
            <h1 className="h2" style={{ fontSize: "var(--t-hero)", lineHeight: 1 }}>our services</h1>
          </div>
          <p className="lede" style={{ maxWidth: "42ch", fontSize: "var(--t-sm)" }}>
            Tap + to add a service to your booking. Fills keep your set full and are for lashes applied in our studio within the last three weeks.
          </p>
        </div>
        <ServicesMenu />
      </div>
    </section>
  );
}
