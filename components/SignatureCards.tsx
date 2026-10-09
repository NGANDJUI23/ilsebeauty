"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "./BookingProvider";
import { LashArt, type ArtKind } from "./LashArt";
import { fmtD } from "@/lib/format";

const ART_FOR: Record<string, ArtKind> = { hybrid: "classic", volume: "volume", wet: "wet" };

export function SignatureCards() {
  const router = useRouter();
  const { catalog, add, price } = useBooking();

  return (
    <div className="sig">
      {catalog.services.filter(s => s.sig).map((s, i) => (
        <button
          key={s.id}
          className="sig-card"
          type="button"
          onClick={() => {
            add(s.id);
            router.push("/book");
          }}
        >
          <figure className="pola" style={{ margin: 0 }}>
            <LashArt kind={ART_FOR[s.id] || "classic"} seed={i + 1} />
          </figure>
          <span className="from">{fmtD(s.mins)} · {price(s.price)}</span>
          <h3>{s.name.toLowerCase()}</h3>
          <p>{s.desc}</p>
          <span className="link" style={{ fontSize: "var(--t-xs)", letterSpacing: ".18em", textTransform: "uppercase" }}>
            Book this look
          </span>
        </button>
      ))}
    </div>
  );
}
