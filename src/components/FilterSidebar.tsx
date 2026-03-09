import { useState, useRef, useEffect } from 'react'
import type { FilterState, MarkerSubtype } from '../types'

interface FilterSidebarProps {
  filters: FilterState
  onChange: (subtype: MarkerSubtype, value: boolean) => void
}

interface Category {
  label: string
  items: { subtype: MarkerSubtype; label: string }[]
}

const CATEGORIES: Category[] = [
  {
    label: 'Recursos',
    items: [
      { subtype: 'water', label: 'Agua' },
      { subtype: 'food', label: 'Alimentos' },
      { subtype: 'clothes', label: 'Ropa' },
      { subtype: 'medicine', label: 'Medicamentos' },
      { subtype: 'battery', label: 'Energía / Carga' },
    ],
  },
  {
    label: 'Instituciones',
    items: [
      { subtype: 'school', label: 'Escuelas' },
      { subtype: 'hospital', label: 'Hospitales' },
      { subtype: 'shelter', label: 'Refugios' },
    ],
  },
  {
    label: 'Situaciones de Riesgo',
    items: [
      { subtype: 'flood', label: 'Inundación' },
      { subtype: 'fire', label: 'Incendio' },
      { subtype: 'structural', label: 'Daño Estructural' },
    ],
  },
]

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
      }}
    >
      <path d="M2 4l4 4 4-4" stroke="#a09990" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CategorySection({
  category,
  filters,
  onChange,
}: {
  category: Category
  filters: FilterState
  onChange: (subtype: MarkerSubtype, value: boolean) => void
}) {
  const [open, setOpen] = useState(true)
  const checkboxRef = useRef<HTMLInputElement>(null)

  const allChecked = category.items.every((i) => filters[i.subtype])
  const someChecked = category.items.some((i) => filters[i.subtype])

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someChecked && !allChecked
    }
  }, [someChecked, allChecked])

  function toggleAll() {
    const next = !allChecked
    category.items.forEach((i) => onChange(i.subtype, next))
  }

  return (
    <div style={{ marginBottom: 0 }}>
      {/* Row: checkbox checks all, clicking the label/chevron area expands/collapses */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '10px 16px',
          gap: 10,
          boxSizing: 'border-box',
          userSelect: 'none',
        }}
      >
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          style={{ width: 12, height: 12, flexShrink: 0, cursor: 'pointer', accentColor: 'white' }}
        />
        <span
          onClick={() => setOpen((o) => !o)}
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#2d2a26',
            paddingLeft: 4,
            cursor: 'pointer',
          }}
        >
          {category.label}
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronIcon open={open} />
        </button>
      </div>

      <div
        style={{
          maxHeight: open ? 300 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.25s ease',
        }}
      >
        {category.items.map((item) => (
          <SubItem
            key={item.subtype}
            label={item.label}
            checked={filters[item.subtype]}
            onChange={(v) => onChange(item.subtype, v)}
          />
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '4px 16px' }} />
    </div>
  )
}

function SubItem({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '5px 16px 5px 36px',
        cursor: 'pointer',
        background: hovered ? 'rgba(0,0,0,0.025)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 12, height: 12, flexShrink: 0, accentColor: 'white' }}
      />
      <span style={{ fontSize: 12, fontWeight: 300, color: '#6b6560', letterSpacing: '0.01em' }}>{label}</span>
    </label>
  )
}

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const [listOpen, setListOpen] = useState(true)

  return (
    <div
      style={{
        width: 220,
        height: '100%',
        background: '#efece6',
        borderRight: '1px solid rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        flexShrink: 0,
      }}
    >
      {/* Header — click "Filtros" to toggle list */}
      <div
        style={{
          padding: '22px 16px 16px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={() => setListOpen((o) => !o)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#a09990',
              flex: 1,
              textAlign: 'left',
            }}
          >
            Filtros
          </p>
          <ChevronIcon open={listOpen} />
        </button>
      </div>

      {/* Category filters */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 20,
          maxHeight: listOpen ? '100%' : 0,
          transition: 'max-height 0.25s ease',
          overflow: 'hidden',
        }}
      >
        <div style={{ paddingTop: 10 }}>
          {CATEGORIES.map((cat) => (
            <CategorySection
              key={cat.label}
              category={cat}
              filters={filters}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
