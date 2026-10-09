# ILSEBEAUTY — site (Next.js)

Site de réservation ILSEBEAUTY : Next.js 15 (App Router, TypeScript), pages `/`, `/services`, `/book`, `/manage`.
Le menu, les horaires et les créneaux viennent de l'API ILSEBEAUTY (repo backend séparé).

## Prérequis

- Node.js 18.18 ou plus récent
- L'API backend lancée (en local sur http://localhost:4000, ou son URL Netlify)

## Lancer en local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Le site est sur http://localhost:3000. Next relaie les appels `/api/*` vers l'API indiquée par `BACKEND_URL` (voir `next.config.mjs`), donc le navigateur n'a pas besoin de CORS.

Pour la production (`npm run build`), l'API doit répondre : les pages récupèrent le menu au moment de la compilation puis le rafraîchissent toutes les 60 secondes.

## Déployer sur Netlify

Déploie d'abord l'API (voir son README), puis : Add new project → Import from GitHub → ce repo.
Base directory : vide (la racine). Le reste est lu dans `netlify.toml`.

Variable d'environnement obligatoire : `BACKEND_URL = https://<site-backend>.netlify.app` (sans `/` final).

## Où modifier quoi

- Styles, couleurs et typos (design system ILSEBEAUTY) : `app/globals.css`
- Pages : `app/**/page.tsx` ; composants : `components/`
- Logos, icône panier, collage : `public/brand/`
- Le menu, les prix et les horaires se modifient dans l'API, pas ici.
