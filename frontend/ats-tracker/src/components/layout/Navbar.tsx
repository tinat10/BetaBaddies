import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Mock user data - replace with actual authentication
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    isLoggedIn: true, // This would come from auth context
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <nav className="bg-white border-b border-slate-200 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <Icon icon="mingcute:file-list-line" width={32} height={32} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900 m-0 font-sans">ATS Tracker</h1>
        </div>

        {/* User Profile Area */}
        <div className="flex items-center">
          {user.isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-transparent border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50"
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-base font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-base font-medium text-slate-900">{user.name}</span>
                <Icon 
                  icon={isDropdownOpen ? "mingcute:up-line" : "mingcute:down-line"} 
                  width={20} 
                  height={20}
                  className="text-slate-600"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg min-w-[280px] overflow-hidden z-50">
                  <div className="p-4 flex items-center gap-3 bg-slate-50">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-slate-900 mb-0.5">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer text-sm font-medium text-slate-900 transition-colors duration-200 hover:bg-slate-50"
                    onClick={() => alert('Edit Profile')}
                  >
                    <Icon icon="mingcute:edit-line" width={20} height={20} />
                    <span>Edit Profile</span>
                  </button>
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer text-sm font-medium text-slate-900 transition-colors duration-200 hover:bg-slate-50"
                    onClick={() => alert('Settings')}
                  >
                    <Icon icon="mingcute:setting-line" width={20} height={20} />
                    <span>Settings</span>
                  </button>
                  <div className="h-px bg-slate-100 my-2" />
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer text-sm font-medium text-red-500 transition-colors duration-200 hover:bg-red-50"
                    onClick={() => alert('Logout')}
                  >
                    <Icon icon="mingcute:logout-line" width={20} height={20} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-transparent border border-slate-200 rounded-lg text-sm font-medium text-slate-900 cursor-pointer transition-all duration-200 hover:bg-slate-50">
                Login
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-br from-blue-500 to-blue-700 border-none rounded-lg text-sm font-semibold text-white cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

