# ATS Candidate Tracker

A comprehensive Applicant Tracking System (ATS) designed specifically for job candidates to manage their job applications, track progress, and maintain their professional profiles.

## 🚀 Features

### Authentication & User Management

- ✅ User registration with email and password
- ✅ Secure login with JWT tokens
- ✅ Password reset functionality
- ✅ User profile management
- 🔄 OAuth integration (Google, LinkedIn) - _Coming Soon_

### Profile Management

- ✅ Complete professional profile creation
- ✅ Employment history tracking
- ✅ Skills management with proficiency levels
- ✅ Education background
- ✅ Certifications tracking
- ✅ Project portfolio
- ✅ Profile completeness indicators

### Application Tracking

- ✅ Job application management
- ✅ Application status tracking
- ✅ Company and position details
- ✅ Salary and location information
- ✅ Application notes and documents
- ✅ Search and filter capabilities

### Design System

- ✅ Modern, responsive UI
- ✅ Dark/Light theme support
- ✅ Professional brand identity
- ✅ Mobile-first design
- ✅ Accessibility features

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with latest features
- **React Router** - Client-side routing
- **React Hook Form** - Form management and validation
- **Yup** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **CSS Custom Properties** - Design system

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

## 📁 Project Structure

```
BetaBaddies/
├── frontend/
│   └── ats-tracker/
│       ├── src/
│       │   ├── components/          # Reusable UI components
│       │   │   ├── Layout/         # Layout components
│       │   │   ├── auth/           # Authentication components
│       │   │   └── UI/             # Basic UI components
│       │   ├── contexts/           # React contexts
│       │   ├── pages/              # Page components
│       │   │   └── auth/           # Authentication pages
│       │   ├── utils/              # Utility functions
│       │   └── App.jsx             # Main app component
│       ├── package.json
│       └── vite.config.js
├── backend/
│   ├── models/                     # Database models
│   ├── routes/                     # API routes
│   ├── middleware/                 # Custom middleware
│   ├── server.js                   # Main server file
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd BetaBaddies
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend/ats-tracker
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd ../../backend
   npm install
   ```

4. **Set up environment variables**

   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd frontend/ats-tracker
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ats-tracker
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### User Endpoints

- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `DELETE /api/users/me` - Delete user account
- `GET /api/users/me/stats` - Get user statistics

### Application Endpoints

- `GET /api/applications` - Get user applications
- `POST /api/applications` - Create new application
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/stats` - Get application statistics

## 🎨 Design System

### Colors

- **Primary**: #3b82f6 (Blue)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Neutral**: #64748b (Slate)

### Typography

- **Font Family**: Inter, system fonts
- **Headings**: 2rem - 3.5rem
- **Body**: 1rem
- **Small**: 0.875rem

### Spacing

- **xs**: 0.25rem
- **sm**: 0.5rem
- **md**: 1rem
- **lg**: 1.5rem
- **xl**: 2rem

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/ats-tracker
npm test
```

### Test Coverage

- Unit tests for all API endpoints
- Component testing for React components
- Integration tests for user flows
- E2E tests for critical paths

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend
2. Deploy to your preferred platform
3. Set environment variables

### Backend (Heroku/Railway/DigitalOcean)

1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy the backend
4. Update frontend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@atstracker.com or create an issue in the repository.

## 🗺️ Roadmap

### Phase 1 (Current)

- ✅ Basic authentication
- ✅ User profile management
- ✅ Application tracking
- ✅ Responsive design

### Phase 2 (Next)

- 🔄 OAuth integration
- 🔄 Email notifications
- 🔄 File uploads
- 🔄 Advanced analytics

### Phase 3 (Future)

- 📅 AI-powered job matching
- 📅 Resume builder
- 📅 Interview scheduling
- 📅 Company insights

---

**Built with ❤️ for job seekers everywhere**
