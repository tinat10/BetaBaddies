#!/usr/bin/env node

/**
 * Test for skills functionality using actual database
 * Creates test data, runs tests, and cleans up
 */

import userService from "../services/userService.js";
import skillService from "../services/skillService.js";
import database from "../services/database.js";
import { v4 as uuidv4 } from "uuid";

console.log("🧪 Testing Skills Service Functionality with Database");
console.log("==========================================================\n");

const testEmail = `skills-test-${Date.now()}@example.com`;
const testPassword = "TestPassword123";

let testUserId;
let createdSkillIds = [];

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
    console.log(`   ✓ Created test user: ${testEmail} (ID: ${testUserId})\n`);
  } catch (error) {
    console.error(`   ❌ Failed to create test user:`, error.message);
    throw error;
  }
}

// Cleanup: Remove test data
async function cleanupTestData() {
  console.log("\n🧹 Cleaning up test data...");

  for (const skillId of createdSkillIds) {
    try {
      await database.query("DELETE FROM skills WHERE id = $1", [skillId]);
      console.log(`   ✓ Deleted skill: ${skillId}`);
    } catch (error) {
      console.error(`   ❌ Failed to delete skill ${skillId}:`, error.message);
    }
  }

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
    `   📊 Cleaned up ${createdSkillIds.length} skills and 1 user`
  );
}

