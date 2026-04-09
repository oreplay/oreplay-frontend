export type countryCode = string // 2 digit country code

interface ispResponse {
  asn: string
  org: string
  isp: string
}

interface locationResponse {
  country: string
  country_code: countryCode
  city: string
  state: string
  zipcode: string
  latitude: string
  longitude: string
  timezone: string
  localtime: string
}

interface riskResponse {
  is_mobile: boolean
  is_vpn: boolean
  is_tor: boolean
  is_proxy: boolean
  is_datacenter: boolean
  risk_score: number
}

export interface userIpInfoResponse {
  ip: string
  isp: ispResponse
  location: locationResponse
  risk: riskResponse
}
