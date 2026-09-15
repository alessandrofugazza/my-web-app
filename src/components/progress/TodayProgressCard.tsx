import Card from 'react-bootstrap/Card'

interface TodayProgressCardProps {
  startingPage: number
  currentPage: number
}

function TodayProgressCard({ startingPage, currentPage }: TodayProgressCardProps) {
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

export default TodayProgressCard
