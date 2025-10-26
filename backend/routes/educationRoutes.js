import express from "express";
import educationController from "../controllers/educationController.js";
import { isAuthenticated } from "../middleware/auth.js";
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
  validateCreateEducation,
  educationController.create
);

router.get("/:id", isAuthenticated, educationController.getById);

router.put(
  "/:id",
  isAuthenticated,
  validateUpdateEducation,
  educationController.update
);

router.delete("/:id", isAuthenticated, educationController.delete);

export default router;
