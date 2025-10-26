# API Routes Documentation

This document provides comprehensive documentation for all implemented API routes in the ATS for Candidates backend.

## Base URL

```
http://localhost:3001/api/v1
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

## Jobs Management Routes (`/api/v1/jobs`)

### Protected Routes (Authentication Required)

#### POST `/api/v1/jobs`

Create a new job entry for the authenticated user.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Request Body:**

```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "startDate": "2023-01-15",
  "endDate": null,
  "isCurrent": true,
  "description": "Full-stack development using React and Node.js"
}
```

**Validation Rules:**

- `title`: Required, string, max 255 characters
- `company`: Required, string, max 255 characters
- `location`: Optional, string, max 255 characters
- `startDate`: Required, valid date (YYYY-MM-DD format)
- `endDate`: Optional, valid date, must be after startDate if provided
- `isCurrent`: Required, boolean
- `description`: Optional, string, max 1000 characters

**Success Response (201):**

```json
{
  "ok": true,
  "data": {
    "job": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2023-01-15",
      "endDate": null,
      "isCurrent": true,
      "description": "Full-stack development using React and Node.js"
    },
    "message": "Job created successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `422` - Validation errors
- `500` - Internal server error

---

#### GET `/api/v1/jobs`

Get all jobs for the authenticated user.

**Headers Required:**

- Session cookie (automatic)

**Query Parameters:**

- `sort` (optional): Sort order (`startDate` or `-startDate`, default: `-startDate`)
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Number of results to skip (default: 0)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "jobs": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Software Engineer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "startDate": "2023-01-15",
        "endDate": null,
        "isCurrent": true,
        "description": "Full-stack development"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    },
    "currentJob": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Software Engineer",
      "company": "Tech Corp"
    },
    "statistics": {
      "totalJobs": 1,
      "currentJobs": 1,
      "pastJobs": 0
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `500` - Internal server error

---

#### GET `/api/v1/jobs/current`

Get the user's current job.

**Headers Required:**

- Session cookie (automatic)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "job": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2023-01-15",
      "endDate": null,
      "isCurrent": true,
      "description": "Full-stack development"
    }
  }
}
```

**Success Response (200) - No Current Job:**

```json
{
  "ok": true,
  "data": {
    "job": null,
    "message": "No current job found"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `500` - Internal server error

---

#### GET `/api/v1/jobs/history`

Get job history in chronological order (timeline view).

**Headers Required:**

- Session cookie (automatic)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "history": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Software Engineer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "startDate": "2023-01-15",
        "endDate": null,
        "isCurrent": true,
        "description": "Full-stack development"
      }
    ],
    "total": 1
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `500` - Internal server error

---

#### GET `/api/v1/jobs/statistics`

Get job statistics for the authenticated user.

**Headers Required:**

- Session cookie (automatic)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "statistics": {
      "totalJobs": 3,
      "currentJobs": 1,
      "pastJobs": 2,
      "earliestStart": "2020-01-01",
      "latestEnd": "2022-12-31"
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `500` - Internal server error

---

#### GET `/api/v1/jobs/:id`

Get a specific job by ID.

**Headers Required:**

- Session cookie (automatic)

**Path Parameters:**

- `id`: Job UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "job": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2023-01-15",
      "endDate": null,
      "isCurrent": true,
      "description": "Full-stack development"
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - Job not found or doesn't belong to user
- `422` - Invalid job ID format
- `500` - Internal server error

---

#### PUT `/api/v1/jobs/:id`

Update an existing job.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Path Parameters:**

- `id`: Job UUID

**Request Body:**

```json
{
  "title": "Senior Software Engineer",
  "description": "Senior full-stack development"
}
```

**Validation Rules:**

- All fields optional (partial updates supported)
- Same validation rules as create job

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "job": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2023-01-15",
      "endDate": null,
      "isCurrent": true,
      "description": "Senior full-stack development"
    },
    "message": "Job updated successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `404` - Job not found or doesn't belong to user
- `422` - Validation errors or invalid job ID format
- `500` - Internal server error

---

#### DELETE `/api/v1/jobs/:id`

Delete a job entry.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Path Parameters:**

- `id`: Job UUID

**Success Response (204):**

