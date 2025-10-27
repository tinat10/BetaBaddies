import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { DashboardProfileData } from '../types'
import { dashboardService } from '../services/dashboardService'

// Icon component for professional icons using Mingcute
function MingcuteIcon({ type }: { type: string }) {
  const iconSize = 48
  const iconMap: Record<string, string> = {
    'Employment': 'mingcute:briefcase-line',
    'Skills': 'mingcute:star-line',
    'Education': 'mingcute:school-line',
    'Projects': 'mingcute:folder-line',
  }
  
  return <Icon icon={iconMap[type]} width={iconSize} height={iconSize} />
}

export function Dashboard() {
  const [profileData, setProfileData] = useState<DashboardProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // No need to access user here - session cookie handles authentication
  // TODO: When implementing AuthContext, you may want to trigger refetch on auth state change

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Session cookie automatically identifies the user
        // Backend fetches data for the authenticated user via req.session.userId
        const data = await dashboardService.getDashboardData()
        setProfileData(data)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
        // Set default data on error
        setProfileData(dashboardService.getDefaultDashboardData())
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleQuickAdd = (section: string) => {
    alert(`Quick add for ${section} - will open modal/form`)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-slate-900 mb-2">Loading your dashboard...</div>
          <div className="text-base text-slate-500">Please wait while we fetch your data</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !profileData) {
    return (
      <div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-red-600 mb-2">Error</div>
          <div className="text-base text-slate-500">{error}</div>
        </div>
      </div>
    )
  }

  // Should never happen, but safety check
  if (!profileData) {
    return null
  }

  return (
    <div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full">

      {/* Error banner if there was an error but we have cached/default data */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800 m-0">{error}</p>
        </div>
      )}

      {/* Profile Completion Section */}
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-slate-900 m-0">Profile Completion</h2>
          <span className="text-4xl font-bold text-blue-500">{profileData.profileCompletion}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-md overflow-hidden mb-6">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300"
            style={{ width: `${profileData.profileCompletion}%` }}
          />
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-slate-900 mb-3">Suggestions to improve your profile:</h4>
          <ul className="list-none p-0 m-0">
            {profileData.suggestions.map((suggestion, index) => (
              <li key={index} className="text-base font-normal text-slate-500 py-3 border-b border-slate-100 flex items-start">
                <span className="text-blue-500 text-base mr-3 font-semibold">•</span> {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-10">
        {[
          { title: 'Employment', count: profileData.employment, icon: 'Employment', color: '#3B82F6' },
          { title: 'Skills', count: profileData.skills, icon: 'Skills', color: '#60A5FA' },
          { title: 'Education', count: profileData.education, icon: 'Education', color: '#93C5FD' },
          { title: 'Projects', count: profileData.projects, icon: 'Projects', color: '#DBEAFE' },
        ].map((section) => (
          <div key={section.title} className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] border border-slate-100 text-center transition-all cursor-pointer hover:shadow-lg" style={{ borderTop: `4px solid ${section.color}` }}>
            <div className="text-6xl mb-4 flex justify-center items-center" style={{ color: section.color }}>
              <MingcuteIcon type={section.icon} />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-0">{section.title}</h3>
            <p className="text-5xl font-bold my-3" style={{ color: section.color }}>{section.count}</p>
            <button 
              className="bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-5 py-3 text-sm font-medium cursor-pointer transition-all w-full min-h-[44px] flex items-center justify-center hover:bg-slate-100"
              onClick={() => handleQuickAdd(section.title)}
            >
              + Quick Add
            </button>
          </div>
        ))}
      </div>

      {/* Two Column Layout for Charts */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-6 mb-6">
        {/* Skills Distribution Chart */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] border border-slate-100">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">Skills Distribution</h3>
          <div className="flex flex-col gap-4">
            {profileData.skillsDistribution.map((skill, index) => {
              const colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'];
              const color = colors[index % colors.length];
              return (
                <div key={skill.category} className="mb-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-base font-medium text-slate-900">{skill.category}</span>
                    <span className="text-base font-semibold text-blue-500">{skill.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300 rounded"
                      style={{
                        width: `${(skill.count / profileData.skills) * 100}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Career Timeline */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] border border-slate-100">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">Career Timeline</h3>
          <div className="max-h-80 overflow-y-auto pr-2">
            <div className="flex flex-col gap-4">
              {profileData.careerTimeline.map((item, index) => (
                <div key={index} className="flex gap-4 relative pb-4 border-b border-slate-100 last:border-b-0">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-blue-500 mb-1">{item.year}</div>
                    <div className="text-base font-semibold text-slate-900 mb-1">{item.position}</div>
                    <div className="text-sm text-slate-500">{item.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Strength Indicators */}
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] border border-slate-100">
        <h3 className="text-2xl font-semibold text-slate-900 mb-6">Profile Strength</h3>
        <div className="flex justify-center mb-8">
          <div className="w-40 h-40 rounded-full border-8 border-blue-500 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-blue-500">{profileData.profileStrength.overall}</span>
            <span className="text-base text-slate-500">Overall</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {profileData.profileStrength.categories.map((category) => (
            <div key={category.name} className="mb-2">
              <div className="flex justify-between mb-2">
                <span className="text-base font-medium text-slate-900">{category.name}</span>
                <span className="text-base font-semibold text-blue-500">{category.score}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full transition-all duration-300 rounded"
                  style={{
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
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] border border-slate-100">
        <h3 className="text-2xl font-semibold text-slate-900 mb-6">Recent Activity</h3>
        <div className="flex flex-col gap-4">
          {profileData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-base font-medium text-slate-900 mb-1 m-0">{activity.action}</p>
                <p className="text-base text-slate-500 m-0">{activity.item}</p>
              </div>
              <span className="text-sm text-slate-500">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
