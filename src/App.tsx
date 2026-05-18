import { useEffect, useMemo, useState } from 'react'
import { AnimatedSection } from './components/AnimatedSection'
import {
  REVEAL_CSS_VAR_CARD_SHADOW_DELAY,
  REVEAL_CARD_SHADOW_DELAY_VALUE,
  REVEAL_DELAY_COOKIE_CARD_MS,
  REVEAL_DELAY_INTRO_MS,
  REVEAL_DELAY_QUOTE_MS,
  REVEAL_DELAY_SNAPSHOT_CARD_MS,
} from './constants/reveal'
import './styles/reveal-animations.css'
import './App.css'

type SnapshotState = {
  browser: string
  operatingSystem: string
  device: string
  deviceCategory: 'computer' | 'phone'
  location: string
  timezone: string
  darkMode: 'Enabled' | 'Disabled'
}

type TrackerCookie = {
  name: string
  purpose: string
  company: string
}

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

const GEOLOCATION_TIMEOUT_MS = 8000
const GEOLOCATION_MAX_AGE_MS = 600_000
const NOMINATIM_REVERSE_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'
const LOCATION_SHARE_LABEL = 'Share location'
const LOCATION_UPDATE_LABEL = 'Update location'

const MOCK_TRACKER_COOKIES: TrackerCookie[] = [
  { name: '_ga', purpose: 'Analytics tracking', company: 'Google' },
  { name: '_fbp', purpose: 'Ad attribution', company: 'Meta' },
  { name: 'tt_pixel', purpose: 'Behavioral ads', company: 'TikTok' },
]

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

function formatCoordinates(latitude: number, longitude: number): string {
  const latAbs = Math.abs(latitude).toFixed(2)
  const lngAbs = Math.abs(longitude).toFixed(2)
  const latHem = latitude >= 0 ? 'N' : 'S'
  const lngHem = longitude >= 0 ? 'E' : 'W'
  return `${latAbs}° ${latHem}, ${lngAbs}° ${lngHem}`
}

