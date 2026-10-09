import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

/* Deux stockages possibles :
   - "file"  : un fichier JSON local (développement, serveur classique)
   - "blobs" : Netlify Blobs (sur Netlify, où le disque n'est pas conservé)
   Par défaut : "blobs" quand l'API tourne dans une fonction Netlify, sinon "file". */
const driver = process.env.STORAGE || (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY ? "blobs" : "file");

/* ---------- fichier JSON ---------- */
const file = path.resolve(config.dataDir, "bookings.json");
let queue = Promise.resolve();

async function readAll() {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

const fileStore = {
  list: () => readAll(),
  add(booking) {
    // les écritures sont sérialisées pour éviter les collisions
    const run = queue.then(async () => {
      const all = await readAll();
      all.push(booking);
      await mkdir(path.dirname(file), { recursive: true });
      const tmp = file + ".tmp";
      await writeFile(tmp, JSON.stringify(all, null, 2));
      await rename(tmp, file);
      return booking;
    });
    queue = run.catch(() => {});
    return run;
  }
};

/* ---------- Netlify Blobs : une entrée par demande ---------- */
async function blobs() {
  const { getStore } = await import("@netlify/blobs");
  return getStore("bookings");
}

const blobStore = {
  async list() {
    const store = await blobs();
    const { blobs: entries } = await store.list();
    const all = await Promise.all(entries.map(e => store.get(e.key, { type: "json" })));
    return all.filter(Boolean).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
  async add(booking) {
    const store = await blobs();
    await store.setJSON(booking.id, booking);
    return booking;
  }
};

export const bookingStore = driver === "blobs" ? blobStore : fileStore;
