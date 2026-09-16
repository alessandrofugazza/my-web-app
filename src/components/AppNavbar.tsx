import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'

function AppNavbar() {
  return (
    <Navbar bg="body-tertiary" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          My Web App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/bg-music">
              Background Music
            </Nav.Link>
            <Nav.Link as={NavLink} to="/progress">
              Progress
            </Nav.Link>
            <Nav.Link as={NavLink} to="/topics">
              Topics
            </Nav.Link>
            <Nav.Link as={NavLink} to="/books">
              Books
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
