import { useState } from 'react'

export function Dashboard() {
  // Mock data - will be replaced with API calls later
  const [profileData] = useState({
    name: 'John Doe',
    profileCompletion: 75,
    employment: 3,
    skills: 12,
    education: 2,
    projects: 5,
    recentActivity: [
      { id: 1, action: 'Added new skill', item: 'React', timestamp: '2 hours ago' },
      { id: 2, action: 'Updated employment', item: 'Software Engineer at Google', timestamp: '1 day ago' },
      { id: 3, action: 'Added project', item: 'E-commerce Platform', timestamp: '2 days ago' },
      { id: 4, action: 'Added education', item: 'BS Computer Science', timestamp: '3 days ago' },
    ],
    skillsDistribution: [
      { category: 'Frontend', count: 5, color: '#3351FD' },
      { category: 'Backend', count: 4, color: '#6A94EE' },
      { category: 'DevOps', count: 2, color: '#B1D0FF' },
      { category: 'Design', count: 1, color: '#EC85CA' },
    ],
    careerTimeline: [
      { year: '2023', company: 'Tech Corp', position: 'Senior Developer', color: '#3351FD' },
      { year: '2021', company: 'StartupXYZ', position: 'Full Stack Developer', color: '#6A94EE' },
      { year: '2019', company: 'Agency Inc', position: 'Junior Developer', color: '#B1D0FF' },
    ],
    suggestions: [
      'Add more project descriptions to improve profile visibility',
      'Complete your education section with GPA information',
      'Add certifications to strengthen your profile',
    ],
    profileStrength: {
      overall: 75,
      categories: [
        { name: 'Employment History', score: 85 },
        { name: 'Skills & Expertise', score: 90 },
        { name: 'Education', score: 60 },
        { name: 'Projects Portfolio', score: 70 },
      ]
    }
  })

  const handleExportProfile = () => {
    alert('Export profile functionality - will download PDF/JSON')
  }

  const handleQuickAdd = (section: string) => {
    alert(`Quick add for ${section} - will open modal/form`)
  }

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Profile Dashboard</h1>
          <p style={styles.description}>Welcome back, {profileData.name}! Here's your profile overview.</p>
        </div>
        <button style={styles.primaryButton} onClick={handleExportProfile}>
          📥 Export Profile
        </button>
      </div>

      {/* Profile Completion Section */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.h2}>Profile Completion</h2>
          <span style={styles.completionPercentage}>{profileData.profileCompletion}%</span>
        </div>
        <div style={styles.progressBarContainer}>
          <div 
            style={{
              ...styles.progressBar,
              width: `${profileData.profileCompletion}%`
            }}
          />
        </div>
        <div style={styles.suggestions}>
          <h4 style={styles.h4}>Suggestions to improve your profile:</h4>
          <ul style={styles.suggestionList}>
            {profileData.suggestions.map((suggestion, index) => (
              <li key={index} style={styles.suggestionItem}>
                💡 {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { title: 'Employment', count: profileData.employment, icon: '💼', color: '#3351FD' },
          { title: 'Skills', count: profileData.skills, icon: '⚡', color: '#6A94EE' },
          { title: 'Education', count: profileData.education, icon: '🎓', color: '#B1D0FF' },
          { title: 'Projects', count: profileData.projects, icon: '🚀', color: '#EC85CA' },
        ].map((section) => (
          <div key={section.title} style={{...styles.summaryCard, borderTop: `4px solid ${section.color}`}}>
            <div style={styles.summaryIcon}>{section.icon}</div>
            <h3 style={styles.h3}>{section.title}</h3>
            <p style={styles.summaryCount}>{section.count}</p>
            <button 
              style={styles.secondaryButton}
              onClick={() => handleQuickAdd(section.title)}
            >
              + Add New
            </button>
          </div>
        ))}
      </div>

      {/* Two Column Layout for Charts */}
      <div style={styles.chartsRow}>
        {/* Skills Distribution Chart */}
        <div style={styles.card}>
          <h3 style={styles.cardHeader}>Skills Distribution</h3>
          <div style={styles.chartContainer}>
            {profileData.skillsDistribution.map((skill) => (
              <div key={skill.category} style={styles.chartItem}>
                <div style={styles.chartLabel}>
                  <span style={styles.chartLabelText}>{skill.category}</span>
                  <span style={styles.chartCount}>{skill.count}</span>
                </div>
                <div style={styles.chartBarContainer}>
                  <div 
                    style={{
                      ...styles.chartBar,
                      width: `${(skill.count / profileData.skills) * 100}%`,
                      backgroundColor: skill.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Timeline */}
        <div style={styles.card}>
          <h3 style={styles.cardHeader}>Career Timeline</h3>
          <div style={styles.timelineContainer}>
            {profileData.careerTimeline.map((item, index) => (
              <div key={index} style={styles.timelineItem}>
                <div style={{...styles.timelineDot, backgroundColor: item.color}} />
                <div style={styles.timelineContent}>
                  <div style={styles.timelineYear}>{item.year}</div>
                  <div style={styles.timelinePosition}>{item.position}</div>
                  <div style={styles.timelineCompany}>{item.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Strength Indicators */}
      <div style={styles.card}>
        <h3 style={styles.cardHeader}>Profile Strength</h3>
        <div style={styles.strengthOverall}>
          <div style={styles.strengthCircle}>
            <span style={styles.strengthScore}>{profileData.profileStrength.overall}</span>
            <span style={styles.strengthLabel}>Overall</span>
          </div>
        </div>
        <div style={styles.strengthCategories}>
          {profileData.profileStrength.categories.map((category) => (
            <div key={category.name} style={styles.strengthCategory}>
              <div style={styles.strengthCategoryHeader}>
                <span style={styles.strengthCategoryName}>{category.name}</span>
                <span style={styles.strengthCategoryScore}>{category.score}%</span>
              </div>
              <div style={styles.strengthBarContainer}>
                <div 
                  style={{
                    ...styles.strengthBar,
                    width: `${category.score}%`,
                    backgroundColor: category.score >= 80 ? '#4DF744' : category.score >= 60 ? '#FFD53F' : '#ED0101'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div style={styles.card}>
        <h3 style={styles.cardHeader}>Recent Activity</h3>
        <div style={styles.activityList}>
          {profileData.recentActivity.map((activity) => (
            <div key={activity.id} style={styles.activityItem}>
              <div style={styles.activityDot} />
              <div style={styles.activityContent}>
                <p style={styles.activityAction}>{activity.action}</p>
                <p style={styles.activityItem}>{activity.item}</p>
              </div>
              <span style={styles.activityTimestamp}>{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Styles based on your design system
const styles = {
  dashboard: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#FAFAFA',
    fontFamily: 'Poppins, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  h1: {
    fontSize: '64px',
    fontWeight: 'bold',
    color: '#000000',
    margin: '0 0 8px 0',
  },
  h2: {
    fontSize: '48px',
    fontWeight: '600',
    color: '#000000',
    margin: '0',
  },
  h3: {
    fontSize: '36px',
    fontWeight: '500',
    color: '#000000',
    margin: '16px 0',
  },
  h4: {
    fontSize: '28px',
    fontWeight: '500',
    color: '#000000',
    margin: '16px 0 12px 0',
  },
  description: {
    fontSize: '25px',
    fontWeight: '300',
    color: '#666',
    margin: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '15px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    fontSize: '36px',
    fontWeight: '500',
    color: '#000000',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completionPercentage: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#3351FD',
  },
  progressBarContainer: {
    width: '100%',
    height: '24px',
    backgroundColor: '#E5E5E5',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3351FD',
    transition: 'width 0.3s ease',
  },
  suggestions: {
    marginTop: '16px',
  },
  suggestionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  suggestionItem: {
    fontSize: '22px',
    fontWeight: '300',
    color: '#666',
    padding: '12px 0',
    borderBottom: '1px solid #E5E5E5',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '15px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  summaryIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  summaryCount: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#3351FD',
    margin: '8px 0 16px 0',
  },
  primaryButton: {
    backgroundColor: '#3351FD',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '22px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.2s ease',
  },
  secondaryButton: {
    backgroundColor: '#6A94EE',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    width: '100%',
    transition: 'background-color 0.2s ease',
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  chartItem: {
    marginBottom: '8px',
  },
  chartLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  chartLabelText: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#000000',
  },
  chartCount: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#3351FD',
  },
  chartBarContainer: {
    width: '100%',
    height: '32px',
    backgroundColor: '#F0F0F0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '8px',
  },
  timelineContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    position: 'relative' as const,
  },
  timelineDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '4px',
  },
  timelineContent: {
    flex: 1,
  },
  timelineYear: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3351FD',
    marginBottom: '4px',
  },
  timelinePosition: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#000000',
    marginBottom: '4px',
  },
  timelineCompany: {
    fontSize: '18px',
    color: '#666',
  },
  strengthOverall: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  strengthCircle: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    border: '12px solid #3351FD',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthScore: {
    fontSize: '64px',
    fontWeight: 'bold',
    color: '#3351FD',
  },
  strengthLabel: {
    fontSize: '22px',
    color: '#666',
  },
  strengthCategories: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  strengthCategory: {
    marginBottom: '8px',
  },
  strengthCategoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  strengthCategoryName: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#000000',
  },
  strengthCategoryScore: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#3351FD',
  },
  strengthBarContainer: {
    width: '100%',
    height: '24px',
    backgroundColor: '#F0F0F0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '12px',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  activityItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#FAFAFA',
    borderRadius: '12px',
  },
  activityDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#3351FD',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#000000',
    margin: '0 0 4px 0',
  },
  activityTimestamp: {
    fontSize: '18px',
    color: '#666',
  },
} as const

