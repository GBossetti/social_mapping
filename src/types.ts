export type MarkerType = 'resource' | 'institution' | 'situation'

export type ResourceSubtype = 'water' | 'food' | 'clothes' | 'medicine' | 'battery'
export type InstitutionSubtype = 'school' | 'hospital' | 'shelter' | 'pharmacy' | 'fire_station' | 'police' | 'community_center'
export type SituationSubtype = 'adults' | 'children'

export type MarkerSubtype = ResourceSubtype | InstitutionSubtype | SituationSubtype

export interface MapMarker {
  id: string
  type: MarkerType
  subtype: MarkerSubtype
  name: string
  description: string
  lat: number
  lng: number
  address?: string
  phone?: string
  hours?: string
  website?: string
}

export type FilterState = {
  [key in MarkerSubtype]: boolean
}
