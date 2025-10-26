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
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo/Brand */}
        <div style={styles.brand}>
          <Icon icon="mingcute:file-list-line" width={32} height={32} style={styles.logoIcon} />
          <h1 style={styles.brandName}>ATS Tracker</h1>
        </div>

        {/* User Profile Area */}
        <div style={styles.userSection}>
          {user.isLoggedIn ? (
            <div style={styles.profileContainer} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={styles.profileButton}
              >
                <div style={styles.avatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={styles.userName}>{user.name}</span>
                <Icon 
                  icon={isDropdownOpen ? "mingcute:up-line" : "mingcute:down-line"} 
                  width={20} 
                  height={20}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.dropdownAvatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.dropdownInfo}>
                      <div style={styles.dropdownName}>{user.name}</div>
                      <div style={styles.dropdownEmail}>{user.email}</div>
                    </div>
                  </div>
                  <div style={styles.dropdownDivider} />
                  <button style={styles.dropdownItem} onClick={() => alert('Edit Profile')}>
                    <Icon icon="mingcute:edit-line" width={20} height={20} />
                    <span>Edit Profile</span>
                  </button>
                  <button style={styles.dropdownItem} onClick={() => alert('Settings')}>
                    <Icon icon="mingcute:setting-line" width={20} height={20} />
                    <span>Settings</span>
                  </button>
                  <div style={styles.dropdownDivider} />
                  <button 
                    style={{...styles.dropdownItem, color: '#EF4444'}}
                    onClick={() => alert('Logout')}
                  >
                    <Icon icon="mingcute:logout-line" width={20} height={20} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.loginButtons}>
              <button style={styles.loginButton}>Login</button>
              <button style={styles.signupButton}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #F1F5F9',
    padding: '16px 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    color: '#3B82F6',
  },
  brandName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    margin: 0,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative' as const,
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
  },
  userName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#0F172A',
  },
  dropdown: {
    position: 'absolute' as const,
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    minWidth: '280px',
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownHeader: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#F8FAFC',
  },
  dropdownAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
  },
  dropdownInfo: {
    flex: 1,
  },
  dropdownName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '2px',
  },
  dropdownEmail: {
    fontSize: '14px',
    color: '#64748B',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#F1F5F9',
    margin: '8px 0',
  },
  dropdownItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left' as const,
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#0F172A',
    transition: 'background-color 0.2s ease',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  loginButtons: {
    display: 'flex',
    gap: '12px',
  },
  loginButton: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#0F172A',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  signupButton: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.15)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
} as const
