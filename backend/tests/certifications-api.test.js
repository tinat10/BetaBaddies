#!/usr/bin/env node

/**
 * Certifications API Integration Tests
 * Tests all API endpoints with real HTTP requests
 */

import request from "supertest";
import app from "../server.js";
import userService from "../services/userService.js";
import database from "../services/database.js";

console.log("🧪 Testing Certifications API Endpoints");
console.log("=====================================\n");

let testUser = null;
let testCertifications = [];
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
    email: `certapitest-${Date.now()}@example.com`,
    password: "TestPassword123",
  };

  testUser = await userService.createUser(userData);
  console.log(`   ✓ Created test user: ${testUser.email}`);

  // Login user
  console.log("🔐 Logging in test user...");
  const csrfResponse = await request(app)
    .get("/api/v1/users/csrf-token")
    .expect(200);

  // Extract session cookie from CSRF response
  const cookies = csrfResponse.headers["set-cookie"];
  sessionCookie = cookies.find((cookie) => cookie.startsWith("connect.sid"));

  if (!sessionCookie) {
    throw new Error("No session cookie received");
  }

  // Get CSRF token from response
  csrfToken = csrfResponse.body.data.csrfToken;
  if (!csrfToken) {
    throw new Error("No CSRF token received");
  }
  console.log(`   ✓ CSRF token obtained`);

  const loginResponse = await request(app)
    .post("/api/v1/users/login")
    .set("X-CSRF-Token", csrfToken)
    .set("Cookie", sessionCookie)
    .send({
      email: testUser.email,
      password: "TestPassword123",
    })
    .expect(200);

  console.log(`   ✓ User logged in successfully`);
}

async function getFreshCsrfToken() {
  const response = await request(app)
    .get("/api/v1/users/csrf-token")
    .set("Cookie", sessionCookie)
    .expect(200);
  return response.body.data.csrfToken;
}

