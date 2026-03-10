import { useState } from 'react'
import MapView from '../components/MapView'
import FilterSidebar from '../components/FilterSidebar'
import AddMarkerModal from '../components/AddMarkerModal'
import rawMarkers from '../data/markers.json'
import type { FilterState, MapMarker, MarkerSubtype, MarkerType } from '../types'

const staticMarkers = rawMarkers as MapMarker[]

const ALL_SUBTYPES: MarkerSubtype[] = [
  'water', 'food', 'clothes', 'medicine', 'battery',
  'school', 'hospital', 'shelter',
  'adults', 'children',
]

function defaultFilters(): FilterState {
  return Object.fromEntries(ALL_SUBTYPES.map((s) => [s, true])) as FilterState
}

const DEFAULT_COLORS: Record<MarkerType, string> = {
  resource: '#1a9e5c',
  institution: '#2a6fd4',
  situation: '#d44c30',
}

export default function MapPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [markerColors, setMarkerColors] = useState<Record<MarkerType, string>>(DEFAULT_COLORS)
  const [userMarkers, setUserMarkers] = useState<MapMarker[]>([])
  const [pendingLatLng, setPendingLatLng] = useState<{ lat: number; lng: number } | null>(null)
  const [focusedMarker, setFocusedMarker] = useState<MapMarker | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function handleChange(subtype: MarkerSubtype, value: boolean) {
    setFilters((prev) => ({ ...prev, [subtype]: value }))
  }

  function handleColorChange(type: MarkerType, color: string) {
    setMarkerColors((prev) => ({ ...prev, [type]: color }))
  }

  function handleMapClick(lat: number, lng: number) {
    setPendingLatLng({ lat, lng })
  }

  function handleModalConfirm(data: { type: MarkerType; subtype: MarkerSubtype; name: string; description: string }) {
    if (!pendingLatLng) return
    const newMarker: MapMarker = {
      id: `user-${Date.now()}`,
      type: data.type,
      subtype: data.subtype,
      name: data.name,
      description: data.description,
      lat: pendingLatLng.lat,
      lng: pendingLatLng.lng,
    }
    setUserMarkers((prev) => [...prev, newMarker])
    setPendingLatLng(null)
  }

  const allMarkers = [...staticMarkers, ...userMarkers]
  const visibleMarkers = allMarkers.filter((m) => filters[m.subtype])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <MapView
        markers={visibleMarkers}
        colors={markerColors}
        onMapClick={handleMapClick}
        focusedMarker={focusedMarker}
      />

      <FilterSidebar
        filters={filters}
        onChange={handleChange}
        colors={markerColors}
        onColorChange={handleColorChange}
        markers={allMarkers}
        onMarkerFocus={(m) => setFocusedMarker(m)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* FAB toggle button — only visible when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          title="Open filters"
          style={{
            position: 'absolute',
            top: 80,
            left: 10,
            zIndex: 1001,
            width: 36,
            height: 36,
            background: '#f8f6f2',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 3h14M1 8h9M1 13h6" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="13" cy="8" r="2" stroke="#555" strokeWidth="1.5" />
            <circle cx="9" cy="13" r="2" stroke="#555" strokeWidth="1.5" />
          </svg>
        </button>
      )}

      {pendingLatLng && (
        <AddMarkerModal
          colors={markerColors}
          onConfirm={handleModalConfirm}
          onCancel={() => setPendingLatLng(null)}
        />
      )}
    </div>
  )
}