```json
{
  "ok": true,
  "data": {
    "message": "Job deleted successfully",
    "deletedJob": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Software Engineer",
      "company": "Tech Corp"
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `404` - Job not found or doesn't belong to user
- `422` - Invalid job ID format
- `500` - Internal server error

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

## Education Management Routes (`/api/v1/education`)

All education endpoints require authentication.

### GET `/api/v1/education`

Get all education entries for the current user.

**Headers Required:**

- Session cookie (automatic)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "educations": [
      {
        "id": "uuid",
        "userId": "uuid",
        "school": "University of Technology",
        "degreeType": "Bachelor's",
        "field": "Computer Science",
        "gpa": "3.75",
        "isEnrolled": false,
        "honors": "Summa Cum Laude"
      }
    ]
  }
}
```

**Error Responses:**

- `401` - Not authenticated

---

### POST `/api/v1/education`

Create a new education entry.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Request Body:**

```json
{
  "school": "University of Technology",
  "degreeType": "Bachelor's",
  "field": "Computer Science",
  "gpa": 3.75,
  "isEnrolled": false,
  "honors": "Summa Cum Laude"
}
```

**Validation Rules:**

- `school`: Required, max 255 characters
- `degreeType`: Required, one of: "High School", "Associate", "Bachelor's", "Master's", "PhD", "Certificate", "Diploma"
- `field`: Optional, max 255 characters
- `gpa`: Optional, number between 0 and 4.0
- `isEnrolled`: Required, boolean
- `honors`: Optional, max 1000 characters

**Success Response (201):**

