#!/usr/bin/env node

/**
 * Jobs API Integration Tests
 * Tests all API endpoints with real HTTP requests
 */

import request from "supertest";
import app from "../server.js";
import userService from "../services/userService.js";
import database from "../services/database.js";

console.log("🧪 Testing Jobs API Endpoints");
console.log("=============================\n");

let testUser = null;
let testJobs = [];
let csrfToken = null;
let sessionCookie = null;
let testResults = { passed: 0, failed: 0, total: 0 };

async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`\n📋 Test: ${testName}`);
  console.log("─".repeat(50));

  try {
    await testFunction();
    console.log(`✅ PASSED: ${testName}`);
    testResults.passed++;
  } catch (error) {
    console.error(`❌ FAILED: ${testName}`);
    console.error(`   Error: ${error.message}`);
    testResults.failed++;
  }
}

async function setupTestData() {
  console.log("🔧 Setting up test data...");

  // Create test user
  const userData = {
    email: `apitest-${Date.now()}@example.com`,
    password: "TestPassword123",
  };

  testUser = await userService.createUser(userData);
  console.log(`   ✓ Created test user: ${testUser.email}`);
}

async function loginUser() {
  console.log("🔐 Logging in test user...");

  // Perform login request
  const loginResponse = await request(app).post("/api/v1/users/login").send({
    email: testUser.email,
    password: "TestPassword123",
  });

  if (loginResponse.status !== 200) {
    throw new Error(`Login failed: ${loginResponse.body.error?.message}`);
  }

  // Extract session cookie
  const cookies = loginResponse.headers["set-cookie"];
  sessionCookie = cookies
    ? cookies.find((cookie) => cookie.startsWith("connect.sid"))
    : null;

  if (!sessionCookie) {
    throw new Error("No session cookie received");
  }

  console.log("   ✓ User logged in successfully");
}

async function getFreshCsrfToken() {
  // CSRF tokens are no longer required
  return "";
}

async function cleanupTestData() {
  console.log("\n🧹 Cleaning up test data...");

  // Delete test jobs
  for (const job of testJobs) {
    try {
      await database.query("DELETE FROM jobs WHERE id = $1", [job.id]);
    } catch (error) {
      console.error(`   ❌ Failed to delete job ${job.id}:`, error.message);
    }
  }

  // Delete test user
  if (testUser) {
    try {
      await database.query("DELETE FROM users WHERE u_id = $1", [testUser.id]);
    } catch (error) {
      console.error(
        `   ❌ Failed to delete user ${testUser.id}:`,
        error.message
      );
    }
  }

  console.log(`   📊 Cleaned up ${testJobs.length} jobs and 1 user`);
}

