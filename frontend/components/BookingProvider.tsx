"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { BookingInfo, Catalog, Service } from "@/lib/types";
import { fmtP } from "@/lib/format";

const STORAGE_KEY = "lf-booking";
const EMPTY_INFO: BookingInfo = { name: "", phone: "", email: "", notes: "", first: false };

type BookingContextValue = {
  catalog: Catalog;
  /** true une fois l'état local (localStorage) chargé côté navigateur */
  hydrated: boolean;
  bag: string[];
  chosen: Service[];
  totals: { mins: number; price: number };
  price: (n: number) => string;
  toggle: (id: string) => void;
  setSelected: (id: string, on: boolean) => void;
  add: (id: string) => void;
  step: number;
  setStep: (n: number) => void;
  date: string | null;
  setDate: (d: string | null) => void;
  time: string | null;
  setTime: (t: string | null) => void;
  info: BookingInfo;
  setInfoField: <K extends keyof BookingInfo>(k: K, v: BookingInfo[K]) => void;
  toast: (msg: string) => void;
  bumpCount: number;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({ catalog, children }: { catalog: Catalog; children: React.ReactNode }) {
  const [bag, setBag] = useState<string[]>([]);
  const [info, setInfo] = useState<BookingInfo>(EMPTY_INFO);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [bumpCount, setBumpCount] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restaure la sélection et les coordonnées
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (s) {
        setBag((s.bag || []).filter((id: string) => catalog.services.some(x => x.id === id)));
        setInfo(i => ({ ...i, ...(s.info || {}) }));
      }
    } catch {}
    setHydrated(true);
  }, [catalog]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bag, info }));
    } catch {}
  }, [bag, info, hydrated]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastOn(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 2200);
  }, []);

  const chosen = useMemo(() => catalog.services.filter(s => bag.includes(s.id)), [catalog, bag]);
  const totals = useMemo(
    () => chosen.reduce((a, s) => ({ mins: a.mins + s.mins, price: a.price + s.price }), { mins: 0, price: 0 }),
    [chosen]
  );
  const price = useCallback((n: number) => fmtP(n, catalog.currency), [catalog.currency]);

  const setSelected = useCallback((id: string, on: boolean) => {
    setBag(b => (on ? (b.includes(id) ? b : [...b, id]) : b.filter(x => x !== id)));
    setTime(null);
  }, []);

  const add = useCallback((id: string) => setSelected(id, true), [setSelected]);

  const toggle = useCallback(
    (id: string) => {
      const s = catalog.services.find(x => x.id === id);
      if (!s) return;
      if (bag.includes(id)) {
        setSelected(id, false);
        toast(s.name + " removed");
      } else {
        setSelected(id, true);
        toast(s.name + " added to your booking");
        setBumpCount(c => c + 1);
      }
    },
    [bag, catalog, setSelected, toast]
  );

  const setInfoField = useCallback(<K extends keyof BookingInfo>(k: K, v: BookingInfo[K]) => {
    setInfo(i => ({ ...i, [k]: v }));
  }, []);

  const value: BookingContextValue = {
    catalog, hydrated, bag, chosen, totals, price, toggle, setSelected, add,
    step, setStep, date, setDate, time, setTime, info, setInfoField, toast, bumpCount
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
      <div className={"toast" + (toastOn ? " show" : "")} role="status">{toastMsg}</div>
    </BookingContext.Provider>
  );
}
