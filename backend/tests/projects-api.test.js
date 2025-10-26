#!/usr/bin/env node

/**
 * Projects API Integration Tests
 * Tests all API endpoints with real HTTP requests
 */

import request from "supertest";
import app from "../server.js";
import userService from "../services/userService.js";
import database from "../services/database.js";

console.log("🧪 Testing Projects API Endpoints");
console.log("=====================================\n");

let testUser = null;
let testProjects = [];
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
    email: `projectapitest-${Date.now()}@example.com`,
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

  // Test 1: POST /api/v1/projects - Create Completed Project
  await runTest("POST /api/v1/projects - Create Completed Project", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const projectData = {
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce application with payment integration",
      link: "https://github.com/test/ecommerce",
      startDate: "2023-01-01",
      endDate: "2023-06-30",
      technologies: "React, Node.js, PostgreSQL, Stripe",
      collaborators: "Team of 5 developers",
      status: "Completed",
      industry: "E-Commerce",
    };

    const response = await request(app)
      .post("/api/v1/projects")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(projectData);

    if (response.status !== 201) {
      throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    testProjects.push(response.body.data.project);
    console.log(`   ✓ Project created successfully`);
    console.log(`   ✓ Project ID: ${response.body.data.project.id}`);
  });

  // Test 2: POST /api/v1/projects - Create Ongoing Project
  await runTest("POST /api/v1/projects - Create Ongoing Project", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const projectData = {
      name: "AI Chatbot Application",
      description: "AI-powered customer service chatbot using NLP",
      link: "https://github.com/test/ai-chatbot",
      startDate: "2024-01-15",
      technologies: "Python, TensorFlow, FastAPI, Redis",
      collaborators: "Team of 3",
      status: "Ongoing",
      industry: "AI/ML",
    };

    const response = await request(app)
      .post("/api/v1/projects")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(projectData);

    if (response.status !== 201) {
      throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    testProjects.push(response.body.data.project);
    console.log(`   ✓ Ongoing project created`);
  });

  // Test 3: POST /api/v1/projects - Create Planned Project
  await runTest("POST /api/v1/projects - Create Planned Project", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const projectData = {
      name: "Mobile App Development",
      description: "Cross-platform mobile app for task management",
      startDate: "2025-01-01",
      technologies: "React Native, Firebase, Redux",
      status: "Planned",
      industry: "Mobile",
    };

    const response = await request(app)
      .post("/api/v1/projects")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(projectData);

    if (response.status !== 201) {
      throw new Error(`Expected 201, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    testProjects.push(response.body.data.project);
    console.log(`   ✓ Planned project created`);
  });

  // Test 4: GET /api/v1/projects - Get All Projects
  await runTest("GET /api/v1/projects - Get All Projects", async () => {
    const response = await request(app)
      .get("/api/v1/projects")
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    if (!Array.isArray(response.body.data.projects)) {
      throw new Error("Projects should be an array");
    }

    if (response.body.data.projects.length < 3) {
      throw new Error("Should have at least 3 projects");
    }

    console.log(`   ✓ Retrieved ${response.body.data.projects.length} projects`);
  });

  // Test 5: GET /api/v1/projects/:id - Get Specific Project
  await runTest("GET /api/v1/projects/:id - Get Specific Project", async () => {
    const projectId = testProjects[0].id;

    const response = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    if (response.body.data.project.id !== projectId) {
      throw new Error("Project ID mismatch");
    }

    console.log(`   ✓ Retrieved project: ${response.body.data.project.name}`);
  });

  // Test 6: GET /api/v1/projects - Filter by Status
  await runTest("GET /api/v1/projects - Filter by Status (Completed)", async () => {
    const response = await request(app)
      .get("/api/v1/projects?status=Completed")
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    if (!Array.isArray(response.body.data.projects)) {
      throw new Error("Projects should be an array");
    }

    // Verify all returned projects are completed
    response.body.data.projects.forEach((project) => {
      if (project.status !== "Completed") {
        throw new Error("Filter returned non-completed project");
      }
    });

    console.log(`   ✓ Retrieved ${response.body.data.projects.length} completed project(s)`);
  });

  // Test 7: GET /api/v1/projects - Filter by Technology
  await runTest("GET /api/v1/projects - Filter by Technology (React)", async () => {
    const response = await request(app)
      .get("/api/v1/projects?technology=React")
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    if (response.body.data.projects.length === 0) {
      throw new Error("Should find projects with React");
    }

    console.log(`   ✓ Retrieved ${response.body.data.projects.length} project(s) using React`);
  });

  // Test 8: GET /api/v1/projects - Filter by Industry
  await runTest("GET /api/v1/projects - Filter by Industry", async () => {
    const response = await request(app)
      .get("/api/v1/projects?industry=E-Commerce")
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    response.body.data.projects.forEach((project) => {
      if (project.industry !== "E-Commerce") {
        throw new Error("Filter returned project with wrong industry");
      }
    });

    console.log(`   ✓ Retrieved ${response.body.data.projects.length} E-Commerce project(s)`);
  });

  // Test 9: GET /api/v1/projects - Sort by Date
  await runTest("GET /api/v1/projects - Sort by Date (DESC)", async () => {
    const response = await request(app)
      .get("/api/v1/projects?sortBy=start_date&sortOrder=DESC")
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    const projects = response.body.data.projects;
    if (projects.length < 2) {
      throw new Error("Need at least 2 projects to verify sorting");
    }

    // Verify sorting
    for (let i = 1; i < projects.length; i++) {
      const prevDate = new Date(projects[i - 1].startDate);
      const currDate = new Date(projects[i].startDate);
      if (prevDate < currDate) {
        throw new Error("Projects are not sorted correctly");
      }
    }

    console.log(`   ✓ Projects sorted correctly by date DESC`);
  });

  // Test 10: GET /api/v1/projects/search - Search Projects
  await runTest("GET /api/v1/projects/search - Search Projects", async () => {
    const response = await request(app)
      .get("/api/v1/projects/search?q=chatbot")
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    if (!Array.isArray(response.body.data.projects)) {
      throw new Error("Search results should be an array");
    }

    if (response.body.data.projects.length === 0) {
      throw new Error("Should find at least one project with 'chatbot'");
    }

    console.log(`   ✓ Found ${response.body.data.projects.length} project(s) matching 'chatbot'`);
  });

  // Test 11: GET /api/v1/projects/search - Empty Search Query
  await runTest("GET /api/v1/projects/search - Empty Search Query (should fail)", async () => {
    const response = await request(app)
      .get("/api/v1/projects/search?q=")
      .set("Cookie", sessionCookie);

    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`);
    }

    if (response.body.error.code !== "INVALID_SEARCH_QUERY") {
      throw new Error("Should return INVALID_SEARCH_QUERY error");
    }

    console.log(`   ✓ Correctly rejected empty search query`);
  });

  // Test 12: GET /api/v1/projects/statistics - Get Project Statistics
  await runTest("GET /api/v1/projects/statistics - Get Statistics", async () => {
    const response = await request(app)
      .get("/api/v1/projects/statistics")
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    const stats = response.body.data.statistics;
    if (!stats.total) {
      throw new Error("Statistics should include total count");
    }

    if (!stats.byStatus) {
      throw new Error("Statistics should include status breakdown");
    }

    console.log(`   ✓ Statistics: ${stats.total} total projects`);
    console.log(`   ✓ By status:`, stats.byStatus);
  });

  // Test 13: PUT /api/v1/projects/:id - Update Project
  await runTest("PUT /api/v1/projects/:id - Update Project", async () => {
    const freshCsrfToken = await getFreshCsrfToken();
    const projectId = testProjects[0].id;

    const updateData = {
      description: "Updated: Full-stack e-commerce with microservices",
      technologies: "React, Node.js, PostgreSQL, Docker, Kubernetes",
    };

    const response = await request(app)
      .put(`/api/v1/projects/${projectId}`)
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(updateData);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}: ${JSON.stringify(response.body)}`);
    }

    if (response.body.data.project.description !== updateData.description) {
      throw new Error("Description was not updated");
    }

    console.log(`   ✓ Project updated successfully`);
  });

  // Test 14: PUT /api/v1/projects/:id - Update Project Status
  await runTest("PUT /api/v1/projects/:id - Update Status to Completed", async () => {
    const freshCsrfToken = await getFreshCsrfToken();
    const projectId = testProjects[1].id; // The ongoing project

    const updateData = {
      status: "Completed",
      endDate: "2024-10-26",
    };

    const response = await request(app)
      .put(`/api/v1/projects/${projectId}`)
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(updateData);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    if (response.body.data.project.status !== "Completed") {
      throw new Error("Status was not updated to Completed");
    }

    console.log(`   ✓ Project status updated to Completed`);
  });

  // Test 15: POST /api/v1/projects - Validation Error (Missing required fields)
  await runTest("POST /api/v1/projects - Validation Error", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const invalidData = {
      name: "Test Project",
      // Missing startDate and status (required)
    };

    const response = await request(app)
      .post("/api/v1/projects")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(invalidData);

    if (response.status !== 422) {
      throw new Error(`Expected 422, got ${response.status}`);
    }

    if (response.body.error.code !== "VALIDATION_ERROR") {
      throw new Error("Should return VALIDATION_ERROR");
    }

    console.log(`   ✓ Correctly rejected invalid project data`);
  });

  // Test 16: POST /api/v1/projects - Invalid Status Value
  await runTest("POST /api/v1/projects - Invalid Status Value", async () => {
    const freshCsrfToken = await getFreshCsrfToken();

    const invalidData = {
      name: "Test Project",
      startDate: "2024-01-01",
      status: "InvalidStatus", // Invalid status
    };

    const response = await request(app)
      .post("/api/v1/projects")
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send(invalidData);

    if (response.status !== 422) {
      throw new Error(`Expected 422, got ${response.status}`);
    }

    console.log(`   ✓ Correctly rejected invalid status value`);
  });

  // Test 17: GET /api/v1/projects/:id - Non-existent Project
  await runTest("GET /api/v1/projects/:id - Non-existent Project", async () => {
    const fakeId = "12345678-1234-1234-1234-123456789012";

    const response = await request(app)
      .get(`/api/v1/projects/${fakeId}`)
      .set("Cookie", sessionCookie);

    if (response.status !== 404) {
      throw new Error(`Expected 404, got ${response.status}`);
    }

    if (response.body.error.code !== "PROJECT_NOT_FOUND") {
      throw new Error("Should return PROJECT_NOT_FOUND error");
    }

    console.log(`   ✓ Correctly returned 404 for non-existent project`);
  });

  // Test 18: PUT /api/v1/projects/:id - Update Non-existent Project
  await runTest("PUT /api/v1/projects/:id - Update Non-existent Project", async () => {
    const freshCsrfToken = await getFreshCsrfToken();
    const fakeId = "12345678-1234-1234-1234-123456789012";

    const response = await request(app)
      .put(`/api/v1/projects/${fakeId}`)
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie)
      .send({ name: "Updated Name" });

    if (response.status !== 404) {
      throw new Error(`Expected 404, got ${response.status}`);
    }

    console.log(`   ✓ Correctly returned 404 for updating non-existent project`);
  });

  // Test 19: DELETE /api/v1/projects/:id - Delete Project
  await runTest("DELETE /api/v1/projects/:id - Delete Project", async () => {
    const freshCsrfToken = await getFreshCsrfToken();
    const projectId = testProjects[testProjects.length - 1].id;

    const response = await request(app)
      .delete(`/api/v1/projects/${projectId}`)
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    // Verify deletion
    const getResponse = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set("Cookie", sessionCookie);

    if (getResponse.status !== 404) {
      throw new Error("Project should not exist after deletion");
    }

    testProjects.pop();
    console.log(`   ✓ Project deleted successfully`);
  });

  // Test 20: DELETE /api/v1/projects/:id - Delete Non-existent Project
  await runTest("DELETE /api/v1/projects/:id - Delete Non-existent Project", async () => {
    const freshCsrfToken = await getFreshCsrfToken();
    const fakeId = "12345678-1234-1234-1234-123456789012";

    const response = await request(app)
      .delete(`/api/v1/projects/${fakeId}`)
      .set("X-CSRF-Token", freshCsrfToken)
      .set("Cookie", sessionCookie);

    if (response.status !== 404) {
      throw new Error(`Expected 404, got ${response.status}`);
    }

    console.log(`   ✓ Correctly returned 404 for deleting non-existent project`);
  });

  // Test 21: Authentication Check - Unauthenticated Access
  await runTest("GET /api/v1/projects - Unauthenticated Access", async () => {
    const response = await request(app).get("/api/v1/projects");

    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }

    console.log(`   ✓ Correctly denied unauthenticated access`);
  });

  console.log("\n📊 Test Results");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📝 Total:  ${testResults.total}`);
  console.log(
    `📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`
  );

  if (testResults.failed === 0) {
    console.log("\n🎉 All API tests passed!");
  } else {
    console.log("\n⚠️  Some tests failed. Please review the errors above.");
  }
}

async function cleanup() {
  console.log("\n🧹 Cleaning up test data...");

  if (testUser) {
    try {
      // Delete remaining test projects
      for (const project of testProjects) {
        await database.query("DELETE FROM projects WHERE id = $1", [
          project.id,
        ]);
      }

      // Delete test user (cascades to related data)
      await userService.deleteUser(testUser.id);
      console.log("   ✓ Test data cleaned up successfully");
    } catch (error) {
      console.error("   ❌ Error during cleanup:", error.message);
    }
  }
}

// Run all tests
runAllTests()
  .then(() => cleanup())
  .then(() => {
    console.log("\n✨ Test suite completed!");
    process.exit(testResults.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    cleanup().finally(() => process.exit(1));
  });

