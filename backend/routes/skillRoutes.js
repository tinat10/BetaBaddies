import express from "express";
import skillController from "../controllers/skillController.js";
import {
  isAuthenticated,
  csrfProtection,
} from "../middleware/auth.js";
import {
  validateCreateSkill,
  validateUpdateSkill,
} from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.get("/", isAuthenticated, skillController.getAll);

router.get("/categories", isAuthenticated, skillController.getByCategory);

router.post(
  "/",
  isAuthenticated,
  csrfProtection,
  validateCreateSkill,
  skillController.create
);

router.get("/:id", isAuthenticated, skillController.getById);

router.put(
  "/:id",
  isAuthenticated,
  csrfProtection,
  validateUpdateSkill,
  skillController.update
);

router.delete(
  "/:id",
  isAuthenticated,
  csrfProtection,
  skillController.delete
);

export default router;

