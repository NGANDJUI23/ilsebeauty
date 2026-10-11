"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useBooking } from "./BookingProvider";
import { DAYL, DAYN, MON, dateKey, daysAhead, fmtD, longDate, validateInfo, type InfoErrors } from "@/lib/format";
import type { BookingInfo } from "@/lib/types";

const STEPS = ["Services", "Date & time", "Your details", "Review"];

const scrollTop = () =>
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

export function BookingFlow() {
  const b = useBooking();
  const { catalog, hydrated, bag, step, setStep, date, time, info } = b;
  const days = useMemo(() => (hydrated ? daysAhead(catalog.bookingWindowDays) : []), [hydrated, catalog.bookingWindowDays]);

  const canReach = (i: number) => {
    if (i <= 0) return true;
    if (bag.length === 0) return false;
    if (i >= 2 && !(date && time)) return false;
    if (i >= 3 && Object.keys(validateInfo(info)).length) return false;
    return true;
  };
  const current = canReach(step) ? step : [3, 2, 1, 0].find(canReach)!;
  useEffect(() => {
    if (current !== step) setStep(current);
  }, [current, step, setStep]);

  if (!hydrated) return null;

  const go = (n: number) => {
    setStep(n);
    scrollTop();
  };

  return (
    <>
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" aria-current={i === current ? "step" : undefined} disabled={!canReach(i)} onClick={() => setStep(i)}>
              <b>{i + 1}</b>
              {s}
            </button>
          </li>
        ))}
      </ol>
      <div className="book">
        <div className="panel">
          {current === 0 && <PanelServices onNext={() => go(1)} />}
          {current === 1 && <PanelTime days={days} onBack={() => go(0)} onNext={() => go(2)} />}
          {current === 2 && <PanelInfo onBack={() => go(1)} onNext={() => go(3)} />}
          {current === 3 && <PanelReview days={days} onBack={() => go(2)} />}
        </div>
        <Summary days={days} />
      </div>
    </>
  );
}

function PanelServices({ onNext }: { onNext: () => void }) {
  const { catalog, bag, setSelected, price } = useBooking();
  const cats = [...new Set(catalog.services.map(s => s.cat))];
  return (
    <>
      <h3>choose your services</h3>
      <p className="lede">Select everything you&apos;d like in one visit. Your time and total update as you go.</p>
      <div className="pick">
        {cats.map(c => (
          <Fragment key={c}>
            <div className="pick-group">{c}</div>
            {catalog.services.filter(s => s.cat === c).map(s => (
              <label key={s.id}>
                <input type="checkbox" checked={bag.includes(s.id)} onChange={e => setSelected(s.id, e.target.checked)} />
                <span>
                  {s.name}
                  <small>{fmtD(s.mins)}</small>
                </span>
                <span className="price">{price(s.price)}</span>
              </label>
            ))}
          </Fragment>
        ))}
      </div>
      <div className="actions">
        <span></span>
        <button className="btn" type="button" disabled={!bag.length} onClick={onNext}>Choose a time</button>
      </div>
    </>
  );
}

function PanelTime({ days, onBack, onNext }: { days: Date[]; onBack: () => void; onNext: () => void }) {
  const { catalog, totals, date, setDate, time, setTime } = useBooking();
  const [slots, setSlots] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  const isOpen = (d: Date) => !!catalog.hours[d.getDay()];

  // Sélectionne le premier jour ouvert par défaut
  useEffect(() => {
    if (!date || !days.some(d => dateKey(d) === date)) {
      const first = days.find(isOpen);
      if (first) setDate(dateKey(first));
    }
  }, [date, days]);

  // Créneaux calculés par l'API
  useEffect(() => {
    if (!date) return;
    const ctrl = new AbortController();
    setSlots(null);
    setFailed(false);
    fetch(`/api/availability?date=${date}&mins=${totals.mins}`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { slots: string[] }) => setSlots(d.slots))
      .catch(e => {
        if (e?.name !== "AbortError") setFailed(true);
      });
    return () => ctrl.abort();
  }, [date, totals.mins]);

  const sel = days.find(d => dateKey(d) === date) || days[0];

  return (
    <>
      <h3>pick a day &amp; time</h3>
      <p className="lede">Your visit needs about {fmtD(totals.mins)}. Choose your preferred start time.</p>
      <div className="days" role="group" aria-label="Day">
        {days.map(d => {
          const k = dateKey(d), open = isOpen(d);
          return (
            <button
              key={k}
              className="day"
              type="button"
              aria-pressed={k === date}
              disabled={!open}
              aria-label={longDate(d) + (open ? "" : ", closed")}
              onClick={() => {
                setDate(k);
                setTime(null);
              }}
            >
              <span>{DAYN[d.getDay()]}</span>
              <strong>{d.getDate()}</strong>
              <span>{MON[d.getMonth()]}</span>
            </button>
          );
        })}
      </div>
      {failed ? (
        <p className="note">We couldn&apos;t load times right now. Please try again in a moment.</p>
      ) : slots === null ? (
        <p className="note">Loading times…</p>
      ) : slots.length ? (
        <div className="times" role="group" aria-label="Start time">
          {slots.map(t => (
            <button key={t} className="time" type="button" aria-pressed={time === t} onClick={() => setTime(t)}>
              {t}
            </button>
          ))}
        </div>
      ) : (
        <p className="note">This visit is too long to fit on {sel ? DAYL[sel.getDay()] : "this day"}. Try a weekday.</p>
      )}
      <p className="note">Fresha shows live availability and holds your exact slot in the final step.</p>
      <div className="actions">
        <button className="link" type="button" onClick={onBack}>Back to services</button>
        <button className="btn" type="button" disabled={!time} onClick={onNext}>Add your details</button>
      </div>
    </>
  );
}

