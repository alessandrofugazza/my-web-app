import './App.css'

import Container from 'react-bootstrap/Container'
import { Route, Routes } from 'react-router-dom'

import AppNavbar from './components/AppNavbar'
import Home from './pages/Home'
import BackgroundMusic from './pages/BackgroundMusic'
import Progress from './pages/Progress'
import Topics from './pages/Topics'
import Books from './pages/Books'

function App() {
  return (
    <div>
      <AppNavbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bg-music" element={<BackgroundMusic />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/books" element={<Books />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
