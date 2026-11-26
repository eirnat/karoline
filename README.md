# Fotograf Karoline Rage – nettside

Nettsiden i stil A fra designlerretet «Karoline Rage – designforslag». Karoline redigerer i **Sanity Studio**, siden bygges med **Astro** til ferdige filer og legges ut på **Cloudflare**.

```
karoline/
├─ studio/   Sanity Studio: skjema, meny, listevisning for bildetekster
├─ web/      Astro-siden, kontaktskjema (Cloudflare Worker) og wrangler.jsonc
└─ .github/workflows/deploy.yml   bygger og publiserer ved push og ved publisering i Sanity
```

## Kom i gang på egen maskin

Krever Node 22 (`node --version`).

1. **Hvor: Terminal**, i `studio/`:

   ```bash
   npm install
   cp .env.example .env
   ```

   Prosjekt-ID-en (`ujffh8q9`) står allerede i `.env.example` og i koden.

   ```bash
   npm run dev          # Studio på http://localhost:3333
   ```

2. **Hvor: Terminal**, i `studio/`. Legg inn eksempelinnhold (kategorier, steder, innstillinger, FAQ og tre bryllup uten bilder). Hopper over dokumenter som finnes fra før:

   ```bash
   npx sanity login
   npm run seed
   ```

3. **Hvor: Terminal**, i `web/`:

   ```bash
   npm install
   cp .env.example .env
   ```

   Endrer du noe i `web/.env`: **lagre filen og start serveren på nytt**.

   ```bash
   npm run dev          # http://localhost:4321, henter fra Sanity
   npm run dev:demo     # samme side med eksempelinnholdet fra skissene, uten Sanity
   ```

## Hvor ting ligger

| Del | Fil |
| --- | --- |
| Farger, skrifter, knapper | `web/src/styles/global.css` |
| Topp og meny (PC og mobil) | `web/src/components/Header.astro` |
| Forsiden | `web/src/pages/index.astro` |
| Bryllupsside og bildemønster | `web/src/pages/[kategori]/[slug].astro` |
| Tjenestesider, Om, Kontakt | `web/src/pages/[slug].astro` |
| Galleri med filter og lysboks | `web/src/pages/galleri.astro` |
| Spørringer mot Sanity | `web/src/lib/queries.ts` |
| Strukturerte data (JSON-LD) | `web/src/lib/schema.ts` |
| Kontaktskjema på serveren | `web/worker/index.ts` |
| Skjema i Sanity | `studio/schemaTypes/` |
| Venstremenyen i Studio | `studio/structure.ts` |
| Listevisning for bildetekster | `studio/components/BilderInput.tsx` |

Adresser: tjenester ligger på `/bryllup`, `/familie`, `/tur`, `/ansattbilder`, og hvert oppdrag på `/<tjeneste>/<adresse>`, f.eks. `/bryllup/lyra-og-stian-solstua-oslo`. Sider fra Sanity (`page`) får `/<adresse>`; `/om` og `/kontakt` finnes alltid.

## Publisering

1. **Hvor: GitHub** → Settings → Secrets and variables → Actions:
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
   - Variables (valgfritt): `PUBLIC_TURNSTILE_SITE_KEY`, `SITE_URL`, og `PUBLIC_SANITY_PROJECT_ID` hvis du vil bruke et annet prosjekt

   Prosjekt-ID-en `ujffh8q9` er lagt inn i koden. Siden bygges ved hver endring, men legges ikke ut før Cloudflare-nøklene finnes.
2. **Hvor: Sanity** → API → Webhooks: URL `https://api.github.com/repos/eirnat/karoline/dispatches`, projeksjon `{"event_type": "sanity-publish"}`, header `Authorization: Bearer <GitHub-token>`.
3. **Hvor: Terminal**, i `studio/`: `npm run deploy` legger ut Studio på `karolinerage.sanity.studio`.

## Kontaktskjema

Skjemaet virker først når e-post er satt opp i Cloudflare:

1. **Hvor: Cloudflare** → Email Routing: bekreft Karolines adresse. Sjekk at eksisterende MX-poster for e-post ikke overskrives.
2. **Hvor: Cursor**, `web/wrangler.jsonc`: fyll inn `KONTAKT_FRA` og `KONTAKT_TIL`, og slå på `send_email`.
3. **Hvor: Terminal**, i `web/`: `npx wrangler secret put TURNSTILE_SECRET` (valgfritt, men anbefalt).

Repoet er offentlig. Legg aldri tokens eller `.env` i koden.
