#!/usr/bin/env node

/**
 * Test for education functionality using actual database
 * Creates test data, runs tests, and cleans up
 */

import userService from "../services/userService.js";
import educationService from "../services/educationService.js";
import database from "../services/database.js";
import { v4 as uuidv4 } from "uuid";

console.log("🧪 Testing Education Service Functionality with Database");
console.log("===========================================================\n");

const testEmail = `education-test-${Date.now()}@example.com`;
const testPassword = "TestPassword123";

let testUserId;
let createdEducationIds = [];

let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`\n📋 Test: ${testName}`);
  console.log("─".repeat(60));

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

// Setup: Create test user
async function setupTestData() {
  console.log("🔧 Setting up test data...");

  try {
    const result = await userService.createUser({
      email: testEmail,
      password: testPassword,
    });
    testUserId = result.id;
    console.log(
      `   ✓ Created test user: ${testEmail} (ID: ${testUserId})\n`
    );
  } catch (error) {
    console.error(`   ❌ Failed to create test user:`, error.message);
    throw error;
  }
}

// Cleanup: Remove test data
async function cleanupTestData() {
  console.log("\n🧹 Cleaning up test data...");

  // Delete education entries
  for (const educationId of createdEducationIds) {
    try {
      await database.query("DELETE FROM educations WHERE id = $1", [
        educationId,
      ]);
      console.log(`   ✓ Deleted education: ${educationId}`);
    } catch (error) {
      console.error(
        `   ❌ Failed to delete education ${educationId}:`,
        error.message
      );
    }
  }

  // Delete test user
  if (testUserId) {
    try {
      await userService.deleteUser(testUserId);
      console.log(`   ✓ Deleted test user: ${testUserId}`);
    } catch (error) {
      console.error(
        `   ❌ Failed to delete test user ${testUserId}:`,
        error.message
      );
    }
  }

  console.log(
    `   📊 Cleaned up ${createdEducationIds.length} education entries and 1 user`
  );
}

