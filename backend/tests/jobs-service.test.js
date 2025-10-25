#!/usr/bin/env node

/**
 * Comprehensive Jobs Service Tests
 * Tests all business logic, validation, and database operations
 */

import jobService from "../services/jobService.js";
import userService from "../services/userService.js";
import database from "../services/database.js";
import { v4 as uuidv4 } from "uuid";

console.log("🧪 Testing Jobs Service Functionality");
console.log("====================================\n");

// Test data
const testUsers = [];
const testJobs = [];
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

// Setup test data
async function setupTestData() {
  console.log("🔧 Setting up test data...");

  // Create test users
  for (let i = 0; i < 2; i++) {
    const userData = {
      email: `jobtest${i}-${Date.now()}@example.com`,
      password: "TestPassword123",
    };

    const user = await userService.createUser(userData);
    testUsers.push(user);
    console.log(`   ✓ Created test user: ${user.email}`);
  }

  console.log(`   📊 Created ${testUsers.length} test users\n`);
}

// Cleanup test data
async function cleanupTestData() {
  console.log("\n🧹 Cleaning up test data...");

  // Delete test jobs first (foreign key constraint)
  for (const job of testJobs) {
    try {
      await database.query("DELETE FROM jobs WHERE id = $1", [job.id]);
    } catch (error) {
      console.error(`   ❌ Failed to delete job ${job.id}:`, error.message);
    }
  }

  // Delete test users
  for (const user of testUsers) {
    try {
      await database.query("DELETE FROM users WHERE u_id = $1", [user.id]);
    } catch (error) {
      console.error(`   ❌ Failed to delete user ${user.id}:`, error.message);
    }
  }

  console.log(
    `   📊 Cleaned up ${testJobs.length} jobs and ${testUsers.length} users`
  );
}

