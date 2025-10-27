import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import BasicInformation from './pages/BasicInformation'
import { Employment } from './pages/Employment'
import { Skills } from './pages/Skills'
import { Education } from './pages/Education'
import { Projects } from './pages/Projects'
import { Certifications } from './pages/Certifications'
import { Settings } from './pages/Settings'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ROUTES } from './config/routes'
import './App.css'

function App() {
  return (
 //   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> 
    <ErrorBoundary>
	    <div className="app">
	      <Routes>
		{/* Login page - redirect to dashboard if already authenticated */}
		<Route 
		  path={ROUTES.LOGIN} 
		  element={
		    <ProtectedRoute requireAuth={false}>
		      <Login />
		    </ProtectedRoute>
		  } 
		/>
		
		{/* Protected pages - require authentication */}
		<Route 
		  element={
		    <ProtectedRoute>
		      <Layout />
		    </ProtectedRoute>
		  }
		>
		  <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
		  <Route path={ROUTES.BASIC_INFO} element={<BasicInformation />} />
		  <Route path={ROUTES.EMPLOYMENT} element={<Employment />} />
		  <Route path={ROUTES.SKILLS} element={<Skills />} />
		  <Route path={ROUTES.EDUCATION} element={<Education />} />
		  <Route path={ROUTES.PROJECTS} element={<Projects />} />
		  <Route path={ROUTES.CERTIFICATIONS} element={<Certifications />} />
		  <Route path={ROUTES.SETTINGS} element={<Settings />} />
		</Route>
	      </Routes>
	    </div>
    </ErrorBoundary>
   // </ThemeProvider>
  )
}

export default App
