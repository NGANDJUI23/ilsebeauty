import { Router } from "express";
import { randomUUID } from "node:crypto";
import { SERVICES } from "../data/catalog.js";
import { parseDateKey, isWithinWindow, slotsFor } from "../lib/schedule.js";
import { bookingStore } from "../lib/store.js";
import { config } from "../config.js";

export const bookingsRouter = Router();

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function validate(body) {
  const errors = {};
  const ids = Array.isArray(body.services) ? [...new Set(body.services)] : [];
  const services = SERVICES.filter(s => ids.includes(s.id));
  if (!services.length || services.length !== ids.length) errors.services = "Choose at least one valid service.";

  const mins = services.reduce((a, s) => a + s.mins, 0);
  const date = parseDateKey(body.date);
  if (!date || !isWithinWindow(date)) errors.date = "Choose a date in the booking window.";
  else if (!slotsFor(date, mins).includes(body.time)) errors.time = "This start time isn't available.";

  const name = str(body.name, 100);
  const phone = str(body.phone, 30);
  const email = str(body.email, 200);
  if (name.length < 2) errors.name = "Enter your full name.";
  if (phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number with at least 7 digits.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter an email like name@example.com.";

  return {
    errors,
    booking: {
      services: services.map(s => ({ id: s.id, name: s.name, mins: s.mins, price: s.price })),
      date: body.date,
      time: body.time,
      totalMins: mins,
      totalPrice: services.reduce((a, s) => a + s.price, 0),
      name, phone, email,
      notes: str(body.notes, 1000),
      firstVisit: body.first === true
    }
  };
}

// Enregistre une demande de réservation (la confirmation finale se fait sur Fresha)
bookingsRouter.post("/bookings", async (req, res, next) => {
  try {
    const { errors, booking } = validate(req.body || {});
    if (Object.keys(errors).length) return res.status(422).json({ error: "Validation failed", fields: errors });
    const saved = await bookingStore.add({ id: randomUUID(), createdAt: new Date().toISOString(), status: "requested", ...booking });
    res.status(201).json({ id: saved.id, status: saved.status, freshaUrl: config.freshaUrl });
  } catch (e) {
    next(e);
  }
});

// Liste des demandes, réservée à l'administratrice (Authorization: Bearer <ADMIN_TOKEN>)
bookingsRouter.get("/bookings", async (req, res, next) => {
  if (!config.adminToken) return res.status(404).json({ error: "Not found" });
  if (req.get("authorization") !== `Bearer ${config.adminToken}`) return res.status(401).json({ error: "Unauthorized" });
  try {
    res.json(await bookingStore.list());
  } catch (e) {
    next(e);
  }
});
