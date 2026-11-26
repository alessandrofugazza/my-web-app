import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabase'
import { getRecoveryProgress, groupRecoverySteps } from './smokingRecoveryData'
import { loadRecovery, resetRecovery, startRecovery } from './smokingRecoveryStorage'
import type { RecoveryRecord } from './smokingRecoveryStorage'

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
  const userId = session?.user.id
  const [loaded, setLoaded] = useState<{ userId: string; record: RecoveryRecord | null } | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [revision, setRevision] = useState(0)
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    if (!userId) return
    let active = true
    loadRecovery(supabase, userId, () => localStorage.getItem(`smoking-recovery-start:${userId}`))
      .then((record) => {
        if (!active) return
        setLoaded({ userId, record })
        setNow(Date.now())
        setError(null)
      })
      .catch((reason: unknown) => {
        if (!active) return
        setLoaded(null)
        setError(`Could not load recovery progress: ${reason instanceof Error ? reason.message : String(reason)}`)
      })
    return () => { active = false }
  }, [userId, revision])

  const isLoaded = loaded !== null && loaded.userId === userId
  const record = isLoaded ? loaded.record : null
  const startedAt = record?.started_at ? Date.parse(record.started_at) : null

  useEffect(() => {
    if (startedAt === null) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [startedAt])

  async function start() {
    if (!userId || !isLoaded) return
    setSaving(true)
    setError(null)
    try {
      const next = await startRecovery(supabase, userId, record, new Date().toISOString())
      setLoaded({ userId, record: next })
      setNow(Date.now())
    } catch (reason) {
      setError(`Could not start recovery: ${reason instanceof Error ? reason.message : String(reason)}`)
    } finally {
      setSaving(false)
    }
  }

  async function reset() {
    if (!userId || !record?.started_at) return
    setSaving(true)
    setError(null)
    try {
      const next = await resetRecovery(supabase, userId, record.started_at)
      setLoaded({ userId, record: next })
      setShowReset(false)
    } catch (reason) {
      setError(`Could not reset recovery: ${reason instanceof Error ? reason.message : String(reason)}`)
      setShowReset(false)
    } finally {
      setSaving(false)
    }
  }

  function reload() {
    setLoaded(null)
    setError(null)
    setRevision((value) => value + 1)
  }

  const progress = startedAt === null ? null : getRecoveryProgress(startedAt, now)
  const achievedGroups = progress ? groupRecoverySteps(progress.achieved) : []

  return (
    <div className="pb-5">
      <h1>Smoking Recovery</h1>
      <p className="text-body-secondary">
        Track your smoke-free time and explore the milestones ahead.
      </p>
      {error && (
        <Alert variant="danger" role="alert">
          {error} <Button variant="link" onClick={reload} disabled={saving}>Reload progress</Button>
        </Alert>
      )}
      <div className="d-flex gap-2 flex-wrap mb-4">
        <Button onClick={start} disabled={!isLoaded || saving || startedAt !== null}>
          Start smoke-free journey
        </Button>
        <Button variant="outline-danger" onClick={() => setShowReset(true)} disabled={!isLoaded || saving || startedAt === null}>
          Reset
        </Button>
      </div>

      {!isLoaded ? (
        !error && <div><Spinner animation="border" size="sm" role="status" /> Loading progress…</div>
      ) : startedAt === null ? (
        <Card>
          <Card.Body>
            <Card.Title>Ready when you are</Card.Title>
            <Card.Text>Start when you stop smoking. Your progress is saved to your account.</Card.Text>
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
        <Modal.Body>This resets the saved start time for your account on all devices. You can start again afterwards.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReset(false)} disabled={saving}>Cancel</Button>
          <Button variant="danger" onClick={reset} disabled={saving}>{saving ? 'Resetting…' : 'Reset journey'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default SmokingRecovery
