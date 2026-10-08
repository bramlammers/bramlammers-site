# bramlammers.nl

De site van Bram Lammers, gebouwd met [Astro](https://astro.build) en gehost op Cloudflare Pages.

## Waar staat wat

| Wat | Waar |
|---|---|
| Alle teksten van de homepage | `src/content/home.json` |
| Instellingen (formulieren, agenda, e-mail, KVK, voorbeeldbalk) | `src/content/instellingen.json` |
| Privacyverklaring | `src/content/privacy.md` |
| Opmaak | `src/styles/site.css` |
| Beweging en formulieren | `src/scripts/site.js` |
| Aanmelden voor de maandradar (via Laposta) | `functions/api/maandradar.js` |
| Wat je in Pages CMS kunt aanpassen | `.pages.yml` |

Teksten pas je aan via [Pages CMS](https://app.pagescms.org). Elke opslag wordt een wijziging in GitHub, waarna Cloudflare de site vanzelf opnieuw bouwt.

## Instellingen in Cloudflare

| Instelling | Waarde |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Variabele `LAPOSTA_API_KEY` | je API-sleutel uit Laposta, als geheim |
| Variabele `LAPOSTA_LIST_ID` | de ID van de lijst Maandradar |

## Zelf draaien op je computer (hoeft niet)

```
npm install
npm run dev
```
