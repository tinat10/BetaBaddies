import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { api } from '@/services/api'
import { ROUTES } from '@/config/routes'
import loginSvg from '@/assets/login.svg'
import { OAuthButton } from '@/components/OAuthButton'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await api.login(email, password)
      // Redirect to dashboard on success - use window.location for full page reload
      console.log('Login successful, redirecting to:', ROUTES.DASHBOARD)
      window.location.href = ROUTES.DASHBOARD
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Gradient Background with Login Form */}
      <div 
        className="flex-[0.35] flex flex-col justify-center items-center px-8 lg:px-16 min-h-screen lg:min-h-auto"
        style={{
          background: 'linear-gradient(to right, #EC85CA, #3351FD)',
          borderRadius: '0 50px 50px 0'
        }}
      >
        {/* Welcome Section */}
        <div className="mb-8 lg:mb-12 text-left">
          <h1 
            className="text-white mb-2 lg:mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 64px)'
            }}
          >
            Welcome!
          </h1>
          <p 
            className="text-white"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '48px'
            }}
          >
            Ready to get started?
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Title */}
          <h2 
            className="text-black mb-6"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '36px'
            }}
          >
            Log In
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <Icon icon="mingcute:alert-line" width={20} height={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block text-black mb-2"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px'
                }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="Enter your email"
                disabled={isLoading}
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#000000'
                }}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-black mb-2"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px'
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="Enter your password"
                disabled={isLoading}
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#000000'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(to right, #6A94EE, #916BE3)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '22px',
                borderRadius: '15px'
              }}
            >
              {isLoading ? (
                <>
                  <Icon icon="mingcute:loading-line" width={20} height={20} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'LOG IN'
              )}
            </button>
          </form>

          {/* OAuth Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-3 bg-white text-gray-500"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <OAuthButton provider="google" />
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Don't have an account?{' '}
              <Link 
                to={ROUTES.REGISTER} 
                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - SVG Illustration */}
      <div className="flex-[0.65] bg-white flex items-center justify-center p-8 hidden lg:flex">
        <img 
          src={loginSvg} 
          alt="Login Illustration" 
          className="w-2/3 h-auto object-contain"
        />
      </div>
    </div>
  )
}

