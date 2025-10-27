import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { cn } from '@/lib/utils'
import { navigationItems, ROUTES } from '@/config/routes'
import { api } from '@/services/api'

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [displayName, setDisplayName] = useState<string>('User')
  const [userEmail, setUserEmail] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Check authentication and fetch user profile
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        console.log('Navbar: Checking authentication...')
        // Try to fetch user auth first
        const userResponse = await api.getUserAuth()
        console.log('Navbar: User auth response:', userResponse)
        
        if (userResponse.ok && userResponse.data?.user) {
          setUserEmail(userResponse.data.user.email)
          setIsLoggedIn(true)
          console.log('Navbar: User is logged in:', userResponse.data.user.email)
          
          // Then try to fetch profile for full name
          try {
            const profileResponse = await api.getProfile()
            console.log('Navbar: Profile response:', profileResponse)
            
            if (profileResponse.ok && profileResponse.data?.profile) {
              const { fullName, first_name, last_name } = profileResponse.data.profile
              const name = fullName || `${first_name} ${last_name}`.trim()
              if (name) {
                setDisplayName(name)
                console.log('Navbar: Display name set to:', name)
              } else {
                // Fallback to email username
                const emailName = userResponse.data.user.email.split('@')[0]
                setDisplayName(emailName)
                console.log('Navbar: Using email username:', emailName)
              }
            }
          } catch (profileError) {
            console.log('Navbar: Profile not found, using email')
            // Profile doesn't exist yet, use email
            setDisplayName(userResponse.data.user.email.split('@')[0])
          }
        } else {
          console.log('Navbar: User not authenticated')
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('Navbar: Auth check failed:', error)
        // Not authenticated
        setIsLoggedIn(false)
      } finally {
        console.log('Navbar: Auth check complete')
        setIsCheckingAuth(false)
      }
    }

    checkAuthAndFetchProfile()
  }, [])

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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-10">
        {/* Top Row: Logo and User Profile */}
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <Icon icon="mingcute:file-list-line" width={32} height={32} className="text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900 m-0 font-sans">ATS Tracker</h1>
          </div>

          {/* User Profile Area */}
          <div className="flex items-center">
            {isCheckingAuth ? (
              <div className="flex items-center gap-2 text-slate-600">
                <Icon icon="mingcute:loading-line" width={20} height={20} className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-transparent border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50"
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-base font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-base font-medium text-slate-900">{displayName}</span>
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
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-slate-900 mb-0.5">{displayName}</div>
                      <div className="text-sm text-slate-500">{userEmail}</div>
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
                    onClick={() => navigate(ROUTES.SETTINGS)}
                  >
                    <Icon icon="mingcute:setting-line" width={20} height={20} />
                    <span>Settings</span>
                  </button>
                  <div className="h-px bg-slate-100 my-2" />
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer text-sm font-medium text-red-500 transition-colors duration-200 hover:bg-red-50"
                    onClick={async () => {
                      try {
                        await api.logout()
                      } catch (error) {
                        console.error('Logout failed:', error)
                      } finally {
                        // Always clear state and redirect, even if API fails
                        setIsLoggedIn(false)
                        setDisplayName('User')
                        setUserEmail('')
                        // Use window.location for hard redirect to clear all state
                        window.location.href = ROUTES.LOGIN
                      }
                    }}
                  >
                    <Icon icon="mingcute:logout-line" width={20} height={20} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => navigate(ROUTES.LOGIN)}
                className="px-6 py-2.5 bg-transparent border border-slate-200 rounded-lg text-sm font-medium text-slate-900 cursor-pointer transition-all duration-200 hover:bg-slate-50"
              >
                Login
              </button>
              <button 
                onClick={() => navigate(ROUTES.LOGIN)}
                className="px-6 py-2.5 bg-gradient-to-br from-blue-500 to-blue-700 border-none rounded-lg text-sm font-semibold text-white cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </button>
            </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Navigation Menu */}
        {isLoggedIn && (
          <div className="border-t border-slate-100 py-3">
            <Menubar className="border-0 bg-transparent shadow-none p-0 h-auto space-x-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <MenubarMenu key={item.id}>
                    <MenubarTrigger
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "cursor-pointer bg-transparent data-[state=open]:bg-transparent focus:bg-transparent",
                        isActive 
                          ? "bg-slate-100 text-slate-900 hover:bg-slate-100" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <Icon icon={item.icon} width={16} height={16} className="mr-2" />
                      {item.label}
                    </MenubarTrigger>
                  </MenubarMenu>
                )
              })}
            </Menubar>
          </div>
        )}
      </div>
    </nav>
  )
}