```json
{
  "ok": true,
  "data": {
    "education": {
      "id": "uuid",
      "userId": "uuid",
      "school": "University of Technology",
      "degreeType": "Bachelor's",
      "field": "Computer Science",
      "gpa": "3.75",
      "isEnrolled": false,
      "honors": "Summa Cum Laude"
    },
    "message": "Education entry created successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `422` - Validation errors

---

### GET `/api/v1/education/:id`

Get a specific education entry by ID.

**Headers Required:**

- Session cookie (automatic)

**URL Parameters:**

- `id`: Education entry UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "education": {
      "id": "uuid",
      "userId": "uuid",
      "school": "University of Technology",
      "degreeType": "Bachelor's",
      "field": "Computer Science",
      "gpa": "3.75",
      "isEnrolled": false,
      "honors": "Summa Cum Laude"
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - Education not found

---

### PUT `/api/v1/education/:id`

Update an education entry.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**URL Parameters:**

- `id`: Education entry UUID

**Request Body:**

```json
{
  "school": "Updated University Name",
  "gpa": 3.8
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "education": {
      "id": "uuid",
      "userId": "uuid",
      "school": "Updated University Name",
      "degreeType": "Bachelor's",
      "field": "Computer Science",
      "gpa": "3.8",
      "isEnrolled": false,
      "honors": "Summa Cum Laude"
    },
    "message": "Education entry updated successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `404` - Education not found
- `422` - Validation errors

---

### DELETE `/api/v1/education/:id`

Delete an education entry.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**URL Parameters:**

- `id`: Education entry UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "message": "Education entry deleted successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `404` - Education not found

---

---

## Certifications Management Routes (`/api/v1/certifications`)

### Protected Routes (Authentication Required)

#### GET `/api/v1/certifications`

Get all certifications for the authenticated user.

**Headers Required:**

- Session cookie (automatic)

**Query Parameters:**

- `neverExpires` (optional): Filter by expiration status (true/false)
- `sort` (optional): Sort order (`dateEarned` or `-dateEarned`, default: `-dateEarned`)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "certifications": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "AWS Certified Solutions Architect",
        "orgName": "Amazon Web Services",
        "dateEarned": "2023-01-15",
        "expirationDate": "2026-01-15",
        "neverExpires": false
      }
    ]
  }
}
```

#### POST `/api/v1/certifications`

Create a new certification.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Request Body:**

```json
{
  "name": "AWS Certified Solutions Architect",
  "orgName": "Amazon Web Services",
  "dateEarned": "2023-01-15",
  "expirationDate": "2026-01-15",
  "neverExpires": false
}
```

**Validation Rules:**

- `name`: Required, string, max 255 characters
- `orgName`: Required, string, max 255 characters
- `dateEarned`: Required, valid date (YYYY-MM-DD format)
- `expirationDate`: Optional, valid date, must be after dateEarned if provided
- `neverExpires`: Required, boolean - if true, expirationDate is ignored

**Success Response (201):**

```json
{
  "ok": true,
  "data": {
    "certification": {
      "id": "uuid",
      "userId": "uuid",
      "name": "AWS Certified Solutions Architect",
      "orgName": "Amazon Web Services",
      "dateEarned": "2023-01-15",
      "expirationDate": "2026-01-15",
      "neverExpires": false
    },
    "message": "Certification created successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `422` - Validation errors
- `500` - Internal server error

---

#### GET `/api/v1/certifications/:id`

Get a specific certification by ID.

**Headers Required:**

- Session cookie (automatic)

**Path Parameters:**

- `id`: Certification UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "certification": {
      "id": "uuid",
      "userId": "uuid",
      "name": "AWS Certified Solutions Architect",
      "orgName": "Amazon Web Services",
      "dateEarned": "2023-01-15",
      "expirationDate": "2026-01-15",
      "neverExpires": false
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - Certification not found
- `422` - Invalid certification ID format

---

#### PUT `/api/v1/certifications/:id`

Update a certification.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Path Parameters:**

- `id`: Certification UUID

**Request Body (all fields optional):**

```json
{
  "name": "Updated Certification Name",
  "expirationDate": "2027-01-15"
}
```

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "certification": {
      "id": "uuid",
      "userId": "uuid",
      "name": "Updated Certification Name",
      "orgName": "Amazon Web Services",
      "dateEarned": "2023-01-15",
      "expirationDate": "2027-01-15",
      "neverExpires": false
    },
    "message": "Certification updated successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `404` - Certification not found
- `422` - Validation errors

---

#### DELETE `/api/v1/certifications/:id`

Delete a certification.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Path Parameters:**

- `id`: Certification UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "message": "Certification deleted successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `404` - Certification not found
- `422` - Invalid certification ID format

---

## Skills Management Routes (`/api/v1/skills`)

All skills endpoints require authentication.

### GET `/api/v1/skills`

Get all skills for the current user, optionally filtered by category.

**Headers Required:**

- Session cookie (automatic)

**Query Parameters:**

- `category` (optional): Filter by category (Technical, Soft Skills, Languages, Industry-Specific)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "skills": [
      {
        "id": "uuid",
        "userId": "uuid",
        "skillName": "JavaScript",
        "proficiency": "Advanced",
        "category": "Technical",
        "skillBadge": "https://example.com/js-badge.png"
      },
      {
        "id": "uuid",
        "userId": "uuid",
        "skillName": "Communication",
        "proficiency": "Expert",
        "category": "Soft Skills",
        "skillBadge": null
      }
    ]
  }
}
```

**Error Responses:**

- `401` - Not authenticated

---

### GET `/api/v1/skills/categories`

Get skills grouped by category with category counts.

**Headers Required:**

- Session cookie (automatic)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "skillsByCategory": {
      "Technical": [
        {
          "id": "uuid",
          "skillName": "JavaScript",
          "proficiency": "Advanced",
          "category": "Technical",
          "skillBadge": "https://example.com/js-badge.png"
        }
      ],
      "Soft Skills": [
        {
          "id": "uuid",
          "skillName": "Communication",
          "proficiency": "Expert",
          "category": "Soft Skills",
          "skillBadge": null
        }
      ]
    },
    "categoryCounts": {
      "Technical": 5,
      "Soft Skills": 3,
      "Languages": 2
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated

---

### POST `/api/v1/skills`

Create a new skill.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Request Body:**

```json
{
  "skillName": "Python",
  "proficiency": "Intermediate",
  "category": "Technical",
  "skillBadge": "https://example.com/python-badge.png"
}
```

**Validation Rules:**

- `skillName`: Required, max 100 characters
- `proficiency`: Required, one of: "Beginner", "Intermediate", "Advanced", "Expert"
- `category`: Optional, one of: "Technical", "Soft Skills", "Languages", "Industry-Specific"
- `skillBadge`: Optional, valid URI, max 500 characters

**Success Response (201):**

```json
{
  "ok": true,
  "data": {
    "skill": {
      "id": "uuid",
      "userId": "uuid",
      "skillName": "Python",
      "proficiency": "Intermediate",
      "category": "Technical",
      "skillBadge": "https://example.com/python-badge.png"
    },
    "message": "Skill created successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `409` - Duplicate skill (skill already exists for this user)
- `422` - Validation errors

---

### GET `/api/v1/skills/:id`

Get a specific skill by ID.

**Headers Required:**

- Session cookie (automatic)

**URL Parameters:**

- `id`: Skill UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "skill": {
      "id": "uuid",
      "userId": "uuid",
      "skillName": "JavaScript",
      "proficiency": "Advanced",
      "category": "Technical",
      "skillBadge": "https://example.com/js-badge.png"
    }
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `404` - Skill not found

---

### PUT `/api/v1/skills/:id`

Update a skill (skill name cannot be changed).

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**URL Parameters:**

- `id`: Skill UUID

**Request Body:**

```json
{
  "proficiency": "Expert",
  "category": "Technical",
  "skillBadge": "https://example.com/js-expert-badge.png"
}
```

**Note:** All fields are optional. `skillName` cannot be updated once created.

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "skill": {
      "id": "uuid",
      "userId": "uuid",
      "skillName": "JavaScript",
      "proficiency": "Expert",
      "category": "Technical",
      "skillBadge": "https://example.com/js-expert-badge.png"
    },
    "message": "Skill updated successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `404` - Skill not found
- `422` - Validation errors

---

### DELETE `/api/v1/skills/:id`

Delete a skill.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**URL Parameters:**

- `id`: Skill UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "message": "Skill deleted successfully"
  }
}
```

**Error Responses:**

- `401` - Not authenticated
- `403` - Invalid CSRF token
- `404` - Skill not found

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

| Code                    | Description                             |
| ----------------------- | --------------------------------------- |
| `UNAUTHORIZED`          | Authentication required                 |
| `INVALID_CREDENTIALS`   | Invalid email or password               |
| `INVALID_PASSWORD`      | Current password is incorrect           |
| `USER_NOT_FOUND`        | User not found                          |
| `CSRF_TOKEN_MISMATCH`   | Invalid CSRF token                      |
| `VALIDATION_ERROR`      | Input validation failed                 |
| `CONFLICT`              | Resource already exists                 |
| `EDUCATION_NOT_FOUND`   | Education entry not found               |
| `SKILL_NOT_FOUND`       | Skill not found                         |
| `DUPLICATE_SKILL`       | Skill already exists                    |
| `RATE_LIMIT_EXCEEDED`   | Too many requests                       |
| `INTERNAL_SERVER_ERROR` | Unexpected server error                 |
| Code                    | Description                             |
| ----------------------- | --------------------------------------- |
| `UNAUTHORIZED`          | Authentication required                 |
| `INVALID_CREDENTIALS`   | Invalid email or password               |
| `INVALID_PASSWORD`      | Current password is incorrect           |
| `USER_NOT_FOUND`        | User not found                          |
| `JOB_NOT_FOUND`         | Job not found or doesn't belong to user |
| `INVALID_DATE_RANGE`    | End date must be after start date       |
| `MULTIPLE_CURRENT_JOBS` | Only one current job allowed per user   |
| `CSRF_TOKEN_MISMATCH`   | Invalid CSRF token                      |
| `VALIDATION_ERROR`      | Input validation failed                 |
| `CONFLICT`              | Resource already exists                 |
| `RATE_LIMIT_EXCEEDED`   | Too many requests                       |
| `INTERNAL_SERVER_ERROR` | Unexpected server error                 |

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

### Jobs API Usage

```bash
# Create a new job
curl -X POST http://localhost:5000/api/v1/jobs \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -b cookies.txt \
  -d '{
    "title": "Software Engineer",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "startDate": "2023-01-15",
    "isCurrent": true,
    "description": "Full-stack development"
  }'

