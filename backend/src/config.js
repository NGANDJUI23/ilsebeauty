import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map(s => s.trim()),
  freshaUrl: process.env.FRESHA_URL || "https://www.fresha.com/",
  currency: process.env.CURRENCY || "€",
  dataDir: process.env.DATA_DIR || "./data",
  adminToken: process.env.ADMIN_TOKEN || ""
};
