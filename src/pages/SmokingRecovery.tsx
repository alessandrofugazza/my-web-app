import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabase'
import alcoholRecovery from './alcoholRecoveryData'
import smokingRecovery from './smokingRecoveryData'
import { formatMilestoneAgo, getRecoveryProgress, groupRecoverySteps } from './smokingRecoveryData'
import { loadRecovery, resetRecovery, startRecovery } from './smokingRecoveryStorage'
import type { RecoveryRecord } from './smokingRecoveryStorage'
import { parseRecoveryDate } from './recoveryDate'

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

function RecoveryTracker({ kind }: { kind: 'smoking' | 'alcohol' }) {
  const { session } = useAuth()
  const userId = session?.user.id
  const table = kind === 'smoking' ? 'smoking_recovery' : 'alcohol_recovery'
  const label = kind === 'smoking' ? 'Smoke' : 'Alcohol'
  const steps = kind === 'smoking' ? smokingRecovery : alcoholRecovery
  const [loaded, setLoaded] = useState<{ userId: string; record: RecoveryRecord | null } | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [revision, setRevision] = useState(0)
  const [showReset, setShowReset] = useState(false)
  const [showStart, setShowStart] = useState(false)
  const [customDate, setCustomDate] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [dateError, setDateError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    let active = true
    loadRecovery(supabase, userId, () => localStorage.getItem(`smoking-recovery-start:${userId}`), table)
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
  }, [userId, revision, table])

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
    let timestamp: number
    try {
      timestamp = customDate ? parseRecoveryDate(startDate, Date.now()) : Date.now()
    } catch (reason) {
      setDateError(reason instanceof Error ? reason.message : String(reason))
      return
    }
    setSaving(true)
    setError(null)
    try {
      const next = await startRecovery(supabase, userId, record, new Date(timestamp).toISOString(), table)
      setLoaded({ userId, record: next })
      setNow(Date.now())
      setShowStart(false)
    } catch (reason) {
      setError(`Could not start recovery: ${reason instanceof Error ? reason.message : String(reason)}`)
      setShowStart(false)
    } finally {
      setSaving(false)
    }
  }

  async function reset() {
    if (!userId || !record?.started_at) return
    setSaving(true)
    setError(null)
    try {
      const next = await resetRecovery(supabase, userId, record.started_at, table)
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

  const progress = startedAt === null ? null : getRecoveryProgress(startedAt, now, steps)
  const achievedGroups = progress ? groupRecoverySteps(progress.achieved) : []

  return (
    <div>
      {error && (
        <Alert variant="danger" role="alert">
          {error} <Button variant="link" onClick={reload} disabled={saving}>Reload progress</Button>
        </Alert>
      )}
      <div className="d-flex gap-2 flex-wrap mb-4">
        <Button onClick={() => { setCustomDate(false); setStartDate(''); setDateError(null); setShowStart(true) }} disabled={!isLoaded || saving}>
          {startedAt === null ? `Start ${label.toLowerCase()}-free journey` : 'Start over'}
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
            <Card.Text>Start your journey. Your progress is saved to your account.</Card.Text>
          </Card.Body>
        </Card>
      ) : progress && (
        <>
          <Row className="g-3 mb-4">
            <Col md={5}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{label}-free time</Card.Title>
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
                <span className="text-body-secondary"> · {formatMilestoneAgo(progress.elapsed, group.hours)}</span>
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
      <Modal show={showStart} onHide={() => !saving && setShowStart(false)} centered>
        <Form onSubmit={(event) => { event.preventDefault(); void start() }}>
          <Modal.Header closeButton={!saving}>
            <Modal.Title>{startedAt === null ? 'Start your journey' : 'Start over?'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {startedAt !== null && <p>This replaces your current {kind} start time on all devices.</p>}
            <Form.Check
              type="radio" name={`${kind}-start-option`} id={`${kind}-start-now`}
              label="Start now" checked={!customDate} onChange={() => { setCustomDate(false); setDateError(null) }}
            />
            <Form.Check
              type="radio" name={`${kind}-start-option`} id={`${kind}-start-past`}
              label="Choose a past date and time" checked={customDate} onChange={() => setCustomDate(true)}
            />
            {customDate && (
              <Form.Group className="mt-3" controlId={`${kind}-start-date`}>
                <Form.Label>Start date and time (your local time)</Form.Label>
                <Form.Control type="datetime-local" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
              </Form.Group>
            )}
            {dateError && <p className="text-danger mt-2 mb-0" role="alert">{dateError}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowStart(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save start time'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

function SmokingRecovery() {
  const [kind, setKind] = useState<'smoking' | 'alcohol'>('smoking')
  return (
    <div className="pb-5">
      <h1>Recovery</h1>
      <p className="text-body-secondary">Track your progress and explore the milestones ahead.</p>
      <div className="d-flex gap-2 mb-4" role="group" aria-label="Recovery tracker">
        <Button variant={kind === 'smoking' ? 'primary' : 'outline-primary'} aria-pressed={kind === 'smoking'} onClick={() => setKind('smoking')}>Smoking</Button>
        <Button variant={kind === 'alcohol' ? 'primary' : 'outline-primary'} aria-pressed={kind === 'alcohol'} onClick={() => setKind('alcohol')}>Alcohol</Button>
      </div>
      <RecoveryTracker key={kind} kind={kind} />
    </div>
  )
}

export default SmokingRecovery
