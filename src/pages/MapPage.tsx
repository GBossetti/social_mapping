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
    <div style={{ width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <FilterSidebar
        filters={filters}
        onChange={handleChange}
        colors={markerColors}
        onColorChange={handleColorChange}
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <MapView
          markers={visibleMarkers}
          colors={markerColors}
          onMapClick={handleMapClick}
        />

        {pendingLatLng && (
          <AddMarkerModal
            colors={markerColors}
            onConfirm={handleModalConfirm}
            onCancel={() => setPendingLatLng(null)}
          />
        )}
      </div>
    </div>
  )
}
