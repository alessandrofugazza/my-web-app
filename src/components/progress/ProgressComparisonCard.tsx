import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'

interface ProgressComparisonCardProps {
  todayProgress: number
  yesterdayProgress: number
}

function ProgressComparisonCard({ todayProgress, yesterdayProgress }: ProgressComparisonCardProps) {
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

export default ProgressComparisonCard
