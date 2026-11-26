// Prosjekt-ID og dataset leses fra .env (SANITY_STUDIO_PROJECT_ID og SANITY_STUDIO_DATASET).
// Prosjekt-ID-en er ikke hemmelig, men holdes i .env så samme kode kan brukes mot et testprosjekt.
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'ujffh8q9'
export const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
export const apiVersion = '2026-11-26'
