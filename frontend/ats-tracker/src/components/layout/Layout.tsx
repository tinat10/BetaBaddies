import { ReactNode } from 'react'
import { Navbar } from './Navbar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar with Navigation */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </div>
  )
}
