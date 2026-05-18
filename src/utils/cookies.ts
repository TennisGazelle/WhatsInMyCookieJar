import {
  KNOWN_TRACKER_EXACT,
  KNOWN_TRACKER_PREFIXES,
  TRACKER_LABEL_UNKNOWN,
} from '../constants/knownTrackers'
import type { BrowserCookie } from '../types/cookie'

type CookieStoreLike = {
  getAll: () => Promise<{ name: string; value: string }[]>
}

function lookupTrackerMetadata(name: string): { purpose: string; company: string } {
  const exact = KNOWN_TRACKER_EXACT[name]
  if (exact) {
    return exact
  }

  const prefixMatch = KNOWN_TRACKER_PREFIXES.find(({ prefix }) => name.startsWith(prefix))
  if (prefixMatch) {
    return prefixMatch.metadata
  }

  return { purpose: TRACKER_LABEL_UNKNOWN, company: TRACKER_LABEL_UNKNOWN }
}

function parseDocumentCookieString(): Map<string, string> {
  const map = new Map<string, string>()
  if (!document.cookie) {
    return map
  }

  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) {
      map.set(decodeURIComponent(trimmed), '')
      continue
    }
    const name = decodeURIComponent(trimmed.slice(0, eq).trim())
    const value = decodeURIComponent(trimmed.slice(eq + 1).trim())
    map.set(name, value)
  }

  return map
}

async function readFromCookieStore(): Promise<Map<string, string> | null> {
  const store = (window as Window & { cookieStore?: CookieStoreLike }).cookieStore
  if (!store?.getAll) {
    return null
  }

  try {
    const entries = await store.getAll()
    const map = new Map<string, string>()
    for (const entry of entries) {
      if (!entry.name) {
        continue
      }
      map.set(entry.name, entry.value ?? '')
    }
    return map
  } catch {
    return null
  }
}

function toBrowserCookies(map: Map<string, string>): BrowserCookie[] {
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => {
      const { purpose, company } = lookupTrackerMetadata(name)
      return { name, value, purpose, company }
    })
}

export async function readBrowserCookies(): Promise<BrowserCookie[]> {
  const fromStore = await readFromCookieStore()
  const fromDocument = parseDocumentCookieString()

  const merged = new Map(fromDocument)
  if (fromStore) {
    for (const [name, value] of fromStore) {
      merged.set(name, value)
    }
  }

  return toBrowserCookies(merged)
}

export const COOKIE_VALUE_DISPLAY_MAX = 48

export function truncateCookieValue(value: string, maxLength = COOKIE_VALUE_DISPLAY_MAX): string {
  if (value.length <= maxLength) {
    return value
  }
  return `${value.slice(0, maxLength)}…`
}
