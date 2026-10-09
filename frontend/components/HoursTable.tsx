"use client";

import { useEffect, useState } from "react";
import { useBooking } from "./BookingProvider";
import { DAYL, pad } from "@/lib/format";

export function HoursTable() {
  const { catalog } = useBooking();
  // le jour courant dépend du fuseau du visiteur : calculé après le montage
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(new Date().getDay()), []);

  return (
    <table className="hours" aria-label="Opening hours">
      <tbody>
        {[1, 2, 3, 4, 5, 6, 0].map(d => {
          const h = catalog.hours[d];
          return (
            <tr key={d} className={d === today ? "today" : ""}>
              <td>{DAYL[d]}{d === today ? " · today" : ""}</td>
              <td>{h ? `${pad(h[0])}:00 – ${pad(h[1])}:00` : "Closed"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
