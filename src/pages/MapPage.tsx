import { useState } from 'react'
import MapView from '../components/MapView'
import FilterSidebar from '../components/FilterSidebar'
import rawMarkers from '../data/markers.json'
import type { FilterState, MapMarker, MarkerSubtype } from '../types'

const markers = rawMarkers as MapMarker[]

const ALL_SUBTYPES: MarkerSubtype[] = [
  'water', 'food', 'clothes', 'medicine', 'battery',
  'school', 'hospital', 'shelter',
  'flood', 'fire', 'structural',
]

function defaultFilters(): FilterState {
  return Object.fromEntries(ALL_SUBTYPES.map((s) => [s, true])) as FilterState
}

export default function MapPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  function handleChange(subtype: MarkerSubtype, value: boolean) {
    setFilters((prev) => ({ ...prev, [subtype]: value }))
  }

  const visibleMarkers = markers.filter((m) => filters[m.subtype])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      {/* Sidebar on the left */}
      <FilterSidebar filters={filters} onChange={handleChange} />

      {/* Map fills remaining space */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView markers={visibleMarkers} />
      </div>
    </div>
  )
}
