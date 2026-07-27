import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import type { CSSProperties } from 'react'
import { AuthContext } from '../context/AuthContext'
import { instance } from '../api/api'

const SignIn = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event:any) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setError('')

    try {
      const response = await instance.post('api/token/', {
        username,
        password,
      })

      localStorage.setItem('token', response.data.access)
      login(response.data.access, response.data.refresh)
      navigate('/home')
    } catch (err) {
      console.error(err)
      setError('Invalid username or password. Please try again.')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.hero}>
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard.</p>
        </div>

        <div style={styles.formPanel}>
          <h2 style={styles.title}>Sign In</h2>
          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label}>
              username
              <input
                style={styles.input}
                type="text"
                placeholder="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>

            <label style={styles.label}>
              Password
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error ? <p style={styles.errorText}>{error}</p> : null}

            <button style={styles.button} type="submit">Sign In</button>
          </form>

          <p style={styles.helperText}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={styles.link}>Create one</Link>
          </p>
          <Link to="/home" style={styles.link}>Go to Home</Link>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, #07111f 0%, #12233d 100%)',
    color: '#f8fafc',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '960px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 18px 50px rgba(0,0,0,0.25)',
    background: '#0f172a',
  },
  hero: {
    padding: '40px',
    background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    margin: '0 0 16px',
    fontSize: '24px',
  },
  formPanel: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontWeight: 600,
  },
  input: {
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #334155',
    background: '#020617',
    color: '#f8fafc',
  },
  button: {
    marginTop: '8px',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  helperText: {
    marginTop: '16px',
    color: '#cbd5e1',
  },
  errorText: {
    margin: '0 0 8px',
    color: '#fda4af',
    fontSize: '14px',
  },
  link: {
    color: '#7dd3fc',
    textDecoration: 'none',
  },
}

export default SignIn
