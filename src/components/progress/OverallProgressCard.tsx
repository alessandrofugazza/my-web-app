import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar'

interface OverallProgressCardProps {
  currentPage: number
  totalPages: number
}

function OverallProgressCard({ currentPage, totalPages }: OverallProgressCardProps) {
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

export default OverallProgressCard
