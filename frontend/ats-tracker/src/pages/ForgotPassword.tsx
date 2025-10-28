import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { api } from '@/services/api'
import { ROUTES } from '@/config/routes'
import loginSvg from '@/assets/login.svg'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await api.forgotPassword(email)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div 
          className="flex-[0.35] flex flex-col justify-center items-center px-8 lg:px-16 min-h-screen lg:min-h-auto"
          style={{
            background: 'linear-gradient(to right, #EC85CA, #3351FD)',
            borderRadius: '0 50px 50px 0'
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="mb-6">
              <Icon icon="mingcute:check-circle-fill" width={64} height={64} className="text-green-500 mx-auto mb-4" />
              <h2 
                className="text-black mb-4"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '28px'
                }}
              >
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                If an account with that email exists, we've sent a password reset link.
              </p>
            </div>
            
            <Link 
              to={ROUTES.LOGIN}
              className="inline-block text-purple-600 hover:text-purple-700 font-semibold hover:underline"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Back to Login
            </Link>
          </div>
        </div>

        <div className="flex-[0.65] bg-white flex items-center justify-center p-8 hidden lg:flex">
          <img 
            src={loginSvg} 
            alt="Password Reset Illustration" 
            className="w-2/3 h-auto object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div 
        className="flex-[0.35] flex flex-col justify-center items-center px-8 lg:px-16 min-h-screen lg:min-h-auto"
        style={{
          background: 'linear-gradient(to right, #EC85CA, #3351FD)',
          borderRadius: '0 50px 50px 0'
        }}
      >
        <div className="mb-8 lg:mb-12 text-left w-full max-w-md">
          <h1 
            className="text-white mb-2 lg:mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 64px)'
            }}
          >
            Reset Password
          </h1>
          <p 
            className="text-white"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '48px'
            }}
          >
            Enter your email
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 
            className="text-black mb-6"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '36px'
            }}
          >
            Forgot Password?
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <Icon icon="mingcute:alert-line" width={20} height={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

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
                  <span>Sending...</span>
                </>
              ) : (
                'SEND RESET LINK'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Remember your password?{' '}
              <Link 
                to={ROUTES.LOGIN} 
                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-[0.65] bg-white flex items-center justify-center p-8 hidden lg:flex">
        <img 
          src={loginSvg} 
          alt="Password Reset Illustration" 
          className="w-2/3 h-auto object-contain"
        />
      </div>
    </div>
  )
}