import { AnimatedSection } from '../AnimatedSection'
import { Card } from '../Card/Card'
import { DataTable } from '../DataTable/DataTable'
import { SoftButton } from '../SoftButton/SoftButton'
import type { SnapshotState } from '../../types/snapshot'

type SnapshotCardProps = {
  snapshot: SnapshotState
  locationButtonLabel: string
  locationButtonDisabled: boolean
  onRequestLocation: () => void
  revealDelayMs: number
}

export function SnapshotCard({
  snapshot,
  locationButtonLabel,
  locationButtonDisabled,
  onRequestLocation,
  revealDelayMs,
}: SnapshotCardProps) {
  return (
    <AnimatedSection variant="card-swipe" delayMs={revealDelayMs} className="card">
      <Card.Heading>
        <p>Read from your browser right now</p>
        <span aria-hidden="true">☕</span>
      </Card.Heading>
      <DataTable>
        <tbody>
          <tr>
            <th scope="row">Approximate Location</th>
            <td>
              <div>{snapshot.location}</div>
              <SoftButton
                variant="muted"
                onClick={onRequestLocation}
                disabled={locationButtonDisabled}
              >
                {locationButtonLabel}
              </SoftButton>
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
      </DataTable>
      <Card.Footnote>
        Most websites can infer this information automatically before you interact with the page at
        all.
      </Card.Footnote>
    </AnimatedSection>
  )
}
