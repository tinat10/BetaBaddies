import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export function Landing() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/dashboard')
  }

  const handleLogin = () => {
    // TODO: Navigate to login page when implemented
    console.log('Login clicked')
  }

  const handleSignUp = () => {
    // TODO: Navigate to sign up page when implemented
    console.log('Sign Up clicked')
  }

  return (
    <div className="min-h-screen font-poppins relative overflow-hidden" style={{ background: 'linear-gradient(to top, #B1D0FF 0%, #F8FAFC 30%, white 100%)' }}>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 w-full">
        <div className="flex items-center gap-3">
          <img src={logo} alt="ATS Logo" className="w-10 h-10" />
          <span className="text-black font-semibold text-xl">ATS For Candidates</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogin}
            className="px-6 py-2 border border-gray-800 text-gray-800 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={handleSignUp}
            className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-8 py-24 text-center w-full mx-auto max-w-[1400px]">
        <h1 className="text-[100px] font-medium mb-6 leading-[1.1]" style={{ lineHeight: '1.1' }}>
          <span>Finally, the ATS that works for </span>
          <span className="text-[#3351FD]">you</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-5xl font-light">
          Manage your applications, optimize your resume, and prepare for interviews, all in one smart platform built for job seekers.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 text-white hover:scale-105 transition-all"
          style={{ 
            fontFamily: 'Poppins', 
            fontWeight: '500', 
            fontSize: '20px',
            borderRadius: '6px',
            background: 'linear-gradient(86deg, #6A94EE 8%, #4165E8 100%)',
            boxShadow: '6px 8px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          Get Started
        </button>
      </section>

      {/* Feature Cards */}
      <section className="px-8 py-12 w-full mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-[15px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative">
            <div className="absolute top-6 right-6 w-6 h-6 bg-[#916BE3] rounded-full"></div>
            <h3 className="text-black mb-4" style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '30px' }}>Smarter Resume Revamps</h3>
            <p className="text-gray-600 leading-relaxed">
              Instantly refine your resume for any role with AI-powered suggestions that highlight your strengths and match job requirements.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[15px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative">
            <div className="absolute top-6 right-6 w-6 h-6 bg-[#916BE3] rounded-full"></div>
            <h3 className="text-black mb-4" style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '30px' }}>See Your Job Search at a Glance</h3>
            <p className="text-gray-600 leading-relaxed">
              Manage every application with an intuitive kanban-style board that keeps your job hunt organized and stress-free.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[15px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative">
            <div className="absolute top-6 right-6 w-6 h-6 bg-[#916BE3] rounded-full"></div>
            <h3 className="text-black mb-4" style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '30px' }}>Train for the Real <br />Thing</h3>
            <p className="text-gray-600 leading-relaxed">
              Sharpen your interview skills with realistic, AI-guided video mock interviews and personalized feedback.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
