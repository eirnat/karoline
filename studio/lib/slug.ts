// Lager pene norske adresser: «Lyra & Stian», «Solstua», «Oslo» → lyra-og-stian-solstua-oslo
export function norskSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, ' og ')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}
