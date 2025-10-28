import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Top Navbar with Navigation */}
      <Navbar />
      
      {/* Main Content Area - Responsive height adjustment */}
      <main className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
    </div>
  )
}
