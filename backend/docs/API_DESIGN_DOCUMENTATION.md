# ATS Backend API Design Documentation

## 📋 **Overview**

This document provides comprehensive design documentation for the ATS (Applicant Tracking System) backend API, including all routes, status codes, request/response formats, and implementation patterns based on the existing database schema.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Project Structure**

```
backend/
├── config/           # Configuration files
├── controllers/      # Request handlers (business logic coordination)
├── middleware/       # Cross-cutting concerns (auth, validation, errors)
├── routes/           # API route definitions
├── services/         # Business logic and data access
├── utils/            # Utility functions
└── server.js         # Express app configuration
```

## 🗄️ **Database Schema**

### **Tables Overview**

| Table            | Purpose             | Key Fields                                             |
| ---------------- | ------------------- | ------------------------------------------------------ |
| `users`          | User authentication | `u_id`, `email`, `password`                            |
| `profiles`       | Extended user info  | `user_id`, `first_name`, `last_name`, `bio`            |
| `jobs`           | Employment history  | `id`, `user_id`, `title`, `company`, `start_date`      |
| `educations`     | Education records   | `id`, `user_id`, `school`, `degree_type`, `gpa`        |
| `skills`         | User skills         | `id`, `user_id`, `skill_name`, `proficiency`           |
| `certifications` | Professional certs  | `id`, `user_id`, `name`, `org_name`, `date_earned`     |
| `projects`       | Project portfolio   | `id`, `user_id`, `name`, `description`, `technologies` |
| `files`          | File storage        | `file_id`, `file_data`, `file_path`                    |

## 🔐 **Authentication & Security**

### **Session-Based Authentication**

- Uses `express-session` with httpOnly cookies
- CSRF protection on all state-changing requests
- Rate limiting on authentication endpoints
- Password hashing with bcrypt (12 rounds)

### **Security Headers**

- Helmet.js for security headers
- CORS configuration for frontend integration
- Input validation and sanitization

## 📡 **API Design Patterns**

### **Response Format**

All API responses follow a consistent format:

```json
{
  "ok": boolean,
  "data": object | null,
  "error": {
    "code": string,
    "message": string,
    "fields": object (optional)
  }
}
```

### **HTTP Status Codes**

| Code | Usage                 | Description                                    |
| ---- | --------------------- | ---------------------------------------------- |
| 200  | Success               | Successful GET, PUT operations                 |
| 201  | Created               | Successful POST operations (resource creation) |
| 204  | No Content            | Successful DELETE operations                   |
| 400  | Bad Request           | Malformed request, missing required fields     |
| 401  | Unauthorized          | Authentication required or failed              |
| 403  | Forbidden             | Valid auth but insufficient permissions        |
| 404  | Not Found             | Resource not found                             |
| 409  | Conflict              | Resource already exists (duplicate email)      |
| 422  | Unprocessable Entity  | Validation errors                              |
| 429  | Too Many Requests     | Rate limit exceeded                            |
| 500  | Internal Server Error | Server-side errors                             |

## 🛣️ **API Routes Documentation**

### **Base URL**: `/api/v1`

---

## 👤 **User Management API**

### **Base Route**: `/api/v1/users`

#### **POST /register**