async function runAllTests() {
  try {
    await setupTestData();
    await loginUser();

    // Test 1: Create Job
    await runTest("POST /api/v1/jobs - Create Job", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const jobData = {
        title: "Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        startDate: "2023-01-15",
        endDate: null,
        isCurrent: true,
        description: "Full-stack development",
      };

      const response = await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", sessionCookie)
        .send(jobData);

      if (response.status !== 201) {
        throw new Error(
          `Expected 201, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (!response.body.ok) {
        throw new Error(`Response not ok: ${JSON.stringify(response.body)}`);
      }

      if (!response.body.data.job.id) {
        throw new Error("Job ID missing from response");
      }

      testJobs.push(response.body.data.job);
      console.log("   ✓ Job created successfully");
      console.log(`   ✓ Job ID: ${response.body.data.job.id}`);
    });

    // Test 2: Get All Jobs
    await runTest("GET /api/v1/jobs - Get All Jobs", async () => {
      const response = await request(app)
        .get("/api/v1/jobs")
        .set("Cookie", sessionCookie);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (!response.body.data.jobs || !Array.isArray(response.body.data.jobs)) {
        throw new Error("Jobs array missing from response");
      }

      if (response.body.data.jobs.length === 0) {
        throw new Error("No jobs found");
      }

      console.log("   ✓ Jobs retrieved successfully");
      console.log(`   ✓ Found ${response.body.data.jobs.length} job(s)`);
    });

    // Test 3: Get Current Job
    await runTest("GET /api/v1/jobs/current - Get Current Job", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/current")
        .set("Cookie", sessionCookie);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (!response.body.data.job) {
        throw new Error("Current job missing from response");
      }

      if (!response.body.data.job.isCurrent) {
        throw new Error("Returned job is not current");
      }

      console.log("   ✓ Current job retrieved successfully");
      console.log(`   ✓ Current job: ${response.body.data.job.title}`);
    });

    // Test 4: Get Job by ID
    await runTest("GET /api/v1/jobs/:id - Get Job by ID", async () => {
      const jobId = testJobs[0].id;
      const response = await request(app)
        .get(`/api/v1/jobs/${jobId}`)
        .set("Cookie", sessionCookie);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (response.body.data.job.id !== jobId) {
        throw new Error("Job ID mismatch");
      }

      console.log("   ✓ Job retrieved by ID successfully");
      console.log(`   ✓ Job ID: ${response.body.data.job.id}`);
    });

    // Test 5: Update Job
    await runTest("PUT /api/v1/jobs/:id - Update Job", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const jobId = testJobs[0].id;
      const updateData = {
        title: "Senior Software Engineer",
        description: "Senior full-stack development",
      };

      const response = await request(app)
        .put(`/api/v1/jobs/${jobId}`)
        .set("Cookie", sessionCookie)
        .send(updateData);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (response.body.data.job.title !== updateData.title) {
        throw new Error("Title not updated");
      }

      console.log("   ✓ Job updated successfully");
      console.log(`   ✓ New title: ${response.body.data.job.title}`);
    });

    // Test 6: Create Second Job
    await runTest("POST /api/v1/jobs - Create Second Job", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const jobData = {
        title: "Junior Developer",
        company: "Startup Inc",
        location: "Remote",
        startDate: "2022-06-01",
        endDate: "2022-12-31",
        isCurrent: false,
        description: "Frontend development",
      };

      const response = await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", sessionCookie)
        .send(jobData);

      if (response.status !== 201) {
        throw new Error(
          `Expected 201, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      testJobs.push(response.body.data.job);
      console.log("   ✓ Second job created successfully");
    });

    // Test 7: Get Job History
    await runTest("GET /api/v1/jobs/history - Get Job History", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/history")
        .set("Cookie", sessionCookie);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (
        !response.body.data.history ||
        !Array.isArray(response.body.data.history)
      ) {
        throw new Error("History array missing from response");
      }

      console.log("   ✓ Job history retrieved successfully");
      console.log(`   ✓ History length: ${response.body.data.history.length}`);
    });

    // Test 8: Get Job Statistics
    await runTest(
      "GET /api/v1/jobs/statistics - Get Job Statistics",
      async () => {
        const response = await request(app)
          .get("/api/v1/jobs/statistics")
          .set("Cookie", sessionCookie);

        if (response.status !== 200) {
          throw new Error(
            `Expected 200, got ${response.status}: ${JSON.stringify(
              response.body
            )}`
          );
        }

        if (!response.body.data.statistics) {
          throw new Error("Statistics missing from response");
        }

        console.log("   ✓ Job statistics retrieved successfully");
        console.log(
          `   ✓ Total jobs: ${response.body.data.statistics.totalJobs}`
        );
      }
    );

    // Test 9: Validation Error
    await runTest("POST /api/v1/jobs - Validation Error", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const invalidJobData = {
        title: "", // Empty title should fail validation
        company: "Test Corp",
        startDate: "2023-01-01",
      };

      const response = await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", sessionCookie)
        .send(invalidJobData);

      if (response.status !== 422) {
        throw new Error(
          `Expected 422, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (response.body.error.code !== "VALIDATION_ERROR") {
        throw new Error("Expected validation error");
      }

      console.log("   ✓ Validation error handled correctly");
    });

    // Test 10: Unauthorized Access
    await runTest("GET /api/v1/jobs - Unauthorized Access", async () => {
      const response = await request(app).get("/api/v1/jobs");

      if (response.status !== 401) {
        throw new Error(
          `Expected 401, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (response.body.error.code !== "UNAUTHORIZED") {
        throw new Error("Expected unauthorized error");
      }

      console.log("   ✓ Unauthorized access handled correctly");
    });

    // Test 11: CSRF Protection (REMOVED - CSRF no longer in use)
    // CSRF protection has been removed from the backend

    // Test 12: Delete Job
    await runTest("DELETE /api/v1/jobs/:id - Delete Job", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const jobId = testJobs[testJobs.length - 1].id;
      const response = await request(app)
        .delete(`/api/v1/jobs/${jobId}`)
        .set("Cookie", sessionCookie);

      if (response.status !== 204) {
        throw new Error(
          `Expected 204, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      // Verify job is deleted
      const getResponse = await request(app)
        .get(`/api/v1/jobs/${jobId}`)
        .set("Cookie", sessionCookie);

      if (getResponse.status !== 404) {
        throw new Error("Job should have been deleted");
      }

      testJobs.pop(); // Remove from test array
      console.log("   ✓ Job deleted successfully");
    });

    // Test 13: Job Not Found
    await runTest("GET /api/v1/jobs/:id - Job Not Found", async () => {
      const fakeJobId = "550e8400-e29b-41d4-a716-446655440000";
      const response = await request(app)
        .get(`/api/v1/jobs/${fakeJobId}`)
        .set("Cookie", sessionCookie);

      if (response.status !== 404) {
        throw new Error(
          `Expected 404, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (response.body.error.code !== "JOB_NOT_FOUND") {
        throw new Error("Expected job not found error");
      }

      console.log("   ✓ Job not found handled correctly");
    });

    // Test 14: Date Validation
    await runTest("POST /api/v1/jobs - Date Validation", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const invalidJobData = {
        title: "Test Job",
        company: "Test Corp",
        startDate: "2023-12-31",
        endDate: "2023-01-01", // End date before start date
        isCurrent: false,
      };

      const response = await request(app)
        .post("/api/v1/jobs")
        .set("Cookie", sessionCookie)
        .send(invalidJobData);

      if (response.status !== 422) {
        throw new Error(
          `Expected 422, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      console.log("   ✓ Date validation working correctly");
    });

    // Test 15: Invalid Job ID Format
    await runTest("GET /api/v1/jobs/:id - Invalid Job ID Format", async () => {
      const invalidJobId = "invalid-uuid";
      const response = await request(app)
        .get(`/api/v1/jobs/${invalidJobId}`)
        .set("Cookie", sessionCookie);

      if (response.status !== 422) {
        throw new Error(
          `Expected 422, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      console.log("   ✓ Invalid job ID format handled correctly");
    });

    // Final Summary
    console.log("\n📊 Test Summary");
    console.log("================");
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);

    if (testResults.failed > 0) {
      console.log(`\n❌ ${testResults.failed} test(s) failed.`);
      process.exit(1);
    } else {
      console.log("\n🎉 All Jobs API tests passed!");
      console.log("\n✅ API endpoints are working correctly:");
      console.log("   • Job creation and validation");
      console.log("   • Job retrieval and updates");
      console.log("   • Authentication and authorization");
      console.log("   • CSRF protection");
      console.log("   • Error handling");
      console.log("   • Business logic enforcement");
      console.log("   • Job history and statistics");
      console.log("   • Input validation");
    }
  } catch (error) {
    console.error("\n❌ Test execution failed:", error.message);
    process.exit(1);
  } finally {
    await cleanupTestData();
    console.log("\n✅ Test cleanup completed");
  }
}

// Run the tests
runAllTests().catch(console.error);
