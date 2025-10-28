import jsPDF from 'jspdf'
import { DashboardProfileData } from '../types/dashboard.types'

export class PDFExporter {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 280
  private margin: number = 20
  private lineHeight: number = 7

  constructor() {
    this.doc = new jsPDF()
  }

  async exportProfile(profileData: DashboardProfileData): Promise<void> {
    try {
      // Set up the document
      this.doc.setProperties({
        title: `${profileData.name} - Professional Profile`,
        subject: 'ATS Tracker Profile Export',
        author: 'ATS Tracker',
        creator: 'ATS Tracker'
      })

      // Add header
      this.addHeader(profileData.name)
      
      // Add profile summary
      this.addProfileSummary(profileData)
      
      // Add career timeline
      this.addCareerTimeline(profileData.careerTimeline)
      
      // Add skills distribution
      this.addSkillsDistribution(profileData.skillsDistribution)
      
      // Add profile strength
      this.addProfileStrength(profileData.profileStrength)
      
      // Add recent activity
      this.addRecentActivity(profileData.recentActivity)
      
      // Add recommendations
      this.addRecommendations(profileData.suggestions)

      // Save the PDF
      const fileName = `${profileData.name.replace(/\s+/g, '_')}_Profile_${new Date().toISOString().split('T')[0]}.pdf`
      this.doc.save(fileName)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw new Error('Failed to generate PDF. Please try again.')
    }
  }

  private addHeader(name: string): void {
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Professional Profile', this.margin, this.currentY)
    
    this.currentY += 10
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(name, this.margin, this.currentY)
    
    this.currentY += 15
    this.doc.setFontSize(10)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`Generated on ${new Date().toLocaleDateString()}`, this.margin, this.currentY)
    
    this.currentY += 20
    this.doc.setTextColor(0, 0, 0)
  }

  private addProfileSummary(profileData: DashboardProfileData): void {
    this.addSectionTitle('Profile Summary')
    
    // Profile completion
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Profile Completion:', this.margin, this.currentY)
    
    this.currentY += this.lineHeight
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`${profileData.profileCompletion}%`, this.margin + 50, this.currentY - this.lineHeight)
    
    // Add progress bar visualization
    const barWidth = 100
    const barHeight = 5
    const progressWidth = (profileData.profileCompletion / 100) * barWidth
    
    this.doc.setFillColor(200, 200, 200)
    this.doc.rect(this.margin, this.currentY + 2, barWidth, barHeight, 'F')
    this.doc.setFillColor(52, 81, 253) // Blue color
    this.doc.rect(this.margin, this.currentY + 2, progressWidth, barHeight, 'F')
    
    this.currentY += 15
    
    // Employment, Skills, Education, Projects counts
    const stats = [
      { label: 'Employment Records:', value: profileData.employment },
      { label: 'Skills:', value: profileData.skills },
      { label: 'Education:', value: profileData.education },
      { label: 'Projects:', value: profileData.projects }
    ]
    
    stats.forEach(stat => {
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(stat.label, this.margin, this.currentY)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(stat.value.toString(), this.margin + 60, this.currentY)
      this.currentY += this.lineHeight
    })
    
    this.currentY += 10
  }

  private addCareerTimeline(timeline: any[]): void {
    if (timeline.length === 0) return
    
    this.addSectionTitle('Career Timeline')
    
    timeline.forEach((item, index) => {
      if (this.currentY > this.pageHeight - 30) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      // Position and company
      this.doc.setFontSize(11)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(item.position, this.margin, this.currentY)
      
      this.currentY += this.lineHeight
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(item.company, this.margin, this.currentY)
      
      // Location and dates
      this.currentY += this.lineHeight
      this.doc.setFontSize(9)
      this.doc.setTextColor(100, 100, 100)
      
      const locationText = item.location ? ` • ${item.location}` : ''
      const dateText = `${this.formatDate(item.startDate)} - ${item.isCurrent ? 'Present' : this.formatDate(item.endDate)}`
      this.doc.text(dateText + locationText, this.margin, this.currentY)
      
      // Duration
      if (item.duration) {
        this.currentY += this.lineHeight
        this.doc.text(`Duration: ${item.duration}`, this.margin, this.currentY)
      }
      
      this.currentY += 12
      this.doc.setTextColor(0, 0, 0)
    })
    
    this.currentY += 5
  }

  private addSkillsDistribution(skills: any[]): void {
    if (skills.length === 0) return
    
    this.addSectionTitle('Skills Distribution')
    
    skills.forEach(skill => {
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(skill.category, this.margin, this.currentY)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(skill.count.toString(), this.margin + 80, this.currentY)
      
      this.currentY += this.lineHeight
    })
    
    this.currentY += 10
  }

  private addProfileStrength(strength: any): void {
    this.addSectionTitle('Profile Strength')
    
    // Overall score
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(`Overall Score: ${strength.overall}`, this.margin, this.currentY)
    this.currentY += this.lineHeight + 5
    
    // Category scores
    strength.categories.forEach((category: any) => {
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(category.name, this.margin, this.currentY)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(`${category.score}%`, this.margin + 80, this.currentY)
      
      this.currentY += this.lineHeight
    })
    
    this.currentY += 10
  }

  private addRecentActivity(activities: any[]): void {
    if (activities.length === 0) return
    
    this.addSectionTitle('Recent Activity')
    
    activities.slice(0, 10).forEach(activity => { // Limit to 10 most recent
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      this.doc.setFontSize(9)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(activity.action, this.margin, this.currentY)
      
      this.currentY += this.lineHeight
      this.doc.setTextColor(100, 100, 100)
      this.doc.text(activity.timestamp, this.margin, this.currentY)
      
      this.currentY += this.lineHeight + 2
      this.doc.setTextColor(0, 0, 0)
    })
    
    this.currentY += 5
  }

  private addRecommendations(suggestions: string[]): void {
    if (suggestions.length === 0) return
    
    this.addSectionTitle('Recommendations')
    
    suggestions.forEach(suggestion => {
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.currentY = 20
      }
      
      this.doc.setFontSize(9)
      this.doc.setFont('helvetica', 'normal')
      
      // Split long suggestions into multiple lines
      const lines = this.doc.splitTextToSize(`• ${suggestion}`, 170)
      this.doc.text(lines, this.margin, this.currentY)
      this.currentY += lines.length * this.lineHeight + 2
    })
  }

  private addSectionTitle(title: string): void {
    if (this.currentY > this.pageHeight - 30) {
      this.doc.addPage()
      this.currentY = 20
    }
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin, this.currentY)
    
    // Add underline
    this.doc.line(this.margin, this.currentY + 1, this.margin + 60, this.currentY + 1)
    
    this.currentY += 15
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return 'Not specified'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }
}

// Convenience function for easy use
export const exportProfileToPDF = async (profileData: DashboardProfileData): Promise<void> => {
  const exporter = new PDFExporter()
  await exporter.exportProfile(profileData)
}
