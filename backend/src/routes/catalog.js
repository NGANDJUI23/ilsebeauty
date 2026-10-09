import { Router } from "express";
import { SERVICES, HOURS, BOOKING_WINDOW_DAYS } from "../data/catalog.js";
import { config } from "../config.js";

export const catalogRouter = Router();

// Tout ce dont le frontend a besoin pour afficher le site
catalogRouter.get("/catalog", (_req, res) => {
  res.json({
    currency: config.currency,
    freshaUrl: config.freshaUrl,
    bookingWindowDays: BOOKING_WINDOW_DAYS,
    services: SERVICES,
    hours: HOURS
  });
});

catalogRouter.get("/services", (_req, res) => res.json(SERVICES));

catalogRouter.get("/services/:id", (req, res) => {
  const s = SERVICES.find(x => x.id === req.params.id);
  if (!s) return res.status(404).json({ error: "Service not found" });
  res.json(s);
});

catalogRouter.get("/hours", (_req, res) => res.json(HOURS));
