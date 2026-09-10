import Col from 'react-bootstrap/Col'
import Ratio from 'react-bootstrap/Ratio'
import Row from 'react-bootstrap/Row'

// Replace these with the YouTube video IDs you want to feature
const videoIds = [
  'tQ-31hv3N5s?si=gHJjJ_mEisFBxy0W',
  'i1zqFpHhIJ4?si=gQ5_XxFsqJAqGSrj',
  'K7Ay3hxZx3A?si=2-u_ZPL5AdHrMFnk',
  'bq7a_ktfYck?si=gZFsXOsWNlkzugSj',
]

function BackgroundMusic() {
  return (
    <div>
      <h1>Background Music</h1>
      <Row xs={1} md={2} className="g-4 mt-2">
        {videoIds.map((videoId) => (
          <Col key={videoId}>
            <Ratio aspectRatio="16x9">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`YouTube video ${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </Ratio>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default BackgroundMusic
