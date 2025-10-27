import express from "express";
import userController from "../controllers/userController.js";
import { isAuthenticated, authRateLimit } from "../middleware/auth.js";
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateDeleteAccount,
} from "../middleware/validation.js";

const router = express.Router();

// Public routes (no authentication required)
router.post(
  "/register",
  authRateLimit(15 * 60 * 1000, 100), // 100 attempts per 15 minutes (increased for development)
  validateRegister,
  userController.register
);

router.post(
  "/login",
  authRateLimit(15 * 60 * 1000, 100), // 100 attempts per 15 minutes (increased for development)
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

router.delete(
  "/account",
  isAuthenticated,
  validateDeleteAccount,
  userController.deleteAccount
);

export default router;
