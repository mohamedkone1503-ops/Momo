# Flex Hairstyle — site vitrine

Barber shop, 43 rue du Château d'Eau, Paris 10e.
Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis changez le mot de passe admin
npm run dev                  # http://localhost:3000
```

| Page | URL |
|---|---|
| Accueil (hero, tarifs, salon, galerie, contact) | `/` |
| Réservation en ligne | `/reservation` |
| Administration des rendez-vous | `/admin` |
| Mentions légales | `/mentions-legales` |

## Arborescence

```
public/photos/          Photos du salon (hero, salon, galerie)
src/
  app/
    layout.tsx          Polices, métadonnées SEO, données structurées (BarberShop)
    page.tsx            Page d'accueil
    reservation/        Page de réservation
    admin/              Espace admin (connexion + gestion des RDV)
    mentions-legales/
    api/slots           Créneaux disponibles
    api/reservations    Enregistrement d'une demande de RDV
    robots.ts, sitemap.ts, icon.svg
    globals.css         Charte graphique (couleurs, polices)
  components/           Header, Hero, Services, Salon, Gallery, Contact, BookingForm…
  data/                 ★ TOUS LES CONTENUS ET VALEURS À REMPLACER ★
  lib/                  Créneaux, stockage des réservations, authentification admin
data/reservations.json  Réservations (créé automatiquement, non versionné)
```

## Valeurs provisoires « [À CONFIRMER] »

Toutes regroupées dans `src/data/` (plus la palette dans `src/app/globals.css`
et les infos légales dans `src/app/mentions-legales/page.tsx`).
Pour les lister : `grep -rn "À CONFIRMER" src/`

En mode développement, un badge pointillé **« À CONFIRMER »** s'affiche à côté
de chaque donnée provisoire sur le site. Il disparaît en production.

| Fichier | Contenu |
|---|---|
| `src/data/site.ts` | téléphone, e-mail, code postal, nom de domaine, réseaux sociaux, horaires, GPS |
| `src/data/services.ts` | prestations, tarifs, durées (passez `aConfirmer: false` une fois validé) |
| `src/data/content.ts` | tous les textes du site, accès métro |
| `src/data/booking.ts` | nombre de RDV simultanés, délai minimum, horizon de réservation |
| `src/data/reviews.ts` | avis clients (vide : la section est masquée tant qu'il n'y a pas de vrais avis) |
| `src/data/gallery.ts` | liste et descriptions des photos |
| `src/app/globals.css` | codes couleur (repris de l'enseigne : noir, or `#c9a25f`, blanc cassé) |
| `.env.local` | `ADMIN_PASSWORD`, `ADMIN_SECRET` |

## Réservations et admin

- Les créneaux sont calculés à partir des horaires, de la durée de la prestation et du
  nombre de fauteuils (`seats`). Un créneau plein disparaît.
- Les demandes arrivent « En attente » dans `/admin`, où l'on peut les confirmer, annuler ou supprimer.
- Stockage : fichier `data/reservations.json`. Cela convient sur un serveur classique (VPS, `npm start`).
  Sur un hébergement serverless (Vercel, Netlify), il faut le remplacer par une base de données
  (fonctions de `src/lib/reservations.ts`).
- Aucune notification (e-mail/SMS) n'est envoyée pour l'instant.

## Mise en production

```bash
npm run build && npm start
```
