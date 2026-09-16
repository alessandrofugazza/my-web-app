import { useState } from 'react'
import type { FormEvent } from 'react'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import { useBooks } from './useBooks'

function Books() {
  const {
    sources,
    genres,
    books,
    loadingLists,
    loadingBooks,
    savingBook,
    message,
    setMessage,
    addSource,
    deleteSource,
    addGenre,
    deleteGenre,
    addBook,
    deleteBook,
  } = useBooks()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [notes, setNotes] = useState('')
  const [sourceId, setSourceId] = useState('')
  const [genreId, setGenreId] = useState('')

  const [newSourceName, setNewSourceName] = useState('')
  const [newGenreName, setNewGenreName] = useState('')

  async function handleAddBook(e: FormEvent) {
    e.preventDefault()
    await addBook({ title, author, notes, sourceId, genreId })
    setTitle('')
    setAuthor('')
    setNotes('')
    setSourceId('')
    setGenreId('')
  }

  async function handleAddSource(e: FormEvent) {
    e.preventDefault()
    await addSource(newSourceName)
    setNewSourceName('')
  }

  async function handleAddGenre(e: FormEvent) {
    e.preventDefault()
    await addGenre(newGenreName)
    setNewGenreName('')
  }

  return (
    <div className="my-4">
      <h1 className="mb-4 text-center">Books</h1>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-secondary h-100">
            <Card.Header className="py-3 border-secondary">
              <h5 className="mb-0">Sources</h5>
            </Card.Header>
            <Card.Body className="p-3">
              <Form onSubmit={handleAddSource} className="d-flex gap-2 mb-3">
                <Form.Control
                  type="text"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="e.g. Kindle, Library, Gift"
                  required
                />
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </Form>

              {loadingLists ? (
                <Spinner animation="border" size="sm" role="status" />
              ) : sources.length === 0 ? (
                <p className="text-secondary mb-0">No sources yet.</p>
              ) : (
                <ListGroup>
                  {sources.map((source) => (
                    <ListGroup.Item key={source.id} className="d-flex justify-content-between align-items-center">
                      {source.name}
                      <Button variant="outline-danger" size="sm" onClick={() => deleteSource(source.id)}>
                        Delete
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-secondary h-100">
            <Card.Header className="py-3 border-secondary">
              <h5 className="mb-0">Genres</h5>
            </Card.Header>
            <Card.Body className="p-3">
              <Form onSubmit={handleAddGenre} className="d-flex gap-2 mb-3">
                <Form.Control
                  type="text"
                  value={newGenreName}
                  onChange={(e) => setNewGenreName(e.target.value)}
                  placeholder="e.g. Fantasy, Sci-Fi"
                  required
                />
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </Form>

              {loadingLists ? (
                <Spinner animation="border" size="sm" role="status" />
              ) : genres.length === 0 ? (
                <p className="text-secondary mb-0">No genres yet.</p>
              ) : (
                <ListGroup>
                  {genres.map((genre) => (
                    <ListGroup.Item key={genre.id} className="d-flex justify-content-between align-items-center">
                      {genre.name}
                      <Button variant="outline-danger" size="sm" onClick={() => deleteGenre(genre.id)}>
                        Delete
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-secondary mb-4">
        <Card.Header className="py-3 border-secondary">
          <h5 className="mb-0">Add a Book</h5>
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleAddBook}>
            <Row className="g-3">
              <Col sm={6}>
                <Form.Group controlId="bookTitle">
                  <Form.Label className="fw-semibold">Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Book title"
                    required
                  />
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="bookAuthor">
                  <Form.Label className="fw-semibold">Author (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                  />
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="bookSource">
                  <Form.Label className="fw-semibold">Source</Form.Label>
                  <Form.Select value={sourceId} onChange={(e) => setSourceId(e.target.value)} required>
                    <option value="" disabled>
                      Select a source
                    </option>
                    {sources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="bookGenre">
                  <Form.Label className="fw-semibold">Genre</Form.Label>
                  <Form.Select value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
                    <option value="" disabled>
                      Select a genre
                    </option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col sm={12}>
                <Form.Group controlId="bookNotes">
                  <Form.Label className="fw-semibold">Notes (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any notes about this book..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={savingBook || sources.length === 0 || genres.length === 0}
              >
                {savingBook ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Saving...
                  </>
                ) : (
                  'Add Book'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-secondary">
        <Card.Header className="py-3 border-secondary">
          <h5 className="mb-0">Your Books</h5>
        </Card.Header>
        <Card.Body className="p-3">
          {loadingBooks ? (
            <div className="text-center my-3">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading books...</span>
              </Spinner>
            </div>
          ) : books.length === 0 ? (
            <p className="text-secondary mb-0">No books added yet.</p>
          ) : (
            <ListGroup>
              {books.map((book) => (
                <ListGroup.Item key={book.id}>
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="fw-semibold">{book.title}</div>
                      {book.author && <div className="text-secondary small">by {book.author}</div>}
                      <div className="mt-2 d-flex gap-2">
                        {book.source && <Badge bg="secondary">{book.source.name}</Badge>}
                        {book.genre && <Badge bg="info">{book.genre.name}</Badge>}
                      </div>
                      {book.notes && <div className="mt-2 text-break">{book.notes}</div>}
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => deleteBook(book.id)}>
                      Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Books
