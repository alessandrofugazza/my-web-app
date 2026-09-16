import './App.css'

import Container from 'react-bootstrap/Container'
import { Route, Routes } from 'react-router-dom'

import AppNavbar from './components/AppNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './AuthContext'
import Home from './pages/Home'
import BackgroundMusic from './pages/BackgroundMusic'
import Progress from './pages/Progress'
import Topics from './pages/Topics'
import Books from './pages/Books'

function App() {
  return (
    <AuthProvider>
      <div>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/bg-music"
              element={
                <ProtectedRoute>
                  <BackgroundMusic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topics"
              element={
                <ProtectedRoute>
                  <Topics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <Books />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </div>
    </AuthProvider>
  )
}

export default App
