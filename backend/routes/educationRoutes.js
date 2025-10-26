import express from "express";
import educationController from "../controllers/educationController.js";
import {
  isAuthenticated,
  csrfProtection,
} from "../middleware/auth.js";
import {
  validateCreateEducation,
  validateUpdateEducation,
} from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.get("/", isAuthenticated, educationController.getAll);

router.post(
  "/",
  isAuthenticated,
  csrfProtection,
  validateCreateEducation,
  educationController.create
);

router.get("/:id", isAuthenticated, educationController.getById);

router.put(
  "/:id",
  isAuthenticated,
  csrfProtection,
  validateUpdateEducation,
  educationController.update
);

router.delete(
  "/:id",
  isAuthenticated,
  csrfProtection,
  educationController.delete
);

export default router;

