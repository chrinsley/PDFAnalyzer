import { Link, redirect, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import type { CSSProperties } from 'react'
import { AuthContext } from '../context/AuthContext'
import { instance } from '../api/api'


const SignUp = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [username, setuserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = (event:any) => {
    event.preventDefault()

    if (!username.trim() || !email.trim() || !password.trim()) {
      return
    }

    const fetch = async () => {
      const response = await instance.post('api/users/', {
      username,
      email,
      password
      });
      console.log(response.data)
     
    }
    fetch()
    navigate('/signin')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.hero}>
          <h1>Create account</h1>
          <p>Start with a fresh account and enjoy a smooth onboarding experience.</p>
        </div>

        <div style={styles.formPanel}>
          <h2 style={styles.title}>Sign Up</h2>
          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label}>
              user name
              <input
                style={styles.input}
                placeholder="Alex Morgan"
                value={username}
                onChange={(event) => setuserName(event.target.value)}
              />
            </label>

            <label style={styles.label}>
              Email
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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

            <button style={styles.button} type="submit">Create Account</button>
          </form>

          <p style={styles.helperText}>
            Already have an account?{' '}
            <Link to="/signin" style={styles.link}>Sign in</Link>
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
    background: 'linear-gradient(135deg, #1d4ed8 0%, #38bdf8 100%)',
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
  link: {
    color: '#7dd3fc',
    textDecoration: 'none',
  },
}

export default SignUp
