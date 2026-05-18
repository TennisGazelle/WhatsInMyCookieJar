export const REVEAL_CLASS_BASE = 'has-animation'
export const REVEAL_CLASS_ANIMATE_IN = 'animate-in'
export const REVEAL_VARIANT_TEXT_SWIPE = 'animation-text-swipe'
export const REVEAL_VARIANT_CARD_SWIPE = 'animation-card-swipe'
export const REVEAL_CSS_VAR_CARD_SHADOW_DELAY = '--card-shadow-delay'
export const REVEAL_CARD_SHADOW_DELAY_VALUE = '0ms'

export const REVEAL_DELAY_INTRO_MS = 0
export const REVEAL_DELAY_QUOTE_MS = 3000
export const REVEAL_DELAY_SNAPSHOT_CARD_MS = 6000
export const REVEAL_DELAY_COOKIE_CARD_MS = 9000

export type RevealVariant = 'text-swipe' | 'card-swipe'

export function revealVariantClass(variant: RevealVariant): string {
  return variant === 'text-swipe' ? REVEAL_VARIANT_TEXT_SWIPE : REVEAL_VARIANT_CARD_SWIPE
}
