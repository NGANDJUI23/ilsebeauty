import { connection } from "next/server";
import type { Catalog } from "./types";

// Sans slash final : "https://x.netlify.app/" deviendrait "https://x.netlify.app//api/catalog"
const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");

async function fetchCatalog(): Promise<Catalog | null> {
  const url = `${BACKEND_URL}/api/catalog`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) return (await res.json()) as Catalog;
    console.error(`[getCatalog] ${url} a répondu ${res.status}. Vérifie la variable BACKEND_URL.`);
  } catch (e) {
    console.error(`[getCatalog] ${url} injoignable (${(e as Error).message}). Vérifie la variable BACKEND_URL.`);
  }
  return null;
}

/** Récupère menu, horaires et réglages depuis l'API (côté serveur, mis en cache 60 s). */
export async function getCatalog(): Promise<Catalog | null> {
  const catalog = await fetchCatalog();
  // API injoignable : on ne fige pas la page d'erreur au build ; elle est recalculée
  // à chaque visite jusqu'à ce que l'API réponde.
  if (!catalog) await connection();
  return catalog;
}
