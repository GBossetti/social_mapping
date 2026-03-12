import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FilterState, MapMarker, MarkerSubtype, MarkerType } from '../types'

interface FilterSidebarProps {
  filters: FilterState
  onChange: (subtype: MarkerSubtype, value: boolean) => void
  colors: Record<MarkerType, string>
  onColorChange: (type: MarkerType, color: string) => void
  markers: MapMarker[]
  onMarkerFocus: (marker: MapMarker) => void
  isOpen: boolean
  onClose: () => void
}

interface Category {
  type: MarkerType
  items: MarkerSubtype[]
  expandable?: boolean
}

const CATEGORIES: Category[] = [
  { type: 'resource', items: ['water', 'food', 'clothes', 'medicine', 'battery'] },
  { type: 'institution', items: ['school', 'hospital', 'pharmacy', 'shelter', 'fire_station', 'police', 'community_center'], expandable: true },
  { type: 'situation', items: ['adults', 'children'], expandable: true },
]

function Checkbox({ checked, indeterminate, onChange }: { checked: boolean; indeterminate?: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 12, height: 12, flexShrink: 0, cursor: 'pointer',
        background: 'white', border: '1px solid rgba(0,0,0,0.25)', borderRadius: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {indeterminate ? (
        <svg width="8" height="8" viewBox="0 0 8 8"><line x1="1" y1="4" x2="7" y2="4" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" /></svg>
      ) : checked ? (
        <svg width="8" height="8" viewBox="0 0 8 8"><polyline points="1,4 3,6 7,2" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
      ) : null}
    </div>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
    >
      <path d="M2 4l4 4 4-4" stroke="#a09990" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CategorySection({
  category, filters, onChange, color, onColorChange, markers, onMarkerClick,
}: {
  category: Category
  filters: FilterState
  onChange: (subtype: MarkerSubtype, value: boolean) => void
  color: string
  onColorChange: (type: MarkerType, color: string) => void
  markers: MapMarker[]
  onMarkerClick: (marker: MapMarker) => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)

  const allChecked = category.items.every((s) => filters[s])
  const someChecked = category.items.some((s) => filters[s])

  function toggleAll() {
    const next = !allChecked
    category.items.forEach((s) => onChange(s, next))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px 16px', gap: 10, boxSizing: 'border-box', userSelect: 'none' }}>
        <Checkbox checked={allChecked} indeterminate={someChecked && !allChecked} onChange={toggleAll} />
        <span
          onClick={() => setOpen((o) => !o)}
          style={{ flex: 1, fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2d2a26', paddingLeft: 4, cursor: 'pointer' }}
        >
          {t(`category.${category.type}`)}
        </span>
        <label title={t('sidebar.changeColor')} style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <span style={{ display: 'inline-block', width: 13, height: 13, borderRadius: '50%', background: color, border: '1.5px solid rgba(0,0,0,0.15)' }} />
          <input type="color" value={color} onChange={(e) => onColorChange(category.type, e.target.value)}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} tabIndex={-1} />
        </label>
        <button onClick={() => setOpen((o) => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}>
          <ChevronIcon open={open} />
        </button>
      </div>

      <div style={{ maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.25s ease' }}>
        {category.items.map((subtype) => (
          <SubItem
            key={subtype}
            subtype={subtype}
            checked={filters[subtype]}
            onChange={(v) => onChange(subtype, v)}
            subtypeMarkers={category.expandable ? markers.filter((m) => m.subtype === subtype) : undefined}
            onMarkerClick={onMarkerClick}
          />
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '4px 16px' }} />
    </div>
  )
}

function SubItem({ subtype, checked, onChange, subtypeMarkers, onMarkerClick }: {
  subtype: MarkerSubtype
  checked: boolean
  onChange: (v: boolean) => void
  subtypeMarkers?: MapMarker[]
  onMarkerClick: (marker: MapMarker) => void
}) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const hasMarkers = subtypeMarkers && subtypeMarkers.length > 0

  return (
    <div>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 16px 5px 36px', background: hovered ? 'rgba(0,0,0,0.025)' : 'transparent', transition: 'background 0.12s' }}
      >
        <Checkbox checked={checked} onChange={() => onChange(!checked)} />
        <span
          style={{ fontSize: 12, fontWeight: 300, color: '#6b6560', letterSpacing: '0.01em', flex: 1, cursor: hasMarkers ? 'pointer' : 'default' }}
          onClick={hasMarkers ? () => setOpen((o) => !o) : undefined}
        >
          {t(`subtype.${subtype}`)}
        </span>
        {hasMarkers && (
          <button onClick={() => setOpen((o) => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}>
            <ChevronIcon open={open} />
          </button>
        )}
      </div>
      {hasMarkers && (
        <div style={{ maxHeight: open ? 500 : 0, overflow: 'hidden', transition: 'max-height 0.25s ease' }}>
          {subtypeMarkers.map((marker) => (
            <div
              key={marker.id}
              onClick={() => onMarkerClick(marker)}
              style={{ padding: '3px 16px 3px 52px', fontSize: 11, color: '#9a9288', fontWeight: 300, lineHeight: 1.4, cursor: 'pointer', transition: 'color 0.12s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2d2a26')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9a9288')}
            >
              {marker.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FilterSidebar({ filters, onChange, colors, onColorChange, markers, onMarkerFocus, isOpen, onClose }: FilterSidebarProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* Drawer panel */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: 240,
        background: '#efece6',
        borderRight: '1px solid rgba(0,0,0,0.07)',
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* × close button */}
        <button
          onClick={onClose}
          title={t('sidebar.close')}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="#a09990" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Category filters */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 44 }}>
          <div style={{ paddingBottom: 20 }}>
            {CATEGORIES.map((cat) => (
              <CategorySection
                key={cat.type}
                category={cat}
                filters={filters}
                onChange={onChange}
                color={colors[cat.type]}
                onColorChange={onColorChange}
                markers={markers}
                onMarkerClick={onMarkerFocus}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
