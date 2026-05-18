import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './SoftButton.css'

type SoftButtonVariant = 'muted' | 'primary'

type SoftButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: SoftButtonVariant
  fullWidth?: boolean
  children: ReactNode
}

export function SoftButton({
  variant = 'muted',
  fullWidth = false,
  className,
  children,
  ...props
}: SoftButtonProps) {
  const classes = [
    'soft-button',
    variant === 'primary' ? 'soft-button--primary' : 'soft-button--muted',
    fullWidth ? 'soft-button--full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return <div className="button-row">{children}</div>
}
