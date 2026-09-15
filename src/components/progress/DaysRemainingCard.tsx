import type { ReactNode } from 'react'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'

interface DaysRemainingCardProps {
  currentPage: number
  totalPages: number
  pagesPerDay: number
}

function DaysRemainingCard({ currentPage, totalPages, pagesPerDay }: DaysRemainingCardProps) {
  const pagesRemaining = Math.max(0, totalPages - currentPage)
  const isDone = totalPages > 0 && pagesRemaining === 0
  const daysRemaining = pagesPerDay > 0 ? Math.ceil(pagesRemaining / pagesPerDay) : null

  let content: ReactNode
  if (totalPages === 0) {
    content = <span className="text-secondary">Set total pages to estimate</span>
  } else if (isDone) {
    content = <Badge bg="success">Finished!</Badge>
  } else if (daysRemaining === null) {
    content = <span className="text-secondary">Read today to estimate</span>
  } else {
    content = (
      <>
        <span className="display-6 fw-bold text-warning">{daysRemaining}</span>
        <span className="text-secondary ms-2">{daysRemaining === 1 ? 'day' : 'days'} left</span>
      </>
    )
  }

  return (
    <Card className="h-100 shadow-sm border-secondary">
      <Card.Body className="d-flex flex-column justify-content-center text-center p-4">
        <Card.Subtitle className="text-secondary text-uppercase mb-2" style={{ letterSpacing: '1px' }}>
          Estimated Time to Finish
        </Card.Subtitle>
        <div className="my-2">{content}</div>
        <Card.Text className="text-secondary mb-0">
          at <strong className="text-light">{pagesPerDay.toFixed(1)}</strong> pages/day
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default DaysRemainingCard
