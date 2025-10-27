import express from "express";
import profileController from "../controllers/profileController.js";
import { isAuthenticated } from "../middleware/auth.js";
import {
  validateCreateProfile,
  validateUpdateProfile,
} from "../middleware/validation.js";

const router = express.Router();

// All profile routes require authentication
router.use(isAuthenticated);

// Get current user's profile
router.get("/", profileController.getProfile);

// Get profile picture path
router.get("/picture", profileController.getProfilePicture);

// Get profile statistics
router.get("/statistics", profileController.getProfileStatistics);

// Create or update profile
router.post(
  "/",
  validateCreateProfile,
  profileController.createOrUpdateProfile
);

// Update profile
router.put("/", validateUpdateProfile, profileController.updateProfile);

// Update profile picture (called by file upload service)
router.put("/picture", profileController.updateProfilePicture);

export default router;
