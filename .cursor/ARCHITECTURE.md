# Architecture

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- Entry: [index.html](../index.html) → [src/main.tsx](../src/main.tsx) → [src/App.tsx](../src/App.tsx)
- Global styles: [src/index.css](../src/index.css), [src/App.css](../src/App.css) (page/hero only)
- Shared motion: [src/styles/reveal-animations.css](../src/styles/reveal-animations.css)

## Component map

```
main.tsx
  └── App.tsx
        ├── AnimatedSection (hero text + quote)
        ├── SnapshotCard
        ├── CookieCtaCard
        ├── RejectCookieModal (mounted when open)
        └── CookieJarModal (mounted when open)
```

| File | Responsibility |
|------|----------------|
| [src/components/AnimatedSection.tsx](../src/components/AnimatedSection.tsx) | Staggered `animate-in` reveals |
| [src/components/Card/Card.tsx](../src/components/Card/Card.tsx) | Card shell + heading/footnote |
| [src/components/DataTable/DataTable.tsx](../src/components/DataTable/DataTable.tsx) | Shared table styling |
| [src/components/SoftButton/SoftButton.tsx](../src/components/SoftButton/SoftButton.tsx) | Button variants |
| [src/components/Modal/Modal.tsx](../src/components/Modal/Modal.tsx) | Backdrop + dialog panel |
| [src/components/SnapshotCard/SnapshotCard.tsx](../src/components/SnapshotCard/SnapshotCard.tsx) | Browser snapshot table + location CTA |
| [src/components/CookieCtaCard/CookieCtaCard.tsx](../src/components/CookieCtaCard/CookieCtaCard.tsx) | Cookie jar CTA buttons |
| [src/components/RejectCookieModal/RejectCookieModal.tsx](../src/components/RejectCookieModal/RejectCookieModal.tsx) | “No thanks” dialog |
| [src/components/CookieJarModal/CookieJarModal.tsx](../src/components/CookieJarModal/CookieJarModal.tsx) | Reads and lists same-origin cookies on mount |

## Utils and types

| File | Responsibility |
|------|----------------|
| [src/utils/browserSnapshot.ts](../src/utils/browserSnapshot.ts) | UA/OS/device detection, geolocation, Nominatim |
| [src/utils/cookies.ts](../src/utils/cookies.ts) | `readBrowserCookies()` via Cookie Store API + `document.cookie` |
| [src/constants/knownTrackers.ts](../src/constants/knownTrackers.ts) | Optional purpose/company enrichment (does not filter rows) |
| [src/types/snapshot.ts](../src/types/snapshot.ts) | `SnapshotState` |
| [src/types/cookie.ts](../src/types/cookie.ts) | `BrowserCookie` |

## State in App.tsx

- `snapshot` — browser snapshot fields for quote + table
- Location button label/disabled
- Modal visibility flags; modals **mount only when open** so cookie reads run in a fresh effect

## Browser APIs

| Feature | Implementation |
|---------|----------------|
| Browser name | `navigator.userAgentData.getHighEntropyValues` when available; else UA regex |
| OS / device | UA + `platform` heuristics in `browserSnapshot.ts` |
| Timezone / dark mode | `Intl` + `matchMedia` |
| Location | `navigator.geolocation` + Nominatim reverse geocode |
| Cookies | `cookieStore.getAll()` or `document.cookie` — **same origin only**; HttpOnly cookies never appear |

## Cookie jar limits

JavaScript cannot read cookies set by other websites or HttpOnly cookies. The jar lists every non-HttpOnly cookie visible on the current origin, with name and value. [knownTrackers.ts](../src/constants/knownTrackers.ts) adds purpose/company labels when names match a known list; otherwise columns show `—`.