function PanelInfo({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { info, setInfoField } = useBooking();
  const [errors, setErrors] = useState<InfoErrors>({});

  const field = (k: "name" | "phone" | "email") => ({
    id: `f-${k}`,
    name: k,
    value: info[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInfoField(k, e.target.value)
  });

  const next = () => {
    const errs = validateInfo(info);
    setErrors(errs);
    const firstBad = (["name", "phone", "email"] as const).find(k => errs[k]);
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus();
      return;
    }
    onNext();
  };

  return (
    <>
      <h3>your details</h3>
      <p className="lede">So we can recognise you when you confirm on Fresha.</p>
      <form className="form" noValidate onSubmit={e => { e.preventDefault(); next(); }}>
        <div className="field">
          <label htmlFor="f-name">Full name</label>
          <input {...field("name")} autoComplete="name" />
          <span className="err">{errors.name}</span>
        </div>
        <div className="field">
          <label htmlFor="f-phone">Phone</label>
          <input {...field("phone")} type="tel" autoComplete="tel" />
          <span className="err">{errors.phone}</span>
        </div>
        <div className="field full">
          <label htmlFor="f-email">Email</label>
          <input {...field("email")} type="email" autoComplete="email" />
          <span className="err">{errors.email}</span>
        </div>
        <div className="field full">
          <label htmlFor="f-notes">Notes for your artist (optional)</label>
          <textarea
            id="f-notes"
            name="notes"
            placeholder="Allergies, sensitive eyes, the look you're hoping for"
            value={info.notes}
            onChange={e => setInfoField("notes", e.target.value)}
          />
        </div>
        <label className="check full" style={{ gridColumn: "1/-1" }}>
          <input type="checkbox" checked={info.first} onChange={e => setInfoField("first", e.target.checked)} />
          <span>This is my first visit to <em>ILSEBEAUTY</em></span>
        </label>
        {/* permet la validation avec la touche Entrée */}
        <button type="submit" hidden />
      </form>
      <div className="actions">
        <button className="link" type="button" onClick={onBack}>Back to date &amp; time</button>
        <button className="btn" type="button" onClick={next}>Review booking</button>
      </div>
    </>
  );
}

function PanelReview({ days, onBack }: { days: Date[]; onBack: () => void }) {
  const { catalog, bag, chosen, totals, date, time, info, price, toast } = useBooking();
  const d = days.find(x => dateKey(x) === date);
  const when = d ? `${longDate(d)} at ${time}` : "";

  const copySummary = () => {
    const txt = `ILSEBEAUTY booking\n${chosen.map(s => "• " + s.name).join("\n")}\n${when}\nEstimated total: ${price(totals.price)}`;
    const fail = () => toast("Copy isn't available here. Select the details above instead.");
    try {
      navigator.clipboard.writeText(txt).then(() => toast("Summary copied"), fail);
    } catch {
      fail();
    }
  };

  // Enregistre la demande côté API ; le lien Fresha s'ouvre en parallèle dans un nouvel onglet
  const sendRequest = () => {
    const body: { services: string[]; date: string | null; time: string | null } & BookingInfo = { services: bag, date, time, ...info };
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true
    })
      .then(r => r.ok && toast("Booking request sent. Finish on Fresha to secure your slot."))
      .catch(() => {});
  };

  return (
    <>
      <h3>review &amp; confirm</h3>
      <p className="lede">
        Check everything, then continue to Fresha to secure your slot. Your booking is confirmed once Fresha sends your confirmation.
      </p>
      <dl className="review" style={{ margin: 0 }}>
        <div><dt>Services</dt><dd>{chosen.map(s => s.name).join(", ")}</dd></div>
        <div><dt>When</dt><dd>{when} · about {fmtD(totals.mins)}</dd></div>
        <div><dt>Name</dt><dd>{info.name}</dd></div>
        <div><dt>Contact</dt><dd>{info.phone}<br />{info.email}</dd></div>
        {info.notes && <div><dt>Notes</dt><dd>{info.notes}</dd></div>}
        <div><dt>Estimated total</dt><dd>{price(totals.price)}</dd></div>
      </dl>
      <div className="actions">
        <button className="link" type="button" onClick={onBack}>Edit details</button>
        <div style={{ display: "flex", gap: "var(--s1)", flexWrap: "wrap" }}>
          <button className="btn ghost" type="button" onClick={copySummary}>Copy summary</button>
          <a className="btn" href={catalog.freshaUrl} target="_blank" rel="noopener" onClick={sendRequest}>Confirm on Fresha</a>
        </div>
      </div>
    </>
  );
}

function Summary({ days }: { days: Date[] }) {
  const { chosen, totals, date, time, price } = useBooking();
  const d = date ? days.find(x => dateKey(x) === date) : undefined;
  return (
    <aside className="summary" aria-live="polite">
      <h4>Your booking</h4>
      {chosen.length ? (
        <>
          <ul>
            {chosen.map(s => (
              <li key={s.id}><span>{s.name}</span><span>{price(s.price)}</span></li>
            ))}
          </ul>
          <p className="when">{time && d ? `${longDate(d)} · ${time}` : "No time chosen yet"}</p>
          <div className="tot"><span>{fmtD(totals.mins)}</span><span>{price(totals.price)}</span></div>
        </>
      ) : (
        <>
          <p className="empty">Nothing added yet. Choose a service to begin.</p>
          <Link className="link" href="/services">Browse services</Link>
        </>
      )}
    </aside>
  );
}
