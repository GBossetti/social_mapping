import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MarkerType, MarkerSubtype } from '../types'

interface AddMarkerModalProps {
  colors: Record<MarkerType, string>
  onConfirm: (data: {
    type: MarkerType
    subtype: MarkerSubtype
    name: string
    description: string
    address?: string
    phone?: string
    hours?: string
    website?: string
  }) => void
  onCancel: () => void
}

const TYPE_OPTIONS: MarkerType[] = ['resource', 'institution', 'situation']

const SUBTYPES: Record<MarkerType, MarkerSubtype[]> = {
  resource: ['water', 'food', 'clothes', 'medicine', 'battery'],
  institution: ['school', 'hospital', 'pharmacy', 'shelter', 'fire_station', 'police', 'community_center'],
  situation: ['adults', 'children'],
}

function isValidPhone(v: string) {
  return /^[\d\s\-+()]{7,20}$/.test(v)
}

function isValidUrl(v: string) {
  try { new URL(v); return true } catch { return false }
}

export default function AddMarkerModal({ colors, onConfirm, onCancel }: AddMarkerModalProps) {
  const { t } = useTranslation()
  const [type, setType] = useState<MarkerType>('situation')
  const [subtype, setSubtype] = useState<MarkerSubtype>('adults')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [hours, setHours] = useState('')
  const [website, setWebsite] = useState('')
  const [phoneError, setPhoneError] = useState(false)
  const [websiteError, setWebsiteError] = useState(false)

  function handleTypeChange(next: MarkerType) {
    setType(next)
    setSubtype(SUBTYPES[next][0])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const phoneVal = phone.trim()
    if (phoneVal && !isValidPhone(phoneVal)) {
      setPhoneError(true)
      return
    }

    const websiteVal = website.trim()
    if (websiteVal && !isValidUrl(websiteVal)) {
      setWebsiteError(true)
      return
    }

    onConfirm({
      type,
      subtype,
      name: name.trim(),
      description: description.trim(),
      ...(type === 'institution' && {
        address: address.trim() || undefined,
        phone: phoneVal || undefined,
        hours: hours.trim() || undefined,
        website: websiteVal || undefined,
      }),
    })
  }

  const accentColor = colors[type]
  const isInstitution = type === 'institution'

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    fontSize: 13,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 300,
    color: '#2d2a26',
    background: '#f8f6f2',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 6,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#a09990',
    display: 'block',
    marginBottom: 5,
  }

  const errorStyle: React.CSSProperties = {
    fontSize: 10,
    color: '#d44c30',
    marginTop: 4,
    marginBottom: 0,
  }

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.22)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#efece6',
          borderRadius: 12,
          padding: '24px 22px 22px',
          width: 360,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a09990', marginBottom: 14 }}>
          {t('modal.header')}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Type selector */}
          <div style={{ display: 'flex', gap: 6 }}>
            {TYPE_OPTIONS.map((optType) => (
              <button
                key={optType}
                type="button"
                onClick={() => handleTypeChange(optType)}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  fontSize: 10,
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  border: `1.5px solid ${type === optType ? colors[optType] : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: type === optType ? colors[optType] : 'transparent',
                  color: type === optType ? '#fff' : '#6b6560',
                  transition: 'all 0.15s',
                }}
              >
                {t(`category.${optType}`)}
              </button>
            ))}
          </div>

          {/* Subtype selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUBTYPES[type].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSubtype(s)}
                style={{
                  padding: '5px 12px',
                  fontSize: 11,
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 400,
                  border: `1px solid ${subtype === s ? accentColor : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 20,
                  cursor: 'pointer',
                  background: subtype === s ? `${accentColor}18` : 'transparent',
                  color: subtype === s ? accentColor : '#6b6560',
                  transition: 'all 0.12s',
                }}
              >
                {t(`subtype.${s}`)}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

          {/* Name */}
          <div>
            <label style={labelStyle}>
              {t('modal.nameLabel')} <span style={{ color: accentColor }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('modal.namePlaceholder')}
              style={inputStyle}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>{t('modal.descriptionLabel')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('modal.descriptionPlaceholder')}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          {/* Institution-specific fields */}
          {isInstitution && (
            <>
              <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

              <p style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a09990', margin: 0 }}>
                {t('modal.institutionDetails')}
              </p>

              {/* Address */}
              <div>
                <label style={labelStyle}>{t('modal.addressLabel')}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('modal.addressPlaceholder')}
                  style={inputStyle}
                />
              </div>

              {/* Phone + Hours */}
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>{t('modal.phoneLabel')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneError(false) }}
                    onBlur={() => phone.trim() && setPhoneError(!isValidPhone(phone.trim()))}
                    placeholder={t('modal.phonePlaceholder')}
                    style={{ ...inputStyle, borderColor: phoneError ? '#d44c30' : 'rgba(0,0,0,0.1)' }}
                  />
                  {phoneError && <p style={errorStyle}>{t('modal.phoneError')}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>{t('modal.hoursLabel')}</label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder={t('modal.hoursPlaceholder')}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label style={labelStyle}>{t('modal.websiteLabel')}</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => { setWebsite(e.target.value); setWebsiteError(false) }}
                  onBlur={() => website.trim() && setWebsiteError(!isValidUrl(website.trim()))}
                  placeholder={t('modal.websitePlaceholder')}
                  style={{ ...inputStyle, borderColor: websiteError ? '#d44c30' : 'rgba(0,0,0,0.1)' }}
                />
                {websiteError && <p style={errorStyle}>{t('modal.websiteError')}</p>}
              </div>
            </>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '9px 0',
                fontSize: 12,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 400,
                color: '#a09990',
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {t('modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                flex: 2,
                padding: '9px 0',
                fontSize: 12,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 500,
                color: '#fff',
                background: name.trim() ? accentColor : '#c9bfb8',
                border: 'none',
                borderRadius: 6,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
              }}
            >
              {t('modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
