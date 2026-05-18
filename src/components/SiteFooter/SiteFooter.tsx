import {
  ATTRIBUTION_FAVICON_IO_URL,
  ATTRIBUTION_TWEMOJI_LICENSE_URL,
  ATTRIBUTION_TWEMOJI_URL,
} from '../../constants/attribution'
import './SiteFooter.css'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Favicon by{' '}
        <a href={ATTRIBUTION_FAVICON_IO_URL} rel="noopener noreferrer" target="_blank">
          favicon.io
        </a>
        , using the cookie emoji from{' '}
        <a href={ATTRIBUTION_TWEMOJI_URL} rel="noopener noreferrer" target="_blank">
          Twitter Twemoji
        </a>{' '}
        (
        <a href={ATTRIBUTION_TWEMOJI_LICENSE_URL} rel="noopener noreferrer" target="_blank">
          CC BY 4.0
        </a>
        ).
      </p>
    </footer>
  )
}
