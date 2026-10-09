import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { catalogRouter } from "./routes/catalog.js";
import { availabilityRouter } from "./routes/availability.js";
import { bookingsRouter } from "./routes/bookings.js";

export const app = express();

app.disable("x-powered-by");

// Sur Netlify, les requêtes arrivent préfixées par le chemin de la fonction
const FUNCTION_PREFIX = "/.netlify/functions/api";
app.use((req, _res, next) => {
  if (req.url.startsWith(FUNCTION_PREFIX)) req.url = req.url.slice(FUNCTION_PREFIX.length) || "/";
  next();
});

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", catalogRouter);
app.use("/api", availabilityRouter);
app.use("/api", bookingsRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON" });
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
