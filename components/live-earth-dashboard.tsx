'use client'

import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { Activity, ArrowDown, ArrowUpRight, Clock3, Crosshair, Layers3, Radio, RefreshCw, Satellite, Waves } from 'lucide-react'

export type LiveEvent = { id: string; magnitude: number; place: string; time: number; longitude: number; latitude: number; depthKm: number; url: string }
type Feed = { data: LiveEvent[]; source: 'live' | 'cached' | 'simulated'; fetchedAt: string; error?: string }

const LiveMap = dynamic(() => import('./live-map'), { ssr: false, loading: () => <div className="map-loading"><span className="map-loader" /><span>Loading live map tiles…</span></div> })
const fetcher = async (url: string): Promise<Feed> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Data service returned ${response.status}`)
  return response.json()
}

function formatAge(timestamp: number) {
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  return `${Math.floor(hours / 24)} days ago`
}

function localTime(timestamp: number) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' }).format(timestamp)
}

export default function LiveEarthDashboard({ light }: { light: boolean }) {
  const { data: feed, error, isLoading, mutate, isValidating } = useSWR<Feed>('/api/earthquakes', fetcher, { refreshInterval: 600_000, revalidateOnFocus: true, dedupingInterval: 60_000 })
  const events = feed?.data ?? []
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [satellite, setSatellite] = useState(false)
  const selected = events.find((event) => event.id === selectedId) ?? [...events].sort((a, b) => b.magnitude - a.magnitude)[0] ?? null
  const sortedEvents = useMemo(() => [...events].sort((a, b) => b.magnitude - a.magnitude), [events])
  const countMajor = events.filter((event) => event.magnitude >= 4).length
  const maxMagnitude = sortedEvents[0]?.magnitude ?? 0
  const histogram = [0, 0, 0, 0, 0, 0]
  events.forEach((event) => histogram[Math.min(histogram.length - 1, Math.max(0, Math.floor(event.magnitude))) ] += 1)
  const topRegions = useMemo(() => {
    const groups = new Map<string, number>()
    events.forEach((event) => {
      const region = event.place.split(',').at(-1)?.trim() || 'Other regions'
      groups.set(region, (groups.get(region) ?? 0) + 1)
    })
    return [...groups.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [events])
  const source = feed?.source ?? (error ? 'cached' : 'live')
  const statusLabel = source === 'live' ? 'LIVE' : source === 'cached' ? 'CACHED' : 'SIMULATED'
  const updated = feed?.fetchedAt ? new Date(feed.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : 'Connecting…'

  return (
    <section className="live-earth section-pad" id="live-data" aria-labelledby="live-title">
      <div className="live-heading">
        <div><div className="section-kicker"><span>00</span><span className="kicker-rule" /><span>EARTH · RIGHT NOW</span></div><h2 id="live-title">A world in <em>motion.</em></h2><p>Recent global earthquake activity, mapped and analyzed from the live USGS feed.</p></div>
        <div className="live-heading-actions"><span className={`feed-status ${source}`}><i />{statusLabel} FEED</span><button className="refresh-button" onClick={() => void mutate()} disabled={isValidating} aria-label="Refresh live earthquake data"><RefreshCw size={14} className={isValidating ? 'refresh-spinning' : ''} /><span>{isValidating ? 'Updating' : 'Refresh'}</span></button></div>
      </div>
      {feed?.error && <p className="feed-warning" role="status">Live source unavailable: {feed.error} Showing the most recent available fallback data.</p>}
      <div className="earth-dashboard">
        <div className="map-shell">
          <div className="map-toolbar"><div className="map-title"><span className="map-target"><Crosshair size={15} /></span><div><strong>GLOBAL SEISMIC ACTIVITY</strong><small>Magnitude · Depth · Location</small></div></div><div className="map-toolbar-actions"><span className={`map-source-status ${source}`}><i /> {statusLabel}</span><button onClick={() => setSatellite(!satellite)} className={satellite ? 'map-layer-button selected' : 'map-layer-button'} aria-pressed={satellite}><Layers3 size={14} /><span>{satellite ? 'NASA imagery' : 'Map layers'}</span></button></div></div>
          {isLoading && !feed ? <div className="map-loading"><span className="map-loader" /><span>Connecting to live USGS feed…</span></div> : <LiveMap events={events} selectedId={selectedId} onSelect={(event) => setSelectedId(event.id)} satellite={satellite} light={light} />}
          <div className="map-status-bar"><span><span className="map-pulse" /> {events.length.toLocaleString()} events · past 7 days</span><span>Source: U.S. Geological Survey</span></div>
        </div>
        <aside className="analysis-panel" aria-label="Live data analysis">
          <div className="analysis-header"><div><span className="panel-label">GLOBAL SNAPSHOT</span><h3>Data analysis</h3></div><span className="panel-time"><Clock3 size={12} /> {updated}</span></div>
          <div className="metric-grid"><div className="metric-card"><span>EVENTS · 7 DAYS</span><strong>{events.length.toLocaleString()}</strong><small>All reported magnitudes</small></div><div className="metric-card"><span>MAGNITUDE 4+</span><strong>{countMajor.toLocaleString()}</strong><small>Globally significant events</small></div></div>
          <div className="analysis-block"><div className="block-heading"><span><Activity size={13} /> MAGNITUDE DISTRIBUTION</span><span>COUNT</span></div><div className="magnitude-chart" role="img" aria-label="Earthquake count by magnitude band"><div className="magnitude-guides"><i /><i /><i /></div>{histogram.map((count, index) => <div className="magnitude-bar-wrap" key={index}><div className="magnitude-bar" style={{ height: `${Math.max(5, (count / Math.max(...histogram, 1)) * 100)}%` }} title={`${count} events from magnitude ${index} to ${index + 1}`} /><small>{index}{index === 5 ? '+' : ''}</small></div>)}</div><div className="chart-axis"><span>MAGNITUDE</span><span>USGS · LAST 7 DAYS</span></div></div>
          <div className="analysis-block regions-block"><div className="block-heading"><span><GlobeIcon /> MOST ACTIVE AREAS</span><span>EVENTS</span></div>{topRegions.map(([region, count], index) => <div className="region-row" key={region}><span className="region-rank">0{index + 1}</span><span className="region-name">{region}</span><span className="region-bar"><i style={{ width: `${Math.max(12, (count / (topRegions[0]?.[1] || 1)) * 100)}%` }} /></span><b>{count}</b></div>)}</div>
          {selected && <div className="selected-event"><div className="selected-top"><span><Radio size={13} /> SELECTED OBSERVATION</span><b className={selected.magnitude >= 5 ? 'magnitude-hot' : ''}>M {selected.magnitude.toFixed(1)}</b></div><h4>{selected.place}</h4><p>{localTime(selected.time)} <span>·</span> {selected.depthKm.toFixed(1)} km depth</p><button onClick={() => window.open(selected.url, '_blank', 'noopener,noreferrer')}>View official USGS report <ArrowUpRight size={13} /></button></div>}
          {!selected && !isLoading && <div className="empty-analysis"><Waves size={18} /><span>No events returned from the selected feed.</span></div>}
          <div className="source-footnote"><Satellite size={13} /><p><strong>Data condition:</strong> {source === 'live' ? `Live USGS GeoJSON · updated ${formatAge(new Date(feed?.fetchedAt ?? Date.now()).getTime())}.` : source === 'cached' ? 'Showing the last successful USGS response.' : 'USGS unavailable; sample observations are simulated, not current seismic events.'} NASA MODIS imagery is optional and clearly identified when enabled.</p></div>
        </aside>
      </div>
      <div className="recent-events"><div className="recent-heading"><div><span className="panel-label">LATEST OBSERVATIONS</span><h3>Strongest events this week</h3></div><a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" target="_blank" rel="noreferrer">Raw GeoJSON <ArrowUpRight size={13} /></a></div><div className="event-list">{sortedEvents.slice(0, 5).map((event) => <button className={event.id === selected?.id ? 'event-row active' : 'event-row'} key={event.id} onClick={() => setSelectedId(event.id)}><span className="event-mag">{event.magnitude.toFixed(1)}</span><span className="event-description"><strong>{event.place}</strong><small>{localTime(event.time)} · {event.depthKm.toFixed(1)} km depth</small></span><span className="event-age">{formatAge(event.time)}</span><ArrowDown size={13} className="event-chevron" /></button>)}</div></div>
      <div className="live-disclaimer"><span><i /> DATA PROVENANCE</span><p>Seismic observations are live USGS data, not NISAR radar measurements. NASA MODIS tiles are an optional daily satellite context layer. Map basemap © OpenStreetMap contributors.</p></div>
    </section>
  )
}

function GlobeIcon() {
  return <span aria-hidden="true" className="globe-glyph">◎</span>
}
