import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { api } from '@/services/api'
import { ROUTES } from '@/config/routes'
import loginSvg from '@/assets/login.svg'
import { OAuthButton } from '@/components/OAuthButton'

export function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' }
    if (pwd.length < 8) return { strength: 25, label: 'Too short', color: '#EF4444' }
    
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 15
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 20
    if (/[0-9]/.test(pwd)) strength += 20
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 20
    
    if (strength < 50) return { strength, label: 'Weak', color: '#EF4444' }
    if (strength < 80) return { strength, label: 'Good', color: '#F59E0B' }
    return { strength: 100, label: 'Strong', color: '#10B981' }
  }

  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      // Register the user
      await api.register(email, password)
      
      // Automatically log them in after registration
      await api.login(email, password)
      
      // Redirect to dashboard on success
      console.log('Registration successful, redirecting to:', ROUTES.DASHBOARD)
      window.location.href = ROUTES.DASHBOARD
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Gradient Background with Register Form */}
      <div 
        className="flex-[0.35] flex flex-col justify-center items-center px-8 lg:px-16 min-h-screen lg:min-h-auto"
        style={{
          background: 'linear-gradient(to right, #EC85CA, #3351FD)',
          borderRadius: '0 50px 50px 0'
        }}
      >
        {/* Welcome Section */}
        <div className="mb-8 lg:mb-12 text-left w-full max-w-md">
          <h1 
            className="text-white mb-2 lg:mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 64px)'
            }}
          >
            Join Us!
          </h1>
          <p 
            className="text-white"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '48px'
            }}
          >
            Create your account
          </p>
        </div>

        {/* Register Form Card */}
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
            Sign Up
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
            {/* Email Field */}
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

            {/* Password Field */}
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-600"
                  placeholder="At least 8 characters"
                  disabled={isLoading}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#000000'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Icon 
                    icon={showPassword ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} 
                    width={20} 
                    height={20} 
                  />
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-black mb-2"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px'
                }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-600"
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#000000'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Icon 
                    icon={showConfirmPassword ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} 
                    width={20} 
                    height={20} 
                  />
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2 flex items-center gap-1">
                  {password === confirmPassword ? (
                    <>
                      <Icon icon="mingcute:check-circle-fill" width={16} className="text-green-500" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="mingcute:close-circle-fill" width={16} className="text-red-500" />
                      <span className="text-xs text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || password !== confirmPassword}
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
                  <span>Creating account...</span>
                </>
              ) : (
                'CREATE ACCOUNT'
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
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <OAuthButton provider="google" label="Sign up with Google" />
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Already have an account?{' '}
              <Link 
                to={ROUTES.LOGIN} 
                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>

          {/* Terms & Privacy */}
          <p className="mt-4 text-xs text-center text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
            By signing up, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right Section - SVG Illustration */}
      <div className="flex-[0.65] bg-white flex items-center justify-center p-8 hidden lg:flex">
        <img 
          src={loginSvg} 
          alt="Registration Illustration" 
          className="w-2/3 h-auto object-contain"
        />
      </div>
    </div>
  )
}

