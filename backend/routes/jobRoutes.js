import express from "express";
import jobController from "../controllers/jobController.js";
import { isAuthenticated, csrfProtection } from "../middleware/auth.js";
import {
  validateCreateJob,
  validateUpdateJob,
  validateJobId,
} from "../middleware/validation.js";

const router = express.Router();

// All job routes require authentication
router.use(isAuthenticated);

// Create a new job
router.post("/", csrfProtection, validateCreateJob, jobController.createJob);

// Get all jobs for the authenticated user
router.get("/", jobController.getJobs);

// Get current job
router.get("/current", jobController.getCurrentJob);

// Get job history (timeline view)
router.get("/history", jobController.getJobHistory);

// Get job statistics
router.get("/statistics", jobController.getJobStatistics);

// Get job by ID (must be after other routes to avoid conflicts)
router.get("/:id", validateJobId, jobController.getJob);

// Update job
router.put(
  "/:id",
  csrfProtection,
  validateJobId,
  validateUpdateJob,
  jobController.updateJob
);

// Delete job
router.delete("/:id", csrfProtection, validateJobId, jobController.deleteJob);

export default router;
