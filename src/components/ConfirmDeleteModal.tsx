import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

interface ConfirmDeleteModalProps {
  show: boolean
  message: string
  error: string | null
  busy: boolean
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmDeleteModal({ show, message, error, busy, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal show={show} onHide={() => { if (!busy) onCancel() }} aria-labelledby="confirm-delete-title" centered>
      <Modal.Header closeButton={!busy}><Modal.Title id="confirm-delete-title">Confirm deletion</Modal.Title></Modal.Header>
      <Modal.Body>
        <p className="text-break mb-0">{message}</p>
        {error && <Alert variant="danger" className="mt-3 mb-0" role="alert">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" disabled={busy} onClick={onCancel} autoFocus>Cancel</Button>
        <Button variant="danger" disabled={busy} onClick={onConfirm}>{busy ? 'Deleting...' : 'Delete'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDeleteModal
