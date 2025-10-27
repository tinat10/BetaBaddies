import { useState, FormEvent } from 'react'
import { Icon } from '@iconify/react'
import { api } from '@/services/api'
import { ROUTES } from '@/config/routes'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isRegisterMode) {
        await api.register(email, password)
        // After successful registration, log them in
        await api.login(email, password)
      } else {
        await api.login(email, password)
      }
      // Redirect to dashboard on success - use window.location for full page reload
      console.log('Login successful, redirecting to:', ROUTES.DASHBOARD)
      window.location.href = ROUTES.DASHBOARD
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Icon icon="mingcute:file-list-line" width={40} height={40} className="text-blue-400" />
          <h1 className="text-3xl font-bold text-white">ATS Tracker</h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white text-center mb-2">
          {isRegisterMode ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-slate-300 text-center mb-6">
          {isRegisterMode ? 'Sign up to get started' : 'Sign in to your account'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <Icon icon="mingcute:alert-line" width={20} height={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
              placeholder="••••••••"
              disabled={isLoading}
            />
            {isRegisterMode && (
              <p className="text-xs text-slate-400 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Icon icon="mingcute:loading-line" width={20} height={20} className="animate-spin" />
                <span>{isRegisterMode ? 'Creating account...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{isRegisterMode ? 'Sign Up' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode)
              setError(null)
            }}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