Create a new user account.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201 Created):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "message": "User registered successfully"
  }
}
```

**Error Responses:**

- `409 Conflict` - Email already exists
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded

---

#### **POST /login**

Authenticate user and create session.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "jobTitle": "Software Engineer",
      "industry": "Technology",
      "pfpLink": "https://example.com/avatar.jpg"
    },
    "message": "Login successful"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid credentials
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded

---

#### **POST /logout**

End user session.

**Response (200 OK):**

```json
{
  "ok": true,
  "data": {
    "message": "Logout successful"
  }
}
```

---

#### **GET /profile**

Get current user's profile information.

**Headers:** `Cookie: connect.sid=session_id`

**Response (200 OK):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "middleName": "Michael",
      "lastName": "Doe",
      "phone": "(555) 123-4567",
      "city": "San Francisco",
      "state": "CA",
      "jobTitle": "Software Engineer",
      "bio": "Passionate developer with 5 years experience",
      "industry": "Technology",
      "expLevel": "mid",
      "pfpLink": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
- `404 Not Found` - User not found

---

#### **PUT /profile**

Update user profile information.

**Headers:**

- `Cookie: connect.sid=session_id`
- `X-CSRF-Token: csrf_token`

**Request Body:**

```json
{
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "phone": "(555) 123-4567",
  "city": "San Francisco",
  "state": "CA",
  "jobTitle": "Senior Software Engineer",
  "bio": "Experienced developer with expertise in React and Node.js",
  "industry": "Technology",
  "expLevel": "senior",
  "pfpLink": "https://example.com/new-avatar.jpg"
}
```

**Response (200 OK):**

```json
{
  "ok": true,
  "data": {
    "profile": {
      "user_id": "uuid",
      "first_name": "John",
      "middle_name": "Michael",
      "last_name": "Doe",
      "phone": "(555) 123-4567",
      "city": "San Francisco",
      "state": "CA",
      "job_title": "Senior Software Engineer",
      "bio": "Experienced developer with expertise in React and Node.js",
      "industry": "Technology",
      "exp_level": "senior",
      "pfp_link": "https://example.com/new-avatar.jpg"
    },
    "message": "Profile updated successfully"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Invalid CSRF token
- `422 Unprocessable Entity` - Validation errors

---

#### **PUT /change-password**

Change user password.

**Headers:**

- `Cookie: connect.sid=session_id`
- `X-CSRF-Token: csrf_token`

**Request Body:**

```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

**Response (200 OK):**

```json
{
  "ok": true,
  "data": {
    "message": "Password updated successfully"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated or invalid current password
- `403 Forbidden` - Invalid CSRF token
- `404 Not Found` - User not found
- `422 Unprocessable Entity` - Validation errors

---

#### **GET /dashboard**

Get user dashboard overview with profile completeness.

**Headers:** `Cookie: connect.sid=session_id`

**Response (200 OK):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "jobTitle": "Software Engineer",
      "industry": "Technology",
      "pfpLink": "https://example.com/avatar.jpg"
    },
    "counts": {
      "jobs": 3,
      "education": 2,
      "skills": 8,
      "certifications": 2,
      "projects": 5
    },
    "profileCompleteness": 85
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
- `404 Not Found` - User not found

---

#### **DELETE /account**

Delete user account and all associated data.

**Headers:**

- `Cookie: connect.sid=session_id`
- `X-CSRF-Token: csrf_token`

**Response (204 No Content):**

```json
{
  "ok": true,
  "data": {
    "message": "Account deleted successfully"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Invalid CSRF token

---

#### **GET /csrf-token**

Get CSRF token for form submissions.

**Response (200 OK):**

```json
{
  "ok": true,
  "data": {
    "csrfToken": "random_csrf_token_string"
  }
}
```

---

## 🔧 **Implementation Guidelines**

### **Adding New Services**

1. **Create Service** (`services/serviceName.js`)

   - Implement business logic
   - Database operations
   - Data validation

2. **Create Controller** (`controllers/serviceController.js`)

   - Handle HTTP requests/responses
   - Call service methods
   - Error handling

3. **Create Routes** (`routes/serviceRoutes.js`)

   - Define API endpoints
   - Apply middleware
   - Route to controllers

4. **Add Validation** (`middleware/validation.js`)

   - Define Joi schemas
   - Create validation middleware

5. **Update Server** (`server.js`)
   - Import and use new routes

### **Error Handling Pattern**

```javascript
// Service Layer
async createResource(data) {
  try {
    // Business logic
    const result = await database.query(query, params);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating resource:", error);
    throw error; // Let errorHandler middleware handle it
  }
}

// Controller Layer
createResource = asyncHandler(async (req, res) => {
  const resource = await resourceService.createResource(req.body);
  res.status(201).json({
    ok: true,
    data: { resource }
  });
});
```

### **Validation Pattern**

```javascript
// Define schema
const createResourceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500),
  // ... other fields
});

// Apply validation
router.post(
  "/resources",
  validate(createResourceSchema),
  resourceController.createResource
);
```

## 🚀 **Future API Extensions**

### **Planned Services**

1. **Jobs Service** (`/api/v1/jobs`)

   - CRUD operations for employment history
   - Current job tracking
   - Employment statistics

2. **Education Service** (`/api/v1/education`)

   - CRUD operations for education records
   - GPA tracking
   - Degree management

3. **Skills Service** (`/api/v1/skills`)

   - CRUD operations for skills
   - Proficiency levels
   - Skill categories

4. **Certifications Service** (`/api/v1/certifications`)

   - CRUD operations for certifications
   - Expiration tracking
   - Organization management

5. **Projects Service** (`/api/v1/projects`)

   - CRUD operations for projects
   - Technology tracking
   - Collaboration management

6. **Files Service** (`/api/v1/files`)
   - File upload/download
   - File management
   - Storage integration

### **Additional Features**

- **Search & Filtering** - Advanced search across all resources
- **Analytics** - User activity and profile insights
- **Export** - PDF resume generation
- **Import** - LinkedIn profile import
- **Notifications** - Email notifications for important events

## 📝 **Testing Strategy**

### **Unit Tests**

- Service layer business logic
- Utility functions
- Validation schemas

### **Integration Tests**

- API endpoint testing
- Database operations
- Authentication flows

### **End-to-End Tests**

- Complete user workflows
- Cross-service interactions
- Error scenarios

## 🔒 **Security Considerations**

### **Authentication**

- Session-based authentication
- Secure session configuration
- Password strength requirements

### **Authorization**

- User-specific data access
- Resource ownership validation
- Admin role considerations

### **Data Protection**

- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### **Rate Limiting**

- Per-endpoint rate limits
- Authentication attempt limits
- IP-based restrictions

## 📊 **Monitoring & Logging**

### **Request Logging**

- Morgan middleware for HTTP requests
- Request/response timing
- Error tracking

### **Database Logging**

- Query execution times
- Error logging
- Connection monitoring

### **Application Metrics**

- Response times
- Error rates
- User activity

---

This documentation provides a comprehensive guide for understanding, implementing, and extending the ATS backend API. The design follows RESTful principles and industry best practices for security, scalability, and maintainability.
