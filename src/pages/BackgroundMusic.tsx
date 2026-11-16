import { useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/Button'
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

function pickRandomIndex(exclude: number | null) {
  const choices = videos.map((_, i) => i).filter((i) => i !== exclude)
  return choices[Math.floor(Math.random() * choices.length)]
}

function BackgroundMusic() {
  const frames = useRef<(HTMLIFrameElement | null)[]>([])
  const [current, setCurrent] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)

  const send = (index: number, func: string) =>
    frames.current[index]?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*',
    )

  const listen = (index: number) =>
    frames.current[index]?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: index }),
      '*',
    )

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'string' || !e.origin.includes('youtube.com')) return
      let data
      try {
        data = JSON.parse(e.data)
      } catch {
        return
      }
      const index = frames.current.findIndex((f) => f?.contentWindow === e.source)
      const state = data?.info?.playerState
      if (index < 0 || state === undefined) return
      if (state === 1 || state === 3) {
        setCurrent(index)
        setPlaying(true)
      } else if (state === 2 || state === 0) {
        setCurrent((c) => {
          if (c === index) setPlaying(false)
          return c
        })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const play = (index: number) => {
    videos.forEach((_, i) => i !== index && send(i, 'pauseVideo'))
    send(index, 'playVideo')
    setCurrent(index)
    setPlaying(true)
  }

  const togglePlay = () => {
    if (current === null) return play(0)
    if (playing) {
      send(current, 'pauseVideo')
      setPlaying(false)
    } else {
      play(current)
    }
  }

  const playRandom = () => {
    play(pickRandomIndex(current))
  }

  return (
    <div>
      <h1>Background Music</h1>
      <section className={`now-playing mt-3${playing ? ' is-playing' : ''}`}>
        <div className="now-playing-label">Currently playing</div>
        <div className="now-playing-title">
          {current === null ? 'Nothing yet' : videos[current].title}
        </div>
        <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
          <Button variant="primary" size="lg" className="px-5" onClick={togglePlay}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </Button>
          <Button variant="outline-light" size="lg" className="px-4" onClick={playRandom}>
            🔀 Play random
          </Button>
        </div>
      </section>
      <Row xs={1} md={2} lg={3} className="g-4 mt-2">
        {videos.map(({ id, title }, index) => (
          <Col key={id}>
            <Card className="video-card">
              <Ratio aspectRatio="16x9">
                <iframe
                  ref={(el) => {
                    frames.current[index] = el
                  }}
                  onLoad={() => listen(index)}
                  src={`https://www.youtube.com/embed/${id}&enablejsapi=1`}
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
