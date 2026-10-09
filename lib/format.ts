import type { BookingInfo } from "./types";

export const DAYN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAYL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const pad = (n: number) => String(n).padStart(2, "0");
export const fmtP = (n: number, currency: string) => (n === 0 ? "Free" : currency + n);
export const fmtD = (m: number) => {
  const h = Math.floor(m / 60), r = m % 60;
  return (h ? h + "h" : "") + (r ? (h ? " " : "") + r + "m" : "");
};

export const dateKey = (d: Date) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
export const longDate = (d: Date) => `${DAYL[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;

export function daysAhead(count: number): Date[] {
  const out: Date[] = [], d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 1; i <= count; i++) {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    out.push(x);
  }
  return out;
}

export type InfoErrors = Partial<Record<"name" | "phone" | "email", string>>;

export function validateInfo(i: BookingInfo): InfoErrors {
  const errs: InfoErrors = {};
  if (i.name.trim().length < 2) errs.name = "Enter your full name.";
  if (i.phone.replace(/\D/g, "").length < 7) errs.phone = "Enter a phone number with at least 7 digits.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.email.trim())) errs.email = "Enter an email like name@example.com.";
  return errs;
}
