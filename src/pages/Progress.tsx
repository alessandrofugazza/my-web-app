import { useCallback, useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Badge from 'react-bootstrap/Badge'
import { supabase } from '../supabase'

export interface ReadingProgress {
  id: string
  starting_page: number
  current_page: number
  yesterday_progress: number
  total_pages?: number | null
}

interface OverallProgressCardProps {
  currentPage: number
  totalPages: number
}

export function OverallProgressCard({ currentPage, totalPages }: OverallProgressCardProps) {
  const percentage = totalPages > 0 ? Math.min(100, Math.max(0, (currentPage / totalPages) * 100)) : 0
  const roundedPercentage = percentage.toFixed(1)

  return (
    <Card className="h-100 shadow-sm border-secondary">
      <Card.Body className="d-flex flex-column justify-content-center p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Subtitle className="text-secondary text-uppercase mb-0" style={{ letterSpacing: '1px' }}>
            Book Progress
          </Card.Subtitle>
          <span className="fw-bold text-info fs-5">{roundedPercentage}%</span>
        </div>

        <ProgressBar
          now={percentage}
          variant="info"
          animated={percentage > 0 && percentage < 100}
          style={{ height: '1.25rem' }}
          className="my-2"
        />

        <div className="d-flex justify-content-between text-secondary mt-1 small">
          <span>
            Page <strong className="text-light">{currentPage}</strong> of{' '}
            <strong className="text-light">{totalPages || 0}</strong>
          </span>
          <span>
            {totalPages > 0 && currentPage >= totalPages ? (
              <Badge bg="success">Completed!</Badge>
            ) : totalPages > 0 ? (
              `${Math.max(0, totalPages - currentPage)} pages remaining`
            ) : (
              'Set total pages below'
            )}
          </span>
        </div>
      </Card.Body>
    </Card>
  )
}

interface TodayProgressCardProps {
  startingPage: number
  currentPage: number
}

export function TodayProgressCard({ startingPage, currentPage }: TodayProgressCardProps) {
  const pagesReadToday = Math.max(0, currentPage - startingPage)

  return (
    <Card className="h-100 shadow-sm border-secondary">
      <Card.Body className="d-flex flex-column justify-content-center text-center p-4">
        <Card.Subtitle className="text-secondary text-uppercase mb-2" style={{ letterSpacing: '1px' }}>
          Today's Progress
        </Card.Subtitle>
        <div className="display-4 fw-bold text-info my-2">{pagesReadToday}</div>
        <Card.Text className="text-secondary mb-0">
          pages read today ({startingPage} &rarr; {currentPage})
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

interface ProgressComparisonCardProps {
  todayProgress: number
  yesterdayProgress: number
}

export function ProgressComparisonCard({ todayProgress, yesterdayProgress }: ProgressComparisonCardProps) {
  let comparisonText = ''
  let badgeVariant: 'success' | 'danger' | 'secondary' | 'info' = 'secondary'

  if (yesterdayProgress > 0) {
    const percentageDiff = ((todayProgress - yesterdayProgress) / yesterdayProgress) * 100
    const rounded = Math.abs(percentageDiff).toFixed(1)
    if (percentageDiff > 0) {
      comparisonText = `+${rounded}% more than yesterday`
      badgeVariant = 'success'
    } else if (percentageDiff < 0) {
      comparisonText = `-${rounded}% less than yesterday`
      badgeVariant = 'danger'
    } else {
      comparisonText = 'Same as yesterday (0%)'
      badgeVariant = 'info'
    }
  } else if (yesterdayProgress === 0) {
    if (todayProgress > 0) {
      comparisonText = '+100% (No reading logged yesterday)'
      badgeVariant = 'success'
    } else {
      comparisonText = '0 pages read today & yesterday'
      badgeVariant = 'secondary'
    }
  }

  return (
    <Card className="h-100 shadow-sm border-secondary">
      <Card.Body className="d-flex flex-column justify-content-center text-center p-4">
        <Card.Subtitle className="text-secondary text-uppercase mb-2" style={{ letterSpacing: '1px' }}>
          Comparison vs Yesterday
        </Card.Subtitle>
        <div className="my-2">
          <Badge bg={badgeVariant} className="fs-5 px-3 py-2">
            {comparisonText || 'No data'}
          </Badge>
        </div>
        <Card.Text className="text-secondary mb-0 mt-2">
          Yesterday's Progress: <strong className="text-light">{yesterdayProgress}</strong>{' '}
          {yesterdayProgress === 1 ? 'page' : 'pages'}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

function Progress() {
  const [record, setRecord] = useState<ReadingProgress | null>(null)
  const [startingPage, setStartingPage] = useState<number | ''>('')
  const [currentPage, setCurrentPage] = useState<number | ''>('')
  const [yesterdayProgress, setYesterdayProgress] = useState<number | ''>('')
  const [totalPages, setTotalPages] = useState<number | ''>('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)

  // Retrieve progress from Supabase
  const loadProgressData = useCallback(async () => {
    const { data, error } = await supabase.from('reading_progress').select('*').limit(1).maybeSingle()

    if (error) {
      setMessage({ type: 'danger', text: `Failed to load progress: ${error.message}` })
    } else if (data) {
      setRecord(data)
      setStartingPage(data.starting_page ?? 0)
      setCurrentPage(data.current_page ?? 0)
      setYesterdayProgress(data.yesterday_progress ?? 0)
      setTotalPages(data.total_pages ?? 0)
    } else {
      setStartingPage(0)
      setCurrentPage(0)
      setYesterdayProgress(0)
      setTotalPages(0)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false

    async function initialFetch() {
      const { data, error } = await supabase.from('reading_progress').select('*').limit(1).maybeSingle()

      if (ignore) return

      if (error) {
        setMessage({ type: 'danger', text: `Failed to load progress: ${error.message}` })
      } else if (data) {
        setRecord(data)
        setStartingPage(data.starting_page ?? 0)
        setCurrentPage(data.current_page ?? 0)
        setYesterdayProgress(data.yesterday_progress ?? 0)
        setTotalPages(data.total_pages ?? 0)
      } else {
        setStartingPage(0)
        setCurrentPage(0)
        setYesterdayProgress(0)
        setTotalPages(0)
      }

      setLoading(false)
    }

    initialFetch()

    return () => {
      ignore = true
    }
  }, [])

  // Save changes to Supabase
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const startVal = startingPage === '' ? 0 : Number(startingPage)
    const currentVal = currentPage === '' ? 0 : Number(currentPage)
    const yesterdayVal = yesterdayProgress === '' ? 0 : Number(yesterdayProgress)
    const totalVal = totalPages === '' ? 0 : Number(totalPages)

    if (currentVal < startVal) {
      setMessage({
        type: 'danger',
        text: 'Current page cannot be less than starting page.',
      })
      setSaving(false)
      return
    }

    if (totalVal > 0 && currentVal > totalVal) {
      setMessage({
        type: 'danger',
        text: 'Current page cannot exceed total pages.',
      })
      setSaving(false)
      return
    }

    if (record?.id) {
      // Update existing record
      const { data, error } = await supabase
        .from('reading_progress')
        .update({
          starting_page: startVal,
          current_page: currentVal,
          yesterday_progress: yesterdayVal,
          total_pages: totalVal,
        })
        .eq('id', record.id)
        .select()
        .single()

      if (error) {
        setMessage({ type: 'danger', text: `Failed to update: ${error.message}` })
      } else if (data) {
        setRecord(data)
        setMessage({ type: 'success', text: 'Reading progress updated successfully!' })
      }
    } else {
      // Insert new record if none exists yet
      const { data, error } = await supabase
        .from('reading_progress')
        .insert([
          {
            starting_page: startVal,
            current_page: currentVal,
            yesterday_progress: yesterdayVal,
            total_pages: totalVal,
          },
        ])
        .select()
        .single()

      if (error) {
        setMessage({ type: 'danger', text: `Failed to save: ${error.message}` })
      } else if (data) {
        setRecord(data)
        setMessage({ type: 'success', text: 'Reading progress created and saved successfully!' })
      }
    }

    setSaving(false)
  }

  const numStarting = startingPage === '' ? 0 : Number(startingPage)
  const numCurrent = currentPage === '' ? 0 : Number(currentPage)
  const numYesterday = yesterdayProgress === '' ? 0 : Number(yesterdayProgress)
  const numTotal = totalPages === '' ? 0 : Number(totalPages)
  const todayPages = Math.max(0, numCurrent - numStarting)

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading reading progress...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="my-4">
      <h1 className="mb-4 text-center">Reading Progress</h1>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* Book Overall Progress Bar Card */}
      <div className="mb-4">
        <OverallProgressCard currentPage={numCurrent} totalPages={numTotal} />
      </div>

      {/* Progress & Comparison Stats Row */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <TodayProgressCard startingPage={numStarting} currentPage={numCurrent} />
        </Col>
        <Col md={6}>
          <ProgressComparisonCard todayProgress={todayPages} yesterdayProgress={numYesterday} />
        </Col>
      </Row>

      {/* Edit Form Card */}
      <Card className="shadow-sm border-secondary">
        <Card.Header className="py-3 border-secondary">
          <h5 className="mb-0">Edit Reading Details</h5>
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSave}>
            <Row className="g-3">
              <Col sm={6} lg={3}>
                <Form.Group controlId="startingPage">
                  <Form.Label className="fw-semibold">Starting Page</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={startingPage}
                    onChange={(e) => setStartingPage(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 50"
                    required
                  />
                  <Form.Text className="text-secondary">Page started today</Form.Text>
                </Form.Group>
              </Col>

              <Col sm={6} lg={3}>
                <Form.Group controlId="currentPage">
                  <Form.Label className="fw-semibold">Current Page</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 85"
                    required
                  />
                  <Form.Text className="text-secondary">Where you are now</Form.Text>
                </Form.Group>
              </Col>

              <Col sm={6} lg={3}>
                <Form.Group controlId="totalPages">
                  <Form.Label className="fw-semibold">Total Pages</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={totalPages}
                    onChange={(e) => setTotalPages(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 300"
                    required
                  />
                  <Form.Text className="text-secondary">Total pages in book</Form.Text>
                </Form.Group>
              </Col>

              <Col sm={6} lg={3}>
                <Form.Group controlId="yesterdayProgress">
                  <Form.Label className="fw-semibold">Yesterday's Progress</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={yesterdayProgress}
                    onChange={(e) => setYesterdayProgress(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 20"
                    required
                  />
                  <Form.Text className="text-secondary">Pages read yesterday</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" type="button" onClick={loadProgressData} disabled={saving}>
                Reset
              </Button>
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Saving...
                  </>
                ) : (
                  'Save to Database'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Progress
