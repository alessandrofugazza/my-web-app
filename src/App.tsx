import './App.css'

import Container from 'react-bootstrap/Container'
import { Route, Routes } from 'react-router-dom'

import AppNavbar from './components/AppNavbar'
import Home from './pages/Home'
import BackgroundMusic from './pages/BackgroundMusic'

function App() {
  return (
    <div>
      <AppNavbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bg-music" element={<BackgroundMusic />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
