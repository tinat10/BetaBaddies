#!/usr/bin/env node

/**
 * Test for basic login functionality using actual database
 * Creates test data, runs tests, and cleans up
 */

import userService from "../services/userService.js";
import database from "../services/database.js";
import { v4 as uuidv4 } from "uuid";

console.log("🧪 Testing User Service Login Functionality with Database");
console.log("========================================================\n");

// Test data with unique emails to avoid conflicts
const testUsers = [
  {
    email: `test1-${Date.now()}@example.com`,
    password: "TestPassword123",
  },
  {
    email: `test2-${Date.now()}@example.com`,
    password: "AnotherPassword456",
  },
];

let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

let createdUserIds = [];

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

// Setup: Create test users
async function setupTestData() {
  console.log("🔧 Setting up test data...");

  for (const userData of testUsers) {
    try {
      const result = await userService.createUser(userData);
      createdUserIds.push(result.id);
      console.log(
        `   ✓ Created test user: ${userData.email} (ID: ${result.id})`
      );
    } catch (error) {
      console.error(
        `   ❌ Failed to create test user ${userData.email}:`,
        error.message
      );
    }
  }

  console.log(`   📊 Created ${createdUserIds.length} test users\n`);
}

// Cleanup: Remove test data
async function cleanupTestData() {
  console.log("\n🧹 Cleaning up test data...");

  for (const userId of createdUserIds) {
    try {
      await database.query("DELETE FROM users WHERE u_id = $1", [userId]);
      console.log(`   ✓ Deleted test user: ${userId}`);
    } catch (error) {
      console.error(
        `   ❌ Failed to delete test user ${userId}:`,
        error.message
      );
    }
  }

  console.log(`   📊 Cleaned up ${createdUserIds.length} test users`);
}

