const express = require("express");
const { body, validationResult } = require("express-validator");
const Application = require("../models/Application");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/applications
// @desc    Get all applications for current user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;

    const query = { userId: req.userId, isArchived: false };

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Search in position and company
    if (search) {
      query.$or = [
        { position: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await Application.find(query)
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("userId", "firstName lastName email");

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting applications",
    });
  }
});

// @route   GET /api/applications/stats
// @desc    Get application statistics for current user
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const stats = await Application.getUserStats(req.userId);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get application stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting application statistics",
    });
  }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting application",
    });
  }
});

// @route   POST /api/applications
// @desc    Create new application
// @access  Private
router.post(
  "/",
  [
    auth,
    body("position")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Position title is required and must be 1-100 characters"),
    body("company")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Company name is required and must be 1-100 characters"),
    body("status")
      .optional()
      .isIn([
        "pending",
        "reviewed",
        "interview",
        "offer",
        "rejected",
        "withdrawn",
      ])
      .withMessage("Invalid status"),
    body("employmentType")
      .optional()
      .isIn(["Full-time", "Part-time", "Contract", "Internship", "Temporary"])
      .withMessage("Invalid employment type"),
    body("source")
      .optional()
      .isIn([
        "company-website",
        "job-board",
        "recruiter",
        "referral",
        "networking",
        "other",
      ])
      .withMessage("Invalid source"),
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

      const applicationData = {
        ...req.body,
        userId: req.userId,
      };

      const application = new Application(applicationData);
      await application.save();

      res.status(201).json({
        success: true,
        message: "Application created successfully",
        application,
      });
    } catch (error) {
      console.error("Create application error:", error);
      res.status(500).json({
        success: false,
        message: "Server error creating application",
      });
    }
  }
);

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put(
  "/:id",
  [
    auth,
    body("position")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Position title must be 1-100 characters"),
    body("company")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Company name must be 1-100 characters"),
    body("status")
      .optional()
      .isIn([
        "pending",
        "reviewed",
        "interview",
        "offer",
        "rejected",
        "withdrawn",
      ])
      .withMessage("Invalid status"),
    body("employmentType")
      .optional()
      .isIn(["Full-time", "Part-time", "Contract", "Internship", "Temporary"])
      .withMessage("Invalid employment type"),
    body("source")
      .optional()
      .isIn([
        "company-website",
        "job-board",
        "recruiter",
        "referral",
        "networking",
        "other",
      ])
      .withMessage("Invalid source"),
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

      const application = await Application.findOne({
        _id: req.params.id,
        userId: req.userId,
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      // Update fields
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          application[key] = req.body[key];
        }
      });

      // Update last activity
      application.lastActivity = new Date();

      await application.save();

      res.json({
        success: true,
        message: "Application updated successfully",
        application,
      });
    } catch (error) {
      console.error("Update application error:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating application",
      });
    }
  }
);

// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Soft delete - archive the application
    application.isArchived = true;
    await application.save();

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting application",
    });
  }
});

// @route   POST /api/applications/:id/archive
// @desc    Archive application
// @access  Private
router.post("/:id/archive", auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.isArchived = true;
    await application.save();

    res.json({
      success: true,
      message: "Application archived successfully",
    });
  } catch (error) {
    console.error("Archive application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error archiving application",
    });
  }
});

// @route   POST /api/applications/:id/restore
// @desc    Restore archived application
// @access  Private
router.post("/:id/restore", auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.isArchived = false;
    await application.save();

    res.json({
      success: true,
      message: "Application restored successfully",
    });
  } catch (error) {
    console.error("Restore application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error restoring application",
    });
  }
});

module.exports = router;