// Main test execution
async function runAllTests() {
  try {
    await setupTestData();

    // Test 1: Create Skill
    await runTest("Create Skill", async () => {
      const skillData = {
        skillName: "JavaScript",
        proficiency: "Advanced",
        category: "Technical",
        skillBadge: "https://example.com/js-badge.png",
      };

      const skill = await skillService.createSkill(testUserId, skillData);

      if (!skill.id) {
        throw new Error("Skill was not created with an ID");
      }

      if (skill.skillName !== skillData.skillName) {
        throw new Error("Skill name mismatch");
      }

      if (skill.proficiency !== skillData.proficiency) {
        throw new Error("Proficiency mismatch");
      }

      createdSkillIds.push(skill.id);
      console.log("   ✓ Skill created successfully:", skill);
    });

    // Test 2: Create Duplicate Skill
    await runTest("Prevent Duplicate Skill", async () => {
      const skillData = {
        skillName: "JavaScript",
        proficiency: "Expert",
        category: "Technical",
      };

      try {
        await skillService.createSkill(testUserId, skillData);
        throw new Error("Should have thrown duplicate error");
      } catch (error) {
        if (error.code !== "DUPLICATE_SKILL" && error.message !== "DUPLICATE_SKILL") {
          throw error;
        }
        console.log("   ✓ Correctly prevented duplicate skill");
      }
    });

    // Test 3: Create Multiple Skills
    await runTest("Create Multiple Skills", async () => {
      const skills = [
        {
          skillName: "Python",
          proficiency: "Intermediate",
          category: "Technical",
        },
        {
          skillName: "Communication",
          proficiency: "Advanced",
          category: "Soft Skills",
        },
        {
          skillName: "Spanish",
          proficiency: "Beginner",
          category: "Languages",
        },
      ];

      for (const skillData of skills) {
        const skill = await skillService.createSkill(testUserId, skillData);
        createdSkillIds.push(skill.id);
      }

      console.log(`   ✓ Created ${skills.length} additional skills`);
    });

    // Test 4: Get All Skills
    await runTest("Get All Skills", async () => {
      const skills = await skillService.getSkillsByUserId(testUserId);

      if (!Array.isArray(skills)) {
        throw new Error("Skills list is not an array");
      }

      if (skills.length < 4) {
        throw new Error("Should have at least 4 skills");
      }

      console.log(`   ✓ Retrieved ${skills.length} skills`);
    });

    // Test 5: Get Skills by Category
    await runTest("Get Skills by Category", async () => {
      const skills = await skillService.getSkillsByUserId(testUserId, "Technical");

      if (skills.length !== 2) {
        throw new Error(
          `Expected 2 Technical skills, got ${skills.length}`
        );
      }

      skills.forEach((skill) => {
        if (skill.category !== "Technical") {
          throw new Error(`Found non-Technical skill: ${skill.skillName}`);
        }
      });

      console.log(`   ✓ Retrieved ${skills.length} Technical skills`);
    });

    // Test 6: Get Skills by Category
    await runTest("Get Skills Grouped by Category", async () => {
      const { skillsByCategory, categoryCounts } =
        await skillService.getSkillsByCategory(testUserId);

      if (!skillsByCategory["Technical"]) {
        throw new Error("Technical category missing");
      }

      if (skillsByCategory["Technical"].length !== 2) {
        throw new Error(
          `Expected 2 Technical skills, got ${skillsByCategory["Technical"].length}`
        );
      }

      console.log(
        `   ✓ Skills grouped into ${Object.keys(skillsByCategory).length} categories`
      );
      console.log(`   ✓ Category counts:`, categoryCounts);
    });

    // Test 7: Get Skill By ID
    await runTest("Get Skill By ID", async () => {
      if (createdSkillIds.length === 0) {
        throw new Error("No skill IDs available for testing");
      }

      const skillId = createdSkillIds[0];
      const skill = await skillService.getSkillById(skillId, testUserId);

      if (!skill) {
        throw new Error("Skill not found");
      }

      if (skill.id !== skillId) {
        throw new Error("Skill ID mismatch");
      }

      console.log("   ✓ Skill retrieved successfully:", skill);
    });

    // Test 8: Update Skill
    await runTest("Update Skill", async () => {
      if (createdSkillIds.length === 0) {
        throw new Error("No skill IDs available for testing");
      }

      const skillId = createdSkillIds[0];
      const updateData = {
        proficiency: "Expert",
        category: "Technical",
      };

      const updatedSkill = await skillService.updateSkill(
        skillId,
        testUserId,
        updateData
      );

      if (!updatedSkill) {
        throw new Error("Skill was not updated");
      }

      if (updatedSkill.proficiency !== "Expert") {
        throw new Error("Proficiency was not updated correctly");
      }

      console.log("   ✓ Skill updated successfully:", updatedSkill);
    });

    // Test 9: Update Skill with Partial Data
    await runTest("Update Skill - Partial Update", async () => {
      if (createdSkillIds.length === 0) {
        throw new Error("No skill IDs available for testing");
      }

      const skillId = createdSkillIds[createdSkillIds.length - 1];
      const updateData = {
        category: "Industry-Specific",
      };

      const updatedSkill = await skillService.updateSkill(
        skillId,
        testUserId,
        updateData
      );

      if (!updatedSkill) {
        throw new Error("Skill was not updated");
      }

      if (updatedSkill.category !== "Industry-Specific") {
        throw new Error("Category was not updated correctly");
      }

      console.log("   ✓ Partial update successful:", updatedSkill);
    });

    // Test 10: Delete Skill
    await runTest("Delete Skill", async () => {
      if (createdSkillIds.length === 0) {
        throw new Error("No skill IDs available for testing");
      }

      const skillId = createdSkillIds[createdSkillIds.length - 1];
      const result = await skillService.deleteSkill(skillId, testUserId);

      if (!result.success) {
        throw new Error("Skill was not deleted");
      }

      createdSkillIds.pop();

      console.log("   ✓ Skill deleted successfully");
    });

    // Test 11: Attempt to Access Another User's Skill
    await runTest("Attempt to Access Another User's Skill", async () => {
      const testSkill = await skillService.createSkill(testUserId, {
        skillName: "Test Skill",
        proficiency: "Beginner",
        category: "Technical",
      });
      createdSkillIds.push(testSkill.id);

      const fakeUserId = uuidv4();
      const skill = await skillService.getSkillById(testSkill.id, fakeUserId);

      if (skill !== null) {
        throw new Error("Should not be able to access another user's skill");
      }

      console.log("   ✓ Correctly denied access to another user's skill");
    });

    // Test 12: Delete Non-existent Skill
    await runTest("Delete Non-existent Skill", async () => {
      const fakeId = uuidv4();

      try {
        await skillService.deleteSkill(fakeId, testUserId);
        throw new Error("Should have thrown an error for non-existent skill");
      } catch (error) {
        if (error.message !== "Skill not found") {
          throw error;
        }
        console.log("   ✓ Correctly handled non-existent skill deletion");
      }
    });

    // Test 13: Create Skill with Minimal Data
    await runTest("Create Skill with Minimal Data", async () => {
      const minimalSkillData = {
        skillName: "Minimal Skill",
        proficiency: "Beginner",
      };

      const skill = await skillService.createSkill(testUserId, minimalSkillData);

      if (!skill.id) {
        throw new Error("Skill was not created with an ID");
      }

      if (skill.category !== null) {
        throw new Error("Category should be null for minimal skill");
      }

      createdSkillIds.push(skill.id);
      console.log("   ✓ Minimal skill created successfully:", skill);
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
    await cleanupTestData();
  }

  console.log("\n✨ Test suite completed!");
  process.exit(testResults.failed > 0 ? 1 : 0);
}

runAllTests().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
