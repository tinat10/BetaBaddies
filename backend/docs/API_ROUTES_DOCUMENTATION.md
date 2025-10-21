# API Routes Documentation

This document provides comprehensive documentation for all implemented API routes in the ATS for Candidates backend.

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

- **Session-based authentication** using HTTP-only cookies
- **CSRF protection** required for all state-changing operations
- **Rate limiting** applied to authentication endpoints

## Response Format

All API responses follow this standardized format:

### Success Response

```json
{
  "ok": true,
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "fields": {
      // Field-specific validation errors (optional)
    }
  }
}
```

---

## User Management Routes (`/api/v1/users`)

### Public Routes (No Authentication Required)

#### POST `/api/v1/users/register`

Create a new user account.

**Rate Limit:** 5 attempts per 15 minutes per IP

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**

- `email`: Required, valid email format
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, and number

**Success Response (201):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "message": "User registered successfully"
  }
}
```

**Error Responses:**

- `409` - Email already exists
- `422` - Validation errors
- `429` - Rate limit exceeded

---

#### POST `/api/v1/users/login`

Authenticate user and create session.

**Rate Limit:** 10 attempts per 15 minutes per IP

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john.doe@example.com"
    },
    "message": "Login successful"
  }
}
```

**Error Responses:**

- `401` - Invalid credentials
- `422` - Validation errors
- `429` - Rate limit exceeded

---

#### POST `/api/v1/users/logout`

End user session.

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "message": "Logout successful"
  }
}
```

---

#### GET `/api/v1/users/csrf-token`

Get CSRF token for form submissions.

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "csrfToken": "random-csrf-token-string"
  }
}
```

---

### Protected Routes (Authentication Required)

#### GET `/api/v1/users/profile`

Get current user's basic information.

**Headers Required:**

- Session cookie (automatic)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - User not found

---

#### PUT `/api/v1/users/change-password`

Change user's password.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Request Body:**

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

**Validation Rules:**

- `currentPassword`: Required
- `newPassword`: Required, minimum 8 characters, must contain uppercase, lowercase, and number

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "message": "Password updated successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated or invalid current password
- `403` - Invalid CSRF token
- `404` - User not found
- `422` - Validation errors

---

#### DELETE `/api/v1/users/account`

Delete user account and all associated data.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Success Response (204):**

```json
{
  "ok": true,
  "data": {
    "message": "Account deleted successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token

---

## Health Check

#### GET `/health`

Check server health status.

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

---

## HTTP Status Codes

| Code | Description           | Usage                                           |
| ---- | --------------------- | ----------------------------------------------- |
| 200  | OK                    | Successful GET, PUT, POST (login/logout)        |
| 201  | Created               | Successful POST (registration)                  |
| 204  | No Content            | Successful DELETE                               |
| 400  | Bad Request           | Invalid request format                          |
| 401  | Unauthorized          | Authentication required or invalid credentials  |
| 403  | Forbidden             | CSRF token mismatch or access denied            |
| 404  | Not Found             | Resource not found                              |
| 409  | Conflict              | Duplicate resource (e.g., email already exists) |
| 422  | Unprocessable Entity  | Validation errors                               |
| 429  | Too Many Requests     | Rate limit exceeded                             |
| 500  | Internal Server Error | Server error                                    |

---

## Error Codes

| Code                    | Description                   |
| ----------------------- | ----------------------------- |
| `UNAUTHORIZED`          | Authentication required       |
| `INVALID_CREDENTIALS`   | Invalid email or password     |
| `INVALID_PASSWORD`      | Current password is incorrect |
| `USER_NOT_FOUND`        | User not found                |
| `CSRF_TOKEN_MISMATCH`   | Invalid CSRF token            |
| `VALIDATION_ERROR`      | Input validation failed       |
| `CONFLICT`              | Resource already exists       |
| `RATE_LIMIT_EXCEEDED`   | Too many requests             |
| `INTERNAL_SERVER_ERROR` | Unexpected server error       |

---

## Usage Examples

### Registration Flow

```bash
# 1. Get CSRF token
curl -X GET http://localhost:5000/api/v1/users/csrf-token

# 2. Register new user
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

### Login Flow

```bash
# 1. Get CSRF token
curl -X GET http://localhost:5000/api/v1/users/csrf-token

# 2. Login
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -c cookies.txt \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

### Protected Route Access

```bash
# Get profile (using session cookie)
curl -X GET http://localhost:5000/api/v1/users/profile \
  -b cookies.txt

# Update profile
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -b cookies.txt \
  -d '{
    "jobTitle": "Senior Software Engineer",
    "bio": "Updated bio text"
  }'
```

---

## Notes

1. **CSRF Protection**: All state-changing operations (POST, PUT, DELETE) require a valid CSRF token in the `X-CSRF-Token` header.

2. **Session Management**: Sessions are managed via HTTP-only cookies and expire after 24 hours.

3. **Rate Limiting**: Authentication endpoints have rate limiting to prevent brute force attacks.

4. **Validation**: All input is validated using Joi schemas with detailed error messages.

5. **Error Handling**: All errors return consistent JSON format with appropriate HTTP status codes.

6. **Database**: Uses PostgreSQL with connection pooling for optimal performance.
