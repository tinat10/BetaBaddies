# ATS Tracker - Frontend Application

A modern, full-featured Applicant Tracking System (ATS) profile management application built with React, TypeScript, and Vite.

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Iconify (Mingcute icon set)
- **HTTP Client**: Native Fetch API
- **State Management**: React Hooks (useState, useEffect)

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Pages](#available-pages)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Development](#development)
- [Building for Production](#building-for-production)

## ✨ Features

### Authentication & Authorization
- ✅ User registration with password strength indicator
- ✅ User login with session management
- ✅ Protected routes (auto-redirect based on auth state)
- ✅ Session-based authentication (cookies)
- ✅ Rate limiting protection

### Dashboard (Profile Overview)
- ✅ Profile completion percentage tracker
- ✅ Summary cards for all profile sections
- ✅ Recent activity timeline
- ✅ Skills distribution visualization
- ✅ Career timeline
- ✅ Profile strength indicators
- ✅ Actionable suggestions
- ✅ Quick-add buttons for each section

### Projects Portfolio
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Grid and List view modes
- ✅ Real-time search across name, description, technologies
- ✅ Filter by status (Completed, Ongoing, Planned)
- ✅ Sort by date or name
- ✅ Technology tags display
- ✅ Status badges with color coding
- ✅ Detailed project view modal
- ✅ Form validation

### Certifications Management
- ✅ Full CRUD operations
- ✅ Smart status calculation (Active, Expiring, Expired, Permanent)
- ✅ Expiration tracking and warnings
- ✅ "Never expires" toggle for permanent certifications
- ✅ Grid and List view modes
- ✅ Real-time search by name or organization
- ✅ Filter by status
- ✅ Sort by expiration date, earned date, or name
- ✅ Statistics dashboard (total, active, expiring, expired counts)
- ✅ Days until expiration calculator
- ✅ Form validation with date logic

### Additional Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support (via theme provider)
- ✅ Error boundaries for graceful error handling
- ✅ Loading states and skeleton screens
- ✅ Empty states with helpful prompts
- ✅ Professional UI/UX design
- ✅ Accessible components

## 📁 Project Structure

```
frontend/ats-tracker/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx           # Main layout wrapper
│   │   │   ├── Navbar.tsx           # Top navigation bar
│   │   │   └── Sidebar.tsx          # Side navigation
│   │   ├── ErrorBoundary.tsx        # Error boundary component
│   │   ├── ProtectedRoute.tsx       # Auth route wrapper
│   │   ├── mode-toggle.tsx          # Dark/light mode toggle
│   │   └── theme-provider.tsx       # Theme context provider
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx            # Profile overview dashboard
│   │   ├── Login.tsx                # Login page
│   │   ├── Register.tsx             # Registration page
│   │   ├── Landing.tsx              # Landing page
│   │   ├── BasicInformation.tsx     # Profile info page
│   │   ├── Employment.tsx           # Employment history page
│   │   ├── Skills.tsx               # Skills management page
│   │   ├── Education.tsx            # Education page
│   │   ├── Projects.tsx             # Projects portfolio page ✅
│   │   ├── Certifications.tsx       # Certifications page ✅
│   │   └── Settings.tsx             # Settings page
│   │
│   ├── services/
│   │   ├── api.ts                   # API service layer
│   │   └── dashboardService.ts      # Dashboard data aggregation
│   │
│   ├── types/
│   │   ├── index.ts                 # Type exports
│   │   ├── user.types.ts            # User-related types
│   │   ├── api.types.ts             # API response types
│   │   ├── dashboard.types.ts       # Dashboard types
│   │   ├── profile.types.ts         # Profile types
│   │   ├── education.types.ts       # Education types
│   │   ├── project.types.ts         # Project types ✅
│   │   └── certification.types.ts   # Certification types ✅
│   │
│   ├── config/
│   │   └── routes.ts                # Route constants
│   │
│   ├── lib/
│   │   └── utils.ts                 # Utility functions
│   │
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles
│
├── public/                          # Static assets
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
└── package.json                     # Dependencies
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3001`

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/ats-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📄 Available Pages

### Public Routes

#### Landing Page (`/`)
- Welcome page with app introduction
- Links to login and registration

#### Login Page (`/login`)
- Email and password authentication
- Link to registration
- Auto-redirects to dashboard if already logged in
- Error handling and validation

#### Register Page (`/register`)
- User account creation
- Password strength indicator
- Password confirmation with real-time validation
- Terms & privacy policy links
- Auto-login after successful registration

### Protected Routes (Require Authentication)

#### Dashboard (`/dashboard`)
See [DASHBOARD_README.md](./DASHBOARD_README.md) for detailed documentation.

**Key Features:**
- Profile completion tracker (0-100%)
- Summary cards (Employment, Skills, Education, Projects)
- Recent activity timeline
- Skills distribution chart
- Career timeline visualization
- Profile strength indicators
- Actionable suggestions

#### Projects (`/projects`)
**Features:**
- Portfolio view with grid/list modes
- Add, edit, delete projects
- Search across name, description, technologies
- Filter by status (Completed, Ongoing, Planned)
- Sort by date or name
- Status badges and technology tags
- Detailed project modal
- Date range tracking
- Collaborators field
- External links to repositories

**Data Fields:**
- Project name
- Description
- Status (Completed/Ongoing/Planned)
- Start & end dates
- Technologies used
- Collaborators
- Project link/URL
- Industry classification

#### Certifications (`/certifications`)
**Features:**
- Certification tracking with expiration management
- Smart status badges (Active, Expiring, Expired, Permanent)
- Expiration warnings (< 30 days)
- Grid/list view modes
- Search by name or organization
- Filter by status
- Sort by expiration, earned date, or name
- Statistics bar showing counts
- "Never expires" toggle for permanent certifications
- Days until expiration calculator

**Data Fields:**
- Certification name
- Issuing organization
- Date earned
- Expiration date (optional)
- Never expires toggle

#### Other Pages
- **Basic Information** (`/basic-information`) - Profile details
- **Employment** (`/employment`) - Job history
- **Skills** (`/skills`) - Technical skills
- **Education** (`/education`) - Educational background
- **Settings** (`/settings`) - Account settings

## 🔌 API Integration

### API Service Architecture

All API calls are centralized in `src/services/api.ts` using a class-based service pattern.

```typescript
// Example usage
import { api } from '@/services/api'

// Authentication
await api.login(email, password)
await api.register(email, password)
await api.logout()

// Projects
const projects = await api.getProjects()
await api.createProject(projectData)
await api.updateProject(id, updates)
await api.deleteProject(id)

// Certifications
const certs = await api.getCertifications()
await api.createCertification(certData)
const expiring = await api.getExpiringCertifications(30)
```

### Backend Proxy Configuration

Vite is configured to proxy `/api` requests to the backend:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### API Response Format

All API responses follow this standard format:

```typescript
{
  ok: boolean,
  data: {
    // Response data
    message?: string
  },
  error?: {
    code: string,
    message: string
  }
}
```

## 🔐 Authentication

### Session-Based Auth

- Uses HTTP-only cookies for session management
- Automatic session validation on protected routes
- Session expires after 24 hours of inactivity
- CSRF protection enabled

### Protected Route Implementation

```typescript
// Automatic redirection based on auth state
<ProtectedRoute requireAuth={true}>
  <Dashboard />
</ProtectedRoute>

// Public routes (redirect if authenticated)
<ProtectedRoute requireAuth={false}>
  <Login />
</ProtectedRoute>
```

## 💻 Development

### Running Development Server

```bash
npm run dev
```

Access at: `http://localhost:5173`

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Code Formatting

This project uses ESLint for code quality. Run linting before committing:

```bash
npm run lint
```

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

Builds the app to the `dist/` folder, optimized for production.

### Preview Production Build

```bash
npm run preview
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

## 🎨 Design System

### Colors

**Primary Palette:**
- Primary: `#3351FD`, `#6A94EE`, `#B1D0FF`
- Secondary: `#EC85CA`, `#916BE3`

**Semantic Colors:**
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)
- Info: `#3B82F6` (blue)

**Neutral:**
- Background: `#FFFFFF`, `#F8FAFC`
- Text: `#0F172A`, `#64748B`

### Typography

**Font Family:** Poppins (sans-serif)

**Font Sizes:**
- H1: 64px (4xl) - Page titles
- H2: 48px (3xl) - Section headers
- H3: 36px (2xl) - Subsections
- H4: 28px (xl) - Card titles
- Body: 16px (base) - Regular text
- Small: 14px (sm) - Meta information

### Components

**Cards:**
- Border radius: 15px (rounded-2xl)
- Shadow: subtle (shadow-sm)
- Padding: 24px (p-6)

**Buttons:**
- Primary: Blue gradient background
- Secondary: Slate background
- Danger: Red background
- Border radius: 12px (rounded-xl)

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Grid layouts automatically adjust:
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

## 🧪 Testing the Application

### Test User Registration
1. Go to `/register`
2. Fill in email and password (min 8 characters)
3. Verify password strength indicator
4. Confirm password matches
5. Submit form
6. Should auto-login and redirect to dashboard

### Test Projects Feature
1. Navigate to `/projects`
2. Click "Add Project"
3. Fill in project details
4. Test different statuses
5. Use search and filters
6. Toggle grid/list views
7. Edit and delete projects

### Test Certifications Feature
1. Navigate to `/certifications`
2. Add certifications with different statuses
3. Test "Never Expires" toggle
4. Add certification expiring soon (< 30 days)
5. Verify warning banner appears
6. Test search and status filters
7. Check expiration calculations

## 🔧 Troubleshooting

### Common Issues

**Port 5173 already in use:**
```bash
# Vite will automatically try 5174, 5175, etc.
# Or kill the process using the port
```

**API calls failing:**
- Verify backend is running on `http://localhost:3001`
- Check browser console for CORS errors
- Verify you're logged in for protected endpoints

**TypeScript errors:**
```bash
npm run type-check
```

**Build errors:**
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the BetaBaddies ATS Tracker application.

---

**Built with ❤️ using React, TypeScript, and Vite**
