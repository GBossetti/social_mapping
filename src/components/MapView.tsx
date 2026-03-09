import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapMarker, MarkerType } from '../types'

// Fix Leaflet default icon issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const COLORS: Record<MarkerType, string> = {
  resource: '#7a9e87',
  institution: '#8ba4c0',
  situation: '#c49a8a',
}

function createCircleIcon(type: MarkerType) {
  const color = COLORS[type]
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 14px;
        height: 14px;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.9);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

interface MapViewProps {
  markers: MapMarker[]
}

const TYPE_LABELS: Record<MarkerType, string> = {
  resource: 'Recurso',
  institution: 'Institución',
  situation: 'Situación de riesgo',
}

export default function MapView({ markers }: MapViewProps) {
  return (
    <MapContainer
      center={[-34.6118, -58.4173]}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={createCircleIcon(m.type)}>
          <Popup>
            <div style={{ fontFamily: "'Outfit', sans-serif", minWidth: 170, maxWidth: 230 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: COLORS[m.type],
                  marginBottom: 5,
                }}
              >
                {TYPE_LABELS[m.type]}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2a26', marginBottom: 5, lineHeight: 1.3 }}>
                {m.name}
              </div>
              <div style={{ fontSize: 11, fontWeight: 300, color: '#a09990', lineHeight: 1.6 }}>
                {m.description}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
