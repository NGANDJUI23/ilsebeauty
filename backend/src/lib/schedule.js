import { HOURS, BOOKING_WINDOW_DAYS } from "../data/catalog.js";

const pad = n => String(n).padStart(2, "0");

/** Parse "YYYY-MM-DD" en date locale (minuit), ou null si invalide. */
export function parseDateKey(key) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key || ""));
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (d.getFullYear() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) return null;
  return d;
}

/** La date est-elle dans la fenêtre de réservation (demain .. +N jours) ? */
export function isWithinWindow(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date - today) / 86400000);
  return diff >= 1 && diff <= BOOKING_WINDOW_DAYS;
}

/** Créneaux de départ (toutes les 30 min) où une visite de `mins` minutes tient dans la journée. */
export function slotsFor(date, mins) {
  const h = HOURS[date.getDay()];
  if (!h) return [];
  const need = Math.max(30, Number(mins) || 0);
  const out = [];
  for (let m = h[0] * 60; m + need <= h[1] * 60; m += 30) out.push(pad(Math.floor(m / 60)) + ":" + pad(m % 60));
  return out;
}
