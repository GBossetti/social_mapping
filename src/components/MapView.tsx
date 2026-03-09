import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet'
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

function createCircleIcon(type: MarkerType, colors: Record<MarkerType, string>) {
  const color = colors[type]
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid rgba(255,255,255,0.9);border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.15);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

const userLocationIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#2a6fd4;border:3px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(42,111,212,0.45);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})


interface MapViewProps {
  markers: MapMarker[]
  colors: Record<MarkerType, string>
  onMapClick: (lat: number, lng: number) => void
}

/** Guards against firing onMapClick right after a popup closes */
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  const recentlyClosedPopup = useRef(false)

  useMapEvents({
    popupclose() {
      recentlyClosedPopup.current = true
      setTimeout(() => { recentlyClosedPopup.current = false }, 120)
    },
    click(e) {
      if (!recentlyClosedPopup.current) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

/** Flies the map to a location when it changes */
function FlyToHandler({ location }: { location: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (location) map.flyTo([location.lat, location.lng], 16, { duration: 1.2 })
  }, [location, map])
  return null
}

export default function MapView({ markers, colors, onMapClick }: MapViewProps) {
  const { t } = useTranslation()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [])

  function handleLocate() {
    if (!navigator.geolocation) {
      setLocateError(t('map.geolocationUnavailable'))
      return
    }
    // Clear any existing watch
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)

    setLocating(true)
    setLocateError(null)

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setLocating(false)
      },
      () => {
        setLocateError(t('map.locationError'))
        setLocating(false)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={[41.3851, 2.1734]}
        zoom={12}
        style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={onMapClick} />
        <FlyToHandler location={userLocation} />

        {/* User location marker + accuracy circle */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy}
              pathOptions={{ color: '#2a6fd4', fillColor: '#2a6fd4', fillOpacity: 0.08, weight: 1 }}
            />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
              <Popup>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#2d2a26', lineHeight: 1.5 }}>
                  <div>{t('map.yourLocation')}</div>
                  <div style={{ fontSize: 11, color: '#a09990', marginTop: 3 }}>
                    ±{Math.round(userLocation.accuracy)} m
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Data markers */}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={createCircleIcon(m.type, colors)}>
            <Popup>
              <div style={{ fontFamily: "'Outfit', sans-serif", minWidth: 170, maxWidth: 230 }}>
                <div style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors[m.type], marginBottom: 5 }}>
                  {t(`subtype.${m.subtype}`, t(`markerType.${m.type}`))}
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

      {/* Geolocate button */}
      <button
        onClick={handleLocate}
        disabled={locating}
        title={t('map.myLocation')}
        style={{
          position: 'absolute',
          bottom: 28,
          right: 20,
          zIndex: 1000,
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: '#f8f6f2',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          cursor: locating ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s',
        }}
      >
        {/* Target/locate icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={locating ? '#a09990' : '#2a6fd4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <circle cx="12" cy="12" r="7" />
        </svg>
      </button>

      {/* Hint: click to add */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(45,42,38,0.75)',
          color: '#f8f6f2',
          fontSize: 11,
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 300,
          padding: '5px 14px',
          borderRadius: 20,
          pointerEvents: 'none',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        {t('map.clickToAdd')}
      </div>

      {/* Locate error */}
      {locateError && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: '#d44c30',
            color: '#fff',
            fontSize: 12,
            fontFamily: "'Outfit', sans-serif",
            padding: '6px 14px',
            borderRadius: 20,
          }}
        >
          {locateError}
        </div>
      )}
    </div>
  )
}
