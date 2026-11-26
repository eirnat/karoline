import {useCallback, useEffect, useMemo, useState} from 'react'
import {set, unset, useDataset, useProjectId, type ArrayOfObjectsInputProps} from 'sanity'
import {Badge, Box, Button, Card, Checkbox, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {StarFilledIcon} from '@sanity/icons/StarFilled'
import {StarIcon} from '@sanity/icons/Star'
import {ThLargeIcon} from '@sanity/icons/ThLarge'
import {ThListIcon} from '@sanity/icons/ThList'
import {CropIcon} from '@sanity/icons/Crop'

// Hurtigredigering av bildetekster: bytt mellom Sanitys vanlige rutenett og en liste
// der beskrivelse, bildetekst og favoritt kan skrives på rad uten å åpne hvert bilde.

type Bilde = {
  _key: string
  _type: 'bilde'
  asset?: {_ref: string}
  alt?: string
  bildetekst?: string
  favoritt?: boolean
}

const MODUS_NOKKEL = 'karoline-bilder-modus'
const GULL = '#B7791F'

function lesModus(): 'rutenett' | 'liste' {
  try {
    return window.localStorage.getItem(MODUS_NOKKEL) === 'liste' ? 'liste' : 'rutenett'
  } catch {
    return 'rutenett'
  }
}

function miniatyrUrl(ref: string | undefined, projectId: string, dataset: string) {
  // image-<id>-<bredde>x<høyde>-<format>  →  cdn-adresse med beskjæring
  if (!ref) return null
  const [, id, dim, format] = ref.split('-')
  if (!id || !dim || !format) return null
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dim}.${format}?w=160&h=120&fit=crop&auto=format`
}

export function BilderInput(props: ArrayOfObjectsInputProps) {
  const {value, onChange, onItemOpen, path, renderDefault, readOnly} = props
  const bilder = (value || []) as Bilde[]
  const projectId = useProjectId()
  const dataset = useDataset()

  const [modus, setModus] = useState<'rutenett' | 'liste'>('rutenett')
  const [bareMangler, setBareMangler] = useState(false)
  useEffect(() => setModus(lesModus()), [])

  const velgModus = useCallback((m: 'rutenett' | 'liste') => {
    setModus(m)
    try {
      window.localStorage.setItem(MODUS_NOKKEL, m)
    } catch {
      // nettleseren tillater ikke lagring – valget gjelder bare denne gangen
    }
  }, [])

  const antallFavoritter = bilder.filter((b) => b.favoritt).length
  const antallMangler = bilder.filter((b) => b.asset && !b.alt?.trim()).length

  const skrivFelt = useCallback(
    (key: string, felt: 'alt' | 'bildetekst', tekst: string) => {
      const ren = tekst.trim()
      onChange(ren ? set(ren, [{_key: key}, felt]) : unset([{_key: key}, felt]))
    },
    [onChange],
  )

  const byttFavoritt = useCallback(
    (key: string, naa: boolean | undefined) => onChange(set(!naa, [{_key: key}, 'favoritt'])),
    [onChange],
  )

  const synlige = useMemo(
    () =>
      bilder
        .map((b, i) => ({b, nr: i + 1}))
        .filter(({b}) => !bareMangler || (b.asset && !b.alt?.trim())),
    [bilder, bareMangler],
  )

  return (
    <Stack gap={3}>
      <Flex align="center" justify="space-between" gap={3} wrap="wrap">
        <Flex align="center" gap={2} wrap="wrap">
          <Text size={1} muted>
            {bilder.length} bilder
          </Text>
          <Badge tone="caution" padding={2} style={{background: '#F4ECDD', color: '#6B4A10'}}>
            ★ {antallFavoritter} {antallFavoritter === 1 ? 'favoritt' : 'favoritter'} – vises i galleriet
          </Badge>
          {antallMangler > 0 ? (
            <Badge tone="caution" padding={2}>
              {antallMangler} mangler bildebeskrivelse
            </Badge>
          ) : bilder.length > 0 ? (
            <Badge tone="positive" padding={2}>
              Alle bildene har beskrivelse
            </Badge>
          ) : null}
        </Flex>
        <Flex gap={1}>
          <Button
            icon={ThLargeIcon}
            text="Rutenett"
            mode={modus === 'rutenett' ? 'default' : 'ghost'}
            tone={modus === 'rutenett' ? 'primary' : 'default'}
            onClick={() => velgModus('rutenett')}
            aria-pressed={modus === 'rutenett'}
            fontSize={1}
            padding={2}
          />
          <Button
            icon={ThListIcon}
            text="Liste"
            mode={modus === 'liste' ? 'default' : 'ghost'}
            tone={modus === 'liste' ? 'primary' : 'default'}
            onClick={() => velgModus('liste')}
            aria-pressed={modus === 'liste'}
            fontSize={1}
            padding={2}
          />
        </Flex>
      </Flex>

      {modus === 'rutenett' ? (
        renderDefault(props)
      ) : (
        <Stack gap={2}>
          <Flex align="center" gap={2} as="label" style={{cursor: 'pointer'}}>
            <Checkbox checked={bareMangler} onChange={() => setBareMangler((v) => !v)} />
            <Text size={1}>Vis bare de som mangler beskrivelse</Text>
          </Flex>

          <Card border radius={2} overflow="hidden">
            {synlige.length === 0 ? (
              <Box padding={4}>
                <Text size={1} align="center" muted>
                  {bilder.length === 0
                    ? 'Ingen bilder ennå. Bytt til Rutenett for å dra inn bilder.'
                    : 'Ingen bilder mangler beskrivelse. Bra jobbet!'}
                </Text>
              </Box>
            ) : (
              synlige.map(({b, nr}) => (
                <BildeRad
                  key={b._key}
                  bilde={b}
                  nr={nr}
                  miniatyr={miniatyrUrl(b.asset?._ref, projectId, dataset)}
                  readOnly={Boolean(readOnly)}
                  onSkriv={skrivFelt}
                  onFavoritt={byttFavoritt}
                  onFokus={() => onItemOpen([...path, {_key: b._key}])}
                />
              ))
            )}
          </Card>
          <Text size={1} muted>
            Skriv rett i feltene – Tab hopper til neste. Teksten lagres når du går ut av feltet. Bytt til
            Rutenett for å laste opp flere bilder eller endre rekkefølgen.
          </Text>
        </Stack>
      )}
    </Stack>
  )
}

type RadProps = {
  bilde: Bilde
  nr: number
  miniatyr: string | null
  readOnly: boolean
  onSkriv: (key: string, felt: 'alt' | 'bildetekst', tekst: string) => void
  onFavoritt: (key: string, naa: boolean | undefined) => void
  onFokus: () => void
}

function BildeRad({bilde, nr, miniatyr, readOnly, onSkriv, onFavoritt, onFokus}: RadProps) {
  const [alt, setAlt] = useState(bilde.alt || '')
  const [tekst, setTekst] = useState(bilde.bildetekst || '')

  // Hold feltene i takt hvis noen andre endrer bildet samtidig
  useEffect(() => setAlt(bilde.alt || ''), [bilde.alt])
  useEffect(() => setTekst(bilde.bildetekst || ''), [bilde.bildetekst])

  const mangler = Boolean(bilde.asset) && !alt.trim()

  return (
    <Card
      padding={2}
      borderBottom
      tone={mangler ? 'caution' : 'default'}
      style={{display: 'grid', gridTemplateColumns: '72px 28px minmax(0, 1.4fr) minmax(0, 1fr) 44px auto', gap: 12, alignItems: 'center'}}
    >
      <Box
        style={{
          width: 72,
          height: 54,
          borderRadius: 4,
          background: '#ddd',
          overflow: 'hidden',
          outline: bilde.favoritt ? `3px solid ${GULL}` : undefined,
          outlineOffset: -3,
        }}
      >
        {miniatyr ? (
          <img src={miniatyr} alt="" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
        ) : null}
      </Box>
      <Text size={1} muted>
        {nr}
      </Text>
      <Stack gap={1}>
        <TextInput
          value={alt}
          placeholder="Hva viser bildet? Én setning."
          aria-label={`Bildebeskrivelse for bilde ${nr}`}
          readOnly={readOnly}
          onChange={(e) => setAlt(e.currentTarget.value)}
          onBlur={() => alt !== (bilde.alt || '') && onSkriv(bilde._key, 'alt', alt)}
          onKeyDown={(e) => e.key === 'Enter' && onSkriv(bilde._key, 'alt', alt)}
          fontSize={1}
        />
        {mangler ? (
          <Text size={0} style={{color: '#7A4300'}}>
            Mangler beskrivelse
          </Text>
        ) : null}
      </Stack>
      <TextInput
        value={tekst}
        placeholder="Bildetekst (valgfritt)"
        aria-label={`Bildetekst for bilde ${nr}`}
        readOnly={readOnly}
        onChange={(e) => setTekst(e.currentTarget.value)}
        onBlur={() => tekst !== (bilde.bildetekst || '') && onSkriv(bilde._key, 'bildetekst', tekst)}
        onKeyDown={(e) => e.key === 'Enter' && onSkriv(bilde._key, 'bildetekst', tekst)}
        fontSize={1}
      />
      <Button
        mode="bleed"
        padding={3}
        disabled={readOnly}
        icon={bilde.favoritt ? <StarFilledIcon style={{color: GULL}} /> : <StarIcon />}
        aria-pressed={Boolean(bilde.favoritt)}
        aria-label={bilde.favoritt ? `Fjern favoritt: bilde ${nr}` : `Marker som favoritt: bilde ${nr}`}
        onClick={() => onFavoritt(bilde._key, bilde.favoritt)}
      />
      <Button mode="bleed" icon={CropIcon} text="Fokuspunkt" fontSize={1} padding={2} onClick={onFokus} />
    </Card>
  )
}
