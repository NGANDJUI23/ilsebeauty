import { Router } from "express";
import { parseDateKey, isWithinWindow, slotsFor } from "../lib/schedule.js";

export const availabilityRouter = Router();

// GET /api/availability?date=YYYY-MM-DD&mins=135
availabilityRouter.get("/availability", (req, res) => {
  const date = parseDateKey(req.query.date);
  if (!date) return res.status(400).json({ error: "Invalid date, expected YYYY-MM-DD" });
  const mins = Number(req.query.mins) || 0;
  if (mins < 0 || mins > 24 * 60) return res.status(400).json({ error: "Invalid duration" });

  const slots = isWithinWindow(date) ? slotsFor(date, mins) : [];
  res.json({ date: req.query.date, open: slots.length > 0, slots });
});