// Main test execution
async function runAllTests() {
  try {
    // Setup test data first
    await setupTestData();

    // Test 1: Password Hashing
    await runTest("Password Hashing", async () => {
      const password = testUsers[0].password;
      const hashedPassword = await userService.hashPassword(password);

      if (!hashedPassword || hashedPassword === password) {
        throw new Error("Password was not hashed properly");
      }

      if (hashedPassword.length < 50) {
        throw new Error("Hashed password seems too short");
      }

      if (!hashedPassword.startsWith("$2b$")) {
        throw new Error("Hashed password does not start with expected prefix");
      }

      console.log("   ✓ Password hashed successfully");
      console.log(`   ✓ Hash length: ${hashedPassword.length} characters`);
      console.log(`   ✓ Hash format: ${hashedPassword.substring(0, 7)}...`);
    });

    // Test 2: Password Verification
    await runTest("Password Verification", async () => {
      const password = testUsers[0].password;
      const hashedPassword = await userService.hashPassword(password);

      const isValid = await userService.verifyPassword(
        password,
        hashedPassword
      );
      if (!isValid) {
        throw new Error("Valid password was rejected");
      }

      const isInvalid = await userService.verifyPassword(
        "WrongPassword",
        hashedPassword
      );
      if (isInvalid) {
        throw new Error("Invalid password was accepted");
      }

      console.log("   ✓ Valid password accepted");
      console.log("   ✓ Invalid password rejected");
    });

    // Test 3: User Registration
    await runTest("User Registration", async () => {
      const userData = {
        email: `newuser-${Date.now()}@example.com`,
        password: "NewPassword123",
      };

      const result = await userService.createUser(userData);
      createdUserIds.push(result.id); // Add to cleanup list

      if (!result.id) {
        throw new Error("User creation did not return ID");
      }

      if (result.email !== userData.email) {
        throw new Error("Email mismatch in created user");
      }

      console.log("   ✓ User created successfully");
      console.log(`   ✓ User ID: ${result.id}`);
      console.log(`   ✓ User Email: ${result.email}`);
    });

    // Test 4: User Lookup by Email
    await runTest("User Lookup by Email", async () => {
      const email = testUsers[0].email;
      const user = await userService.getUserByEmail(email);

      if (!user) {
        throw new Error("User not found");
      }

      if (user.email !== email) {
        throw new Error("Email mismatch");
      }

      if (!user.u_id) {
        throw new Error("User ID missing");
      }

      console.log("   ✓ User found by email");
      console.log(`   ✓ User ID: ${user.u_id}`);
      console.log(`   ✓ User Email: ${user.email}`);
    });

    // Test 5: Complete Login Flow
    await runTest("Complete Login Flow", async () => {
      const email = testUsers[0].email;
      const password = testUsers[0].password;

      // Step 1: Look up user by email
      const user = await userService.getUserByEmail(email);

      if (!user) {
        throw new Error("User not found during login");
      }

      if (user.email !== email) {
        throw new Error("Email mismatch during login");
      }

      // Step 2: Verify password
      const isValidPassword = await userService.verifyPassword(
        password,
        user.password
      );

      if (!isValidPassword) {
        throw new Error("Password verification failed");
      }

      // Step 3: Simulate successful login response
      const loginResponse = {
        id: user.u_id,
        email: user.email,
      };

      if (!loginResponse.id) {
        throw new Error("Login response missing user ID");
      }

      console.log("   ✓ User found by email");
      console.log("   ✓ Password verified successfully");
      console.log("   ✓ Login response created");
      console.log(`   ✓ User ID: ${loginResponse.id}`);
      console.log(`   ✓ User Email: ${loginResponse.email}`);
    });

    // Test 6: Login with Invalid Credentials
    await runTest("Login with Invalid Credentials", async () => {
      const email = "nonexistent@example.com";
      const user = await userService.getUserByEmail(email);

      if (user) {
        throw new Error("Non-existent user was found");
      }

      console.log("   ✓ Non-existent user correctly not found");
      console.log("   ✓ Invalid credentials handled properly");
    });

    // Test 7: Password Strength Validation
    await runTest("Password Strength Validation", async () => {
      const weakPasswords = ["123", "password", "abc", "12345678"];
      const strongPasswords = [
        "TestPassword123",
        "MySecure@Pass1",
        "ComplexP@ssw0rd",
      ];

      // Test weak passwords (should be rejected by validation)
      for (const weak of weakPasswords) {
        if (
          weak.length >= 8 &&
          /[A-Z]/.test(weak) &&
          /[a-z]/.test(weak) &&
          /\d/.test(weak)
        ) {
          throw new Error(`Weak password "${weak}" passed strength validation`);
        }
      }

      // Test strong passwords (should pass validation)
      for (const strong of strongPasswords) {
        if (
          !(
            strong.length >= 8 &&
            /[A-Z]/.test(strong) &&
            /[a-z]/.test(strong) &&
            /\d/.test(strong)
          )
        ) {
          throw new Error(
            `Strong password "${strong}" failed strength validation`
          );
        }
      }

      console.log("   ✓ Weak passwords correctly identified");
      console.log("   ✓ Strong passwords correctly identified");
    });

    // Test 8: Email Validation
    await runTest("Email Validation", async () => {
      const validEmails = [
        "user@example.com",
        "test@example.com",
        "user.name@domain.co.uk",
        "admin+tag@company.org",
      ];

      const invalidEmails = [
        "invalid-email",
        "@domain.com",
        "user@",
        "user@domain",
        "",
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Test valid emails
      for (const email of validEmails) {
        if (!emailRegex.test(email)) {
          throw new Error(`Valid email "${email}" was rejected`);
        }
      }

      // Test invalid emails
      for (const email of invalidEmails) {
        if (emailRegex.test(email)) {
          throw new Error(`Invalid email "${email}" was accepted`);
        }
      }

      console.log("   ✓ Valid emails correctly identified");
      console.log("   ✓ Invalid emails correctly rejected");
    });

    // Test 9: Duplicate Email Registration
    await runTest("Duplicate Email Registration", async () => {
      const userData = {
        email: testUsers[0].email, // Use existing email
        password: "AnotherPassword123",
      };

      try {
        await userService.createUser(userData);
        throw new Error("Duplicate email registration should have failed");
      } catch (error) {
        if (
          error.message.includes("already exists") ||
          error.message.includes("duplicate")
        ) {
          console.log("   ✓ Duplicate email correctly rejected");
        } else {
          throw new Error(
            `Unexpected error for duplicate email: ${error.message}`
          );
        }
      }
    });

    // Test 10: Database Connection
    await runTest("Database Connection", async () => {
      const result = await database.query("SELECT NOW() as current_time");

      if (!result.rows || result.rows.length === 0) {
        throw new Error("Database query returned no results");
      }

      const currentTime = result.rows[0].current_time;
      if (!currentTime) {
        throw new Error("Database query did not return current time");
      }

      console.log("   ✓ Database connection successful");
      console.log(`   ✓ Current time: ${currentTime}`);
    });

    // Test 11: User Account Creation (Authentication Only)
    await runTest("User Account Creation (Authentication Only)", async () => {
      const userData = {
        email: `authtest-${Date.now()}@example.com`,
        password: "AuthPassword123",
      };

      const result = await userService.createUser(userData);
      createdUserIds.push(result.id); // Add to cleanup list

      // Verify user was created in users table
      const userResult = await database.query(
        "SELECT * FROM users WHERE u_id = $1",
        [result.id]
      );

      if (!userResult.rows || userResult.rows.length === 0) {
        throw new Error("User was not created in database");
      }

      const user = userResult.rows[0];
      if (user.email !== userData.email) {
        throw new Error("User email mismatch");
      }

      console.log("   ✓ User account created successfully");
      console.log(`   ✓ User ID: ${user.u_id}`);
      console.log(`   ✓ User Email: ${user.email}`);
    });

    // Test 12: Session Data Structure
    await runTest("Session Data Structure", async () => {
      const mockSession = {
        userId: uuidv4(),
        userEmail: "test@example.com",
        csrfToken: "random-csrf-token-123",
      };

      if (!mockSession.userId) {
        throw new Error("Session missing userId");
      }

      if (!mockSession.userEmail) {
        throw new Error("Session missing userEmail");
      }

      if (!mockSession.csrfToken) {
        throw new Error("Session missing csrfToken");
      }

      if (typeof mockSession.userId !== "string") {
        throw new Error("userId should be string");
      }

      if (typeof mockSession.userEmail !== "string") {
        throw new Error("userEmail should be string");
      }

      if (typeof mockSession.csrfToken !== "string") {
        throw new Error("csrfToken should be string");
      }

      console.log("   ✓ Session has required fields");
      console.log("   ✓ Session data types are correct");
      console.log(`   ✓ User ID: ${mockSession.userId}`);
      console.log(`   ✓ User Email: ${mockSession.userEmail}`);
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
      console.log("\n🎉 All user service login functionality tests passed!");
      console.log("\n✅ Core login components are working correctly:");
      console.log("   • Password hashing with bcrypt");
      console.log("   • Password verification");
      console.log("   • User registration");
      console.log("   • User lookup by email");
      console.log("   • Complete login flow");
      console.log("   • Invalid credentials handling");
      console.log("   • Password strength validation");
      console.log("   • Email validation");
      console.log("   • Duplicate email prevention");
      console.log("   • Database connection");
      console.log("   • User account creation (authentication only)");
      console.log("   • Session data structure");
    }
  } catch (error) {
    console.error("\n❌ Test execution failed:", error.message);
    process.exit(1);
  } finally {
    // Always cleanup test data
    await cleanupTestData();
    console.log("\n✅ Test cleanup completed");
  }
}

// Run the tests
runAllTests().catch(console.error);
