import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { DashboardProfileData } from '../types'
import { dashboardService } from '../services/dashboardService'
import { ROUTES } from '../config/routes'
import { exportProfileToPDF } from '../utils/pdfExport'

export function Dashboard() {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<DashboardProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

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
    switch (section) {
      case 'Employment':
        navigate(ROUTES.EMPLOYMENT)
        break
      case 'Skills':
        navigate(ROUTES.SKILLS)
        break
      case 'Education':
        navigate(ROUTES.EDUCATION)
        break
      case 'Projects':
        navigate(ROUTES.PROJECTS)
        break
      default:
        console.warn(`Unknown section: ${section}`)
    }
  }

  const handleExportProfile = async () => {
    if (!profileData) return
    
    try {
      setIsExporting(true)
      await exportProfileToPDF(profileData)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export profile. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full xl:max-w-[1600px] mx-auto font-poppins min-h-full flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-xl sm:text-2xl font-semibold mb-2">Loading your dashboard...</div>
          <div className="text-sm sm:text-base">Please wait while we fetch your data</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !profileData) {
    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-full xl:max-w-[1600px] mx-auto font-poppins min-h-full flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-xl sm:text-2xl font-semibold text-red-200 mb-2">Error</div>
          <div className="text-sm sm:text-base">{error}</div>
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
      <div className="max-w-full xl:max-w-[1600px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 pb-3 sm:pb-4 md:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="mb-0" style={{ fontFamily: 'Poppins', fontSize: 'clamp(28px, 5vw, 64px)', fontWeight: 100 }}>
            Welcome Back, <span style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#3351FD' }}>{profileData.name}</span>
          </h2>
          <button 
            className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-[#F9FAFB] border border-[#3351FD] rounded-md text-xs sm:text-sm font-medium text-[#3351FD] cursor-pointer transition-all hover:bg-[#3351FD] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            onClick={handleExportProfile}
            disabled={isExporting || !profileData}
          >
            <Icon icon={isExporting ? "mingcute:loading-line" : "mingcute:download-line"} width={18} height={18} className={isExporting ? "animate-spin" : ""} />
            {isExporting ? 'Exporting...' : 'Export Profile'}
          </button>
        </div>
      </div>

      {/* Error banner if there was an error but we have cached/default data */}
      {error && (
        <div className="max-w-full xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800 m-0">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content Layout with Gradient behind cards only */}
      <div className="relative sm:-mt-4 md:-mt-6 lg:-mt-8 pb-4">
        <div className="max-w-full xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-4 pt-8 sm:pt-12 md:pt-16 lg:pt-24 relative">
          {/* Gradient Background - hidden on mobile, visible on larger screens */}
          <div 
            className="absolute pointer-events-none hidden lg:block"
            style={{ 
              left: 'calc(350px + 2rem - 1.5rem)',
              right: '-10rem',
              top: '5%',
              bottom: '-1rem',
              background: 'linear-gradient(180deg, #B1D0FF 0%, #EC85CA 100%)',
              borderTopLeftRadius: '25px'
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 md:gap-8 relative">
          
          {/* Left Sidebar */}
          <div className="space-y-6 relative z-10">
           {/* Career Timeline */}
           <div>
             <h3 className="text-base font-semibold text-black mb-4" style={{ fontFamily: 'Poppins' }}>Career Timeline</h3>
             <div className="space-y-4">
               {profileData.careerTimeline.length > 0 ? (
                 profileData.careerTimeline.map((item, index) => (
                   <div key={item.id} className="flex items-start gap-3">
                     <div className="flex flex-col items-center flex-shrink-0">
                       <div className={`w-3 h-3 rounded-full mt-1.5 ${
                         item.isCurrent ? 'bg-green-500' : 'bg-[#3351FD]'
                       }`} />
                       {index < profileData.careerTimeline.length - 1 && (
                         <div className="w-px h-full bg-slate-300 mt-2 min-h-[80px]" />
                       )}
                     </div>
                     <div className="flex-1 pb-4">
                       <div className="text-sm font-semibold" style={{ color: '#161616', marginBottom: '2px' }}>
                         {item.position}
                       </div>
                       <div className="text-xs font-medium" style={{ color: '#525252', marginBottom: '2px' }}>
                         {item.company}
                         {item.location && ` • ${item.location}`}
                       </div>
                       <div className="text-xs" style={{ color: '#525252', marginBottom: '2px' }}>
                         {formatDate(item.startDate)} - {item.isCurrent ? 'Present' : formatDate(item.endDate)}
                       </div>
                       {item.duration && (
                         <div className="text-xs" style={{ color: '#525252' }}>
                           {item.duration}
                         </div>
                       )}
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
          <div className="lg:-ml-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
          {/* Profile Completion Card - Row 1 */}
          <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200 md:col-span-2 xl:col-span-2">
            <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-4 md:mb-6">Profile Completion</h3>
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="flex-1 h-5 md:h-6 bg-slate-200 rounded-2xl overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 rounded-l-2xl"
                  style={{ width: `${profileData.profileCompletion}%` }}
                />
              </div>
              <div className="text-2xl md:text-3xl font-medium text-slate-900">{profileData.profileCompletion}%</div>
            </div>
            <p className="text-sm md:text-base text-slate-500 mb-4">The profile is {profileData.profileCompletion}% complete</p>
            <h4 className="text-base md:text-lg font-medium text-slate-900 mb-3">Recommended Actions ({profileData.suggestions.length})</h4>
            <ul className="space-y-1">
              {profileData.suggestions.map((suggestion, index) => (
                <li key={index} className="text-xs md:text-sm text-slate-600">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Strength Card - Row 1 */}
          <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <h3 className="text-2xl md:text-3xl font-medium text-slate-900">Profile Strength</h3>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-blue-500 flex flex-col items-center justify-center bg-white flex-shrink-0">
                <span className="text-xl md:text-2xl font-medium text-blue-500">{profileData.profileStrength.overall}</span>
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
          <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200 relative">
            <div className="absolute top-4 right-4 md:top-5 md:right-5">
              <Icon icon="mingcute:briefcase-line" width={32} height={32} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 md:mb-12">Employment</h3>
            <div className="text-6xl md:text-8xl font-medium text-slate-900 mb-8 md:mb-12 text-center" style={{ fontFamily: 'Poppins' }}>{profileData.employment}</div>
            <button 
              className="w-full bg-blue-500 text-white rounded-md py-2.5 text-sm font-medium cursor-pointer transition-all hover:bg-blue-600"
              onClick={() => handleQuickAdd('Employment')}
            >
              Quick Add
            </button>
          </div>

          {/* Skills Card - Row 2 */}
          <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200 relative">
            <div className="absolute top-4 right-4 md:top-5 md:right-5">
              <Icon icon="mingcute:star-line" width={32} height={32} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 md:mb-12">Skills</h3>
            <div className="text-6xl md:text-8xl font-medium text-slate-900 mb-8 md:mb-12 text-center" style={{ fontFamily: 'Poppins' }}>{profileData.skills}</div>
            <button 
              className="w-full bg-blue-500 text-white rounded-md py-2.5 text-sm font-medium cursor-pointer transition-all hover:bg-blue-600"
              onClick={() => handleQuickAdd('Skills')}
            >
              Quick Add
            </button>
          </div>

          {/* Education Card - Row 2 */}
          <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200 relative">
            <div className="absolute top-4 right-4 md:top-5 md:right-5">
              <Icon icon="mingcute:school-line" width={32} height={32} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 md:mb-12">Education</h3>
            <div className="text-6xl md:text-8xl font-medium text-slate-900 mb-8 md:mb-12 text-center" style={{ fontFamily: 'Poppins' }}>{profileData.education}</div>
            <button 
              className="w-full bg-blue-500 text-white rounded-md py-2.5 text-sm font-medium cursor-pointer transition-all hover:bg-blue-600"
              onClick={() => handleQuickAdd('Education')}
            >
              Quick Add
            </button>
          </div>

          {/* Projects Card - Row 3 */}
          <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200 relative">
            <div className="absolute top-4 right-4 md:top-5 md:right-5">
              <Icon icon="mingcute:folder-line" width={32} height={32} className="md:w-10 md:h-10" />
            </div>
            <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 md:mb-12">Projects</h3>
            <div className="text-6xl md:text-8xl font-medium text-slate-900 mb-8 md:mb-12 text-center" style={{ fontFamily: 'Poppins' }}>{profileData.projects}</div>
            <button 
              className="w-full bg-blue-500 text-white rounded-md py-2.5 text-sm font-medium cursor-pointer transition-all hover:bg-blue-600"
              onClick={() => handleQuickAdd('Projects')}
            >
              Quick Add
            </button>
          </div>

          {/* Skill Distribution Card - Row 3 */}
          <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-200 md:col-span-2 xl:col-span-2">
            <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-4 md:mb-6">Skill Distribution</h3>
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

// Helper function to format dates
function formatDate(dateString?: string): string {
  if (!dateString) return 'Not specified'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
}
