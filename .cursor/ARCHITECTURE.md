# Architecture

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- Entry: [index.html](../index.html) → [src/main.tsx](../src/main.tsx) → [src/App.tsx](../src/App.tsx)
- Global styles: [src/index.css](../src/index.css), [src/App.css](../src/App.css)
- Shared motion: [src/styles/reveal-animations.css](../src/styles/reveal-animations.css)

## Component map

```
main.tsx
  └── App.tsx
        ├── AnimatedSection (staggered reveals)
        ├── Hero (title, intro, dynamic quote)
        ├── Snapshot card (table + geolocation CTA)
        ├── Cookie CTA card (modals)
        └── Modals (reject / accept jar)
```

| File | Responsibility |
|------|----------------|
| [src/components/AnimatedSection.tsx](../src/components/AnimatedSection.tsx) | Applies `has-animation` + variant class; adds `animate-in` after `delayMs` |
| [src/constants/reveal.ts](../src/constants/reveal.ts) | Class names and stagger delays (mirror prototype `data-delay`) |
| [src/App.tsx](../src/App.tsx) | Snapshot state, geolocation + Nominatim reverse geocode, modals, mock cookie table |

## State

- **`SnapshotState`**: browser, OS, device, location string, timezone, dark mode, device category for quote wording.
- **Modals**: `rejectModalOpen`, `acceptModalOpen` (React boolean state vs prototype `modal.show` class).
- **Location button**: label + disabled flag while `getCurrentPosition` runs.

## Browser APIs

| Feature | Implementation |
|---------|----------------|
| Browser name | `navigator.userAgentData.getHighEntropyValues` when available; else UA regex in `parseUserAgent` |
| OS / device | UA + `platform` heuristics |
| Timezone | `Intl.DateTimeFormat().resolvedOptions().timeZone` |
| Dark mode | `matchMedia('(prefers-color-scheme: dark)')` |
| Location | `navigator.geolocation.getCurrentPosition` → coordinates or city via [Nominatim](https://nominatim.openstreetmap.org/reverse) |

Constants for timeouts and endpoints live at the top of `App.tsx` (consider moving to `src/constants/` if the file grows).

## Static assets

- [public/](../public/) — favicon, icons, `CNAME`, optional `prototype-goal.html` copy
- [src/assets/](../src/assets/) — bundled images (e.g. hero if used later)

## Prototype vs React

| | Prototype | React |
|---|-----------|-------|
| DOM updates | `getElementById` + `textContent` | `useState` / `useMemo` |
| Reveal trigger | `DOMContentLoaded` + `setTimeout` on `data-delay` | `AnimatedSection` `useEffect` |
| Modals | `#rejectModal` / `#acceptModal` + `.show` | Conditional render + `modal show` on backdrop for button shadow CSS |

Feature parity goal: same copy, snapshot fields, mock cookies, and [animation sequence](ANIMATIONS.md).
