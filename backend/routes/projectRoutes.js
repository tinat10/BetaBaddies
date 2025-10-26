import express from "express";
import projectController from "../controllers/projectController.js";
import { isAuthenticated } from "../middleware/auth.js";
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
  validateCreateProject,
  projectController.create
);

router.get("/:id", isAuthenticated, projectController.getById);

router.put(
  "/:id",
  isAuthenticated,
  validateUpdateProject,
  projectController.update
);

router.delete("/:id", isAuthenticated, projectController.delete);

export default router;
