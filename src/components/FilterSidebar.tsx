import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { FilterState, MapMarker, MarkerSubtype, MarkerType } from '../types'

interface FilterSidebarProps {
  filters: FilterState
  onChange: (subtype: MarkerSubtype, value: boolean) => void
  colors: Record<MarkerType, string>
  onColorChange: (type: MarkerType, color: string) => void
  markers: MapMarker[]
  onMarkerFocus: (marker: MapMarker) => void
}

interface Category {
  type: MarkerType
  items: MarkerSubtype[]
  expandable?: boolean
}

const CATEGORIES: Category[] = [
  { type: 'resource', items: ['water', 'food', 'clothes', 'medicine', 'battery'] },
  { type: 'institution', items: ['school', 'hospital', 'shelter'], expandable: true },
  { type: 'situation', items: ['adults', 'children'], expandable: true },
]

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'ca', label: 'CA' },
]

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
  const checkboxRef = useRef<HTMLInputElement>(null)

  const allChecked = category.items.every((s) => filters[s])
  const someChecked = category.items.some((s) => filters[s])

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someChecked && !allChecked
    }
  }, [someChecked, allChecked])

  function toggleAll() {
    const next = !allChecked
    category.items.forEach((s) => onChange(s, next))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px 16px', gap: 10, boxSizing: 'border-box', userSelect: 'none' }}>
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          style={{ width: 12, height: 12, flexShrink: 0, cursor: 'pointer', accentColor: 'white' }}
        />
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
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
          style={{ width: 12, height: 12, flexShrink: 0, accentColor: 'white', cursor: 'pointer' }} />
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

export default function FilterSidebar({ filters, onChange, colors, onColorChange, markers, onMarkerFocus }: FilterSidebarProps) {
  const { t, i18n } = useTranslation()
  const [listOpen, setListOpen] = useState(true)

  function switchLang(lang: string) {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  return (
    <div style={{ width: 220, height: '100%', background: '#efece6', borderRight: '1px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000, flexShrink: 0 }}>

      {/* Header */}
      <div style={{ padding: '22px 16px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => setListOpen((o) => !o)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}
        >
          <p style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a09990', flex: 1, textAlign: 'left' }}>
            {t('sidebar.filters')}
          </p>
          <ChevronIcon open={listOpen} />
        </button>
      </div>

      {/* Category filters */}
      <div style={{ flex: 1, maxHeight: listOpen ? '100%' : 0, transition: 'max-height 0.25s ease', overflow: 'hidden' }}>
        <div style={{ paddingTop: 10, paddingBottom: 20 }}>
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

      {/* Language switcher */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 10, justifyContent: 'center' }}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLang(lang.code)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 10,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: i18n.language === lang.code ? 600 : 400,
              color: i18n.language === lang.code ? '#2d2a26' : '#a09990',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '2px 4px',
              transition: 'color 0.15s',
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>

    </div>
  )
}
