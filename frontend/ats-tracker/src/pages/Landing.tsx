import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { ROUTES } from "@/config/routes";
import logo from "../assets/logo.png";

export function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleSignUp = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <div className="min-h-screen font-poppins relative overflow-x-hidden w-full bg-white md:bg-gradient-to-t md:from-[#B1D0FF] md:via-[#F8FAFC] md:to-white">
      {/* Annotations - Hide on mobile and tablet */}
      {/* Candidate Profile Management */}
      <div className="absolute top-24 right-[70px] z-10 hidden lg:block">
        <div className="relative flex items-center gap-2">
          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: "25px",
              transform: "rotate(12deg)",
              display: "block",
              maxWidth: "240px",
              lineHeight: "1.2",
              textAlign: "center",
            }}
          >
            Candidate Profile Management
          </span>
          <svg
            width="70"
            height="80"
            style={{ transform: "rotate(12deg)", marginTop: "-20px" }}
          >
            <path
              d="M 0 75 Q 30 85 60 0"
              stroke="black"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead1)"
            />
            <defs>
              <marker
                id="arrowhead1"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="black" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* AI Powered Content Generation */}
      <div className="absolute top-[615px] left-[50px] z-10 hidden lg:block">
        <div className="relative text-center">
          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: "25px",
              transform: "rotate(-15deg)",
              display: "block",
              marginBottom: "10px",
              maxWidth: "180px",
              lineHeight: "1.2",
              textAlign: "center",
            }}
          >
            AI Powered Content Generation
          </span>
          <svg
            width="80"
            height="70"
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <path
              d="M 40 0 Q 45 15 50 30 Q 60 45 75 60"
              stroke="black"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead2)"
            />
            <defs>
              <marker
                id="arrowhead2"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="black" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Job Application Tracking System */}
      <div className="absolute top-[620px] left-1/2 -translate-x-1/2 z-10 hidden lg:block">
        <div className="relative text-center">
          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: "25px",
              display: "inline-block",
              maxWidth: "250px",
              lineHeight: "1.2",
            }}
          >
            Job Application Tracking System
          </span>
          <svg
            width="20"
            height="45"
            style={{ margin: "10px auto 0", display: "block" }}
          >
            <defs>
              <marker
                id="arrowhead3"
                markerWidth="8"
                markerHeight="8"
                refX="4"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0 0, 8 4, 0 8" fill="black" />
              </marker>
            </defs>
            <path
              d="M 10 0 L 10 37"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead3)"
            />
          </svg>
        </div>
      </div>

      {/* Interview Preparation Suite */}
      <div className="absolute top-[615px] right-[70px] z-10 hidden lg:block">
        <div className="relative text-center">
          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: "25px",
              transform: "rotate(12deg)",
              display: "block",
              marginBottom: "10px",
              maxWidth: "170px",
              lineHeight: "1.2",
              textAlign: "center",
            }}
          >
            Interview Preparation Suite
          </span>
          <svg
            width="100"
            height="80"
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <path
              d="M 50 0 Q 40 10 30 25 Q 15 45 0 70"
              stroke="black"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead4)"
            />
            <defs>
              <marker
                id="arrowhead4"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="black" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 md:py-6 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <img
            src={logo}
            alt="ATS Logo"
            className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
          />
          <span className="text-black font-semibold text-sm sm:text-base md:text-xl truncate">
            ATS For Candidates
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
          <button
            onClick={handleLogin}
            className="px-2.5 py-1.5 sm:px-4 md:px-6 md:py-2 text-gray-800 bg-white font-medium hover:bg-gray-50 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap"
            style={{ borderRadius: "6px", border: "1.5px solid #1F2937" }}
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            className="px-2.5 py-1.5 sm:px-4 md:px-6 md:py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap"
            style={{ borderRadius: "6px" }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 md:py-16 lg:py-24 text-center w-full mx-auto max-w-[1400px]">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[100px] font-medium mb-4 md:mb-6 leading-[1.1] break-words"
          style={{ lineHeight: "1.1" }}
        >
          <span className="block sm:inline">
            <span className="hidden md:inline">
              Finally, the ATS that works for{" "}
            </span>
            <span className="md:hidden">ATS that works for </span>
          </span>
          <span className="text-[#3351FD] inline-block relative whitespace-nowrap">
            you
            <Icon
              icon="mingcute:ai-fill"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#3351FD] absolute top-0 right-[-24px] sm:right-[-32px] md:right-[-40px] lg:right-[-48px]"
            />
          </span>
        </h1>
        <p className="hidden md:block text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 lg:mb-10 max-w-5xl font-light px-4">
          Manage your applications, optimize your resume, and prepare for
          interviews, all in one smart platform built for job seekers.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 md:px-10 md:py-3.5 text-white hover:scale-105 transition-all text-lg sm:text-xl md:text-2xl font-semibold"
          style={{
            fontFamily: "Poppins",
            fontWeight: "600",
            borderRadius: "8px",
            background: "linear-gradient(86deg, #6A94EE 8%, #4165E8 100%)",
            boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.4)",
          }}
        >
          Get Started
        </button>
      </section>

      {/* Feature Cards */}
      <section className="px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12 w-full mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-[15px] p-6 sm:p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative pr-16 sm:pr-20">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <Icon
                icon="mingcute:ai-fill"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#916BE3]"
              />
            </div>
            <h3
              className="text-black mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl pr-8"
              style={{ fontFamily: "Poppins", fontWeight: "500" }}
            >
              Smarter Resume Revamps
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Instantly refine your resume for any role with AI-powered
              suggestions that highlight your strengths and match job
              requirements.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[15px] p-6 sm:p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative pr-16 sm:pr-20">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <Icon
                icon="mingcute:ai-fill"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#916BE3]"
              />
            </div>
            <h3
              className="text-black mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl pr-8"
              style={{ fontFamily: "Poppins", fontWeight: "500" }}
            >
              Your Job Search at a Glance
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Manage every application with an intuitive kanban-style board that
              keeps your job hunt organized and stress-free.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[15px] p-6 sm:p-8 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative pr-16 sm:pr-20">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <Icon
                icon="mingcute:ai-fill"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#916BE3]"
              />
            </div>
            <h3
              className="text-black mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl pr-8"
              style={{ fontFamily: "Poppins", fontWeight: "500" }}
            >
              Train for the Real <br />
              Thing
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Sharpen your interview skills with realistic, AI-guided video mock
              interviews and personalized feedback.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
