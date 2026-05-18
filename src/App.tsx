import { useEffect, useMemo, useState } from 'react'
import { AnimatedSection } from './components/AnimatedSection'
import { CookieCtaCard } from './components/CookieCtaCard/CookieCtaCard'
import { CookieJarModal } from './components/CookieJarModal/CookieJarModal'
import { RejectCookieModal } from './components/RejectCookieModal/RejectCookieModal'
import { SnapshotCard } from './components/SnapshotCard/SnapshotCard'
import {
  REVEAL_CSS_VAR_CARD_SHADOW_DELAY,
  REVEAL_CARD_SHADOW_DELAY_VALUE,
  REVEAL_DELAY_COOKIE_CARD_MS,
  REVEAL_DELAY_INTRO_MS,
  REVEAL_DELAY_QUOTE_MS,
  REVEAL_DELAY_SNAPSHOT_CARD_MS,
} from './constants/reveal'
import type { SnapshotState } from './types/snapshot'
import {
  buildInitialSnapshot,
  detectBrowser,
  LOCATION_SHARE_LABEL,
  requestBrowserLocation,
} from './utils/browserSnapshot'
import './styles/reveal-animations.css'
import './App.css'

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
    setLocationButtonDisabled(true)
    requestBrowserLocation({
      onLocating: () => {
        setLocationButtonLabel('Locating...')
        setSnapshot((previous) => ({ ...previous, location: 'Requesting permission...' }))
      },
      onLocation: (location) => {
        setSnapshot((previous) => ({ ...previous, location }))
      },
      onComplete: (buttonLabel) => {
        setLocationButtonDisabled(false)
        setLocationButtonLabel(buttonLabel)
      },
    })
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

        <SnapshotCard
          snapshot={snapshot}
          locationButtonLabel={locationButtonLabel}
          locationButtonDisabled={locationButtonDisabled}
          onRequestLocation={onRequestLocation}
          revealDelayMs={REVEAL_DELAY_SNAPSHOT_CARD_MS}
        />

        <CookieCtaCard
          onReject={() => setRejectModalOpen(true)}
          onOpenJar={() => setAcceptModalOpen(true)}
          revealDelayMs={REVEAL_DELAY_COOKIE_CARD_MS}
        />
      </div>

      {rejectModalOpen && (
        <RejectCookieModal onClose={() => setRejectModalOpen(false)} />
      )}
      {acceptModalOpen && <CookieJarModal onClose={() => setAcceptModalOpen(false)} />}
    </main>
  )
}

export default App
