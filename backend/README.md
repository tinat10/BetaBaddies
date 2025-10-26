# ATS Backend API

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
cd backend
npm install

# Start the server
npm start
```

Server will run on `http://localhost:3001`

### Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ats_tracker
DB_USER=postgres
DB_PASS=your_password
SERVER_PORT=3001
SESSION_SECRET=your-secret-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

### Base URL

```
http://localhost:3001/api/v1
```

### Available Routes

#### User Management (`/api/v1/users`)

- `POST /register` - Register new user
- `POST /login` - Authenticate user
- `POST /logout` - End session
- `GET /csrf-token` - Get CSRF token
- `GET /profile` - Get user profile
- `PUT /change-password` - Change password
- `DELETE /account` - Delete account

#### Jobs Management (`/api/v1/jobs`)

- `POST /` - Create new job
- `GET /` - Get all jobs
- `GET /current` - Get current job
- `GET /history` - Get job history
- `GET /statistics` - Get job statistics
- `GET /:id` - Get job by ID
- `PUT /:id` - Update job
- `DELETE /:id` - Delete job

#### Education Management (`/api/v1/education`)

- `GET /` - Get all education entries
- `POST /` - Create education entry
- `GET /:id` - Get education by ID
- `PUT /:id` - Update education
- `DELETE /:id` - Delete education

#### Skills Management (`/api/v1/skills`)

- `GET /` - Get all skills
- `GET /categories` - Get skills by category
- `POST /` - Create skill
- `GET /:id` - Get skill by ID
- `PUT /:id` - Update skill
- `DELETE /:id` - Delete skill

#### Certifications Management (`/api/v1/certifications`)

- `GET /` - Get all certifications
- `GET /current` - Get current certifications
- `GET /history` - Get certification history
- `GET /statistics` - Get certification statistics
- `GET /expiring` - Get expiring certifications
- `GET /search` - Search certifications
- `GET /organization` - Get by organization
- `POST /` - Create certification
- `GET /:id` - Get certification by ID
- `PUT /:id` - Update certification
- `DELETE /:id` - Delete certification

## 🧪 Testing

### Run All Tests

```bash
npm run test:all
```

### Run Individual Test Suites

```bash
npm run test                    # Login functionality tests
npm run test:user-api           # User API tests
npm run test:jobs-service       # Jobs service tests
npm run test:jobs-api           # Jobs API tests
npm run test:certifications     # Certifications service tests
npm run test:certifications-api # Certifications API tests
```

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   └── db.config.js    # Database configuration
├── controllers/        # Request handlers
│   ├── userController.js
│   ├── jobController.js
│   ├── educationController.js
│   ├── skillController.js
│   └── certificationController.js
├── middleware/          # Cross-cutting concerns
│   ├── auth.js         # Authentication & CSRF
│   ├── errorHandler.js # Error handling
│   └── validation.js   # Input validation
├── routes/              # API routes
│   ├── userRoutes.js
│   ├── jobRoutes.js
│   ├── educationRoutes.js
│   ├── skillRoutes.js
│   └── certificationRoutes.js
├── services/            # Business logic
│   ├── database.js      # Database service
│   ├── userService.js
│   ├── jobService.js
│   ├── educationService.js
│   ├── skillService.js
│   └── certificationService.js
├── tests/               # Test files
│   ├── login-functionality.test.js
│   ├── user-api.test.js
│   ├── jobs-service.test.js
│   ├── jobs-api.test.js
│   ├── certifications-functionality.test.js
│   └── certifications-api.test.js
├── utils/               # Utility functions
├── docs/                # Documentation
├── server.js            # Express app configuration
└── index.js             # Application entry point
```

## 🔐 Authentication

- **Session-based** authentication using HTTP-only cookies
- **CSRF protection** on all state-changing operations
- **Rate limiting** on authentication endpoints

### Getting Started with CSRF Protection

```javascript
// 1. Get CSRF token
const response = await fetch("http://localhost:3001/api/v1/users/csrf-token");
const { csrfToken } = await response.json();

// 2. Use token in requests
await fetch("http://localhost:3001/api/v1/users/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
  },
  credentials: "include",
  body: JSON.stringify({ email, password }),
});
```

## 📊 Response Format

### Success Response

```json
{
  "ok": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "fields": {
      // Field-specific errors
    }
  }
}
```

## 📖 Documentation

- [API Routes Documentation](./docs/API_ROUTES_DOCUMENTATION.md)
- [API Design Documentation](./docs/API_DESIGN_DOCUMENTATION.md)
- [Status Codes Reference](./docs/STATUS_CODES_REFERENCE.md)

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Joi** - Validation
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Supertest** - API testing
- **Morgan** - HTTP request logging

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Session-based authentication
- ✅ CSRF protection
- ✅ Rate limiting on auth endpoints
- ✅ Security headers (Helmet)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ CORS configuration

## 📝 License

ISC