function geolocationErrorMessage(error?: GeolocationPositionError): string {
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

async function detectBrowser(): Promise<string> {
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

function buildInitialSnapshot(): SnapshotState {
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

function App() {
  const [snapshot, setSnapshot] = useState<SnapshotState>(() => buildInitialSnapshot())
  const [locationButtonLabel, setLocationButtonLabel] = useState(LOCATION_SHARE_LABEL)
  const [locationButtonDisabled, setLocationButtonDisabled] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [acceptModalOpen, setAcceptModalOpen] = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty(
      REVEAL_CSS_VAR_CARD_SHADOW_DELAY,
      REVEAL_CARD_SHADOW_DELAY_VALUE,
    )
  }, [])

  useEffect(() => {
    detectBrowser().then((browser) => {
      setSnapshot((previous) => ({ ...previous, browser }))
    })
  }, [])

  const quote = useMemo(
    () =>
      `You are on your ${snapshot.operatingSystem} ${snapshot.deviceCategory} in ${snapshot.location} and you like ${snapshot.darkMode === 'Enabled' ? 'dark mode' : 'light mode'}.`,
    [snapshot],
  )

  const onRequestLocation = () => {
    if (!navigator.geolocation) {
      setSnapshot((previous) => ({ ...previous, location: 'Not available in this browser' }))
      setLocationButtonDisabled(true)
      return
    }

    setLocationButtonDisabled(true)
    setLocationButtonLabel('Locating...')
    setSnapshot((previous) => ({ ...previous, location: 'Requesting permission...' }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const coords = formatCoordinates(latitude, longitude)
        const accuracyText = accuracy != null ? ` ±${Math.round(accuracy)} m` : ''

        setSnapshot((previous) => ({
          ...previous,
          location: `${coords}${accuracyText}`,
        }))

        try {
          const city = await reverseGeocodeCity(latitude, longitude)
          if (city) {
            setSnapshot((previous) => ({ ...previous, location: city }))
          }
        } catch {
          // Keep coordinate-based location if reverse geocoding fails.
        }

        setLocationButtonDisabled(false)
        setLocationButtonLabel(LOCATION_UPDATE_LABEL)
      },
      (error) => {
        setSnapshot((previous) => ({
          ...previous,
          location: geolocationErrorMessage(error),
        }))
        setLocationButtonDisabled(false)
        setLocationButtonLabel(LOCATION_SHARE_LABEL)
      },
      {
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: GEOLOCATION_MAX_AGE_MS,
        enableHighAccuracy: false,
      },
    )
  }

  return (
    <main className="page">
      <div className="page-shell">
        <header className="hero">
          <div className="hero-title-row">
            <div className="hero-emoji" aria-hidden="true">
              🍪
            </div>
            <div>
              <h1>What&apos;s In My Cookie Jar?</h1>
              <p className="hero-subtitle">A calmer way to understand internet tracking</p>
            </div>
          </div>
          <AnimatedSection variant="text-swipe" delayMs={REVEAL_DELAY_INTRO_MS}>
            <p className="quote-intro">
              Websites quietly learn things about your browser and device before you even click
              &quot;Accept Cookies.&quot;
            </p>
          </AnimatedSection>
          <AnimatedSection variant="text-swipe" delayMs={REVEAL_DELAY_QUOTE_MS}>
            <blockquote className="snapshot-quote">{quote}</blockquote>
          </AnimatedSection>
        </header>

        <AnimatedSection
          variant="card-swipe"
          delayMs={REVEAL_DELAY_SNAPSHOT_CARD_MS}
          className="card"
        >
          <div className="card-heading">
            <p>Read from your browser right now</p>
            <span aria-hidden="true">☕</span>
          </div>
          <table className="snapshot-table">
            <tbody>
              <tr>
                <th scope="row">Approximate Location</th>
                <td>
                  <div>{snapshot.location}</div>
                  <button
                    type="button"
                    className="soft-button soft-button-muted"
                    onClick={onRequestLocation}
                    disabled={locationButtonDisabled}
                  >
                    {locationButtonLabel}
                  </button>
                </td>
              </tr>
              <tr>
                <th scope="row">Browser</th>
                <td>{snapshot.browser}</td>
              </tr>
              <tr>
                <th scope="row">Operating System</th>
                <td>{snapshot.operatingSystem}</td>
              </tr>
              <tr>
                <th scope="row">Likely Device</th>
                <td>{snapshot.device}</td>
              </tr>
              <tr>
                <th scope="row">Screen Resolution</th>
                <td>{`${window.screen.width} × ${window.screen.height} (${window.devicePixelRatio}x)`}</td>
              </tr>
              <tr>
                <th scope="row">Timezone</th>
                <td>{snapshot.timezone}</td>
              </tr>
              <tr>
                <th scope="row">Dark Mode</th>
                <td>{snapshot.darkMode}</td>
              </tr>
            </tbody>
          </table>
          <p className="card-footnote">
            Most websites can infer this information automatically before you interact with the
            page at all.
          </p>
        </AnimatedSection>

        <AnimatedSection
          variant="card-swipe"
          delayMs={REVEAL_DELAY_COOKIE_CARD_MS}
          className="card"
        >
          <h2>Open your cookie jar?</h2>
          <p>
            This demo can inspect common tracking cookies and explain what advertising systems may
            infer from them.
          </p>
          <div className="button-row">
            <button
              type="button"
              className="soft-button soft-button-muted"
              onClick={() => setRejectModalOpen(true)}
            >
              No Thanks
            </button>
            <button
              type="button"
              className="soft-button soft-button-primary"
              onClick={() => setAcceptModalOpen(true)}
            >
              Open The Jar
            </button>
          </div>
        </AnimatedSection>
      </div>

      {rejectModalOpen && (
        <div
          className="modal-backdrop modal show"
          role="presentation"
          onClick={() => setRejectModalOpen(false)}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="Cookie sharing warning"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-emoji" aria-hidden="true">
              ✅
            </div>
            <h3>Good call.</h3>
            <p>You generally should not hand your cookies to random websites.</p>
            <button
              type="button"
              className="soft-button soft-button-muted modal-close"
              onClick={() => setRejectModalOpen(false)}
            >
              Close
            </button>
          </section>
        </div>
      )}

      {acceptModalOpen && (
        <div
          className="modal-backdrop modal show"
          role="presentation"
          onClick={() => setAcceptModalOpen(false)}
        >
          <section
            className="modal-card modal-card-wide"
            role="dialog"
            aria-modal="true"
            aria-label="Cookie table"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>Your Cookie Jar</h3>
                <p className="hero-subtitle">Mocked tracker data</p>
              </div>
              <div className="hero-emoji" aria-hidden="true">
                🍪
              </div>
            </div>

            <table className="snapshot-table">
              <thead>
                <tr>
                  <th scope="col">Cookie</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Company</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRACKER_COOKIES.map((cookie) => (
                  <tr key={cookie.name}>
                    <td className="cookie-name">{cookie.name}</td>
                    <td>{cookie.purpose}</td>
                    <td>{cookie.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="profile-card">
              <strong>Possible advertising profile</strong>
              <p>
                Your browser activity may suggest interests in technology, gaming, finance, travel,
                and online shopping.
              </p>
            </div>

            <p className="card-footnote">This demo uses mocked example data for educational purposes.</p>

            <button
              type="button"
              className="soft-button soft-button-primary modal-close"
              onClick={() => setAcceptModalOpen(false)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
