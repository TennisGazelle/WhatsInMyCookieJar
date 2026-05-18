import type { ReactNode } from 'react'
import './Card.css'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  const classes = ['card', className].filter(Boolean).join(' ')
  return <div className={classes}>{children}</div>
}

function CardHeading({ children }: { children: ReactNode }) {
  return <div className="card-heading">{children}</div>
}

function CardFootnote({ children }: { children: ReactNode }) {
  return <p className="card-footnote">{children}</p>
}

Card.Heading = CardHeading
Card.Footnote = CardFootnote
