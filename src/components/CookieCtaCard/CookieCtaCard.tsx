import { AnimatedSection } from '../AnimatedSection'
import { ButtonRow, SoftButton } from '../SoftButton/SoftButton'

type CookieCtaCardProps = {
  onReject: () => void
  onOpenJar: () => void
  revealDelayMs: number
}

export function CookieCtaCard({ onReject, onOpenJar, revealDelayMs }: CookieCtaCardProps) {
  return (
    <AnimatedSection variant="card-swipe" delayMs={revealDelayMs} className="card">
      <h2>Open your cookie jar?</h2>
      <p>
        This page can list cookies JavaScript can read on this site and flag names that match
        known trackers.
      </p>
      <ButtonRow>
        <SoftButton variant="muted" onClick={onReject}>
          No Thanks
        </SoftButton>
        <SoftButton variant="primary" onClick={onOpenJar}>
          Open The Jar
        </SoftButton>
      </ButtonRow>
    </AnimatedSection>
  )
}
