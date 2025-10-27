import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar with Navigation */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
    </div>
  )
}
