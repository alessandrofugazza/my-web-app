import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import { useAuth } from '../AuthContext'
import { getRecoveryProgress, groupRecoverySteps } from './smokingRecoveryData'

function formatDuration(milliseconds: number) {
  let seconds = Math.max(0, Math.floor(milliseconds / 1000))
  const days = Math.floor(seconds / 86400)
  seconds %= 86400
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60
  return [
    ...(days ? [`${days}d`] : []),
    ...(days || hours ? [`${hours}h`] : []),
    ...(days || hours || minutes ? [`${minutes}m`] : []),
    `${seconds}s`,
  ].join(' ')
}

function milestoneTime(hours: number) {
  if (hours === 0) return 'Start'
  if (hours < 1) return `${Math.round(hours * 60)} minutes`
  if (hours % 24 === 0) return `${hours / 24} ${hours === 24 ? 'day' : 'days'}`
  return `${hours} hours`
}

function SmokingRecovery() {
  const { session } = useAuth()
  const storageKey = `smoking-recovery-start:${session?.user.id}`
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [storageError, setStorageError] = useState<string | null>(null)
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    function loadStart() {
      try {
        const saved = localStorage.getItem(storageKey)
        const timestamp = saved === null ? null : Number(saved)
        if (timestamp !== null && (!Number.isFinite(timestamp) || timestamp <= 0)) {
          setStorageError('The saved start time is invalid. Reset it to start again.')
          setStartedAt(null)
          return
        }
        setStartedAt(timestamp)
        setStorageError(null)
      } catch {
        setStorageError('Your browser storage is unavailable. Progress cannot be loaded or saved.')
      }
    }

    loadStart()
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) loadStart()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  useEffect(() => {
    if (startedAt === null) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [startedAt])

  function start() {
    const timestamp = Date.now()
    try {
      localStorage.setItem(storageKey, String(timestamp))
      setStartedAt(timestamp)
      setNow(timestamp)
      setStorageError(null)
    } catch {
      setStorageError('Your browser storage is unavailable. Progress could not be saved.')
    }
  }

  function reset() {
    try {
      localStorage.removeItem(storageKey)
      setStartedAt(null)
      setStorageError(null)
      setShowReset(false)
    } catch {
      setStorageError('Your browser storage is unavailable. Progress could not be reset.')
      setShowReset(false)
    }
  }

  const progress = startedAt === null ? null : getRecoveryProgress(startedAt, now)
  const achievedGroups = progress ? groupRecoverySteps(progress.achieved) : []

  return (
    <div className="pb-5">
      <h1>Smoking Recovery</h1>
      <p className="text-body-secondary">
        Track your smoke-free time and explore the milestones ahead.
      </p>
      {storageError && <Alert variant="danger" role="alert">{storageError}</Alert>}
      <div className="d-flex gap-2 flex-wrap mb-4">
        <Button onClick={start} disabled={startedAt !== null || storageError !== null}>
          Start smoke-free journey
        </Button>
        <Button variant="outline-danger" onClick={() => setShowReset(true)} disabled={startedAt === null && storageError === null}>
          Reset
        </Button>
      </div>

      {startedAt === null ? (
        <Card>
          <Card.Body>
            <Card.Title>Ready when you are</Card.Title>
            <Card.Text>Start when you stop smoking. Your progress is saved only in this browser on this device.</Card.Text>
          </Card.Body>
        </Card>
      ) : progress && (
        <>
          <Row className="g-3 mb-4">
            <Col md={5}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Smoke-free time</Card.Title>
                  <p className="fs-2 fw-bold mb-1">{formatDuration(progress.elapsed)}</p>
                  <p className="text-body-secondary mb-0">Started {new Date(startedAt).toLocaleString()}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={7}>
              <Card className="h-100 border-success">
                <Card.Body>
                  <Card.Title>Next milestone</Card.Title>
                  {progress.next && progress.remaining !== null ? (
                    <>
                      <p className="mb-2">
                        <strong>{milestoneTime(progress.next.hours)}</strong> · in {formatDuration(progress.remaining)}
                      </p>
                      <ul className="mb-0">{progress.nextSteps.map((step) => <li key={step.description}>{step.description}</li>)}</ul>
                    </>
                  ) : (
                    <Card.Text>You have reached all milestones in this two-week timeline. Keep going!</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <h2 className="h4">Milestones reached <Badge bg="success">{achievedGroups.length}</Badge></h2>
          <p className="text-body-secondary">The latest milestones are shown first.</p>
          <div className="list-group">
            {achievedGroups.map((group) => (
              <div className="list-group-item" key={group.hours}>
                <strong>{milestoneTime(group.hours)}</strong>
                <ul className="mb-0 mt-1">
                  {group.descriptions.map((description, index) => <li key={index}>{description}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal show={showReset} onHide={() => setShowReset(false)} centered>
        <Modal.Header closeButton><Modal.Title>Reset your journey?</Modal.Title></Modal.Header>
        <Modal.Body>This removes the saved start time from this browser. You can start again afterwards.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReset(false)}>Cancel</Button>
          <Button variant="danger" onClick={reset}>Reset journey</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default SmokingRecovery
