import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Camera,
} from "lucide-react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    headline: user?.headline || "",
    bio: user?.bio || "",
    industry: user?.industry || "",
    experienceLevel: user?.experienceLevel || "",
    profilePicture: user?.profilePicture || null,
  });

  const [employmentHistory, setEmploymentHistory] = useState([
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2022-01-01",
      endDate: null,
      current: true,
      description:
        "Led development of core platform features and mentored junior developers.",
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      startDate: "2020-06-01",
      endDate: "2021-12-31",
      current: false,
      description: "Developed full-stack applications using React and Node.js.",
    },
  ]);

  const [skills, setSkills] = useState([
    { id: 1, name: "JavaScript", category: "Technical", proficiency: "Expert" },
    { id: 2, name: "React", category: "Technical", proficiency: "Expert" },
    { id: 3, name: "Node.js", category: "Technical", proficiency: "Advanced" },
    {
      id: 4,
      name: "Python",
      category: "Technical",
      proficiency: "Intermediate",
    },
    {
      id: 5,
      name: "Leadership",
      category: "Soft Skills",
      proficiency: "Advanced",
    },
    {
      id: 6,
      name: "Communication",
      category: "Soft Skills",
      proficiency: "Expert",
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of California, Berkeley",
      graduationDate: "2020-05-01",
      gpa: "3.8",
      achievements: "Magna Cum Laude, Dean's List",
    },
  ]);

  const [certifications, setCertifications] = useState([
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      dateEarned: "2023-03-15",
      expirationDate: "2026-03-15",
      credentialId: "AWS-SAA-123456",
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with React frontend and Node.js backend",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      role: "Full-stack Developer",
      startDate: "2023-01-01",
      endDate: "2023-06-30",
      status: "Completed",
      url: "https://github.com/username/ecommerce-platform",
    },
  ]);

  const [activeTab, setActiveTab] = useState("overview");

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      headline: user?.headline || "",
      bio: user?.bio || "",
      industry: user?.industry || "",
      experienceLevel: user?.experienceLevel || "",
      profilePicture: user?.profilePicture || null,
    });
    setIsEditing(false);
  };

  const calculateProfileCompleteness = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "headline",
      "bio",
    ];
    const filledFields = requiredFields.filter((field) => profileData[field]);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "projects", label: "Projects", icon: Code },
  ];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-picture-section">
          <div className="profile-picture">
            {profileData.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" />
            ) : (
              <User size={48} />
            )}
            {isEditing && (
              <button className="upload-button">
                <Camera size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="profile-info">
          <h1>
            {isEditing ? (
              <input
                type="text"
                value={`${profileData.firstName} ${profileData.lastName}`}
                onChange={(e) => {
                  const [firstName, ...lastName] = e.target.value.split(" ");
                  handleInputChange("firstName", firstName || "");
                  handleInputChange("lastName", lastName.join(" ") || "");
                }}
                className="name-input"
              />
            ) : (
              `${profileData.firstName} ${profileData.lastName}`
            )}
          </h1>
          {isEditing ? (
            <input
              type="text"
              value={profileData.headline}
              onChange={(e) => handleInputChange("headline", e.target.value)}
              placeholder="Professional headline"
              className="headline-input"
            />
          ) : (
            <p className="headline">
              {profileData.headline || "Add your professional headline"}
            </p>
          )}
          <div className="profile-meta">
            <div className="meta-item">
              <Mail size={16} />
              <span>{profileData.email}</span>
            </div>
            {profileData.phone && (
              <div className="meta-item">
                <Phone size={16} />
                <span>{profileData.phone}</span>
              </div>
            )}
            {profileData.location && (
              <div className="meta-item">
                <MapPin size={16} />
                <span>{profileData.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="profile-actions">
          {isEditing ? (
            <div className="edit-actions">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="btn btn-primary"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={handleCancelEdit} className="btn btn-outline">
                <X size={16} />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Completeness */}
      <div className="profile-completeness">
        <div className="completeness-header">
          <h3>Profile Completeness</h3>
          <span className="completeness-percentage">
            {calculateProfileCompleteness()}%
          </span>
        </div>
        <div className="completeness-bar">
          <div
            className="completeness-fill"
            style={{ width: `${calculateProfileCompleteness()}%` }}
          />
        </div>
        <p className="completeness-text">
          Complete your profile to increase your visibility to employers
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="bio-section">
              <h3>About</h3>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="bio-textarea"
                  rows={4}
                />
              ) : (
                <p className="bio-text">
                  {profileData.bio ||
                    "Add a bio to tell employers about yourself"}
                </p>
              )}
            </div>

            <div className="basic-info-section">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Industry</label>
                  {isEditing ? (
                    <select
                      value={profileData.industry}
                      onChange={(e) =>
                        handleInputChange("industry", e.target.value)
                      }
                      className="info-select"
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span>{profileData.industry || "Not specified"}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>Experience Level</label>
                  {isEditing ? (
                    <select
                      value={profileData.experienceLevel}
                      onChange={(e) =>
                        handleInputChange("experienceLevel", e.target.value)
                      }
                      className="info-select"
                    >
                      <option value="">Select level</option>
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </select>
                  ) : (
                    <span>
                      {profileData.experienceLevel || "Not specified"}
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Phone number"
                      className="info-input"
                    />
                  ) : (
                    <span>{profileData.phone || "Not provided"}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, State"
                      className="info-input"
                    />
                  ) : (
                    <span>{profileData.location || "Not specified"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "employment" && (
          <div className="employment-tab">
            <div className="section-header">
              <h3>Employment History</h3>
              <button className="btn btn-primary">
                <Plus size={16} />
                Add Experience
              </button>
            </div>
            <div className="employment-list">
              {employmentHistory.map((job) => (
                <div key={job.id} className="employment-card">
                  <div className="employment-header">
                    <div className="employment-info">
                      <h4>{job.title}</h4>
                      <p className="company">{job.company}</p>
                      <p className="location">{job.location}</p>
                      <p className="dates">
                        {new Date(job.startDate).toLocaleDateString()} -
                        {job.current
                          ? " Present"
                          : new Date(job.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="employment-actions">
                      <button className="btn btn-outline btn-sm">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-outline btn-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="description">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="skills-tab">
            <div className="section-header">
              <h3>Skills</h3>
              <button className="btn btn-primary">
                <Plus size={16} />
                Add Skill
              </button>
            </div>
            <div className="skills-grid">
              {skills.map((skill) => (
                <div key={skill.id} className="skill-card">
                  <div className="skill-info">
                    <h4>{skill.name}</h4>
                    <span className="skill-category">{skill.category}</span>
                  </div>
                  <div className="skill-proficiency">
                    <span
                      className={`proficiency-badge ${skill.proficiency.toLowerCase()}`}
                    >
                      {skill.proficiency}
                    </span>
                  </div>
                  <div className="skill-actions">
                    <button className="btn btn-outline btn-sm">
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add other tabs here */}
      </div>
    </div>
  );
};

export default ProfilePage;
