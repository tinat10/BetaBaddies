# HTTP Status Codes Reference

## 📊 **Status Code Analysis & Implementation**

This document provides a comprehensive reference for HTTP status codes used in the ATS Backend API, ensuring proper RESTful API design and client-server communication.

## ✅ **Properly Implemented Status Codes**

### **2xx Success Codes**

| Code | Method | Endpoint           | Usage | Description                         |
| ---- | ------ | ------------------ | ----- | ----------------------------------- |
| 200  | GET    | `/profile`         | ✅    | Successful profile retrieval        |
| 200  | PUT    | `/profile`         | ✅    | Successful profile update           |
| 200  | PUT    | `/change-password` | ✅    | Successful password change          |
| 200  | GET    | `/dashboard`       | ✅    | Successful dashboard data retrieval |
| 200  | POST   | `/login`           | ✅    | Successful authentication           |
| 200  | POST   | `/logout`          | ✅    | Successful session termination      |
| 200  | GET    | `/csrf-token`      | ✅    | Successful CSRF token retrieval     |
| 201  | POST   | `/register`        | ✅    | Successful user creation            |
| 204  | DELETE | `/account`         | ✅    | Successful account deletion         |

### **4xx Client Error Codes**

| Code | Usage                | Description                                | Implementation           |
| ---- | -------------------- | ------------------------------------------ | ------------------------ |
| 400  | Bad Request          | Malformed request, missing required fields | ✅ Error Handler         |
| 401  | Unauthorized         | Authentication required or failed          | ✅ Auth Middleware       |
| 403  | Forbidden            | Valid auth but insufficient permissions    | ✅ CSRF Protection       |
| 404  | Not Found            | Resource not found                         | ✅ Controllers           |
| 409  | Conflict             | Resource already exists (duplicate email)  | ✅ Error Handler         |
| 422  | Unprocessable Entity | Validation errors                          | ✅ Validation Middleware |
| 429  | Too Many Requests    | Rate limit exceeded                        | ✅ Rate Limiting         |

### **5xx Server Error Codes**

| Code | Usage                 | Description        | Implementation   |
| ---- | --------------------- | ------------------ | ---------------- |
| 500  | Internal Server Error | Server-side errors | ✅ Error Handler |

## 🔧 **Status Code Implementation Details**

### **Success Responses (2xx)**

#### **200 OK**

Used for successful GET, PUT, and POST operations that don't create new resources.

```javascript
// Example: Profile retrieval
res.status(200).json({
  ok: true,
  data: {
    user: {
      /* user data */
    },
  },
});
```

#### **201 Created**

Used for successful POST operations that create new resources.

```javascript
// Example: User registration
res.status(201).json({
  ok: true,
  data: {
    user: {
      /* new user data */
    },
    message: "User registered successfully",
  },
});
```

#### **204 No Content**

Used for successful DELETE operations.

```javascript
// Example: Account deletion
res.status(204).json({
  ok: true,
  data: {
    message: "Account deleted successfully",
  },
});
```

### **Client Error Responses (4xx)**

#### **400 Bad Request**

Used for malformed requests or missing required fields.

```javascript
// Example: Missing required fields
res.status(400).json({
  ok: false,
  error: {
    code: "BAD_REQUEST",
    message: "Missing required fields",
    fields: {
      email: "Email is required",
    },
  },
});
```

#### **401 Unauthorized**

Used for authentication failures.

```javascript
// Example: Invalid credentials
res.status(401).json({
  ok: false,
  error: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password",
  },
});
```

#### **403 Forbidden**

Used for valid authentication but insufficient permissions.

```javascript
// Example: CSRF token mismatch
res.status(403).json({
  ok: false,
  error: {
    code: "CSRF_TOKEN_MISMATCH",
    message: "Invalid CSRF token",
  },
});
```

#### **404 Not Found**

Used when requested resource doesn't exist.

```javascript
// Example: User not found
res.status(404).json({
  ok: false,
  error: {
    code: "USER_NOT_FOUND",
    message: "User not found",
  },
});
```

#### **409 Conflict**

Used when resource already exists.

```javascript
// Example: Duplicate email
res.status(409).json({
  ok: false,
  error: {
    code: "CONFLICT",
    message: "A resource with this information already exists",
    fields: {
      email: "A user with this email address already exists",
    },
  },
});
```

#### **422 Unprocessable Entity**

Used for validation errors.

```javascript
// Example: Validation failure
res.status(422).json({
  ok: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    fields: {
      password: "Password must contain at least one uppercase letter",
    },
  },
});
```

#### **429 Too Many Requests**

Used when rate limit is exceeded.

```javascript
// Example: Rate limit exceeded
res.status(429).json({
  ok: false,
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again later.",
  },
});
```

### **Server Error Responses (5xx)**

#### **500 Internal Server Error**

Used for unexpected server errors.

```javascript
// Example: Database connection error
res.status(500).json({
  ok: false,
  error: {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  },
});
```

## 🎯 **Status Code Best Practices**

### **Do's**

- ✅ Use 200 for successful GET, PUT operations
- ✅ Use 201 for successful POST operations that create resources
- ✅ Use 204 for successful DELETE operations
- ✅ Use 400 for malformed requests
- ✅ Use 401 for authentication failures
- ✅ Use 403 for authorization failures
- ✅ Use 404 for missing resources
- ✅ Use 409 for resource conflicts
- ✅ Use 422 for validation errors
- ✅ Use 429 for rate limiting
- ✅ Use 500 for server errors

### **Don'ts**

- ❌ Don't use 200 for DELETE operations (use 204)
- ❌ Don't use 400 for validation errors (use 422)
- ❌ Don't use 401 for authorization failures (use 403)
- ❌ Don't use 500 for client errors
- ❌ Don't use custom status codes

## 🔍 **Status Code Testing**

### **Test Cases**

```javascript
// Test successful registration
describe("POST /register", () => {
  it("should return 201 for successful registration", async () => {
    const response = await request(app)
      .post("/api/v1/users/register")
      .send(validUserData);

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
  });
});

// Test validation error
describe("POST /register", () => {
  it("should return 422 for validation error", async () => {
    const response = await request(app)
      .post("/api/v1/users/register")
      .send(invalidUserData);

    expect(response.status).toBe(422);
    expect(response.body.ok).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

// Test authentication failure
describe("POST /login", () => {
  it("should return 401 for invalid credentials", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send(invalidCredentials);

    expect(response.status).toBe(401);
    expect(response.body.ok).toBe(false);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
  });
});
```

## 📋 **Status Code Checklist**

### **For Each Endpoint**

- [ ] Success case returns appropriate 2xx status code
- [ ] Validation errors return 422
- [ ] Authentication errors return 401
- [ ] Authorization errors return 403
- [ ] Not found errors return 404
- [ ] Conflict errors return 409
- [ ] Rate limiting returns 429
- [ ] Server errors return 500

### **For Each Status Code**

- [ ] Consistent error response format
- [ ] Appropriate error messages
- [ ] Proper error codes
- [ ] Field-specific errors when applicable

## 🚀 **Future Considerations**

### **Additional Status Codes**

- **202 Accepted** - For async operations
- **206 Partial Content** - For paginated responses
- **410 Gone** - For permanently deleted resources
- **451 Unavailable For Legal Reasons** - For compliance requirements

### **Custom Error Codes**

- Maintain consistent error code naming
- Use descriptive error messages
- Include field-specific errors for validation
- Provide actionable error information

---

This status code reference ensures consistent, RESTful API design and proper client-server communication patterns throughout the ATS Backend API.
