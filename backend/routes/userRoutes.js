import express from "express";
import userController from "../controllers/userController.js";
import { isAuthenticated, authRateLimit } from "../middleware/auth.js";
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
} from "../middleware/validation.js";

const router = express.Router();

// Public routes (no authentication required)
router.post(
  "/register",
  authRateLimit(15 * 60 * 1000, 5), // 5 attempts per 15 minutes
  validateRegister,
  userController.register
);

router.post(
  "/login",
  authRateLimit(15 * 60 * 1000, 10), // 10 attempts per 15 minutes
  validateLogin,
  userController.login
);

router.post("/logout", userController.logout);

// Protected routes (authentication required)
router.get("/profile", isAuthenticated, userController.getProfile);

router.put(
  "/change-password",
  isAuthenticated,
  validateChangePassword,
  userController.changePassword
);

router.delete("/account", isAuthenticated, userController.deleteAccount);

export default router;
