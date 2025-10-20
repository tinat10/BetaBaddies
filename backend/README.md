# ATS Backend API

A comprehensive RESTful API for the ATS (Applicant Tracking System) platform built with Express.js and PostgreSQL.

## 🏗️ Project Structure

```
backend/
├── config/
│   └── db.config.js          # Database configuration
├── controllers/
│   └── userController.js      # User-related request handlers
├── middleware/
│   ├── auth.js               # Authentication middleware
│   ├── errorHandler.js       # Error handling middleware
│   └── validation.js         # Input validation middleware
├── routes/
│   └── userRoutes.js         # User API routes
├── services/
│   ├── database.js           # Database service with connection pooling
│   └── userService.js        # User business logic
├── utils/
│   └── helpers.js            # Utility functions
├── index.js                  # Application entry point
├── server.js                 # Express app configuration
└── package.json
```

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with controllers, services, and middleware
- **Authentication**: Session-based authentication with CSRF protection
- **Security**: Rate limiting, input validation, SQL injection protection
- **Error Handling**: Centralized error handling with standardized responses
- **Database**: PostgreSQL with connection pooling
- **Validation**: Comprehensive input validation using Joi
- **Logging**: Request logging with Morgan

## 📋 API Endpoints

### User Management (`/api/v1/users`)

| Method | Endpoint           | Description             | Auth Required |
| ------ | ------------------ | ----------------------- | ------------- |
| POST   | `/register`        | Create new user account | No            |
| POST   | `/login`           | Authenticate user       | No            |
| POST   | `/logout`          | End user session        | No            |
| GET    | `/profile`         | Get user profile        | Yes           |
| PUT    | `/profile`         | Update user profile     | Yes           |
| PUT    | `/change-password` | Change user password    | Yes           |
| GET    | `/dashboard`       | Get user dashboard      | Yes           |
| DELETE | `/account`         | Delete user account     | Yes           |
| GET    | `/csrf-token`      | Get CSRF token          | No            |

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ (recommended)
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the backend directory:

   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_NAME=ats_db
   DB_USER=your_username
   DB_PASS=your_password
   DB_PORT=5432
   SESSION_SECRET=your-super-secret-session-key
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Health Check

Visit `http://localhost:5000/health` to verify the server is running.

## 📝 API Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get user profile (requires authentication)

```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Cookie: connect.sid=your-session-cookie"
```

## 🔒 Security Features

- **CSRF Protection**: All state-changing requests require CSRF tokens
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse
- **Input Validation**: All inputs are validated and sanitized
- **Password Security**: Passwords are hashed using bcrypt
- **Session Security**: Sessions are httpOnly and secure in production
- **SQL Injection Prevention**: Parameterized queries prevent SQL injection

## 📊 Response Format

### Success Response

```json
{
  "ok": true,
  "data": {
    // Resource payload
  }
}
```

### Error Response

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "fields": {
      "fieldName": "Field-specific error message"
    }
  }
}
```

## 🛠️ Development

### Adding New Services

1. Create service in `services/` directory
2. Create controller in `controllers/` directory
3. Create routes in `routes/` directory
4. Add validation schemas in `middleware/validation.js`
5. Import and use routes in `server.js`

### Database Schema

The API works with the existing database schema:

- `users` - User authentication
- `profiles` - Extended user profile information
- `jobs` - Employment history
- `educations` - Education history
- `skills` - User skills
- `certifications` - Professional certifications
- `projects` - Personal/professional projects
- `files` - File storage references

## 📄 License

This project is part of the ATS platform and follows the project's licensing terms.
