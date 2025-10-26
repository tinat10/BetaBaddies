# Backend Testing Guide

## 📋 Overview

This document provides comprehensive information about testing the ATS Backend API, including available test suites, how to run them, and GitHub Actions CI/CD integration.

## 🧪 Available Test Suites

### 1. Login Functionality Tests (`test`)

Tests user authentication and registration functionality.

```bash
npm test
# or
npm run test
```

**Coverage:**

- Password hashing with bcrypt
- Password verification
- User registration
- User lookup by email
- Complete login flow
- Invalid credentials handling
- Password strength validation
- Email validation
- Duplicate email prevention
- Database connection
- Session data structure

### 2. User API Tests (`test:user-api`)

Tests user API endpoints with real HTTP requests.

```bash
npm run test:user-api
```

**Coverage:**

- User registration endpoint
- Login endpoint
- Profile retrieval
- Password change
- Account deletion
- Logout functionality
- Authentication middleware
- CSRF protection
- Validation errors
- Error handling

### 3. Jobs Service Tests (`test:jobs-service`)

Tests business logic for job management.

```bash
npm run test:jobs-service
```

**Coverage:**

- Job creation
- Job retrieval by ID
- Jobs retrieval by user ID
- Job updates
- Multiple job creation
- Current job management
- Date validation
- User ownership validation
- Job deletion
- Job statistics

### 4. Jobs API Tests (`test:jobs-api`)

Tests job management API endpoints.

```bash
npm run test:jobs-api
```

**Coverage:**

- POST /api/v1/jobs - Create job
- GET /api/v1/jobs - Get all jobs
- GET /api/v1/jobs/current - Get current job
- GET /api/v1/jobs/history - Get job history
- GET /api/v1/jobs/statistics - Get statistics
- GET /api/v1/jobs/:id - Get job by ID
- PUT /api/v1/jobs/:id - Update job
- DELETE /api/v1/jobs/:id - Delete job
- Validation errors
- Authentication and authorization
- CSRF protection

### 5. Certifications Tests (`test:certifications`)

Tests certification service business logic.

```bash
npm run test:certifications
```

**Coverage:**

- Certification creation
- Retrieval by ID and user ID
- Update operations
- Deletion
- Search functionality
- Organization-based queries
- Expiring certifications
- Statistics
- Date validation
- User ownership validation

### 6. Certifications API Tests (`test:certifications-api`)

Tests certification API endpoints.

```bash
npm run test:certifications-api
```

**Coverage:**

- GET /api/v1/certifications - Get all certifications
- POST /api/v1/certifications - Create certification
- GET /api/v1/certifications/:id - Get by ID
- PUT /api/v1/certifications/:id - Update
- DELETE /api/v1/certifications/:id - Delete
- Validation errors
- Date validation
- CSRF protection
- Authentication and authorization

### 7. Run All Tests (`test:all`)

Runs all test suites in sequence.

```bash
npm run test:all
```

**Runs:**

1. Login functionality tests
2. User API tests
3. Jobs service tests
4. Jobs API tests
5. Certifications tests
6. Certifications API tests

**Total Coverage:**

- ~90+ test cases
- Service layer business logic
- API endpoint integration
- Authentication and authorization
- Error handling
- Validation
- CSRF protection

## 🔄 GitHub Actions CI/CD

### Workflow Configuration

The GitHub Actions workflow runs automatically on:

- Push to `main` branch
- Push to `development` branch
- Pull requests targeting `main` or `development`

### Workflow File

Location: `.github/workflows/test.yml`

### What Gets Tested

```yaml
Services:
  - PostgreSQL 14 (test database)

Steps: 1. Checkout code
  2. Setup Node.js 18
  3. Install dependencies (npm ci)
  4. Wait for PostgreSQL
  5. Create test database
  6. Load database schema
  7. Run all tests (npm run test:all)
  8. Upload test results (if any)
```

### Environment Variables

The CI environment uses:

- `DB_HOST`: localhost
- `DB_PORT`: 5432
- `DB_NAME`: ats_tracker_test
- `DB_USER`: postgres
- `DB_PASS`: postgres
- `SERVER_PORT`: 3001
- `NODE_ENV`: test
- `SESSION_SECRET`: test-secret-key
- `FRONTEND_URL`: http://localhost:3000

