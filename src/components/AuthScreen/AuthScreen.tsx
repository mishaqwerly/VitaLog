import { useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import styles from './AuthScreen.module.css'

type AuthMode = 'login' | 'register'

export default function AuthScreen() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (mode === 'register') {
        await register(name, email, password)
      } else {
        await login(email, password)
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Authentication failed',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = () => {
    setMode((current) => current === 'login' ? 'register' : 'login')
    setError('')
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-heading">
        <div className={styles.brand}>Vita<span>Log</span></div>
        <p className={styles.eyebrow}>Secure care workspace</p>
        <h1 id="auth-heading">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className={styles.intro}>
          {mode === 'login'
            ? 'Sign in to access patient records.'
            : 'Register to start using the dashboard.'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label>
              Name
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              required
              minLength={8}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className={styles.error} role="alert">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait…'
              : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button className={styles.switchButton} type="button" onClick={switchMode}>
          {mode === 'login'
            ? 'Need an account? Register'
            : 'Already registered? Sign in'}
        </button>

        <a className={styles.clinicLink} href="/clinic">
          Book an examination as a patient
        </a>
      </section>
    </main>
  )
}
