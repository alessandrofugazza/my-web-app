import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { supabase } from '../supabase'

function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  async function logout() {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  if (session) {
    return (
      <Card className="mx-auto" style={{ maxWidth: '24rem' }}>
        <Card.Body>
          <Card.Title>Welcome back</Card.Title>
          <Card.Text>Signed in as {session.user.email}</Card.Text>
          <Button variant="outline-danger" onClick={logout} disabled={loading}>
            {loading ? 'Logging out…' : 'Logout'}
          </Button>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: '24rem' }}>
      <Card.Body>
        <Card.Title>Login</Card.Title>
        <Form onSubmit={login}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </Form.Group>

          {error && <p className="text-danger">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default Home
