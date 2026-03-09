export type MarkerType = 'resource' | 'institution' | 'situation'

export type ResourceSubtype = 'water' | 'food' | 'clothes' | 'medicine' | 'battery'
export type InstitutionSubtype = 'school' | 'hospital' | 'shelter'
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
}

export type FilterState = {
  [key in MarkerSubtype]: boolean
}
