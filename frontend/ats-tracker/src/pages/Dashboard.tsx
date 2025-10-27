import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { DashboardProfileData } from '../types'
import { dashboardService } from '../services/dashboardService'

// Icon component for professional icons using Mingcute
function MingcuteIcon({ type }: { type: string }) {
  const iconSize = 40
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await dashboardService.getDashboardData()
        setProfileData(data)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
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
      <div className="p-10 max-w-[1600px] mx-auto font-poppins min-h-full flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-2xl font-semibold mb-2">Loading your dashboard...</div>
          <div className="text-base">Please wait while we fetch your data</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !profileData) {
    return (
      <div className="p-10 max-w-[1600px] mx-auto font-poppins min-h-full flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-2xl font-semibold text-red-200 mb-2">Error</div>
          <div className="text-base">{error}</div>
        </div>
      </div>
    )
  }

  // Should never happen, but safety check
  if (!profileData) {
    return null
  }

  return (
    <div className="font-poppins min-h-full">
      {/* Welcome Message */}
      <div className="max-w-[1600px] mx-auto p-10 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="mb-2" style={{ fontFamily: 'Poppins', fontSize: '64px', fontWeight: 100 }}>
            Welcome Back, <span style={{ fontFamily: 'Poppins', fontSize: '64px', fontWeight: 600, color: '#3351FD' }}>{profileData.name}</span>
          </h2>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] border border-[#3351FD] rounded-md text-sm font-medium text-[#3351FD] cursor-pointer transition-all hover:bg-[#3351FD] hover:text-white"
            onClick={() => alert('Export Profile - Coming soon!')}
          >
            <Icon icon="mingcute:download-line" width={20} height={20} />
            Export Profile
          </button>
        </div>
      </div>

      {/* Error banner if there was an error but we have cached/default data */}
      {error && (
        <div className="max-w-[1600px] mx-auto px-10 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800 m-0">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content Layout with Gradient behind cards only */}
      <div className="relative -mt-8 pb-4">
        {/* Gradient Background - positioned behind right column, extends to screen edge */}
        <div 
          className="absolute inset-y-0 pointer-events-none"
          style={{ 
            left: '27%',
            right: 0,
            top: '5%',
            bottom: 0,
            background: 'linear-gradient(180deg, #B1D0FF 0%, #EC85CA 100%)',
            borderTopLeftRadius: '25px'
          }}
        />
        <div className="max-w-[1600px] mx-auto px-10 pb-4 pt-24">
          <div className="grid grid-cols-[350px_1fr] gap-8 relative">
          
          {/* Left Sidebar */}
          <div className="space-y-6 relative z-10">
           {/* Career Timeline */}
           <div>
             <h3 className="text-base font-semibold text-black mb-4" style={{ fontFamily: 'Poppins' }}>Career Timeline</h3>
             <div className="space-y-4">
               {profileData.careerTimeline.length > 0 ? (
                 profileData.careerTimeline.map((item, index) => (
                   <div key={index} className="flex items-start gap-3">
                     <div className="flex flex-col items-center flex-shrink-0">
                       <div className="w-2 h-2 rounded-full bg-[#3351FD] mt-1.5" />
                       {index < profileData.careerTimeline.length - 1 && (
                         <div className="w-px h-full bg-slate-300 mt-2 min-h-[60px]" />
                       )}
                     </div>
                     <div className="flex-1 pb-4">
                       <div className="text-xs font-medium" style={{ color: '#525252' }}>{item.year}</div>
                       <div className="text-sm font-semibold" style={{ color: '#161616', marginTop: '2px' }}>{item.position}</div>
                       <div className="text-xs" style={{ color: '#525252', marginTop: '2px' }}>@{item.company}</div>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="text-xs" style={{ color: '#525252' }}>No career timeline data yet</div>
               )}
             </div>
           </div>

           {/* Recent Activity */}
           <div>
             <h3 className="text-base font-semibold text-black mb-4" style={{ fontFamily: 'Poppins' }}>Recent Activity</h3>
             <div className="space-y-4">
               {profileData.recentActivity.length > 0 ? (
                 profileData.recentActivity.map((activity, index) => (
                   <div key={activity.id} className="flex items-start gap-3">
                     <div className="flex flex-col items-center flex-shrink-0">
                       <div className="w-2 h-2 rounded-full bg-[#3351FD] mt-1.5" />
                       {index < profileData.recentActivity.length - 1 && (
                         <div className="w-px h-full bg-slate-300 mt-2 min-h-[50px]" />
                       )}
                     </div>
                     <div className="flex-1 pb-4">
                       <div className="text-xs font-medium" style={{ color: '#161616' }}>{activity.action}</div>
                       <div className="text-xs" style={{ color: '#525252', marginTop: '2px' }}>{activity.timestamp}</div>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="flex items-center">
                   <div className="flex flex-col items-center flex-shrink-0 mr-3">
                     <div className="w-2 h-2 rounded-full bg-[#3351FD] mt-1.5" />
                   </div>
                   <div className="text-xs" style={{ color: '#525252' }}>No recent activity</div>
                 </div>
               )}
             </div>
           </div>
                  </div>

          {/* Right Main Content - Bento Grid */}
          <div className="-ml-6 relative z-10">
            <div className="grid grid-cols-[373px_373px_374px] gap-6 auto-rows-auto">
          {/* Profile Completion Card - Row 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200" style={{ gridColumn: 'span 2 / span 2' }}>
            <h3 className="text-3xl font-medium text-slate-900 mb-6">Profile Completion</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-6 bg-slate-200 rounded-2xl overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 rounded-l-2xl"
                  style={{ width: `${profileData.profileCompletion}%` }}
                />
              </div>
              <div className="text-3xl font-medium text-slate-900">{profileData.profileCompletion}%</div>
            </div>
            <p className="text-base text-slate-500 mb-4">The profile is {profileData.profileCompletion}% complete</p>
            <h4 className="text-lg font-medium text-slate-900 mb-3">Recommended Actions ({profileData.suggestions.length})</h4>
            <ul className="space-y-1">
              {profileData.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-slate-600">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Strength Card - Row 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-medium text-slate-900">Profile Strength</h3>
              <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex flex-col items-center justify-center bg-white">
                <span className="text-2xl font-medium text-blue-500">{profileData.profileStrength.overall}</span>
                <span className="text-xs text-slate-500">Overall</span>
              </div>
            </div>
            <div className="space-y-3">
              {profileData.profileStrength.categories.map((category) => (
                <div key={category.name}>
                  <div className="text-sm font-normal text-slate-700 mb-1">{category.name}</div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${category.score}%`,
                        backgroundColor: category.score >= 80 ? '#22C55E' : category.score >= 60 ? '#FFD53F' : '#ED0101'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employment Card - Row 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative">
            <div className="absolute top-5 right-5">
              <MingcuteIcon type="Employment" />
            </div>
            <h3 className="text-3xl font-medium text-slate-900 mb-12">Employment</h3>
            <div className="text-8xl font-medium text-slate-900 mb-12 text-center" style={{ fontFamily: 'Poppins' }}>{profileData.employment}</div>
            <button 
              className="w-full bg-blue-500 text-white rounded-md py-2 text-sm font-medium cursor-pointer transition-all hover:bg-blue-600"
              onClick={() => handleQuickAdd('Employment')}
            >
              Quick Add
            </button>
          </div>

          {/* Skills Card - Row 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative">
            <div className="absolute top-5 right-5">
              <MingcuteIcon type="Skills" />
            </div>
            <h3 className="text-3xl font-medium text-slate-900 mb-12">Skills</h3>
            <div className="text-8xl font-medium text-slate-900 mb-12 text-center" style={{ fontFamily: 'Poppins' }}>{profileData.skills}</div>
            <button 
              className="w-full bg-blue-500 text-white rounded-md py-2 text-sm font-medium cursor-pointer transition-all hover:bg-blue-600"
              onClick={() => handleQuickAdd('Skills')}
            >
              Quick Add
            </button>
          </div>

          {/* Education Card - Row 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative">
            <div className="absolute top-5 right-5">
              <MingcuteIcon type="Education" />
            </div>
            <h3 className="text-3xl font-medium text-slate-900 mb-12">Education</h3>
            <div className="text-8xl font-medium text-slate-900 mb-12 text-center" style={{ fontFamily: 'Poppins' }}>{profileData.education}</div>
            <button 
              className="w-full bg-blue-500 text-white rounded-md py-2 text-sm font-medium cursor-pointer transition-all hover:bg-blue-600"
              onClick={() => handleQuickAdd('Education')}
            >
              Quick Add
            </button>
          </div>

          {/* Projects Card - Row 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative">
            <div className="absolute top-5 right-5">
              <MingcuteIcon type="Projects" />
            </div>
            <h3 className="text-3xl font-medium text-slate-900 mb-12">Projects</h3>
            <div className="text-8xl font-medium text-slate-900 mb-12 text-center" style={{ fontFamily: 'Poppins' }}>{profileData.projects}</div>
            <button 
              className="w-full bg-blue-500 text-white rounded-md py-2 text-sm font-medium cursor-pointer transition-all hover:bg-blue-600"
              onClick={() => handleQuickAdd('Projects')}
            >
              Quick Add
            </button>
          </div>

          {/* Skill Distribution Card - Row 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200" style={{ gridColumn: 'span 2 / span 2' }}>
            <h3 className="text-3xl font-medium text-slate-900 mb-6">Skill Distribution</h3>
            <div className="space-y-4">
              {profileData.skillsDistribution.map((skill) => (
                <div key={skill.category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-normal text-slate-700">{skill.category}</span>
                    <span className="text-sm font-medium text-blue-500">{skill.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                      style={{
                        width: `${profileData.skills > 0 ? (skill.count / profileData.skills) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
