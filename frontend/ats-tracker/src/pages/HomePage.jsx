import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import "./HomePage.css";

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <BarChart3 size={24} />,
      title: "Track Applications",
      description:
        "Monitor all your job applications in one centralized dashboard with real-time status updates.",
    },
    {
      icon: <Users size={24} />,
      title: "Professional Network",
      description:
        "Connect with recruiters and hiring managers to expand your professional network.",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security and privacy controls.",
    },
    {
      icon: <Zap size={24} />,
      title: "Smart Insights",
      description:
        "Get AI-powered insights and recommendations to improve your job search success.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50,000+", label: "Applications Tracked" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Take Control of Your
              <span className="text-gradient"> Job Search</span>
            </h1>
            <p className="hero-description">
              The ultimate ATS for candidates. Track applications, manage your
              professional profile, and land your dream job with confidence.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started Free
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <div className="preview-title">Dashboard</div>
              </div>
              <div className="preview-content">
                <div className="preview-card">
                  <div className="card-header">
                    <div className="card-title">Recent Applications</div>
                    <div className="card-badge">5</div>
                  </div>
                  <div className="card-list">
                    <div className="list-item">
                      <div className="item-info">
                        <div className="item-title">Senior Developer</div>
                        <div className="item-company">Tech Corp</div>
                      </div>
                      <div className="item-status pending">Pending</div>
                    </div>
                    <div className="list-item">
                      <div className="item-info">
                        <div className="item-title">Product Manager</div>
                        <div className="item-company">StartupXYZ</div>
                      </div>
                      <div className="item-status interview">Interview</div>
                    </div>
                    <div className="list-item">
                      <div className="item-info">
                        <div className="item-title">UX Designer</div>
                        <div className="item-company">Design Co</div>
                      </div>
                      <div className="item-status offer">Offer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need to succeed</h2>
            <p>
              Powerful features designed to streamline your job search process
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to land your dream job?</h2>
            <p>
              Join thousands of professionals who have already transformed their
              job search experience.
            </p>
            {!user && (
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-large">
                  Start Your Journey
                  <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-large">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