### Viewing Results

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Backend Tests" workflow
4. View the latest run

## 📊 Test Results

Expected output for each test suite:

```
🧪 Testing [Test Suite]
========================================================

✅ PASSED: [Test Name]
   ✓ [Description]

📊 Test Summary
================
Total Tests: X
Passed: X
Failed: 0

🎉 All tests passed!
```

## 🐛 Debugging Failed Tests

### Common Issues

#### Database Connection Error

```
Error: Could not connect to PostgreSQL
```

**Solution:**

- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify network connectivity

#### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

- Kill the process using port 3001
- Change SERVER_PORT in .env

#### Timeout Error

```
Error: Test suite timeout
```

**Solution:**

- Increase timeout in test file
- Check database performance
- Review test data cleanup

#### Authentication Failures

```
Error: UNAUTHORIZED
```

**Solution:**

- Verify session cookie handling
- Check CSRF token generation
- Ensure middleware order is correct

## 🧹 Test Data Cleanup

All tests automatically clean up after themselves:

- **Users** - Deleted after each test suite
- **Jobs** - Deleted after each test suite
- **Education** - Deleted after each test suite
- **Skills** - Deleted after each test suite
- **Certifications** - Deleted after each test suite

This ensures test isolation and prevents data pollution.

## 📈 Test Coverage

### Service Layer

- ✅ User service
- ✅ Job service
- ✅ Education service
- ✅ Skill service
- ✅ Certification service

### API Endpoints

- ✅ User management endpoints
- ✅ Job management endpoints
- ✅ Education endpoints
- ✅ Skill endpoints
- ✅ Certification endpoints

### Security

- ✅ Authentication middleware
- ✅ CSRF protection
- ✅ Authorization checks
- ✅ Rate limiting
- ✅ Input validation

### Error Handling

- ✅ 400 Bad Request
- ✅ 401 Unauthorized
- ✅ 403 Forbidden
- ✅ 404 Not Found
- ✅ 409 Conflict
- ✅ 422 Validation Error
- ✅ 500 Internal Server Error

## 🚀 Best Practices

### Writing New Tests

1. **Follow the pattern:**

   ```javascript
   await runTest("Test Name", async () => {
     // Test implementation
     if (condition !== expected) {
       throw new Error("Test failed");
     }
     console.log("   ✓ Test passed");
   });
   ```

2. **Clean up data:**

   ```javascript
   // At the end of test suite
   await cleanupTestData();
   ```

3. **Use descriptive test names:**

   ```javascript
   "POST /api/v1/jobs - Create Job with Valid Data";
   ```

4. **Test both success and error cases:**

   ```javascript
   // Success case
   await runTest("Valid input", async () => {
     /* ... */
   });

   // Error case
   await runTest("Invalid input", async () => {
     /* ... */
   });
   ```

### Running Tests Locally

```bash
# Run all tests
npm run test:all

# Run specific test suite
npm run test:user-api

# Run with verbose output
DEBUG=* npm run test:all
```

### Test Data Management

Tests use isolated test data with unique identifiers:

```javascript
const testEmail = `test-${Date.now()}@example.com`;
const testJob = {
  title: "Test Job",
  company: "Test Company",
  startDate: "2023-01-01",
  isCurrent: false,
};
```

## 📝 Adding New Endpoints

When adding new API endpoints:

1. **Update routes** in appropriate route file
2. **Add validation** in `middleware/validation.js`
3. **Add service methods** if needed
4. **Add controller methods**
5. **Create test suite** in `tests/` directory
6. **Add to package.json scripts**
7. **Update test:all command**
8. **Update documentation**

## ✅ Test Checklist

Before pushing code:

- [ ] All existing tests pass
- [ ] New functionality has tests
- [ ] No test data left in database
- [ ] CI/CD will run successfully
- [ ] Documentation is updated
- [ ] Error handling is tested
- [ ] Edge cases are covered

---

## 🔗 Related Documentation

- [API Routes Documentation](./API_ROUTES_DOCUMENTATION.md)
- [API Design Documentation](./API_DESIGN_DOCUMENTATION.md)
- [Status Codes Reference](./STATUS_CODES_REFERENCE.md)
- [Backend README](../README.md)
