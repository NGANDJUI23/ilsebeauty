"use client";

import { useState } from "react";
import { useBooking } from "./BookingProvider";
import { fmtD } from "@/lib/format";

const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 1v14M1 8h14" />
  </svg>
);

/* Prestations annoncées mais pas encore réservables : affichées sans prix ni bouton */
const SOON = "Coming soon";
const COMING_SOON = ["Waxing", "Make up"];

export function ServicesMenu() {
  const { catalog, bag, toggle, price } = useBooking();
  const [filter, setFilter] = useState("All");
  const cats = [...new Set(catalog.services.map(s => s.cat))];
  const shown = filter === "All" ? cats : cats.filter(c => c === filter);

  return (
    <>
      <div className="chips" role="group" aria-label="Filter services">
        {["All", ...cats, SOON].map(c => (
          <button key={c} className="chip" type="button" aria-pressed={filter === c} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>
      <div>
        {shown.map(c => (
          <div className="cat" key={c}>
            <h3>{c}</h3>
            {catalog.services.filter(s => s.cat === c).map(s => {
              const on = bag.includes(s.id);
              return (
                <div className={"svc" + (on ? " on" : "")} key={s.id}>
                  <div className="svc-main">
                    <span className="svc-name">{s.name}</span>
                    <span className="svc-desc">{s.desc}</span>
                    <span className="svc-meta">
                      <span>{fmtD(s.mins)}</span>
                      <b>{price(s.price)}</b>
                    </span>
                  </div>
                  <button className="add" type="button" aria-pressed={on} aria-label={`${on ? "Remove" : "Add"} ${s.name}`} onClick={() => toggle(s.id)}>
                    <Plus />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
        {(filter === "All" || filter === SOON) && (
          <div className="cat">
            <h3>{SOON}</h3>
            {COMING_SOON.map(name => (
              <div className="svc" key={name}>
                <div className="svc-main">
                  <span className="svc-name">{name}</span>
                  <span className="svc-meta">
                    <b>{SOON}</b>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
