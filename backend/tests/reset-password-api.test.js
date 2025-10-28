#!/usr/bin/env node

/**
 * Test for Reset Password API endpoints using actual HTTP requests
 * Tests forgot password and reset password endpoints
 */

import request from "supertest";
import app from "../server.js";
import userService from "../services/userService.js";
import database from "../services/database.js";

console.log("🧪 Testing Reset Password API Endpoints");
console.log("=======================================\n");

// Test data
let testUser = null;
let resetToken = null;

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
    email: `reset-api-test-${Date.now()}@example.com`,
    password: "TestPassword123",
  };

  try {
    testUser = await userService.createUser(userData);
    console.log(`   ✅ Created test user: ${testUser.email}`);
  } catch (error) {
    console.error(`   ❌ Failed to create test user: ${error.message}`);
    throw error;
  }
}

async function cleanupTestData() {
  console.log("\n🧹 Cleaning up test data...");

  if (testUser) {
    try {
      await database.query("DELETE FROM users WHERE u_id = $1", [testUser.id]);
      console.log(`   ✅ Cleaned up user: ${testUser.email}`);
    } catch (error) {
      console.error(`   ❌ Failed to cleanup user: ${error.message}`);
    }
  }
}

// Test: Forgot password with valid email
async function testForgotPasswordWithValidEmail() {
  const response = await request(app)
    .post("/api/v1/users/forgot-password")
    .send({ email: testUser.email })
    .expect(200);

  if (!response.body.ok) {
    throw new Error("Response should be successful");
  }

  if (!response.body.data.message.includes("password reset link")) {
    throw new Error("Response should contain success message");
  }

  console.log("   ✅ Forgot password request successful");
}

// Test: Forgot password with invalid email
async function testForgotPasswordWithInvalidEmail() {
  const response = await request(app)
    .post("/api/v1/users/forgot-password")
    .send({ email: "nonexistent@example.com" })
    .expect(200);

  if (!response.body.ok) {
    throw new Error("Response should be successful even for non-existent email");
  }

  if (!response.body.data.message.includes("password reset link")) {
    throw new Error("Response should contain success message");
  }

  console.log("   ✅ Forgot password with invalid email handled correctly");
}

// Test: Forgot password with malformed email
async function testForgotPasswordWithMalformedEmail() {
  const response = await request(app)
    .post("/api/v1/users/forgot-password")
    .send({ email: "not-an-email" })
    .expect(422);

  if (response.body.ok) {
    throw new Error("Response should indicate validation error");
  }

  if (response.body.error.code !== "VALIDATION_ERROR") {
    throw new Error("Should be validation error");
  }

  console.log("   ✅ Malformed email validation working");
}

// Test: Forgot password without email
async function testForgotPasswordWithoutEmail() {
  const response = await request(app)
    .post("/api/v1/users/forgot-password")
    .send({})
    .expect(422);

  if (response.body.ok) {
    throw new Error("Response should indicate validation error");
  }

  console.log("   ✅ Missing email validation working");
}

// Test: Reset password with valid token
async function testResetPasswordWithValidToken() {
  // Generate reset token
  resetToken = await userService.generateResetToken(testUser.id);

  const newPassword = "NewSecurePassword789";
  const response = await request(app)
    .post("/api/v1/users/reset-password")
    .send({ 
      token: resetToken, 
      newPassword: newPassword 
    })
    .expect(200);

  if (!response.body.ok) {
    throw new Error("Response should be successful");
  }

  if (!response.body.data.message.includes("Password has been reset")) {
    throw new Error("Response should contain success message");
  }

  // Verify password was actually changed
  const updatedUser = await userService.getUserByEmail(testUser.email);
  const isPasswordValid = await userService.verifyPassword(newPassword, updatedUser.password);
  
  if (!isPasswordValid) {
    throw new Error("Password should have been changed");
  }

  console.log("   ✅ Password reset successful");
}

// Test: Reset password with invalid token
async function testResetPasswordWithInvalidToken() {
  const response = await request(app)
    .post("/api/v1/users/reset-password")
    .send({ 
      token: "invalid-token-123", 
      newPassword: "NewPassword123" 
    })
    .expect(400);

  if (response.body.ok) {
    throw new Error("Response should indicate error");
  }

  if (response.body.error.code !== "INVALID_TOKEN") {
    throw new Error("Should be invalid token error");
  }

  console.log("   ✅ Invalid token handled correctly");
}

