# GitHub Actions Test Setup

This document explains how to run tests in GitHub Actions.

## Workflows

### 1. Database Tests (`test.yml`)

- **Trigger:** Every push and PR to main/develop branches
- **Purpose:** Full integration testing with PostgreSQL
- **Database:** PostgreSQL 14 service
- **Duration:** ~2-3 minutes

### 2. Full Test Suite (`full-test.yml`)

- **Trigger:** Only on main branch pushes and PRs to main
- **Purpose:** Complete test coverage
- **Database:** PostgreSQL 14 service
- **Duration:** ~2-3 minutes

## Environment Variables

The workflows use these environment variables:

```yaml
DB_HOST: localhost
DB_PORT: 5432
DB_NAME: ats_tracker_test
DB_USER: postgres
DB_PASS: postgres
SERVER_PORT: 3001
NODE_ENV: test
SESSION_SECRET: test-secret-key
CORS_ORIGIN: http://localhost:3000
```

## Test Commands

### Local Development

```bash
# Run database tests
npm test
```

### GitHub Actions

```bash
# Database tests
npm test
```

## Status Badges

Add these to your README.md:

```markdown
![Database Tests](https://github.com/yourusername/BetaBaddies/workflows/Backend%20Tests/badge.svg)
![Full Tests](https://github.com/yourusername/BetaBaddies/workflows/Full%20Test%20Suite/badge.svg)
```

## Troubleshooting

### Common Issues

1. **PostgreSQL Connection Failed**

   - Check if PostgreSQL service is running
   - Verify database credentials
   - Ensure database exists

2. **Node.js Version Issues**

   - Ensure using Node.js 18+
   - Check package.json engines field

3. **Test Timeout**
   - Increase timeout in workflow
   - Check for hanging database connections

### Debug Commands

```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432 -U postgres

# List databases
psql -h localhost -U postgres -l

# Check test database
psql -h localhost -U postgres -d ats_tracker_test -c "\dt"
```

## Workflow Files

- `.github/workflows/test.yml` - Database integration tests
- `.github/workflows/full-test.yml` - Complete test suite

## Test Artifacts

Test results are uploaded as artifacts and kept for 7 days:

- Test output logs
- Coverage reports (if configured)
- Database dumps (if needed)
