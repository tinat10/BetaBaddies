# Backend Tests

This directory contains all test files for the backend application.

## Test Files

- `login-functionality.test.js` - Comprehensive login functionality tests using real database

## Running Tests

### Run Tests

```bash
cd /Users/farazmerchant/BetaBaddies/backend
npm test
```

### Run Test Directly

```bash
# Login functionality test (with database)
node tests/login-functionality.test.js
```

## Test Structure

### Login Functionality Test

- Uses actual PostgreSQL database
- Creates test users with unique emails
- Tests all core authentication features
- Cleans up test data after completion
- Tests: password hashing, verification, user registration, lookup, login flow, error handling, validation

## Requirements

- PostgreSQL database running
- All backend dependencies installed
- Environment variables configured in `.env`
