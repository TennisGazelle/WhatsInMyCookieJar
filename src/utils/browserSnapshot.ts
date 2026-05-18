import type { SnapshotState } from '../types/snapshot'

export const GEOLOCATION_TIMEOUT_MS = 8000
export const GEOLOCATION_MAX_AGE_MS = 600_000
export const NOMINATIM_REVERSE_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'
export const LOCATION_SHARE_LABEL = 'Share location'
export const LOCATION_UPDATE_LABEL = 'Update location'

type UserAgentBrand = {
  brand: string
  version: string
}

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    platform?: string
    brands?: UserAgentBrand[]
    getHighEntropyValues?: (hints: string[]) => Promise<{
      brands?: UserAgentBrand[]
      fullVersionList?: UserAgentBrand[]
    }>
  }
}

function parseUserAgent(ua: string): string {
  const rules = [
    { name: 'Edge', re: /Edg(?:e|A|iOS)?\/([\d.]+)/ },
    { name: 'Opera', re: /OPR\/([\d.]+)/ },
    { name: 'Chrome', re: /Chrome\/([\d.]+)/ },
    { name: 'Firefox', re: /Firefox\/([\d.]+)/ },
    { name: 'Safari', re: /Version\/([\d.]+).*Safari/ },
  ]

  for (const { name, re } of rules) {
    const match = ua.match(re)
    if (match) {
      return `${name} ${match[1].split('.')[0]}`
    }
  }

  return 'Unknown browser'
}

function detectOS(ua: string, platform: string): string {
  if (/Windows NT 10/.test(ua)) return 'Windows 10 or later'
  if (/Windows NT/.test(ua)) return 'Windows'
  if (/Mac OS X|Macintosh/.test(ua)) {
    const version = ua.match(/Mac OS X (\d+[._]\d+)/)
    return version ? `macOS ${version[1].replace('_', '.')}` : 'macOS'
  }
  const android = ua.match(/Android (\d+(?:\.\d+)?)/)
  if (android) return `Android ${android[1]}`
  const ios = ua.match(/iPhone OS (\d+[._]\d+)/)
  if (ios) return `iOS ${ios[1].replace('_', '.')}`
  if (/iPad/.test(ua)) return 'iPadOS'
  if (/CrOS/.test(ua)) return 'ChromeOS'
  if (/Linux/.test(ua)) return 'Linux'
  return platform || 'Unknown OS'
}

function detectDevice(ua: string): string {
  const touch = navigator.maxTouchPoints > 0
  const width = window.screen.width
  const height = window.screen.height

  if (/iPhone/.test(ua)) return 'iPhone'
  if (/iPad/.test(ua)) return 'iPad'
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? 'Android phone' : 'Android tablet'
  if (/Macintosh/.test(ua) && touch) return 'Mac (touchscreen)'
  if (/Macintosh/.test(ua)) return 'Mac'
  if (/Windows/.test(ua)) return 'Windows PC'
  if (/CrOS/.test(ua)) return 'Chromebook'
  if (touch && Math.min(width, height) < 768) return 'Mobile device'
  if (touch) return 'Touchscreen device'
  return 'Desktop or laptop'
}

function deviceCategoryForQuote(device: string): 'computer' | 'phone' {
  if (/phone|mobile/i.test(device)) return 'phone'
  return 'computer'
}

export function formatCoordinates(latitude: number, longitude: number): string {
  const latAbs = Math.abs(latitude).toFixed(2)
  const lngAbs = Math.abs(longitude).toFixed(2)
  const latHem = latitude >= 0 ? 'N' : 'S'
  const lngHem = longitude >= 0 ? 'E' : 'W'
  return `${latAbs}° ${latHem}, ${lngAbs}° ${lngHem}`
}

export function geolocationErrorMessage(error?: GeolocationPositionError): string {
  if (!error) return "Couldn't get location"
  if (error.code === error.PERMISSION_DENIED) return 'Permission denied'
  if (error.code === error.TIMEOUT) return 'Location timed out'
  return "Couldn't get location"
}

async function reverseGeocodeCity(latitude: number, longitude: number): Promise<string | null> {
  const url = new URL(NOMINATIM_REVERSE_ENDPOINT)
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('format', 'json')

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Reverse geocode failed')
  }

  const data = await response.json() as { address?: Record<string, string> }
  const address = data.address ?? {}
  return (
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.county ??
    null
  )
}

export async function detectBrowser(): Promise<string> {
  const nav = navigator as NavigatorWithUserAgentData
  if (nav.userAgentData?.getHighEntropyValues) {
    try {
      const result = await nav.userAgentData.getHighEntropyValues([
        'brands',
        'fullVersionList',
      ])
      const candidates = result.fullVersionList?.length ? result.fullVersionList : result.brands
      const primary = candidates?.find(
        (candidate) => candidate.brand && !/not.a.brand|chromium/i.test(candidate.brand),
      )

      if (primary) {
        return `${primary.brand} ${primary.version.split('.')[0]}`
      }
    } catch {
      // Fall back to user-agent parsing below.
    }
  }

  return parseUserAgent(navigator.userAgent)
}

export function buildInitialSnapshot(): SnapshotState {
  const nav = navigator as NavigatorWithUserAgentData
  const ua = navigator.userAgent
  const platform = nav.userAgentData?.platform ?? navigator.platform
  const operatingSystem = detectOS(ua, platform)
  const device = detectDevice(ua)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Enabled' : 'Disabled'

  return {
    browser: parseUserAgent(ua),
    operatingSystem,
    device,
    deviceCategory: deviceCategoryForQuote(device),
    location: `${timezone} (inferred)`,
    timezone,
    darkMode,
  }
}

export function requestBrowserLocation(handlers: {
  onLocating: () => void
  onLocation: (location: string) => void
  onComplete: (buttonLabel: string) => void
}): void {
  if (!navigator.geolocation) {
    handlers.onLocation('Not available in this browser')
    handlers.onComplete(LOCATION_SHARE_LABEL)
    return
  }

  handlers.onLocating()

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords
      const coords = formatCoordinates(latitude, longitude)
      const accuracyText = accuracy != null ? ` ±${Math.round(accuracy)} m` : ''
      handlers.onLocation(`${coords}${accuracyText}`)

      try {
        const city = await reverseGeocodeCity(latitude, longitude)
        if (city) {
          handlers.onLocation(city)
        }
      } catch {
        // Keep coordinate-based location if reverse geocoding fails.
      }

      handlers.onComplete(LOCATION_UPDATE_LABEL)
    },
    (error) => {
      handlers.onLocation(geolocationErrorMessage(error))
      handlers.onComplete(LOCATION_SHARE_LABEL)
    },
    {
      timeout: GEOLOCATION_TIMEOUT_MS,
      maximumAge: GEOLOCATION_MAX_AGE_MS,
      enableHighAccuracy: false,
    },
  )
}
