const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        headline: user.headline,
        bio: user.bio,
        industry: user.industry,
        experienceLevel: user.experienceLevel,
        profilePicture: user.profilePicture,
        profileCompletion: user.getProfileCompletion(),
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting user profile",
    });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put(
  "/me",
  [
    auth,
    body("firstName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be 2-50 characters"),
    body("lastName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be 2-50 characters"),
    body("phone")
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage("Please enter a valid phone number"),
    body("headline")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Headline cannot exceed 200 characters"),
    body("bio")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Bio cannot exceed 1000 characters"),
    body("industry")
      .optional()
      .isIn([
        "Technology",
        "Finance",
        "Healthcare",
        "Education",
        "Manufacturing",
        "Retail",
        "Other",
      ])
      .withMessage("Invalid industry"),
    body("experienceLevel")
      .optional()
      .isIn(["Entry", "Mid", "Senior", "Executive"])
      .withMessage("Invalid experience level"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        firstName,
        lastName,
        phone,
        location,
        headline,
        bio,
        industry,
        experienceLevel,
        profilePicture,
        preferences,
      } = req.body;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update fields
      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (phone !== undefined) user.phone = phone;
      if (location !== undefined) user.location = location;
      if (headline !== undefined) user.headline = headline;
      if (bio !== undefined) user.bio = bio;
      if (industry !== undefined) user.industry = industry;
      if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
      if (profilePicture !== undefined) user.profilePicture = profilePicture;
      if (preferences !== undefined)
        user.preferences = { ...user.preferences, ...preferences };

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          location: user.location,
          headline: user.headline,
          bio: user.bio,
          industry: user.industry,
          experienceLevel: user.experienceLevel,
          profilePicture: user.profilePicture,
          profileCompletion: user.getProfileCompletion(),
          preferences: user.preferences,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("Update user profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating user profile",
      });
    }
  }
);

// @route   DELETE /api/users/me
// @desc    Delete current user account
// @access  Private
router.delete(
  "/me",
  [
    auth,
    body("password")
      .notEmpty()
      .withMessage("Password is required for account deletion"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { password } = req.body;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      // Soft delete - deactivate account
      user.isActive = false;
      user.email = `deleted_${Date.now()}_${user.email}`;
      await user.save();

      res.json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Delete user account error:", error);
      res.status(500).json({
        success: false,
        message: "Server error deleting user account",
      });
    }
  }
);

// @route   POST /api/users/me/upload-avatar
// @desc    Upload profile picture
// @access  Private
router.post("/me/upload-avatar", auth, async (req, res) => {
  try {
    // TODO: Implement file upload with multer
    // For now, just return a placeholder
    res.json({
      success: true,
      message: "Avatar upload endpoint - implementation pending",
      profilePicture: null,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Server error uploading avatar",
    });
  }
});

// @route   GET /api/users/me/stats
// @desc    Get user statistics
// @access  Private
router.get("/me/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // TODO: Get application statistics
    const stats = {
      profileCompletion: user.getProfileCompletion(),
      totalApplications: 0,
      pendingApplications: 0,
      interviewApplications: 0,
      offerApplications: 0,
      rejectedApplications: 0,
      accountCreated: user.createdAt,
      lastLogin: user.lastLogin,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting user statistics",
    });
  }
});

module.exports = router;
