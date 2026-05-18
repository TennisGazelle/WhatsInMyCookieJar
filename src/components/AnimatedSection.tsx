import { useEffect, useState, type ReactNode } from 'react'
import {
  REVEAL_CLASS_ANIMATE_IN,
  REVEAL_CLASS_BASE,
  revealVariantClass,
  type RevealVariant,
} from '../constants/reveal'

type AnimatedSectionProps = {
  variant: RevealVariant
  delayMs: number
  className?: string
  children: ReactNode
}

export function AnimatedSection({
  variant,
  delayMs,
  className,
  children,
}: AnimatedSectionProps) {
  const [animateIn, setAnimateIn] = useState(delayMs === 0)

  useEffect(() => {
    if (delayMs === 0) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setAnimateIn(true)
    }, delayMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [delayMs])

  const classes = [
    REVEAL_CLASS_BASE,
    revealVariantClass(variant),
    animateIn ? REVEAL_CLASS_ANIMATE_IN : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
