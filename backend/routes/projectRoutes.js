import express from "express";
import projectController from "../controllers/projectController.js";
import {
  isAuthenticated,
  csrfProtection,
} from "../middleware/auth.js";
import {
  validateCreateProject,
  validateUpdateProject,
} from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication

// Search and statistics routes (before :id to avoid conflicts)
router.get("/search", isAuthenticated, projectController.search);
router.get("/statistics", isAuthenticated, projectController.statistics);

// CRUD routes
router.get("/", isAuthenticated, projectController.getAll);

router.post(
  "/",
  isAuthenticated,
  csrfProtection,
  validateCreateProject,
  projectController.create
);

router.get("/:id", isAuthenticated, projectController.getById);

router.put(
  "/:id",
  isAuthenticated,
  csrfProtection,
  validateUpdateProject,
  projectController.update
);

router.delete(
  "/:id",
  isAuthenticated,
  csrfProtection,
  projectController.delete
);

export default router;