# Get all jobs
curl -X GET http://localhost:5000/api/v1/jobs \
  -b cookies.txt

# Get current job
curl -X GET http://localhost:5000/api/v1/jobs/current \
  -b cookies.txt

# Get job by ID
curl -X GET http://localhost:5000/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000 \
  -b cookies.txt

# Update job
curl -X PUT http://localhost:5000/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -b cookies.txt \
  -d '{
    "title": "Senior Software Engineer",
    "description": "Senior full-stack development"
  }'

# Delete job
curl -X DELETE http://localhost:5000/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000 \
  -H "X-CSRF-Token: your-csrf-token" \
  -b cookies.txt

# Get job history
curl -X GET http://localhost:5000/api/v1/jobs/history \
  -b cookies.txt

# Get job statistics
curl -X GET http://localhost:5000/api/v1/jobs/statistics \
  -b cookies.txt
```

---

## Projects Management Routes (`/api/v1/projects`)

### Protected Routes (Authentication Required)

#### POST `/api/v1/projects`

Create a new project entry for the authenticated user's portfolio.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**Request Body:**

```json
{
  "name": "E-Commerce Platform",
  "description": "Full-stack e-commerce application with payment integration",
  "link": "https://github.com/username/ecommerce",
  "startDate": "2023-01-01",
  "endDate": "2023-06-30",
  "technologies": "React, Node.js, PostgreSQL, Stripe",
  "collaborators": "Team of 5 developers",
  "status": "Completed",
  "industry": "E-Commerce"
}
```

**Validation Rules:**

- `name`: Required, string, max 255 characters
- `description`: Optional, string, max 500 characters
- `link`: Optional, valid URL, max 500 characters
- `startDate`: Required, valid date (YYYY-MM-DD format)
- `endDate`: Optional, valid date, must be after startDate if provided
- `technologies`: Optional, string, max 500 characters (comma-separated recommended)
- `collaborators`: Optional, string, max 255 characters
- `status`: Required, enum: "Completed", "Ongoing", "Planned"
- `industry`: Optional, string, max 255 characters

**Success Response (201):**

```json
{
  "ok": true,
  "data": {
    "project": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "E-Commerce Platform",
      "description": "Full-stack e-commerce application with payment integration",
      "link": "https://github.com/username/ecommerce",
      "startDate": "2023-01-01",
      "endDate": "2023-06-30",
      "technologies": "React, Node.js, PostgreSQL, Stripe",
      "collaborators": "Team of 5 developers",
      "status": "Completed",
      "industry": "E-Commerce"
    },
    "message": "Project created successfully"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

---

#### GET `/api/v1/projects`

Get all projects for the authenticated user with optional filtering and sorting.

**Headers Required:**

- Session cookie (automatic)

**Query Parameters (all optional):**

- `status`: Filter by status ("Completed", "Ongoing", "Planned")
- `industry`: Filter by industry
- `technology`: Search for specific technology in projects
- `startDateFrom`: Filter projects starting from this date (YYYY-MM-DD)
- `startDateTo`: Filter projects starting up to this date (YYYY-MM-DD)
- `sortBy`: Sort field ("start_date", "end_date", "name", "status", "industry")
- `sortOrder`: Sort order ("ASC", "DESC")

**Example Requests:**

```
GET /api/v1/projects
GET /api/v1/projects?status=Completed
GET /api/v1/projects?technology=React
GET /api/v1/projects?industry=E-Commerce&sortBy=start_date&sortOrder=DESC
```

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "projects": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "userId": "123e4567-e89b-12d3-a456-426614174000",
        "name": "E-Commerce Platform",
        "description": "Full-stack e-commerce application",
        "link": "https://github.com/username/ecommerce",
        "startDate": "2023-01-01",
        "endDate": "2023-06-30",
        "technologies": "React, Node.js, PostgreSQL, Stripe",
        "collaborators": "Team of 5 developers",
        "status": "Completed",
        "industry": "E-Commerce"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "userId": "123e4567-e89b-12d3-a456-426614174000",
        "name": "AI Chatbot",
        "description": "AI-powered customer service chatbot",
        "link": null,
        "startDate": "2024-01-15",
        "endDate": null,
        "technologies": "Python, TensorFlow, FastAPI",
        "collaborators": "Team of 3",
        "status": "Ongoing",
        "industry": "AI/ML"
      }
    ],
    "count": 2,
    "filters": {
      "status": "Completed"
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

---

#### GET `/api/v1/projects/:id`

Get a specific project by ID.

**Headers Required:**

- Session cookie (automatic)

**URL Parameters:**

- `id`: Project UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "project": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "E-Commerce Platform",
      "description": "Full-stack e-commerce application",
      "link": "https://github.com/username/ecommerce",
      "startDate": "2023-01-01",
      "endDate": "2023-06-30",
      "technologies": "React, Node.js, PostgreSQL, Stripe",
      "collaborators": "Team of 5 developers",
      "status": "Completed",
      "industry": "E-Commerce"
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Project not found or doesn't belong to user
- `500 Internal Server Error`: Server error

---

#### GET `/api/v1/projects/search`

Search projects by text across name, description, technologies, and industry.

**Headers Required:**

- Session cookie (automatic)

**Query Parameters:**

- `q`: Search query (required)

**Example Request:**

```
GET /api/v1/projects/search?q=chatbot
```

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "projects": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "userId": "123e4567-e89b-12d3-a456-426614174000",
        "name": "AI Chatbot",
        "description": "AI-powered customer service chatbot",
        "link": null,
        "startDate": "2024-01-15",
        "endDate": null,
        "technologies": "Python, TensorFlow, FastAPI",
        "collaborators": "Team of 3",
        "status": "Ongoing",
        "industry": "AI/ML"
      }
    ],
    "count": 1,
    "query": "chatbot"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing or empty search query
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

