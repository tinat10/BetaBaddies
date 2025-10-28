# BetaBaddies ATS Tracker

## 📝 Project Overview

**BetaBaddies ATS Tracker** is a full-stack web application designed to help job seekers organize and manage their job application process. The platform allows users to track job applications, maintain professional profiles, manage education history, showcase skills and certifications, and organize personal projects—all in one centralized dashboard.

## 🛠️ Tech Stack

### **Backend**
- **Runtime:** Node.js with ES6 modules
- **Framework:** Express.js (v5.1.0)
- **Database:** PostgreSQL with raw SQL queries
- **Authentication:** Passport.js with session-based auth, Google OAuth 2.0 integration
- **Security:** Helmet (security headers), bcrypt (password hashing), express-rate-limit, CORS
- **Validation:** Joi for input validation and sanitization
- **Email Service:** Nodemailer for password resets and notifications
- **File Uploads:** Multer for handling resumes and profile pictures, Sharp for image processing
- **Testing:** Supertest for API testing
- **Additional Libraries:** express-session, morgan (HTTP logging), dotenv, uuid

### **Frontend**
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS with custom theme support and animations
- **UI Components:** Radix UI primitives, Lucide React icons, Iconify
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios for API requests
- **Drag & Drop:** @dnd-kit libraries for sortable/interactive elements
- **PDF Export:** jsPDF and html2canvas for exporting resumes/profiles
- **Development:** ESLint, Stylelint, TypeScript with strict type checking

### **Database**
- **PostgreSQL** database with custom SQL schema
- Includes stored procedures and triggers (e.g., `addupdatetime()`, `lower_email()`)
- Database migrations for schema updates (e.g., Google OAuth integration)

## 🏗️ Architecture

### **Backend Architecture (MVC + Service Layer)**
The backend follows a layered architecture pattern:
- **Routes:** Define API endpoints and delegate to controllers
- **Controllers:** Handle HTTP requests/responses and input validation
- **Services:** Contain business logic and interact with the database
- **Middleware:** Authentication, error handling, and validation logic
- **Config:** Database configuration and Passport strategies

### **API Design**
RESTful API with versioning (`/api/v1/...`) organized into modules:
- **Users:** Registration, login, logout, password management, account deletion
- **Jobs:** Create, read, update, delete job applications with status tracking
- **Education:** Manage educational background
- **Skills:** Organize skills by categories
- **Certifications:** Track certifications with expiration monitoring
- **Projects:** Showcase personal/professional projects
- **Profile:** User profile management with picture uploads and completeness statistics
- **File Uploads:** Resume and document management

### **Frontend Architecture**
- **Component-based** architecture with reusable UI components
- **Type-safe** development with TypeScript interfaces for all API responses
- **Protected Routes** with authentication guards
- **Centralized API service** layer for backend communication
- **Theme provider** for dark/light mode support
- **Error boundaries** for graceful error handling

## 💡 Key Features

1. **User Authentication:** Secure registration/login with session management and Google OAuth
2. **Job Application Tracking:** Organize job applications with status updates, deadlines, and notes
3. **Profile Management:** Build comprehensive professional profiles with profile pictures
4. **Education & Skills:** Document educational background and technical/soft skills
5. **Certifications:** Track certifications with expiration alerts
6. **Project Portfolio:** Showcase personal and professional projects
7. **Dashboard Analytics:** View statistics and track application progress
8. **Resume Export:** Export profiles as PDFs
9. **File Management:** Upload and manage resumes and documents with image optimization
10. **Password Recovery:** Email-based password reset functionality

## 🔐 Security

- Password hashing with bcrypt (12 salt rounds)
- Session-based authentication with HTTP-only cookies
- Rate limiting on authentication endpoints
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- CORS configuration for cross-origin requests
- Security headers via Helmet middleware

## 📂 Project Structure

```
BetaBaddies/
├── backend/               # Node.js/Express API
│   ├── config/           # Database & Passport configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, validation, error handling
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic & database operations
│   ├── tests/            # API and functionality tests
│   ├── uploads/          # User-uploaded files (resumes, profile pics)
│   └── docs/             # API documentation
├── frontend/             # React/TypeScript SPA
│   └── ats-tracker/
│       ├── src/
│       │   ├── components/   # Reusable UI components
│       │   ├── pages/        # Route-level components
│       │   ├── services/     # API client & data fetching
│       │   ├── types/        # TypeScript type definitions
│       │   └── utils/        # Helper functions
│       └── public/           # Static assets
└── db/                   # Database schema & migrations
    ├── ats_db.sql       # Complete database schema
    └── migrations/      # Schema migration files
```

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
node index  # Runs on http://localhost:3001
```

### Frontend
```bash
cd frontend/ats-tracker
npm install
npm run dev  # Runs on http://localhost:3000
```

### Database Setup
1. Install PostgreSQL
2. Create database: `ats_tracker`
3. Run schema: `psql -U postgres -d ats_tracker -f db/ats_db.sql`
4. Configure `.env` file in backend with database credentials

## 📚 Languages & Technologies Summary

- **Languages:** JavaScript (ES6+), TypeScript, SQL (PostgreSQL dialect), HTML5, CSS3
- **Runtime:** Node.js
- **Frameworks:** Express.js, React
- **Database:** PostgreSQL
- **Build Tools:** Vite, npm
- **Authentication:** Passport.js (local & OAuth strategies)
- **Styling:** Tailwind CSS
- **Testing:** Supertest (backend API testing)
