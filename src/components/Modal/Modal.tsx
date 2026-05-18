import type { ReactNode } from 'react'
import './Modal.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  ariaLabel: string
  wide?: boolean
  children: ReactNode
}

export function Modal({ open, onClose, ariaLabel, wide = false, children }: ModalProps) {
  if (!open) {
    return null
  }

  const panelClass = ['modal-card', wide ? 'modal-card--wide' : ''].filter(Boolean).join(' ')

  return (
    <div
      className="modal-backdrop modal show"
      role="presentation"
      onClick={onClose}
    >
      <section
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </section>
    </div>
  )
}
