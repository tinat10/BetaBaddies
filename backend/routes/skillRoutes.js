import express from "express";
import skillController from "../controllers/skillController.js";
import { isAuthenticated } from "../middleware/auth.js";
import {
  validateCreateSkill,
  validateUpdateSkill,
} from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.get("/", isAuthenticated, skillController.getAll);

router.get("/categories", isAuthenticated, skillController.getByCategory);

router.post("/", isAuthenticated, validateCreateSkill, skillController.create);

router.get("/:id", isAuthenticated, skillController.getById);

router.put(
  "/:id",
  isAuthenticated,
  validateUpdateSkill,
  skillController.update
);

router.delete("/:id", isAuthenticated, skillController.delete);

export default router;
