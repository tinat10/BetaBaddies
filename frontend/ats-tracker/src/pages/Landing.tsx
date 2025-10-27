import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
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
      {/* Annotations */}
      {/* Candidate Profile Management */}
      <div className="absolute top-24 right-[70px] z-10">
        <div className="relative flex items-center gap-2">
          <span style={{ 
            fontFamily: 'Poppins',
            fontWeight: '600',
            fontSize: '25px',
            transform: 'rotate(12deg)',
            display: 'block',
            maxWidth: '240px',
            lineHeight: '1.2',
            textAlign: 'center'
          }}>
            Candidate Profile Management
          </span>
          <svg width="70" height="80" style={{ transform: 'rotate(12deg)', marginTop: '-20px' }}>
            <path d="M 0 75 Q 30 85 60 0" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" markerEnd="url(#arrowhead1)"/>
            <defs>
              <marker id="arrowhead1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="black"/>
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* AI Powered Content Generation */}
      <div className="absolute top-[615px] left-[50px] z-10 hidden md:block">
        <div className="relative text-center">
          <span style={{ 
            fontFamily: 'Poppins',
            fontWeight: '600',
            fontSize: '25px',
            transform: 'rotate(-15deg)',
            display: 'block',
            marginBottom: '10px',
            maxWidth: '180px',
            lineHeight: '1.2',
            textAlign: 'center'
          }}>
            AI Powered Content Generation
          </span>
          <svg width="80" height="70" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
            <path d="M 40 0 Q 45 15 50 30 Q 60 45 75 60" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" markerEnd="url(#arrowhead2)"/>
            <defs>
              <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="black"/>
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Job Application Tracking System */}
      <div className="absolute top-[620px] left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="relative text-center">
          <span style={{ 
            fontFamily: 'Poppins',
            fontWeight: '600',
            fontSize: '25px',
            display: 'inline-block',
            maxWidth: '250px',
            lineHeight: '1.2'
          }}>
            Job Application Tracking System
          </span>
          <svg width="20" height="45" style={{ margin: '10px auto 0', display: 'block' }}>
            <defs>
              <marker id="arrowhead3" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 8 4, 0 8" fill="black"/>
              </marker>
            </defs>
            <path d="M 10 0 L 10 37" stroke="black" strokeWidth="2" markerEnd="url(#arrowhead3)"/>
          </svg>
        </div>
      </div>

      {/* Interview Preparation Suite */}
      <div className="absolute top-[615px] right-[70px] z-10 hidden md:block">
        <div className="relative text-center">
          <span style={{ 
            fontFamily: 'Poppins',
            fontWeight: '600',
            fontSize: '25px',
            transform: 'rotate(12deg)',
            display: 'block',
            marginBottom: '10px',
            maxWidth: '170px',
            lineHeight: '1.2',
            textAlign: 'center'
          }}>
            Interview Preparation Suite
          </span>
          <svg width="100" height="80" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
            <path d="M 50 0 Q 40 10 30 25 Q 15 45 0 70" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" markerEnd="url(#arrowhead4)"/>
            <defs>
              <marker id="arrowhead4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="black"/>
              </marker>
            </defs>
          </svg>
        </div>
      </div>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 w-full">
        <div className="flex items-center gap-3">
          <img src={logo} alt="ATS Logo" className="w-10 h-10" />
          <span className="text-black font-semibold text-xl">ATS For Candidates</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogin}
            className="px-6 py-2 text-gray-800 bg-white font-medium hover:bg-gray-50 transition-colors"
            style={{ borderRadius: '6px', border: '1.5px solid #1F2937' }}
          >
            Log In
          </button>
          <button
            onClick={handleSignUp}
            className="px-6 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            style={{ borderRadius: '6px' }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-8 py-24 text-center w-full mx-auto max-w-[1400px]">
        <h1 className="text-[100px] font-medium mb-6 leading-[1.1]" style={{ lineHeight: '1.1' }}>
          <span>Finally, the ATS that works for </span>
          <span className="text-[#3351FD] inline-block relative">
            you
            <Icon icon="mingcute:ai-fill" className="w-12 h-12 text-[#3351FD] absolute top-0 right-[-48px]" />
          </span>
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
      <section className="px-8 pt-20 pb-12 w-full mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-[15px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative">
            <div className="absolute top-6 right-6">
              <Icon icon="mingcute:ai-fill" className="w-6 h-6 text-[#916BE3]" />
            </div>
            <h3 className="text-black mb-4" style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '30px' }}>Smarter Resume Revamps</h3>
            <p className="text-gray-600 leading-relaxed">
              Instantly refine your resume for any role with AI-powered suggestions that highlight your strengths and match job requirements.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[15px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative">
            <div className="absolute top-6 right-6">
              <Icon icon="mingcute:ai-fill" className="w-6 h-6 text-[#916BE3]" />
            </div>
            <h3 className="text-black mb-4" style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: '30px' }}>Your Job Search at a Glance</h3>
            <p className="text-gray-600 leading-relaxed">
              Manage every application with an intuitive kanban-style board that keeps your job hunt organized and stress-free.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[15px] p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative">
            <div className="absolute top-6 right-6">
              <Icon icon="mingcute:ai-fill" className="w-6 h-6 text-[#916BE3]" />
            </div>
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
