import { Modal } from '../Modal/Modal'
import { SoftButton } from '../SoftButton/SoftButton'

type RejectCookieModalProps = {
  onClose: () => void
}

export function RejectCookieModal({ onClose }: RejectCookieModalProps) {
  return (
    <Modal open onClose={onClose} ariaLabel="Cookie sharing warning">
      <div className="modal-emoji" aria-hidden="true">
        ✅
      </div>
      <h3>Good call.</h3>
      <p>
        You generally should not hand your cookies to random websites. That is exactly the point
        of this project.
      </p>
      <SoftButton variant="muted" fullWidth onClick={onClose}>
        Close
      </SoftButton>
    </Modal>
  )
}
