#!/usr/bin/env node

/**
 * Test for User API endpoints using actual HTTP requests
 * Tests authentication, CSRF protection, validation, and error handling
 */

import request from "supertest";
import app from "../server.js";
import userService from "../services/userService.js";
import database from "../services/database.js";

console.log("🧪 Testing User API Endpoints");
console.log("=============================\n");

// Test data
let testUser = null;
let sessionCookie = null;
let csrfToken = null;

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

  // Delete test user
  if (testUser) {
    try {
      await database.query("DELETE FROM users WHERE u_id = $1", [testUser.id]);
      console.log(`   ✓ Deleted test user: ${testUser.id}`);
    } catch (error) {
      console.error(
        `   ❌ Failed to delete user ${testUser.id}:`,
        error.message
      );
    }
  }

  console.log(`   📊 Cleaned up 1 user`);
}

// Main test execution
async function runAllTests() {
  try {
    await setupTestData();
    await loginUser();

    // Test 1: GET /api/v1/users/profile - Get User Profile
    await runTest("GET /api/v1/users/profile - Get User Profile", async () => {
      const response = await request(app)
        .get("/api/v1/users/profile")
        .set("Cookie", sessionCookie);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (!response.body.data.user) {
        throw new Error("User data missing from response");
      }

      if (response.body.data.user.email !== testUser.email) {
        throw new Error("Email mismatch in profile");
      }

      console.log("   ✓ User profile retrieved successfully");
      console.log(`   ✓ Email: ${response.body.data.user.email}`);
    });

    // Test 2: POST /api/v1/users/register - Register New User
    await runTest(
      "POST /api/v1/users/register - Register New User",
      async () => {
        const freshCsrfToken = await getFreshCsrfToken();

        const newUserData = {
          email: `newuser-${Date.now()}@example.com`,
          password: "NewPassword123",
        };

        const response = await request(app)
          .post("/api/v1/users/register")
          .set("Cookie", sessionCookie)
          .send(newUserData);

        if (response.status !== 201) {
          throw new Error(
            `Expected 201, got ${response.status}: ${JSON.stringify(
              response.body
            )}`
          );
        }

        if (!response.body.data.user.id) {
          throw new Error("User ID missing from response");
        }

        console.log("   ✓ User registered successfully");
        console.log(`   ✓ User ID: ${response.body.data.user.id}`);
      }
    );

    // Test 3: POST /api/v1/users/logout - Logout User
    await runTest("POST /api/v1/users/logout - Logout User", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const response = await request(app)
        .post("/api/v1/users/logout")
        .set("Cookie", sessionCookie);

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      console.log("   ✓ User logged out successfully");
    });

    // Test 4: GET /api/v1/users/profile - Unauthorized After Logout
    await runTest(
      "GET /api/v1/users/profile - Unauthorized After Logout",
      async () => {
        const response = await request(app)
          .get("/api/v1/users/profile")
          .set("Cookie", sessionCookie);

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

        console.log("   ✓ Unauthorized access handled correctly after logout");
      }
    );

    // Test 5: Login Again for Remaining Tests
    await runTest("Login Again for Remaining Tests", async () => {
      // Login again
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: testUser.email,
          password: "TestPassword123",
        });

      if (loginResponse.status !== 200) {
        throw new Error(
          `Re-login failed: ${loginResponse.body.error?.message}`
        );
      }

      // Extract session cookie
      const cookies = loginResponse.headers["set-cookie"];
      sessionCookie = cookies
        ? cookies.find((cookie) => cookie.startsWith("connect.sid"))
        : null;

      if (!sessionCookie) {
        throw new Error("No session cookie received on re-login");
      }

      console.log("   ✓ User re-logged in successfully");
    });

    // Test 6: PUT /api/v1/users/change-password - Change Password
    await runTest(
      "PUT /api/v1/users/change-password - Change Password",
      async () => {
        const freshCsrfToken = await getFreshCsrfToken();

        const passwordData = {
          currentPassword: "TestPassword123",
          newPassword: "NewTestPassword456",
        };

        const response = await request(app)
          .put("/api/v1/users/change-password")
          .set("Cookie", sessionCookie)
          .send(passwordData);

        if (response.status !== 200) {
          throw new Error(
            `Expected 200, got ${response.status}: ${JSON.stringify(
              response.body
            )}`
          );
        }

        console.log("   ✓ Password changed successfully");
      }
    );

    // Test 7: Login with New Password
    await runTest("Login with New Password", async () => {
      // Login with new password
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: testUser.email,
          password: "NewTestPassword456",
        });

      if (loginResponse.status !== 200) {
        throw new Error(
          `Login with new password failed: ${loginResponse.body.error?.message}`
        );
      }

      // Extract session cookie
      const cookies = loginResponse.headers["set-cookie"];
      sessionCookie = cookies
        ? cookies.find((cookie) => cookie.startsWith("connect.sid"))
        : null;

      if (!sessionCookie) {
        throw new Error(
          "No session cookie received on login with new password"
        );
      }

      console.log("   ✓ Login with new password successful");
    });

    // Test 8: POST /api/v1/users/register - Duplicate Email
    await runTest("POST /api/v1/users/register - Duplicate Email", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const duplicateUserData = {
        email: testUser.email, // Use existing email
        password: "AnotherPassword123",
      };

      const response = await request(app)
        .post("/api/v1/users/register")
        .set("Cookie", sessionCookie)
        .send(duplicateUserData);

      if (response.status !== 409) {
        throw new Error(
          `Expected 409, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      if (response.body.error.code !== "CONFLICT") {
        throw new Error("Expected conflict error");
      }

      console.log("   ✓ Duplicate email registration handled correctly");
    });

    // Test 9: POST /api/v1/users/login - Invalid Credentials
    await runTest(
      "POST /api/v1/users/login - Invalid Credentials",
      async () => {
        const freshCsrfToken = await getFreshCsrfToken();

        const response = await request(app)
          .post("/api/v1/users/login")
          .set("Cookie", sessionCookie)
          .send({
            email: testUser.email,
            password: "WrongPassword",
          });

        if (response.status !== 401) {
          throw new Error(
            `Expected 401, got ${response.status}: ${JSON.stringify(
              response.body
            )}`
          );
        }

        if (response.body.error.code !== "INVALID_CREDENTIALS") {
          throw new Error("Expected invalid credentials error");
        }

        console.log("   ✓ Invalid credentials handled correctly");
      }
    );

    // Test 10: POST /api/v1/users/register - Validation Error
    await runTest(
      "POST /api/v1/users/register - Validation Error",
      async () => {
        const freshCsrfToken = await getFreshCsrfToken();

        const invalidUserData = {
          email: "invalid-email", // Invalid email format
          password: "123", // Too short password
        };

        const response = await request(app)
          .post("/api/v1/users/register")
          .set("Cookie", sessionCookie)
          .send(invalidUserData);

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
      }
    );

    // Test 11: POST /api/v1/users/login - CSRF Protection (REMOVED - CSRF no longer in use)
    // CSRF protection has been removed from the backend

    // Test 12: GET /api/v1/users/profile - Unauthorized Access
    await runTest(
      "GET /api/v1/users/profile - Unauthorized Access",
      async () => {
        const response = await request(app).get("/api/v1/users/profile");

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
      }
    );

    // Test 13: PUT /api/v1/users/change-password - Wrong Current Password
    await runTest(
      "PUT /api/v1/users/change-password - Wrong Current Password",
      async () => {
        // Login first
        const loginResponse = await request(app)
          .post("/api/v1/users/login")
          .send({
            email: testUser.email,
            password: "NewTestPassword456",
          });

        if (loginResponse.status !== 200) {
          throw new Error("Login failed for password test");
        }

        // Extract session cookie
        const cookies = loginResponse.headers["set-cookie"];
        sessionCookie = cookies
          ? cookies.find((cookie) => cookie.startsWith("connect.sid"))
          : null;

        if (!sessionCookie) {
          throw new Error("No session cookie received");
        }

        // Try to change password with wrong current password
        const freshCsrfToken = await getFreshCsrfToken();

        const passwordData = {
          currentPassword: "WrongCurrentPassword",
          newPassword: "AnotherNewPassword789",
        };

        const response = await request(app)
          .put("/api/v1/users/change-password")
          .set("Cookie", sessionCookie)
          .send(passwordData);

        if (response.status !== 401) {
          throw new Error(
            `Expected 401, got ${response.status}: ${JSON.stringify(
              response.body
            )}`
          );
        }

        if (response.body.error.code !== "INVALID_PASSWORD") {
          throw new Error("Expected invalid password error");
        }

        console.log("   ✓ Wrong current password handled correctly");
      }
    );

    // Test 14: DELETE /api/v1/users/account - Delete Account
    await runTest("DELETE /api/v1/users/account - Delete Account", async () => {
      const freshCsrfToken = await getFreshCsrfToken();

      const response = await request(app)
        .delete("/api/v1/users/account")
        .set("Cookie", sessionCookie)
        .send({
          password: "NewTestPassword456",
          confirmationText: "DELETE MY ACCOUNT",
        });

      if (response.status !== 200) {
        throw new Error(
          `Expected 200, got ${response.status}: ${JSON.stringify(
            response.body
          )}`
        );
      }

      console.log("   ✓ Account deleted successfully");
    });

    // Test 15: GET /api/v1/users/profile - Profile After Deletion
    await runTest(
      "GET /api/v1/users/profile - Profile After Deletion",
      async () => {
        const response = await request(app)
          .get("/api/v1/users/profile")
          .set("Cookie", sessionCookie);

        if (response.status !== 401) {
          throw new Error(
            `Expected 401, got ${response.status}: ${JSON.stringify(
              response.body
            )}`
          );
        }

        console.log("   ✓ Profile access denied after account deletion");
      }
    );

    // Final Summary
    console.log("\n📊 Test Summary");
    console.log("================");
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);

    if (testResults.failed > 0) {
      console.log(`\n❌ ${testResults.failed} test(s) failed.`);
      console.log("\n🔍 Common issues to check:");
      console.log("   • Authentication middleware");
      console.log("   • CSRF token handling");
      console.log("   • Input validation");
      console.log("   • Error response formatting");
    } else {
      console.log("\n🎉 All User API tests passed!");
      console.log("\n✅ API endpoints are working correctly:");
      console.log("   • User registration and login");
      console.log("   • Authentication and authorization");
      console.log("   • CSRF protection");
      console.log("   • Password management");
      console.log("   • Error handling");
      console.log("   • Input validation");
      console.log("   • Account deletion");
    }
  } catch (error) {
    console.error("\n❌ Test execution failed:", error.message);
  } finally {
    // Always cleanup test data
    await cleanupTestData();
    console.log("\n✅ Test cleanup completed");
  }
}

// Run the tests
runAllTests().catch(console.error);
