import { Icon } from '@iconify/react'
import { useNavigate, useLocation } from 'react-router-dom'

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'mingcute:home-line', path: '/' },
    { id: 'profile', label: 'Basic Information', icon: 'mingcute:user-line', path: '/basic-information' },
    { id: 'employment', label: 'Employment', icon: 'mingcute:briefcase-line', path: '/employment' },
    { id: 'skills', label: 'Skills', icon: 'mingcute:star-line', path: '/skills' },
    { id: 'education', label: 'Education', icon: 'mingcute:school-line', path: '/education' },
    { id: 'projects', label: 'Projects', icon: 'mingcute:folder-line', path: '/projects' },
    { id: 'certifications', label: 'Certifications', icon: 'mingcute:award-line', path: '/certifications' },
    { id: 'settings', label: 'Settings', icon: 'mingcute:setting-line', path: '/settings' },
  ]

  const handleItemClick = (path: string) => {
    navigate(path)
  }

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col w-64">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Icon icon="mingcute:file-list-line" width={24} height={24} className="text-gray-600" />
          <span className="text-lg font-semibold text-gray-800">Menu</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon 
                    icon={item.icon} 
                    width={20} 
                    height={20} 
                    className={isActive ? 'text-gray-700' : 'text-gray-500'}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">
          ATS Tracker v1.0
        </div>
      </div>
    </div>
  )
}
