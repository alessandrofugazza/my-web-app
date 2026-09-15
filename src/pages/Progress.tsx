import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import OverallProgressCard from '../components/progress/OverallProgressCard'
import TodayProgressCard from '../components/progress/TodayProgressCard'
import ProgressComparisonCard from '../components/progress/ProgressComparisonCard'
import DaysRemainingCard from '../components/progress/DaysRemainingCard'
import { useReadingProgress } from './useReadingProgress'

function Progress() {
  const {
    startingPage,
    setStartingPage,
    currentPage,
    setCurrentPage,
    yesterdayProgress,
    setYesterdayProgress,
    totalPages,
    setTotalPages,
    loading,
    saving,
    message,
    setMessage,
    loadProgressData,
    handleSave,
  } = useReadingProgress()

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

      {/* Days Remaining Estimate */}
      <Row className="g-4 mb-4">
        <Col md={12}>
          <DaysRemainingCard currentPage={numCurrent} totalPages={numTotal} pagesPerDay={todayPages} />
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
