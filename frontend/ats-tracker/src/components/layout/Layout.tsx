import { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <Navbar />
      
      {/* Main Layout Container */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  )
}
