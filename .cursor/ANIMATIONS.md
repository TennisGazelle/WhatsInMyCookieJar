# Animations

Canonical stylesheet: [../src/styles/reveal-animations.css](../src/styles/reveal-animations.css)

Constants: [../src/constants/reveal.ts](../src/constants/reveal.ts)

Trigger component: [../src/components/AnimatedSection.tsx](../src/components/AnimatedSection.tsx)

## Sequence (page load)

Stagger matches the prototype `data-delay` values:

| Step | Delay (ms) | Variant | Content |
|------|------------|---------|---------|
| Intro | 0 | `text-swipe` | Hero paragraph (“Websites quietly learn…”) |
| Quote | 3000 | `text-swipe` | Dynamic `blockquote.snapshot-quote` |
| Snapshot card | 6000 | `card-swipe` | Browser snapshot table |
| Cookie card | 9000 | `card-swipe` | “Open your cookie jar?” |

On mount, `App` sets `--card-shadow-delay: 0ms` on `document.documentElement` (same as prototype).

## Variants

### `animation-text-swipe`

- Text starts hidden via mask (`mask-image` linear gradient, 200% width).
- On `animate-in`, runs `textSwipeLTR` (or RTL) over 1.8s.
- **`blockquote`**: uses `quoteSwipeLTR` / `quoteSwipeRTL` so **text-shadow** eases from `--soft-shadow-sharp` to `--soft-shadow-relaxed`.
- No `::before` / `::after` overlay bars (unlike generic `animation-ltr` reveals).

### `animation-card-swipe`

- Whole `.card` starts `opacity: 0` with **no** box-shadow.
- On `animate-in`: `cardFadeIn` (0.95s) + `cardShadowIn` (1.2s) → strong drop shadow.
- Inner headings/copy stay visible (`opacity: 1`) during card fade.

### Button shadows

- `.soft-button` uses `--soft-shadow-sharp` by default ([App.css](../src/App.css)).
- When a card finishes `animate-in`, or a `.modal.show` is visible, buttons get `softShadowIn`.

## CSS classes (constants in `reveal.ts`)

| Constant | Value |
|----------|--------|
| `REVEAL_CLASS_BASE` | `has-animation` |
| `REVEAL_CLASS_ANIMATE_IN` | `animate-in` |
| `REVEAL_VARIANT_TEXT_SWIPE` | `animation-text-swipe` |
| `REVEAL_VARIANT_CARD_SWIPE` | `animation-card-swipe` |

## Reduced motion

`@media (prefers-reduced-motion: reduce)` in `reveal-animations.css` forces final opacity, removes masks/animations, and applies relaxed shadows immediately.

## Changing timing

1. Update delays in `reveal.ts`.
2. Update `AnimatedSection` `delayMs` props in `App.tsx`.
3. Update this doc and [prototype-goal.html](../prototype-goal.html) `data-delay` attributes if keeping prototype in sync.