---

#### GET `/api/v1/projects/statistics`

Get project statistics for the authenticated user.

**Headers Required:**

- Session cookie (automatic)

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "statistics": {
      "total": 5,
      "byStatus": {
        "Completed": 3,
        "Ongoing": 1,
        "Planned": 1
      },
      "uniqueTechnologies": 12
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

---

#### PUT `/api/v1/projects/:id`

Update an existing project.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**URL Parameters:**

- `id`: Project UUID

**Request Body (all fields optional):**

```json
{
  "name": "Updated E-Commerce Platform",
  "description": "Updated description with microservices architecture",
  "link": "https://github.com/username/ecommerce-v2",
  "startDate": "2023-01-01",
  "endDate": "2023-08-30",
  "technologies": "React, Node.js, PostgreSQL, Docker, Kubernetes",
  "collaborators": "Team of 8 developers",
  "status": "Completed",
  "industry": "E-Commerce"
}
```

**Validation Rules:**

- Same as POST `/api/v1/projects` but all fields are optional
- Can perform partial updates

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "project": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Updated E-Commerce Platform",
      "description": "Updated description with microservices architecture",
      "link": "https://github.com/username/ecommerce-v2",
      "startDate": "2023-01-01",
      "endDate": "2023-08-30",
      "technologies": "React, Node.js, PostgreSQL, Docker, Kubernetes",
      "collaborators": "Team of 8 developers",
      "status": "Completed",
      "industry": "E-Commerce"
    },
    "message": "Project updated successfully"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Project not found or doesn't belong to user
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

