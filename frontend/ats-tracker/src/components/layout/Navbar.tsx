import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { cn } from '@/lib/utils'
import { navigationItems, ROUTES } from '@/config/routes'
import { api } from '@/services/api'
import logo from '@/assets/logo.png'

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [displayName, setDisplayName] = useState<string>('User')
  const [userEmail, setUserEmail] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, isMobileMenuOpen])

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-full xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Top Row: Logo, Navigation, and User Profile */}
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="ATS Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 m-0 font-poppins">ATS For Candidates</h1>
          </div>

          {/* Desktop Navigation Menu - Hidden on mobile */}
          {isLoggedIn && (
            <div className="hidden md:flex flex-1 justify-center mx-4">
              <Menubar className="border-0 bg-transparent shadow-none p-0 h-auto space-x-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <MenubarMenu key={item.id}>
                      <MenubarTrigger
                        onClick={() => navigate(item.path)}
                        className={cn(
                          "cursor-pointer bg-transparent data-[state=open]:bg-transparent focus:bg-transparent text-xs lg:text-sm font-medium",
                          isActive 
                            ? "bg-black text-white hover:bg-black rounded-md px-3 py-2 lg:px-4" 
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md px-3 py-2 lg:px-4"
                        )}
                      >
                        {item.label}
                      </MenubarTrigger>
                    </MenubarMenu>
                  )
                })}
              </Menubar>
            </div>
          )}

          {/* Right Side: Mobile Menu Button + User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button - Only show on mobile when logged in */}
            {isLoggedIn && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Toggle mobile menu"
              >
                <Icon 
                  icon={isMobileMenuOpen ? "mingcute:close-line" : "mingcute:menu-line"} 
                  width={24} 
                  height={24}
                />
              </button>
            )}

            {isCheckingAuth ? (
              <div className="flex items-center gap-2 text-slate-600">
                <Icon icon="mingcute:loading-line" width={20} height={20} className="animate-spin" />
                <span className="text-sm hidden sm:inline">Loading...</span>
              </div>
            ) : isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 bg-transparent border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm sm:text-base font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm md:text-base font-medium text-slate-900">{displayName}</span>
                <Icon 
                  icon={isDropdownOpen ? "mingcute:up-line" : "mingcute:down-line"} 
                  width={20} 
                  height={20}
                  className="text-slate-600 hidden sm:block"
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

        {/* Mobile Navigation Menu Drawer */}
        {isLoggedIn && isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg"
          >
            <div className="px-4 py-3 space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg font-medium transition-colors",
                      isActive
                        ? "bg-black text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

