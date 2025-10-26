import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import BasicInformation from './pages/BasicInformation'
import { Employment } from './pages/Employment'
import { Skills } from './pages/Skills'
import { Education } from './pages/Education'
import { Projects } from './pages/Projects'
import { Certifications } from './pages/Certifications'
import { Settings } from './pages/Settings'
import { ThemeProvider } from "./components/theme-provider"
import './App.css'

function App() {
  return (
 //   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> 
	    <div className="app">
	      <Layout>
		<Routes>
		  <Route path="/" element={<Dashboard />} />
		  <Route path="/basic-information" element={<BasicInformation />} />
		  <Route path="/employment" element={<Employment />} />
		  <Route path="/skills" element={<Skills />} />
		  <Route path="/education" element={<Education />} />
		  <Route path="/projects" element={<Projects />} />
		  <Route path="/certifications" element={<Certifications />} />
		  <Route path="/settings" element={<Settings />} />
		</Routes>
	      </Layout>
	    </div>
   // </ThemeProvider>
  )
}

export default App