async function runAllTests() {
  await setupTestData();

  // Test 1: POST /api/v1/certifications - Create Certification
  await runTest("POST /api/v1/certifications - Create Certification", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const certificationData = {
      name: "AWS Certified Solutions Architect",
      orgName: "Amazon Web Services",
      dateEarned: "2023-06-15",
      expirationDate: "2026-06-15",
      neverExpires: false,
    };

    const response = await request(app)
      .post("/api/v1/certifications")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(certificationData);

    if (response.status !== 201) {
      throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    testCertifications.push(response.body.data.certification);
    console.log(`   ✓ Certification created successfully`);
    console.log(`   ✓ Certification ID: ${response.body.data.certification.id}`);
  });

  // Test 2: POST /api/v1/certifications - Create Permanent Certification
  await runTest("POST /api/v1/certifications - Create Permanent Certification", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const certificationData = {
      name: "PMP Certification",
      orgName: "Project Management Institute",
      dateEarned: "2022-03-10",
      neverExpires: true,
    };

    const response = await request(app)
      .post("/api/v1/certifications")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(certificationData);

    if (response.status !== 201) {
      throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    testCertifications.push(response.body.data.certification);
    console.log(`   ✓ Permanent certification created`);
    console.log(`   ✓ Status: ${response.body.data.certification.status}`);
  });

  // Test 3: GET /api/v1/certifications - Get All Certifications
  await runTest("GET /api/v1/certifications - Get All Certifications", async () => {
    const response = await request(app)
      .get("/api/v1/certifications")
      .set("Cookie", sessionCookie)
      .expect(200);

    if (response.body.data.count !== testCertifications.length) {
      throw new Error(`Expected ${testCertifications.length} certifications, got ${response.body.data.count}`);
    }

    console.log(`   ✓ Certifications retrieved successfully`);
    console.log(`   ✓ Found ${response.body.data.count} certification(s)`);
  });

  // Test 4: GET /api/v1/certifications/current - Get Current Certifications
  await runTest("GET /api/v1/certifications/current - Get Current Certifications", async () => {
    const response = await request(app)
      .get("/api/v1/certifications/current")
      .set("Cookie", sessionCookie)
      .expect(200);

    console.log(`   ✓ Current certifications retrieved`);
    console.log(`   ✓ Found ${response.body.data.count} current certification(s)`);
  });

  // Test 5: GET /api/v1/certifications/:id - Get Certification by ID
  await runTest("GET /api/v1/certifications/:id - Get Certification by ID", async () => {
    const response = await request(app)
      .get(`/api/v1/certifications/${testCertifications[0].id}`)
      .set("Cookie", sessionCookie)
      .expect(200);

    if (!response.body.data.certification) {
      throw new Error("Certification missing from response");
    }

    console.log(`   ✓ Certification retrieved by ID successfully`);
    console.log(`   ✓ Certification ID: ${response.body.data.certification.id}`);
  });

  // Test 6: PUT /api/v1/certifications/:id - Update Certification
  await runTest("PUT /api/v1/certifications/:id - Update Certification", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const updateData = {
      name: "AWS Certified Solutions Architect - Professional",
      expirationDate: "2027-06-15",
    };

    const response = await request(app)
      .put(`/api/v1/certifications/${testCertifications[0].id}`)
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(updateData);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    console.log(`   ✓ Certification updated successfully`);
    console.log(`   ✓ New name: ${response.body.data.certification.name}`);
  });

  // Test 7: GET /api/v1/certifications/statistics - Get Statistics
  await runTest("GET /api/v1/certifications/statistics - Get Statistics", async () => {
    const response = await request(app)
      .get("/api/v1/certifications/statistics")
      .set("Cookie", sessionCookie)
      .expect(200);

    console.log(`   ✓ Statistics retrieved successfully`);
    console.log(`   ✓ Total certifications: ${response.body.data.statistics.total_certifications}`);
  });

  // Test 8: GET /api/v1/certifications/search - Search Certifications
  await runTest("GET /api/v1/certifications/search - Search Certifications", async () => {
    const response = await request(app)
      .get("/api/v1/certifications/search?q=AWS")
      .set("Cookie", sessionCookie)
      .expect(200);

    console.log(`   ✓ Search completed successfully`);
    console.log(`   ✓ Found ${response.body.data.count} AWS certification(s)`);
  });

  // Test 9: GET /api/v1/certifications/organization - Get by Organization
  await runTest("GET /api/v1/certifications/organization - Get by Organization", async () => {
    const response = await request(app)
      .get("/api/v1/certifications/organization?organization=Amazon")
      .set("Cookie", sessionCookie)
      .expect(200);

    console.log(`   ✓ Organization search completed`);
    console.log(`   ✓ Found ${response.body.data.count} Amazon certification(s)`);
  });

  // Test 10: GET /api/v1/certifications/expiring - Get Expiring Certifications
  await runTest("GET /api/v1/certifications/expiring - Get Expiring Certifications", async () => {
    const response = await request(app)
      .get("/api/v1/certifications/expiring?days=365")
      .set("Cookie", sessionCookie)
      .expect(200);

    console.log(`   ✓ Expiring certifications retrieved`);
    console.log(`   ✓ Found ${response.body.data.count} expiring certification(s)`);
  });

  // Test 11: POST /api/v1/certifications - Validation Error
  await runTest("POST /api/v1/certifications - Validation Error", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const invalidData = {
      // Missing required fields
      orgName: "Test Org",
    };

    const response = await request(app)
      .post("/api/v1/certifications")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(invalidData);

    if (response.status !== 422) {
      throw new Error(`Expected 422, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    console.log(`   ✓ Validation error handled correctly`);
  });

  // Test 12: GET /api/v1/certifications - Unauthorized Access
  await runTest("GET /api/v1/certifications - Unauthorized Access", async () => {
    const response = await request(app)
      .get("/api/v1/certifications")
      .expect(401);

    console.log(`   ✓ Unauthorized access handled correctly`);
  });

  // Test 13: POST /api/v1/certifications - CSRF Protection
  await runTest("POST /api/v1/certifications - CSRF Protection", async () => {
    const response = await request(app)
      .post("/api/v1/certifications")
      .set("Cookie", sessionCookie)
      .send({
        name: "Test Cert",
        orgName: "Test Org",
        dateEarned: "2023-01-01",
        neverExpires: true,
      })
      .expect(403);

    console.log(`   ✓ CSRF protection working correctly`);
  });

  // Test 14: DELETE /api/v1/certifications/:id - Delete Certification
  await runTest("DELETE /api/v1/certifications/:id - Delete Certification", async () => {
    const freshCsrfToken = await getFreshCsrfToken();
    const certToDelete = testCertifications[testCertifications.length - 1];

    const response = await request(app)
      .delete(`/api/v1/certifications/${certToDelete.id}`)
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .expect(200);

    // Verify deletion
    await request(app)
      .get(`/api/v1/certifications/${certToDelete.id}`)
      .set("Cookie", sessionCookie)
      .expect(404);

    console.log(`   ✓ Certification deleted successfully`);
  });

  // Test 15: GET /api/v1/certifications/:id - Certification Not Found
  await runTest("GET /api/v1/certifications/:id - Certification Not Found", async () => {
    const fakeId = "550e8400-e29b-41d4-a716-446655440000";

    const response = await request(app)
      .get(`/api/v1/certifications/${fakeId}`)
      .set("Cookie", sessionCookie)
      .expect(404);

    console.log(`   ✓ Certification not found handled correctly`);
  });

  // Test 16: POST /api/v1/certifications - Date Validation
  await runTest("POST /api/v1/certifications - Date Validation", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const invalidData = {
      name: "Invalid Date Cert",
      orgName: "Test Org",
      dateEarned: "2025-12-31", // Future date
      expirationDate: "2026-12-31",
      neverExpires: false,
    };

    const response = await request(app)
      .post("/api/v1/certifications")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(invalidData);

    if (response.status !== 422) {
      throw new Error(`Expected 422, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    console.log(`   ✓ Date validation working correctly`);
  });

  // Test 17: GET /api/v1/certifications/:id - Invalid Certification ID Format
  await runTest("GET /api/v1/certifications/:id - Invalid Certification ID Format", async () => {
    const response = await request(app)
      .get("/api/v1/certifications/invalid-uuid")
      .set("Cookie", sessionCookie)
      .expect(422);

    console.log(`   ✓ Invalid certification ID format handled correctly`);
  });

  // Print test summary
  console.log("\n📊 Test Summary");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📝 Total:  ${testResults.total}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed === 0) {
    console.log("\n🎉 All Certifications API tests passed!");
    console.log("\n✅ API endpoints are working correctly:");
    console.log("   • Certification creation and validation");
    console.log("   • Certification retrieval and updates");
    console.log("   • Authentication and authorization");
    console.log("   • CSRF protection");
    console.log("   • Error handling");
    console.log("   • Business logic enforcement");
    console.log("   • Search and filtering");
    console.log("   • Statistics and reporting");
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

  try {
    await database.query("DELETE FROM users WHERE u_id = $1", [testUser.id]);
  } catch (error) {
    // Ignore cleanup errors
  }

  console.log(`   📊 Cleaned up ${testCertifications.length} certifications and 1 user`);
  console.log("\n✨ Test suite completed!");
}

// Run tests
runAllTests().catch((error) => {
  console.error("❌ Test suite failed:", error);
  process.exit(1);
});
