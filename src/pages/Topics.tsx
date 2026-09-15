import { useState } from 'react'
import type { FormEvent } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import { useTopics } from './useTopics'

function Topics() {
  const {
    topics,
    selectedTopicId,
    setSelectedTopicId,
    notes,
    loadingTopics,
    loadingNotes,
    savingTopic,
    savingNote,
    message,
    setMessage,
    addTopic,
    deleteTopic,
    addNote,
    deleteNote,
  } = useTopics()

  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? null

  async function handleAddTopic(e: FormEvent) {
    e.preventDefault()
    await addTopic(newTopicTitle)
    setNewTopicTitle('')
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault()
    await addNote(newNoteContent)
    setNewNoteContent('')
  }

  return (
    <div className="my-4">
      <h1 className="mb-4 text-center">Study Topics</h1>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm border-secondary">
            <Card.Header className="py-3 border-secondary">
              <h5 className="mb-0">Topics</h5>
            </Card.Header>
            <Card.Body className="p-3">
              <Form onSubmit={handleAddTopic} className="d-flex gap-2 mb-3">
                <Form.Control
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="New topic name"
                  required
                />
                <Button variant="primary" type="submit" disabled={savingTopic}>
                  {savingTopic ? <Spinner as="span" animation="border" size="sm" role="status" /> : 'Add'}
                </Button>
              </Form>

              {loadingTopics ? (
                <div className="text-center my-3">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading topics...</span>
                  </Spinner>
                </div>
              ) : topics.length === 0 ? (
                <p className="text-secondary mb-0">No topics yet. Create one above.</p>
              ) : (
                <ListGroup>
                  {topics.map((topic) => (
                    <ListGroup.Item
                      key={topic.id}
                      active={topic.id === selectedTopicId}
                      action
                      onClick={() => setSelectedTopicId(topic.id)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {topic.title}
                      <Button
                        variant={topic.id === selectedTopicId ? 'outline-light' : 'outline-danger'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTopic(topic.id)
                        }}
                      >
                        Delete
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-secondary">
            <Card.Header className="py-3 border-secondary">
              <h5 className="mb-0">{selectedTopic ? `Notes - ${selectedTopic.title}` : 'Notes'}</h5>
            </Card.Header>
            <Card.Body className="p-3">
              {!selectedTopic ? (
                <p className="text-secondary mb-0">Select a topic to view and add notes.</p>
              ) : (
                <>
                  <Form onSubmit={handleAddNote} className="mb-3">
                    <Form.Group controlId="newNoteContent" className="mb-2">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Write a note..."
                        required
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button variant="primary" type="submit" disabled={savingNote}>
                        {savingNote ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Saving...
                          </>
                        ) : (
                          'Save Note'
                        )}
                      </Button>
                    </div>
                  </Form>

                  {loadingNotes ? (
                    <div className="text-center my-3">
                      <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading notes...</span>
                      </Spinner>
                    </div>
                  ) : notes.length === 0 ? (
                    <p className="text-secondary mb-0">No notes yet for this topic.</p>
                  ) : (
                    <ListGroup>
                      {notes.map((note) => (
                        <ListGroup.Item
                          key={note.id}
                          className="d-flex justify-content-between align-items-start gap-3"
                        >
                          <span className="text-break">{note.content}</span>
                          <Button variant="outline-danger" size="sm" onClick={() => deleteNote(note.id)}>
                            Delete
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Topics
