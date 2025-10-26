import express from "express";
import userController from "../controllers/userController.js";
import {
  isAuthenticated,
  csrfProtection,
  authRateLimit,
} from "../middleware/auth.js";
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
  csrfProtection,
  validateRegister,
  userController.register
);

router.post(
  "/login",
  authRateLimit(15 * 60 * 1000, 10), // 10 attempts per 15 minutes
  csrfProtection,
  validateLogin,
  userController.login
);

router.post("/logout", csrfProtection, userController.logout);

router.get("/csrf-token", userController.getCSRFToken);

// Protected routes (authentication required)
router.get("/profile", isAuthenticated, userController.getProfile);

router.put(
  "/change-password",
  isAuthenticated,
  csrfProtection,
  validateChangePassword,
  userController.changePassword
);

router.delete(
  "/account",
  isAuthenticated,
  csrfProtection,
  userController.deleteAccount
);

export default router;
