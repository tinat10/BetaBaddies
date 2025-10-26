import { useState } from 'react'
import { Icon } from '@iconify/react'

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
      { category: 'Frontend', count: 5 },
      { category: 'Backend', count: 4 },
      { category: 'DevOps', count: 2 },
      { category: 'Design', count: 1 },
    ],
    careerTimeline: [
      { year: '2023', company: 'Tech Corp', position: 'Senior Developer' },
      { year: '2021', company: 'StartupXYZ', position: 'Full Stack Developer' },
      { year: '2019', company: 'Agency Inc', position: 'Junior Developer' },
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
    <div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full">
      {/* Welcome Header */}
      <div className="flex justify-between items-start mb-12 pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 m-0 mb-3 leading-tight">Welcome back, {profileData.name}!</h1>
        </div>
        <button 
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none rounded-xl px-7 py-4 text-base font-semibold cursor-pointer transition-all shadow-[0_4px_6px_rgba(59,130,246,0.15)] hover:shadow-lg hover:scale-105" 
          onClick={handleExportProfile}
        >
          Export Profile
        </button>
      </div>

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
