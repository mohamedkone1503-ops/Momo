# Flex Hairstyle : site vitrine

Barber shop afro, 43 rue du Château d'Eau, 75010 Paris.
Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript, d'après `brief-site-flex-hairstyle`.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis changez le mot de passe admin
npm run dev                  # http://localhost:3000
```

| Page | URL |
|---|---|
| One page (Accueil, Le salon, Tarifs, Galerie, Avis, Infos) | `/` |
| Réservation en 4 étapes | `/reservation` |
| Administration (RDV du jour/semaine, annulation, blocages) | `/admin` |
| Mentions légales / Politique de confidentialité | `/mentions-legales`, `/confidentialite` |

## Arborescence

```
public/photos/              Photos du salon (hero, salon, galerie)
src/
  app/
    layout.tsx              Polices, SEO (title, description, Open Graph), Schema.org HairSalon
    page.tsx                One page
    reservation/            Page de réservation (interne ou outil externe)
    admin/                  Espace admin protégé par mot de passe
    api/slots               Créneaux (disponibles / pris)
    api/reservations        Création d'un RDV + e-mails
    mentions-legales/, confidentialite/
    robots.ts, sitemap.ts, icon.svg
    globals.css             Charte graphique (palette, boutons, motifs)
  components/               Sections, header, footer, bannière cookies…
    booking/                Assistant de réservation + calendrier
  data/                     ★ TOUS LES CONTENUS MODIFIABLES ★
  lib/                      Créneaux, stockage, e-mails, .ics, authentification
data/                       reservations.json, blocks.json (créés automatiquement, non versionnés)
```

## Modifier les contenus : `src/data/`

| Fichier | Contenu |
|---|---|
| `services.json` | **Prestations, prix, durées** (fichier unique). Passez `aConfirmer` à `false` une fois validé |
| `site.ts` | Téléphone, e-mail, horaires, accès métro, réseaux sociaux, lien avis Google, domaine, logo |
| `barbers.ts` | Noms et photos des barbiers (= nombre de RDV simultanés) |
| `reviews.ts` | Avis clients |
| `gallery.ts` | Photos ; les emplacements `src: null` attendent des photos de coupes |
| `content.ts` | Textes du site |
| `booking.ts` | Règles de réservation, mode interne / externe (Planity, Booksy) |
| `legal.ts` | Raison sociale, SIRET, hébergeur |

### Valeurs provisoires « [À CONFIRMER] »

Liste complète : `grep -rn "À CONFIRMER" src/`.
En `npm run dev`, un badge pointillé **« À CONFIRMER »** s'affiche sur le site à côté de chaque
donnée provisoire. Il disparaît en production.

À fournir (brief §7) : logo HD (`public/logo.svg` puis `logoSrc: "/logo.svg"` dans `site.ts`),
grille tarifaire, horaires, téléphone/e-mail, comptes Instagram/Snapchat/TikTok, barbiers,
photos de coupes, règles de réservation, raison sociale/SIRET, **vrais avis Google**
(les 3 avis actuels sont les exemples du brief et ne doivent pas être publiés tels quels).

## Réservation

- Parcours : prestation (+ supplément design) → coiffeur (« Peu importe » ou un barbier) → date et créneau → coordonnées + consentement RGPD → confirmation avec fichier `.ics`.
- Créneaux calculés à partir des horaires, de la durée totale et du planning de chaque barbier. Créneaux pris grisés.
- « Peu importe » : le barbier libre le moins chargé de la journée est attribué automatiquement.
- **Outil externe** : dans `src/data/booking.ts`, `mode: "externe"` + `external.url` remplace la page par un bouton (ou widget) Planity/Booksy.

### E-mails

Renseignez `SMTP_*` dans `.env.local` (Brevo, OVH, Gmail…) : e-mail de confirmation au client (avec `.ics`), notification au salon (`SALON_NOTIFY_EMAIL`), e-mail d'annulation depuis l'admin.
Sans SMTP, rien n'est envoyé (message dans la console) et la page de confirmation l'indique.

### Admin

`/admin`, mot de passe `ADMIN_PASSWORD` (`.env.local`). Vues : aujourd'hui, 7 jours, tout à venir, passés.
Annuler un RDV (avec e-mail au client), supprimer, bloquer un créneau ou une journée (tout le salon ou un barbier).

## Mise en ligne

- **Serveur classique (VPS)** : `npm run build && npm start`. Les données sont dans `data/`.
- **Vercel** : le disque n'y est pas persistant. Remplacez `read`/`write` dans `src/lib/reservations.ts`
  par une base (Vercel Postgres, Supabase, Upstash…), ou passez en mode `externe`.
- Pensez à définir `ADMIN_PASSWORD`, `ADMIN_SECRET` et les variables SMTP chez l'hébergeur.

## Qualité

Lighthouse mobile (build de production) : performance 92–94, accessibilité 100, bonnes pratiques 100, SEO 100.
