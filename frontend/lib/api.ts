import type { Catalog } from "./types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

/** Récupère menu, horaires et réglages depuis l'API (côté serveur, mis en cache 60 s). */
export async function getCatalog(): Promise<Catalog | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/catalog`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as Catalog;
  } catch {
    return null;
  }
}
