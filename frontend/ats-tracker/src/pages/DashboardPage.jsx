import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockApplications = [
      {
        id: 1,
        position: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        status: "interview",
        appliedDate: "2024-01-15",
        lastActivity: "2024-01-20",
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000",
        type: "Full-time",
        description:
          "We are looking for a senior frontend developer to join our team...",
      },
      {
        id: 2,
        position: "Product Manager",
        company: "StartupXYZ",
        status: "pending",
        appliedDate: "2024-01-18",
        lastActivity: "2024-01-18",
        location: "New York, NY",
        salary: "$100,000 - $130,000",
        type: "Full-time",
        description: "Lead product development for our core platform...",
      },
      {
        id: 3,
        position: "UX Designer",
        company: "Design Co",
        status: "offer",
        appliedDate: "2024-01-10",
        lastActivity: "2024-01-22",
        location: "Remote",
        salary: "$90,000 - $110,000",
        type: "Full-time",
        description: "Create amazing user experiences for our products...",
      },
      {
        id: 4,
        position: "Backend Developer",
        company: "DataFlow Systems",
        status: "rejected",
        appliedDate: "2024-01-05",
        lastActivity: "2024-01-12",
        location: "Austin, TX",
        salary: "$110,000 - $140,000",
        type: "Full-time",
        description: "Build scalable backend systems...",
      },
      {
        id: 5,
        position: "DevOps Engineer",
        company: "CloudTech",
        status: "pending",
        appliedDate: "2024-01-20",
        lastActivity: "2024-01-20",
        location: "Seattle, WA",
        salary: "$130,000 - $160,000",
        type: "Full-time",
        description: "Manage cloud infrastructure and deployment...",
      },
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "offer":
        return <CheckCircle size={16} className="status-icon offer" />;
      case "interview":
        return <Calendar size={16} className="status-icon interview" />;
      case "pending":
        return <Clock size={16} className="status-icon pending" />;
      case "rejected":
        return <XCircle size={16} className="status-icon rejected" />;
      default:
        return <AlertCircle size={16} className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "offer":
        return "Offer Received";
      case "interview":
        return "Interview Scheduled";
      case "pending":
        return "Pending Review";
      case "rejected":
        return "Not Selected";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "offer":
        return "var(--color-success)";
      case "interview":
        return "var(--color-primary)";
      case "pending":
        return "var(--color-warning)";
      case "rejected":
        return "var(--color-error)";
      default:
        return "var(--color-text-secondary)";
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    interviews: applications.filter((app) => app.status === "interview").length,
    offers: applications.filter((app) => app.status === "offer").length,
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.firstName}!</h1>
          <p>Here's an overview of your job applications</p>
        </div>
        <Link to="/profile" className="btn btn-primary">
          <Plus size={20} />
          Add Application
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Briefcase size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon interview">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.interviews}</div>
            <div className="stat-label">Interviews</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon offer">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.offers}</div>
            <div className="stat-label">Offers</div>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="applications-section">
        <div className="section-header">
          <h2>Recent Applications</h2>
          <div className="section-actions">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-dropdown">
              <Filter size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="applications-list">
          {filteredApplications.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={48} className="empty-icon" />
              <h3>No applications found</h3>
              <p>
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first job application"}
              </p>
              <Link to="/profile" className="btn btn-primary">
                <Plus size={20} />
                Add Application
              </Link>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="application-info">
                    <h3 className="position-title">{application.position}</h3>
                    <p className="company-name">{application.company}</p>
                    <div className="application-meta">
                      <span className="location">{application.location}</span>
                      <span className="salary">{application.salary}</span>
                      <span className="type">{application.type}</span>
                    </div>
                  </div>
                  <div className="application-status">
                    <div
                      className="status-badge"
                      style={{ color: getStatusColor(application.status) }}
                    >
                      {getStatusIcon(application.status)}
                      {getStatusText(application.status)}
                    </div>
                  </div>
                </div>

                <div className="application-details">
                  <p className="description">{application.description}</p>
                  <div className="application-dates">
                    <div className="date-item">
                      <span className="date-label">Applied:</span>
                      <span className="date-value">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Last Activity:</span>
                      <span className="date-value">
                        {new Date(
                          application.lastActivity
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="application-actions">
                  <button className="btn btn-outline btn-sm">
                    <Eye size={16} />
                    View Details
                  </button>
                  <button className="btn btn-outline btn-sm">Edit</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
