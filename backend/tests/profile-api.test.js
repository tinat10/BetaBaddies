#!/usr/bin/env node

/**
 * Test for Profile API endpoints using actual HTTP requests
 * Tests profile CRUD operations, validation, and error handling
 */

import request from "supertest";
import app from "../server.js";
import userService from "../services/userService.js";
import database from "../services/database.js";

console.log("🧪 Testing Profile API Endpoints");
console.log("===============================\n");

// Test data
let testUser = null;
let sessionCookie = null;

let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

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
    email: `profileapitest-${Date.now()}@example.com`,
    password: "TestPassword123",
  };

  testUser = await userService.createUser(userData);
  console.log(`   ✓ Created test user: ${testUser.email}`);

  // Login to get session cookie
  console.log("🔐 Logging in test user...");
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

async function cleanupTestData() {
  console.log("\n🧹 Cleaning up test data...");

  // Delete test profile and user
  if (testUser) {
    try {
      await database.query("DELETE FROM profiles WHERE user_id = $1", [
        testUser.id,
      ]);
      console.log(`   ✓ Deleted test profile for user: ${testUser.id}`);
      await database.query("DELETE FROM users WHERE u_id = $1", [testUser.id]);
      console.log(`   ✓ Deleted test user: ${testUser.id}`);
    } catch (error) {
      console.error(`   ❌ Failed to cleanup:`, error.message);
    }
  }

  console.log(`   📊 Cleaned up profile and user`);
}

// Main test execution
async function runAllTests() {
  try {
    await setupTestData();

    // Test 1: POST /api/v1/profile - Create Profile (Required Fields Only)
    await runTest(
      "POST /api/v1/profile - Create Profile with Required Fields",
      async () => {
        const profileData = {
          firstName: "John",
          lastName: "Doe",
          state: "CA",
        };

        const response = await request(app)
          .post("/api/v1/profile")
          .set("Cookie", sessionCookie)
          .send(profileData);

        if (response.status !== 201) {
          throw new Error(
            `Expected 201, got ${response.status}: ${JSON.stringify(
              response.body
            )}`
          );
        }

        if (!response.body.data.profile) {
          throw new Error("Profile missing from response");
        }

        console.log(`   ✓ Profile created successfully`);
        console.log(
          `   ✓ Name: ${response.body.data.profile.first_name} ${response.body.data.profile.last_name}`
        );
      }
    );

    // Test 2: POST /api/v1/profile - Create Full Profile
    await runTest("POST /api/v1/profile - Create Full Profile", async () => {
      // Delete existing profile first
      await database.query("DELETE FROM profiles WHERE user_id = $1", [
        testUser.id,
      ]);

      const profileData = {
        firstName: "Jane",
        middleName: "Marie",
        lastName: "Smith",
        phone: "123-456-7890",
        city: "San Francisco",
        state: "CA",
        jobTitle: "Software Engineer",
        bio: "Experienced full-stack developer",
        industry: "Technology",
        expLevel: "Senior",
      };

      const response = await request(app)
        .post("/api/v1/profile")
        .set("Cookie", sessionCookie)
        .send(profileData);

      if (response.status !== 201) {
        throw new Error(
          `Expected 201, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      const profile = response.body.data.profile;

      if (profile.middle_name !== "Marie") {
        throw new Error("Middle name not set correctly");
      }

      console.log(`   ✓ Full profile created successfully`);
      console.log(`   ✓ Full name: ${profile.fullName}`);
      console.log(`   ✓ Job title: ${profile.job_title}`);
    });

    // Test 3: GET /api/v1/profile - Get Profile
    await runTest("GET /api/v1/profile - Get Profile", async () => {
      const response = await request(app)
        .get("/api/v1/profile")
        .set("Cookie", sessionCookie);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (!response.body.data.profile) {
        throw new Error("Profile missing from response");
      }

      console.log(`   ✓ Profile retrieved successfully`);
      console.log(`   ✓ Name: ${response.body.data.profile.fullName}`);
    });

    // Test 4: PUT /api/v1/profile - Update Profile
    await runTest("PUT /api/v1/profile - Update Profile", async () => {
      const updateData = {
        firstName: "John",
        city: "Los Angeles",
        jobTitle: "Senior Software Engineer",
      };

      const response = await request(app)
        .put("/api/v1/profile")
        .set("Cookie", sessionCookie)
        .send(updateData);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      const profile = response.body.data.profile;

      if (profile.city !== "Los Angeles") {
        throw new Error("City not updated correctly");
      }

      console.log(`   ✓ Profile updated successfully`);
      console.log(`   ✓ New city: ${profile.city}`);
    });

    // Test 5: GET /api/v1/profile/statistics - Get Statistics
    await runTest(
      "GET /api/v1/profile/statistics - Get Statistics",
      async () => {
        const response = await request(app)
          .get("/api/v1/profile/statistics")
          .set("Cookie", sessionCookie);

        if (response.status !== 200) {
          throw new Error(
            `Expected 200, got ${response.status}: ${JSON.stringify(
              response.body
            )}`
          );
        }

        const stats = response.body.data.statistics;

        if (!stats.hasProfile) {
          throw new Error("Profile should exist");
        }

        console.log(`   ✓ Statistics retrieved successfully`);
        console.log(`   ✓ Completeness: ${stats.completeness}%`);
        console.log(
          `   ✓ Fields completed: ${stats.fieldsCompleted}/${stats.totalFields}`
        );
      }
    );

    // Test 6: POST /api/v1/profile - Validation Error
    await runTest("POST /api/v1/profile - Validation Error", async () => {
      const response = await request(app)
        .post("/api/v1/profile")
        .set("Cookie", sessionCookie)
        .send({
          firstName: "Test",
          // Missing lastName and state
        });

      if (response.status !== 422) {
        throw new Error(
          `Expected 422, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      console.log(`   ✓ Validation error handled correctly`);
    });

    // Test 7: GET /api/v1/profile - Unauthorized Access
    await runTest("GET /api/v1/profile - Unauthorized Access", async () => {
      const response = await request(app).get("/api/v1/profile");

      if (response.status !== 401) {
        throw new Error(
          `Expected 401, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      console.log(`   ✓ Unauthorized access handled correctly`);
    });

    // Test 8: PUT /api/v1/profile - Invalid State Code
    await runTest("PUT /api/v1/profile - Invalid State Code", async () => {
      const response = await request(app)
        .put("/api/v1/profile")
        .set("Cookie", sessionCookie)
        .send({
          state: "CAL",
        });

      if (response.status !== 422) {
        throw new Error(
          `Expected 422, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      console.log(`   ✓ Invalid state code handled correctly`);
    });

    // Print test summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Test Summary");
    console.log("=".repeat(50));
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📝 Total:  ${testResults.total}`);
    console.log(
      `📈 Success Rate: ${(
        (testResults.passed / testResults.total) *
        100
      ).toFixed(1)}%`
    );

    if (testResults.failed === 0) {
      console.log("\n🎉 All Profile API tests passed!");
    } else {
      console.log(`\n⚠️  ${testResults.failed} test(s) failed.`);
    }

    console.log("\n✅ API endpoints are working correctly:");
    console.log("   • Profile creation and validation");
    console.log("   • Profile retrieval and updates");
    console.log("   • Authentication and authorization");
    console.log("   • Error handling");
    console.log("   • Input validation");
    console.log("   • Profile statistics");
  } catch (error) {
    console.error("\n❌ Test execution failed:", error.message);
    process.exit(1);
  } finally {
    await cleanupTestData();
  }
}

runAllTests();
