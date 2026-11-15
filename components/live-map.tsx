'use client'

import { useEffect, useMemo } from 'react'
import { Circle, MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import type { LiveEvent } from './live-earth-dashboard'

type Props = { events: LiveEvent[]; selectedId: string | null; onSelect: (event: LiveEvent) => void; satellite: boolean; light: boolean }

function FitWorld({ focus }: { focus: LiveEvent | null }) {
  const map = useMap()
  useEffect(() => {
    if (focus) map.flyTo([focus.latitude, focus.longitude] as LatLngExpression, Math.max(map.getZoom(), 5), { duration: 0.8 })
  }, [focus?.id, focus?.latitude, focus?.longitude, map])
  return null
}

export default function LiveMap({ events, selectedId, onSelect, satellite, light }: Props) {
  const center: LatLngExpression = [16, 6]
  const imageryDate = useMemo(() => new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().slice(0, 10), [])
  const active = events.find((event) => event.id === selectedId) ?? null
  const base = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  return (
    <div className="live-map-wrap" aria-label="Interactive world map showing recent earthquakes">
      <MapContainer center={center} zoom={2} minZoom={2} maxZoom={9} scrollWheelZoom zoomControl={false} preferCanvas className={light ? 'live-map light-map' : 'live-map dark-map'}>
        <ZoomControl position="bottomright" />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' url={base} className="basemap-layer" />
        {satellite && <TileLayer attribution='Imagery &copy; <a href="https://earthdata.nasa.gov/">NASA GIBS</a>' url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${imageryDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`} opacity={0.75} />}
        {events.map((event) => {
          const selected = event.id === selectedId
          const color = event.magnitude >= 5 ? '#ff6b62' : event.magnitude >= 3.5 ? '#f4ba63' : '#83e4cf'
          return <Circle key={event.id} center={[event.latitude, event.longitude]} radius={Math.pow(10, event.magnitude * 0.7) * 75} pathOptions={{ color, fillColor: color, fillOpacity: selected ? 0.48 : 0.25, weight: selected ? 2.4 : 1.1, opacity: 0.92 }} eventHandlers={{ click: () => onSelect(event) }} />
        })}
        <FitWorld focus={active} />
      </MapContainer>
      <div className="map-coordinates"><span>GLOBAL VIEW</span><span>WEB MERCATOR · EPSG:3857</span></div>
      <div className="map-key"><span><i className="key-low" /> &lt; 3.5</span><span><i className="key-mid" /> 3.5–4.9</span><span><i className="key-high" /> 5.0+</span><small>EVENT MAGNITUDE</small></div>
    </div>
  )
}
