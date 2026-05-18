import { useEffect, useMemo, useState } from 'react'
import { TRACKER_LABEL_UNKNOWN } from '../../constants/knownTrackers'
import type { BrowserCookie } from '../../types/cookie'
import { readBrowserCookies, truncateCookieValue } from '../../utils/cookies'
import { Card } from '../Card/Card'
import { DataTable } from '../DataTable/DataTable'
import { Modal } from '../Modal/Modal'
import { SoftButton } from '../SoftButton/SoftButton'

type CookieJarModalProps = {
  onClose: () => void
}

export function CookieJarModal({ onClose }: CookieJarModalProps) {
  const [cookies, setCookies] = useState<BrowserCookie[] | null>(null)

  useEffect(() => {
    let cancelled = false
    void readBrowserCookies().then((result) => {
      if (!cancelled) {
        setCookies(result)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const loading = cookies === null

  const trackerMatchCount = useMemo(() => {
    if (!cookies) {
      return 0
    }
    return cookies.filter(
      (cookie) =>
        cookie.purpose !== TRACKER_LABEL_UNKNOWN || cookie.company !== TRACKER_LABEL_UNKNOWN,
    ).length
  }, [cookies])

  return (
    <Modal open onClose={onClose} ariaLabel="Cookie table" wide>
      <div className="modal-header">
        <div>
          <h3>Your Cookie Jar</h3>
          <p className="hero-subtitle">Cookies readable on this site</p>
        </div>
        <div className="hero-emoji" aria-hidden="true">
          🍪
        </div>
      </div>

      {loading ? (
        <p className="modal-empty">Reading cookies…</p>
      ) : cookies.length === 0 ? (
        <div className="modal-empty">
          <p>No non-HttpOnly cookies are visible to this page.</p>
          <p>
            Tracking cookies set by other websites are not accessible to JavaScript here — that
            limitation is intentional.
          </p>
        </div>
      ) : (
        <DataTable className="data-table--value-last">
          <thead>
            <tr>
              <th scope="col">Cookie</th>
              <th scope="col">Value</th>
              <th scope="col">Purpose</th>
              <th scope="col">Company</th>
            </tr>
          </thead>
          <tbody>
            {cookies.map((cookie) => (
              <tr key={cookie.name}>
                <td className="data-table__cookie-name">{cookie.name}</td>
                <td className="data-table__value" title={cookie.value}>
                  {truncateCookieValue(cookie.value)}
                </td>
                <td>{cookie.purpose}</td>
                <td>{cookie.company}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}

      {!loading && trackerMatchCount > 0 && (
        <div className="modal-insight">
          <strong>Known tracker names</strong>
          <p>
            {trackerMatchCount} cookie{trackerMatchCount === 1 ? '' : 's'} on this domain match
            names commonly used for tracking or advertising.
          </p>
        </div>
      )}

      <Card.Footnote>
        Only same-origin, non-HttpOnly cookies appear here. HttpOnly and other sites&apos; cookies
        stay hidden from page scripts.
      </Card.Footnote>

      <SoftButton variant="primary" fullWidth onClick={onClose}>
        Close
      </SoftButton>
    </Modal>
  )
}