---

#### DELETE `/api/v1/projects/:id`

Delete a project.

**Headers Required:**

- Session cookie (automatic)
- `X-CSRF-Token`: CSRF token

**URL Parameters:**

- `id`: Project UUID

**Success Response (200):**

```json
{
  "ok": true,
  "data": {
    "message": "Project deleted successfully"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Project not found or doesn't belong to user
- `500 Internal Server Error`: Server error

---

### cURL Examples - Projects

```bash
# Create a new project
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -b cookies.txt \
  -d '{
    "name": "E-Commerce Platform",
    "description": "Full-stack e-commerce application",
    "link": "https://github.com/username/ecommerce",
    "startDate": "2023-01-01",
    "endDate": "2023-06-30",
    "technologies": "React, Node.js, PostgreSQL",
    "collaborators": "Team of 5",
    "status": "Completed",
    "industry": "E-Commerce"
  }'

# Get all projects
curl -X GET http://localhost:5000/api/v1/projects \
  -b cookies.txt

# Get projects with filters
curl -X GET "http://localhost:5000/api/v1/projects?status=Completed&sortBy=start_date&sortOrder=DESC" \
  -b cookies.txt

# Search projects
curl -X GET "http://localhost:5000/api/v1/projects/search?q=chatbot" \
  -b cookies.txt

# Get project statistics
curl -X GET http://localhost:5000/api/v1/projects/statistics \
  -b cookies.txt

# Get project by ID
curl -X GET http://localhost:5000/api/v1/projects/550e8400-e29b-41d4-a716-446655440000 \
  -b cookies.txt

# Update project
curl -X PUT http://localhost:5000/api/v1/projects/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -b cookies.txt \
  -d '{
    "description": "Updated description",
    "status": "Completed",
    "endDate": "2023-08-30"
  }'

# Delete project
curl -X DELETE http://localhost:5000/api/v1/projects/550e8400-e29b-41d4-a716-446655440000 \
  -H "X-CSRF-Token: your-csrf-token" \
  -b cookies.txt
```

---

## Notes

1. **CSRF Protection**: All state-changing operations (POST, PUT, DELETE) require a valid CSRF token in the `X-CSRF-Token` header.

2. **Session Management**: Sessions are managed via HTTP-only cookies and expire after 24 hours.

3. **Rate Limiting**: Authentication endpoints have rate limiting to prevent brute force attacks.

4. **Validation**: All input is validated using Joi schemas with detailed error messages.

5. **Error Handling**: All errors return consistent JSON format with appropriate HTTP status codes.

6. **Database**: Uses PostgreSQL with connection pooling for optimal performance.