// Main test execution
async function runAllTests() {
  try {
    // Setup test data first
    await setupTestData();

    // Test 1: Create Education Entry
    await runTest("Create Education Entry", async () => {
      const educationData = {
        school: "Test University",
        degreeType: "Bachelor's",
        field: "Computer Science",
        gpa: 3.75,
        isEnrolled: false,
        honors: "Summa Cum Laude",
      };

      const education = await educationService.createEducation(
        testUserId,
        educationData
      );

      if (!education.id) {
        throw new Error("Education was not created with an ID");
      }

      if (education.school !== educationData.school) {
        throw new Error("School name mismatch");
      }

      if (education.degreeType !== educationData.degreeType) {
        throw new Error("Degree type mismatch");
      }

      if (education.gpa !== 3.75) {
        throw new Error(`GPA mismatch. Expected 3.75, got ${education.gpa}`);
      }

      createdEducationIds.push(education.id);
      console.log("   ✓ Education created successfully:", education);
    });

    // Test 2: Create Education Entry (Ongoing)
    let ongoingEducationId;
    await runTest("Create Ongoing Education Entry", async () => {
      const educationData = {
        school: "Graduate University",
        degreeType: "Master's",
        field: "Data Science",
        isEnrolled: true,
      };

      const education = await educationService.createEducation(
        testUserId,
        educationData
      );

      if (!education.id) {
        throw new Error("Education was not created with an ID");
      }

      if (education.isEnrolled !== true) {
        throw new Error("isEnrolled should be true");
      }

      ongoingEducationId = education.id;
      createdEducationIds.push(education.id);
      console.log("   ✓ Ongoing education created successfully:", education);
    });

    // Test 3: Get All Education Entries
    await runTest("Get All Education Entries", async () => {
      const educations = await educationService.getEducationsByUserId(
        testUserId
      );

      if (!Array.isArray(educations)) {
        throw new Error("Education list is not an array");
      }

      if (educations.length < 2) {
        throw new Error("Should have at least 2 education entries");
      }

      console.log(`   ✓ Retrieved ${educations.length} education entries`);
    });

    // Test 4: Get Education By ID
    await runTest("Get Education By ID", async () => {
      if (createdEducationIds.length === 0) {
        throw new Error("No education IDs available for testing");
      }

      const educationId = createdEducationIds[0];
      const education = await educationService.getEducationById(
        educationId,
        testUserId
      );

      if (!education) {
        throw new Error("Education not found");
      }

      if (education.id !== educationId) {
        throw new Error("Education ID mismatch");
      }

      console.log("   ✓ Education retrieved successfully:", education);
    });

    // Test 5: Update Education Entry
    await runTest("Update Education Entry", async () => {
      if (createdEducationIds.length === 0) {
        throw new Error("No education IDs available for testing");
      }

      const educationId = createdEducationIds[0];
      const updateData = {
        gpa: 3.9,
        honors: "Updated Honors",
      };

      const updatedEducation = await educationService.updateEducation(
        educationId,
        testUserId,
        updateData
      );

      if (!updatedEducation) {
        throw new Error("Education was not updated");
      }

      if (updatedEducation.gpa !== 3.9) {
        throw new Error(`GPA was not updated correctly. Expected 3.9, got ${updatedEducation.gpa}`);
      }

      console.log("   ✓ Education updated successfully:", updatedEducation);
    });

    // Test 6: Update Education Entry (Partial Update)
    await runTest("Update Education Entry - Partial Update", async () => {
      if (createdEducationIds.length === 0) {
        throw new Error("No education IDs available for testing");
      }

      const educationId = createdEducationIds[0];
      const updateData = {
        field: "Updated Field of Study",
      };

      const updatedEducation = await educationService.updateEducation(
        educationId,
        testUserId,
        updateData
      );

      if (!updatedEducation) {
        throw new Error("Education was not updated");
      }

      if (updatedEducation.field !== "Updated Field of Study") {
        throw new Error("Field was not updated correctly");
      }

      console.log("   ✓ Partial update successful:", updatedEducation);
    });

    // Test 7: Delete Education Entry
    await runTest("Delete Education Entry", async () => {
      if (createdEducationIds.length === 0) {
        throw new Error("No education IDs available for testing");
      }

      const educationId = createdEducationIds[createdEducationIds.length - 1];
      const result = await educationService.deleteEducation(educationId, testUserId);

      if (!result.success) {
        throw new Error("Education was not deleted");
      }

      // Remove from cleanup list
      createdEducationIds.pop();

      console.log("   ✓ Education deleted successfully");
    });

    // Test 8: Invalid User Access
    await runTest("Attempt to Access Another User's Education", async () => {
      // Create an education entry for this test
      const testEducation = await educationService.createEducation(testUserId, {
        school: "Test School",
        degreeType: "Bachelor's",
        isEnrolled: false,
      });
      
      createdEducationIds.push(testEducation.id);

      const fakeUserId = uuidv4();
      const educationId = testEducation.id;

      const education = await educationService.getEducationById(
        educationId,
        fakeUserId
      );

      if (education !== null) {
        throw new Error(
          "Should not be able to access another user's education"
        );
      }

      console.log("   ✓ Correctly denied access to another user's education");
    });

    // Test 9: Delete Non-existent Education
    await runTest("Delete Non-existent Education", async () => {
      const fakeId = uuidv4();

      try {
        await educationService.deleteEducation(fakeId, testUserId);
        throw new Error("Should have thrown an error for non-existent education");
      } catch (error) {
        if (error.message !== "Education not found") {
          throw error;
        }
        console.log("   ✓ Correctly handled non-existent education deletion");
      }
    });

    // Test 10: Get Education Entries for Non-existent User
    await runTest("Get Educations for Non-existent User", async () => {
      const fakeUserId = uuidv4();
      const educations = await educationService.getEducationsByUserId(fakeUserId);

      if (!Array.isArray(educations)) {
        throw new Error("Should return an array");
      }

      if (educations.length !== 0) {
        throw new Error("Should return empty array for non-existent user");
      }

      console.log("   ✓ Correctly returned empty array for non-existent user");
    });

    // Test 11: Create Education with Optional Fields Only
    await runTest("Create Education with Minimal Data", async () => {
      const minimalEducationData = {
        school: "Minimal University",
        degreeType: "High School",
        isEnrolled: false,
      };

      const education = await educationService.createEducation(
        testUserId,
        minimalEducationData
      );

      if (!education.id) {
        throw new Error("Education was not created with an ID");
      }

      if (education.school !== minimalEducationData.school) {
        throw new Error("School name mismatch");
      }

      createdEducationIds.push(education.id);
      console.log("   ✓ Minimal education created successfully:", education);
    });

    console.log("\n📊 Test Results");
    console.log("=".repeat(60));
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📝 Total:  ${testResults.total}`);
    console.log(
      `📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`
    );

    if (testResults.failed === 0) {
      console.log("\n🎉 All tests passed!");
    } else {
      console.log("\n⚠️  Some tests failed. Please review the errors above.");
    }
  } catch (error) {
    console.error("\n💥 Fatal error during test execution:");
    console.error(error);
  } finally {
    // Always cleanup regardless of test results
    await cleanupTestData();
  }

  console.log("\n✨ Test suite completed!");
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});