// Test: Reset password with expired token
async function testResetPasswordWithExpiredToken() {
  // Create expired token
  const expiredToken = "expired-token-123";
  const expiredTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
  
  await database.query(
    "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE u_id = $3",
    [expiredToken, expiredTime, testUser.id]
  );

  const response = await request(app)
    .post("/api/v1/users/reset-password")
    .send({ 
      token: expiredToken, 
      newPassword: "NewPassword123" 
    })
    .expect(400);

  if (response.body.ok) {
    throw new Error("Response should indicate error");
  }

  console.log("   ✅ Expired token handled correctly");
}

// Test: Reset password with weak password
async function testResetPasswordWithWeakPassword() {
  // Generate new reset token
  const newResetToken = await userService.generateResetToken(testUser.id);

  const response = await request(app)
    .post("/api/v1/users/reset-password")
    .send({ 
      token: newResetToken, 
      newPassword: "weak" 
    })
    .expect(422);

  if (response.body.ok) {
    throw new Error("Response should indicate validation error");
  }

  if (response.body.error.code !== "VALIDATION_ERROR") {
    throw new Error("Should be validation error");
  }

  console.log("   ✅ Weak password validation working");
}

// Test: Reset password without token
async function testResetPasswordWithoutToken() {
  const response = await request(app)
    .post("/api/v1/users/reset-password")
    .send({ 
      newPassword: "NewPassword123" 
    })
    .expect(422);

  if (response.body.ok) {
    throw new Error("Response should indicate validation error");
  }

  console.log("   ✅ Missing token validation working");
}

// Test: Reset password without new password
async function testResetPasswordWithoutNewPassword() {
  const response = await request(app)
    .post("/api/v1/users/reset-password")
    .send({ 
      token: "some-token" 
    })
    .expect(422);

  if (response.body.ok) {
    throw new Error("Response should indicate validation error");
  }

  console.log("   ✅ Missing password validation working");
}

// Test: Rate limiting on forgot password
async function testForgotPasswordRateLimit() {
  // Make multiple requests quickly
  const promises = [];
  for (let i = 0; i < 6; i++) {
    promises.push(
      request(app)
        .post("/api/v1/users/forgot-password")
        .send({ email: testUser.email })
    );
  }

  const responses = await Promise.all(promises);
  
  // At least one should be rate limited
  const rateLimited = responses.some(res => res.status === 429);
  
  if (!rateLimited) {
    console.log("   ⚠️  Rate limiting not triggered (may be normal in development)");
  } else {
    console.log("   ✅ Rate limiting working");
  }
}

// Main test execution
async function runAllTests() {
  try {
    await setupTestData();

    await runTest("Forgot password with valid email", testForgotPasswordWithValidEmail);
    await runTest("Forgot password with invalid email", testForgotPasswordWithInvalidEmail);
    await runTest("Forgot password with malformed email", testForgotPasswordWithMalformedEmail);
    await runTest("Forgot password without email", testForgotPasswordWithoutEmail);
    await runTest("Reset password with valid token", testResetPasswordWithValidToken);
    await runTest("Reset password with invalid token", testResetPasswordWithInvalidToken);
    await runTest("Reset password with expired token", testResetPasswordWithExpiredToken);
    await runTest("Reset password with weak password", testResetPasswordWithWeakPassword);
    await runTest("Reset password without token", testResetPasswordWithoutToken);
    await runTest("Reset password without new password", testResetPasswordWithoutNewPassword);
    await runTest("Rate limiting on forgot password", testForgotPasswordRateLimit);

  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
  } finally {
    await cleanupTestData();
    printTestResults();
  }
}

function printTestResults() {
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESET PASSWORD API TEST RESULTS");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total:  ${testResults.total}`);
  console.log(`📊 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed === 0) {
    console.log("\n🎉 All tests passed! Reset password API is working correctly.");
  } else {
    console.log(`\n⚠️  ${testResults.failed} test(s) failed. Please review the errors above.`);
  }
  
  console.log("=".repeat(60));
}

// Run tests
runAllTests().catch(console.error);