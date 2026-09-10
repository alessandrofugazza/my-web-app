import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Ratio from 'react-bootstrap/Ratio'
import Row from 'react-bootstrap/Row'

// Replace these with the YouTube videos you want to feature
const videos = [
  { id: 'tQ-31hv3N5s?si=gHJjJ_mEisFBxy0W', title: 'Nier Automata' },
  { id: 'i1zqFpHhIJ4?si=gQ5_XxFsqJAqGSrj', title: 'Nier Replicant' },
  { id: 'K7Ay3hxZx3A?si=2-u_ZPL5AdHrMFnk', title: 'Axiom Verge' },
  { id: 'bq7a_ktfYck?si=gZFsXOsWNlkzugSj', title: 'Hyper Light Drifter' },
  { id: 'YnVynk4hllU?si=yYIMmTchemxqoaJz', title: 'Fallout: New Vegas' },
  { id: 'S8JlQV_y4Hc?si=5UBidu57xt6nd98A', title: 'Fallout 3' },
  { id: 'CNEW2udsaTc?si=lJU85ZAptm10VNIn', title: 'Silent Hill' },
]

function BackgroundMusic() {
  return (
    <div>
      <h1>Background Music</h1>
      <Row xs={1} md={2} lg={3} className="g-4 mt-2">
        {videos.map(({ id, title }) => (
          <Col key={id}>
            <Card className="video-card">
              <Ratio aspectRatio="16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </Ratio>
              <Card.Body>
                <Card.Title className="text-center">{title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default BackgroundMusic
