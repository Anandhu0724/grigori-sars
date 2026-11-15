import { NextResponse } from 'next/server'

type Event = {
  id: string
  magnitude: number
  place: string
  time: number
  longitude: number
  latitude: number
  depthKm: number
  url: string
}

type Payload = { data: Event[]; source: 'live' | 'cached' | 'simulated'; fetchedAt: string; error?: string }

let lastGood: Payload | null = null

const sampleEvents: Event[] = [
  { id: 'sample-alaska', magnitude: 5.1, place: 'South of the Aleutian Islands', time: Date.now() - 2_400_000, longitude: -167.2, latitude: 52.1, depthKm: 31, url: 'https://earthquake.usgs.gov/earthquakes/search/' },
  { id: 'sample-japan', magnitude: 4.7, place: 'Near the east coast of Honshu, Japan', time: Date.now() - 8_100_000, longitude: 142.4, latitude: 38.3, depthKm: 42, url: 'https://earthquake.usgs.gov/earthquakes/search/' },
  { id: 'sample-chile', magnitude: 4.2, place: 'Off the coast of northern Chile', time: Date.now() - 15_900_000, longitude: -72.8, latitude: -23.1, depthKm: 54, url: 'https://earthquake.usgs.gov/earthquakes/search/' },
  { id: 'sample-indonesia', magnitude: 3.8, place: 'Banda Sea, Indonesia', time: Date.now() - 25_500_000, longitude: 129.8, latitude: -6.2, depthKm: 18, url: 'https://earthquake.usgs.gov/earthquakes/search/' },
  { id: 'sample-turkey', magnitude: 3.4, place: 'Eastern Turkey', time: Date.now() - 39_200_000, longitude: 40.1, latitude: 38.2, depthKm: 12, url: 'https://earthquake.usgs.gov/earthquakes/search/' },
]

function toEvents(collection: { features?: Array<{ id?: string; properties?: { mag?: number; place?: string; time?: number; url?: string }; geometry?: { coordinates?: number[] } }> }): Event[] {
  return (collection.features ?? []).flatMap((feature) => {
    const [longitude, latitude, depthKm] = feature.geometry?.coordinates ?? []
    const { mag, place, time, url } = feature.properties ?? {}
    if (typeof mag !== 'number' || typeof longitude !== 'number' || typeof latitude !== 'number') return []
    return [{ id: feature.id ?? `${longitude}-${latitude}-${time}`, magnitude: mag, place: place ?? 'Location not reported', time: time ?? Date.now(), longitude, latitude, depthKm: depthKm ?? 0, url: url ?? 'https://earthquake.usgs.gov/earthquakes/search/' }]
  })
}

export async function GET() {
  let lastError = 'The USGS feed is temporarily unavailable.'
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (attempt) await new Promise((resolve) => setTimeout(resolve, 350))
      const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', {
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 600 },
        headers: { Accept: 'application/geo+json, application/json' },
      })
      if (!response.ok) throw new Error(`USGS returned ${response.status}`)
      const feed = await response.json()
      const data = toEvents(feed)
      if (!data.length) throw new Error('The USGS feed returned no usable event data.')
      const payload: Payload = { data, source: 'live', fetchedAt: new Date().toISOString() }
      lastGood = payload
      return NextResponse.json(payload, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' } })
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError
    }
  }
  if (lastGood) return NextResponse.json({ ...lastGood, source: 'cached', error: lastError }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } })
  return NextResponse.json({ data: sampleEvents, source: 'simulated', fetchedAt: new Date().toISOString(), error: lastError } satisfies Payload, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } })
}
