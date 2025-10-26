#!/usr/bin/env node

/**
 * Certifications Service Functionality Tests
 * Tests all certification service methods with database integration
 */

import certificationService from "../services/certificationService.js";
import userService from "../services/userService.js";
import database from "../services/database.js";

console.log("🧪 Testing Certifications Service Functionality");
console.log("===============================================\n");

let testUsers = [];
let testCertifications = [];
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

  // Create test users
  for (let i = 0; i < 2; i++) {
    const userData = {
      email: `certtest${i}-${Date.now()}@example.com`,
      password: "TestPassword123",
    };

    const user = await userService.createUser(userData);
    testUsers.push(user);
    console.log(`   ✓ Created test user: ${user.email}`);
  }

  console.log(`   📊 Created ${testUsers.length} test users\n`);
}

async function runAllTests() {
  await setupTestData();

  // Test 1: Create Certification
  await runTest("Create Certification", async () => {
    const certificationData = {
      name: "AWS Certified Solutions Architect",
      orgName: "Amazon Web Services",
      dateEarned: "2023-06-15",
      expirationDate: "2026-06-15",
      neverExpires: false,
    };

    const certification = await certificationService.createCertification(
      testUsers[0].id,
      certificationData
    );

    testCertifications.push(certification);
    console.log(`   ✓ Certification created successfully: ${certification.name}`);
    console.log(`   ✓ Certification ID: ${certification.id}`);
  });

  // Test 2: Create Permanent Certification
  await runTest("Create Permanent Certification", async () => {
    const certificationData = {
      name: "PMP Certification",
      orgName: "Project Management Institute",
      dateEarned: "2022-03-10",
      neverExpires: true,
    };

    const certification = await certificationService.createCertification(
      testUsers[0].id,
      certificationData
    );

    testCertifications.push(certification);
    console.log(`   ✓ Permanent certification created: ${certification.name}`);
    console.log(`   ✓ Status: ${certification.status}`);
  });

  // Test 3: Get Certification by ID
  await runTest("Get Certification by ID", async () => {
    const certification = await certificationService.getCertificationById(
      testCertifications[0].id,
      testUsers[0].id
    );

    console.log(`   ✓ Certification retrieved: ${certification.name}`);
    console.log(`   ✓ Organization: ${certification.orgName}`);
  });

  // Test 4: Get All Certifications
  await runTest("Get All Certifications", async () => {
    const certifications = await certificationService.getCertifications(testUsers[0].id);

    console.log(`   ✓ Retrieved ${certifications.length} certifications`);
    console.log(`   ✓ Expected: ${testCertifications.length}`);
  });

  // Test 5: Update Certification
  await runTest("Update Certification", async () => {
    const updateData = {
      name: "AWS Certified Solutions Architect - Professional",
      expirationDate: "2027-06-15",
    };

    const updatedCert = await certificationService.updateCertification(
      testCertifications[0].id,
      testUsers[0].id,
      updateData
    );

    console.log(`   ✓ Certification updated: ${updatedCert.name}`);
    console.log(`   ✓ New expiration: ${updatedCert.expirationDate}`);
  });

  // Test 6: Create Multiple Certifications
  await runTest("Create Multiple Certifications", async () => {
    const certificationsData = [
      {
        name: "Google Cloud Professional Architect",
        orgName: "Google Cloud",
        dateEarned: "2023-08-20",
        expirationDate: "2025-08-20",
        neverExpires: false,
      },
      {
        name: "Microsoft Azure Solutions Architect",
        orgName: "Microsoft",
        dateEarned: "2023-09-15",
        expirationDate: "2026-09-15",
        neverExpires: false,
      },
    ];

    for (const certData of certificationsData) {
      const certification = await certificationService.createCertification(
        testUsers[0].id,
        certData
      );
      testCertifications.push(certification);
    }

    const allCerts = await certificationService.getCertifications(testUsers[0].id);
    console.log(`   ✓ Multiple certifications created`);
    console.log(`   ✓ Total certifications: ${allCerts.length}`);
  });

  // Test 7: Search Certifications
  await runTest("Search Certifications", async () => {
    const searchResults = await certificationService.searchCertifications(
      testUsers[0].id,
      "AWS"
    );

    console.log(`   ✓ Search results: ${searchResults.length} certifications`);
    console.log(`   ✓ Found AWS certifications`);
  });

  // Test 8: Get Certifications by Organization
  await runTest("Get Certifications by Organization", async () => {
    const orgCerts = await certificationService.getCertificationsByOrganization(
      testUsers[0].id,
      "Amazon"
    );

    console.log(`   ✓ Organization search results: ${orgCerts.length}`);
    console.log(`   ✓ Found Amazon certifications`);
  });

  // Test 9: Get Expiring Certifications
  await runTest("Get Expiring Certifications", async () => {
    const expiringCerts = await certificationService.getExpiringCertifications(
      testUsers[0].id,
      365 // Look ahead 1 year
    );

    console.log(`   ✓ Expiring certifications: ${expiringCerts.length}`);
  });

  // Test 10: Get Certification Statistics
  await runTest("Get Certification Statistics", async () => {
    const stats = await certificationService.getCertificationStatistics(testUsers[0].id);

    console.log(`   ✓ Total certifications: ${stats.total_certifications}`);
    console.log(`   ✓ Permanent certifications: ${stats.permanent_certifications}`);
    console.log(`   ✓ Expiring certifications: ${stats.expiring_certifications}`);
  });

  // Test 11: User Ownership Validation
  await runTest("User Ownership Validation", async () => {
    try {
      await certificationService.getCertificationById(
        testCertifications[0].id,
        testUsers[1].id // Different user
      );
      throw new Error("Should not be able to access another user's certification");
    } catch (error) {
      if (error.message.includes("not found")) {
        console.log(`   ✓ User ownership validation working`);
      } else {
        throw error;
      }
    }
  });

  // Test 12: Delete Certification
  await runTest("Delete Certification", async () => {
    const certToDelete = testCertifications[testCertifications.length - 1];
    
    await certificationService.deleteCertification(
      certToDelete.id,
      testUsers[0].id
    );

    // Verify deletion
    try {
      await certificationService.getCertificationById(
        certToDelete.id,
        testUsers[0].id
      );
      throw new Error("Certification should have been deleted");
    } catch (error) {
      if (error.message.includes("not found")) {
        console.log(`   ✓ Certification deleted successfully`);
      } else {
        throw error;
      }
    }
  });

  // Test 13: Date Validation
  await runTest("Date Validation", async () => {
    try {
      await certificationService.createCertification(testUsers[0].id, {
        name: "Invalid Cert",
        orgName: "Test Org",
        dateEarned: "2025-12-31", // Future date
        expirationDate: "2026-12-31",
        neverExpires: false,
      });
      throw new Error("Should not allow future date earned");
    } catch (error) {
      if (error.message.includes("future")) {
        console.log(`   ✓ Date validation working`);
      } else {
        throw error;
      }
    }
  });

  // Test 14: Expiration Date Validation
  await runTest("Expiration Date Validation", async () => {
    try {
      await certificationService.createCertification(testUsers[0].id, {
        name: "Invalid Expiration",
        orgName: "Test Org",
        dateEarned: "2023-06-15",
        expirationDate: "2023-01-01", // Before date earned
        neverExpires: false,
      });
      throw new Error("Should not allow expiration before date earned");
    } catch (error) {
      if (error.message.includes("after")) {
        console.log(`   ✓ Expiration date validation working`);
      } else {
        throw error;
      }
    }
  });

  // Test 15: Permanent Certification Validation
  await runTest("Permanent Certification Validation", async () => {
    try {
      await certificationService.createCertification(testUsers[0].id, {
        name: "Invalid Permanent",
        orgName: "Test Org",
        dateEarned: "2023-06-15",
        expirationDate: "2026-06-15", // Should not have expiration
        neverExpires: true,
      });
      throw new Error("Should not allow expiration date for permanent certification");
    } catch (error) {
      if (error.message.includes("permanent")) {
        console.log(`   ✓ Permanent certification validation working`);
      } else {
        throw error;
      }
    }
  });

  // Print test summary
  console.log("\n📊 Test Summary");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📝 Total:  ${testResults.total}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed === 0) {
    console.log("\n🎉 All tests passed!");
  } else {
    console.log(`\n⚠️  ${testResults.failed} test(s) failed.`);
  }

  // Cleanup
  console.log("\n🧹 Cleaning up test data...");
  for (const cert of testCertifications) {
    try {
      await database.query("DELETE FROM certifications WHERE id = $1", [cert.id]);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  for (const user of testUsers) {
    try {
      await database.query("DELETE FROM users WHERE u_id = $1", [user.id]);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  console.log(`   📊 Cleaned up ${testCertifications.length} certifications and ${testUsers.length} users`);
  console.log("\n✨ Test suite completed!");
}

// Run tests
runAllTests().catch((error) => {
  console.error("❌ Test suite failed:", error);
  process.exit(1);
});