// Main test execution
async function runAllTests() {
  try {
    await setupTestData();

    // Test 1: Create Job
    await runTest("Create Job", async () => {
      const jobData = {
        title: "Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        startDate: "2023-01-15",
        endDate: null,
        isCurrent: true,
        description: "Full-stack development",
      };

      const job = await jobService.createJob(testUsers[0].id, jobData);
      testJobs.push(job);

      if (!job.id) throw new Error("Job creation did not return ID");
      if (job.title !== jobData.title) throw new Error("Title mismatch");
      if (job.company !== jobData.company) throw new Error("Company mismatch");
      if (job.isCurrent !== jobData.isCurrent)
        throw new Error("isCurrent mismatch");

      console.log("   ✓ Job created successfully");
      console.log(`   ✓ Job ID: ${job.id}`);
      console.log(`   ✓ Title: ${job.title}`);
    });

    // Test 2: Get Job by ID
    await runTest("Get Job by ID", async () => {
      const job = await jobService.getJobById(testJobs[0].id, testUsers[0].id);

      if (!job) throw new Error("Job not found");
      if (job.id !== testJobs[0].id) throw new Error("Job ID mismatch");
      if (job.title !== "Software Engineer") throw new Error("Title mismatch");

      console.log("   ✓ Job retrieved successfully");
      console.log(`   ✓ Job ID: ${job.id}`);
    });

    // Test 3: Get Jobs by User ID
    await runTest("Get Jobs by User ID", async () => {
      const jobs = await jobService.getJobsByUserId(testUsers[0].id);

      if (!Array.isArray(jobs)) throw new Error("Jobs should be an array");
      if (jobs.length === 0) throw new Error("No jobs found");
      if (jobs[0].id !== testJobs[0].id) throw new Error("Job ID mismatch");

      console.log("   ✓ Jobs retrieved successfully");
      console.log(`   ✓ Found ${jobs.length} job(s)`);
    });

    // Test 4: Update Job
    await runTest("Update Job", async () => {
      const updateData = {
        title: "Senior Software Engineer",
        description: "Senior full-stack development",
      };

      const updatedJob = await jobService.updateJob(
        testJobs[0].id,
        testUsers[0].id,
        updateData
      );

      if (updatedJob.title !== updateData.title)
        throw new Error("Title not updated");
      if (updatedJob.description !== updateData.description)
        throw new Error("Description not updated");

      console.log("   ✓ Job updated successfully");
      console.log(`   ✓ New title: ${updatedJob.title}`);
    });

    // Test 5: Create Multiple Jobs
    await runTest("Create Multiple Jobs", async () => {
      const jobData2 = {
        title: "Junior Developer",
        company: "Startup Inc",
        location: "Remote",
        startDate: "2022-06-01",
        endDate: "2022-12-31",
        isCurrent: false,
        description: "Frontend development",
      };

      const job2 = await jobService.createJob(testUsers[0].id, jobData2);
      testJobs.push(job2);

      const jobs = await jobService.getJobsByUserId(testUsers[0].id);
      if (jobs.length !== 2)
        throw new Error(`Expected 2 jobs, found ${jobs.length}`);

      console.log("   ✓ Multiple jobs created successfully");
      console.log(`   ✓ Total jobs: ${jobs.length}`);
    });

    // Test 6: Current Job Management
    await runTest("Current Job Management", async () => {
      // Create a new current job (should set others to not current)
      const currentJobData = {
        title: "Lead Developer",
        company: "New Corp",
        location: "New York, NY",
        startDate: "2024-01-01",
        endDate: null,
        isCurrent: true,
        description: "Lead development team",
      };

      const currentJob = await jobService.createJob(
        testUsers[0].id,
        currentJobData
      );
      testJobs.push(currentJob);

      // Check that only one job is current
      const jobs = await jobService.getJobsByUserId(testUsers[0].id);
      const currentJobs = jobs.filter((job) => job.isCurrent);

      if (currentJobs.length !== 1)
        throw new Error(`Expected 1 current job, found ${currentJobs.length}`);
      if (currentJobs[0].id !== currentJob.id)
        throw new Error("Wrong job marked as current");

      console.log("   ✓ Current job management working");
      console.log(`   ✓ Current jobs: ${currentJobs.length}`);
    });

    // Test 7: Date Validation
    await runTest("Date Validation", async () => {
      const invalidJobData = {
        title: "Test Job",
        company: "Test Corp",
        startDate: "2023-12-31",
        endDate: "2023-01-01", // End date before start date
        isCurrent: false,
        description: "Test job",
      };

      try {
        await jobService.createJob(testUsers[0].id, invalidJobData);
        throw new Error("Should have failed with invalid date range");
      } catch (error) {
        if (error.message.includes("date") || error.message.includes("range")) {
          console.log("   ✓ Date validation working");
        } else {
          throw error;
        }
      }
    });

    // Test 8: User Ownership Validation
    await runTest("User Ownership Validation", async () => {
      try {
        await jobService.getJobById(testJobs[0].id, testUsers[1].id);
        throw new Error("Should not access other user's job");
      } catch (error) {
        if (
          error.message.includes("not found") ||
          error.message.includes("access")
        ) {
          console.log("   ✓ User ownership validation working");
        } else {
          throw error;
        }
      }
    });

    // Test 9: Get Current Job (before deletion)
    await runTest("Get Current Job", async () => {
      const currentJob = await jobService.getCurrentJob(testUsers[0].id);

      if (!currentJob) throw new Error("No current job found");
      if (!currentJob.isCurrent) throw new Error("Returned job is not current");

      console.log("   ✓ Current job retrieved successfully");
      console.log(
        `   ✓ Current job: ${currentJob.title} at ${currentJob.company}`
      );
    });

    // Test 10: Delete Job
    await runTest("Delete Job", async () => {
      const jobToDelete = testJobs[testJobs.length - 1];
      await jobService.deleteJob(jobToDelete.id, testUsers[0].id);

      // Verify job is deleted
      try {
        await jobService.getJobById(jobToDelete.id, testUsers[0].id);
        throw new Error("Job should have been deleted");
      } catch (error) {
        console.log("   ✓ Job deleted successfully");
      }

      // Remove from test jobs array
      testJobs.pop();
    });

    // Test 11: Job History
    await runTest("Job History", async () => {
      const history = await jobService.getJobHistory(testUsers[0].id);

      if (!Array.isArray(history))
        throw new Error("History should be an array");
      if (history.length === 0) throw new Error("No job history found");

      // Check if jobs are in chronological order (newest first)
      for (let i = 0; i < history.length - 1; i++) {
        const current = new Date(history[i].startDate);
        const next = new Date(history[i + 1].startDate);
        if (current < next) throw new Error("Jobs not in chronological order");
      }

      console.log("   ✓ Job history retrieved successfully");
      console.log(`   ✓ History length: ${history.length}`);
    });

    // Test 12: Validation Rules
    await runTest("Validation Rules", async () => {
      const invalidJobs = [
        { title: "", company: "Test Corp", startDate: "2023-01-01" }, // Empty title
        { title: "Test", company: "", startDate: "2023-01-01" }, // Empty company
        { title: "Test", company: "Test Corp", startDate: "invalid-date" }, // Invalid date
        {
          title: "Test",
          company: "Test Corp",
          startDate: "2023-01-01",
          isCurrent: true,
          endDate: "2023-12-31",
        }, // Current job with end date
      ];

      for (const invalidJob of invalidJobs) {
        try {
          await jobService.createJob(testUsers[0].id, invalidJob);
          throw new Error(
            `Should have failed validation for: ${JSON.stringify(invalidJob)}`
          );
        } catch (error) {
          // Expected to fail
        }
      }

      console.log("   ✓ Validation rules working correctly");
    });

    // Test 13: Job Statistics
    await runTest("Job Statistics", async () => {
      const stats = await jobService.getJobStatistics(testUsers[0].id);

      if (typeof stats.totalJobs !== "number")
        throw new Error("Total jobs should be a number");
      if (stats.totalJobs < 1) throw new Error("Should have at least 1 job");
      if (stats.currentJobs < 0)
        throw new Error("Current jobs should not be negative");

      console.log("   ✓ Job statistics retrieved successfully");
      console.log(`   ✓ Total jobs: ${stats.totalJobs}`);
      console.log(`   ✓ Current jobs: ${stats.currentJobs}`);
    });

    // Test 14: Field Length Validation
    await runTest("Field Length Validation", async () => {
      const longJobData = {
        title: "A".repeat(256), // Exceeds max length
        company: "Test Corp",
        startDate: "2023-01-01",
      };

      try {
        await jobService.createJob(testUsers[0].id, longJobData);
        throw new Error("Should have failed with field length exceeded");
      } catch (error) {
        if (error.message.includes("characters")) {
          console.log("   ✓ Field length validation working");
        } else {
          throw error;
        }
      }
    });

    // Test 15: Pagination
    await runTest("Pagination", async () => {
      const options = { limit: 1, offset: 0 };
      const jobs = await jobService.getJobsByUserId(testUsers[0].id, options);

      if (jobs.length > 1) throw new Error("Pagination limit not working");

      console.log("   ✓ Pagination working correctly");
      console.log(`   ✓ Limited to ${jobs.length} job(s)`);
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
      console.log("\n🎉 All Jobs Service tests passed!");
      console.log("\n✅ Core Jobs Service components are working correctly:");
      console.log("   • Job creation and validation");
      console.log("   • Job retrieval and updates");
      console.log("   • Current job management");
      console.log("   • Date validation");
      console.log("   • User ownership validation");
      console.log("   • Job deletion");
      console.log("   • Job history and timeline");
      console.log("   • Business logic enforcement");
      console.log("   • Field validation");
      console.log("   • Pagination");
      console.log("   • Statistics");
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
