import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";

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

/** Stockage JSON minimal ; les écritures sont sérialisées pour éviter les collisions. */
export const bookingStore = {
  list: () => readAll(),
  add(booking) {
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
