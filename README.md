# ILSEBEAUTY — Next.js + Node.js

Conversion du fichier `Luxury Feel.html` en deux projets :

```
backend/    API Node.js (Express) : menu, horaires, disponibilités, demandes de réservation
frontend/   Site Next.js 15 (App Router, TypeScript) : /, /services, /book, /manage
```

## Prérequis

Node.js 18.18 ou plus récent (https://nodejs.org).

## Lancer en local

Terminal 1 — l'API :

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

L'API écoute sur http://localhost:4000.

Terminal 2 — le site :

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Le site est sur http://localhost:3000. Next relaie les appels `/api/*` vers l'API (voir `next.config.mjs`), donc le navigateur n'a pas besoin de CORS.

Pour la production (`npm run build`), démarre l'API d'abord : les pages récupèrent le menu au moment de la compilation puis le rafraîchissent toutes les 60 secondes.

## API

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/health` | Vérifie que l'API répond |
| GET | `/api/catalog` | Services, horaires, devise, lien Fresha |
| GET | `/api/services`, `/api/services/:id` | Le menu |
| GET | `/api/hours` | Horaires (dimanche → samedi) |
| GET | `/api/availability?date=YYYY-MM-DD&mins=135` | Créneaux de départ possibles |
| POST | `/api/bookings` | Enregistre une demande de réservation (validée côté serveur) |
| GET | `/api/bookings` | Liste des demandes, avec `Authorization: Bearer <ADMIN_TOKEN>` |

Les demandes sont écrites dans `backend/data/bookings.json`. La réservation reste confirmée par Fresha, comme dans le site d'origine.

## Où modifier quoi

- Menu, prix, horaires : `backend/src/data/catalog.js`
- Lien Fresha, devise, port : `backend/.env`
- Styles : `frontend/app/globals.css`
- Pages : `frontend/app/**/page.tsx` ; composants : `frontend/components/`
- Identité visuelle : design system ILSEBEAUTY (couleurs et typos dans `frontend/app/globals.css`, logos, icône panier et collage dans `frontend/public/brand/`)
