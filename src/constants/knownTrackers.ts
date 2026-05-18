export type TrackerMetadata = {
  purpose: string
  company: string
}

/** Enrichment only — does not filter which cookies are shown. */
export const KNOWN_TRACKER_EXACT: Record<string, TrackerMetadata> = {
  _ga: { purpose: 'Analytics tracking', company: 'Google' },
  _gid: { purpose: 'Analytics tracking', company: 'Google' },
  _fbp: { purpose: 'Ad attribution', company: 'Meta' },
  _fbc: { purpose: 'Ad attribution', company: 'Meta' },
  tt_pixel: { purpose: 'Behavioral ads', company: 'TikTok' },
  _ttp: { purpose: 'Behavioral ads', company: 'TikTok' },
  IDE: { purpose: 'Ad targeting', company: 'Google' },
  NID: { purpose: 'Ad targeting', company: 'Google' },
}

/** Longest prefix wins when multiple match. */
export const KNOWN_TRACKER_PREFIXES: { prefix: string; metadata: TrackerMetadata }[] = [
  { prefix: '_ga_', metadata: { purpose: 'Analytics tracking', company: 'Google' } },
  { prefix: '_gac_', metadata: { purpose: 'Analytics tracking', company: 'Google' } },
  { prefix: '__utm', metadata: { purpose: 'Analytics tracking', company: 'Google' } },
]

export const TRACKER_LABEL_UNKNOWN = '—'
