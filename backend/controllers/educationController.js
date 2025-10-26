import educationService from "../services/educationService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class EducationController {
  // Create a new education entry
  create = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const educationData = req.body;

    const education = await educationService.createEducation(userId, educationData);

    res.status(201).json({
      ok: true,
      data: {
        education,
        message: "Education entry created successfully",
      },
    });
  });

  // Get all education entries for the current user
  getAll = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const educations = await educationService.getEducationsByUserId(userId);

    res.status(200).json({
      ok: true,
      data: {
        educations,
      },
    });
  });

  // Get a specific education entry by ID
  getById = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const education = await educationService.getEducationById(id, userId);

    if (!education) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "EDUCATION_NOT_FOUND",
          message: "Education entry not found",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        education,
      },
    });
  });

  // Update an education entry
  update = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    const educationData = req.body;

    try {
      const education = await educationService.updateEducation(
        id,
        userId,
        educationData
      );

      res.status(200).json({
        ok: true,
        data: {
          education,
          message: "Education entry updated successfully",
        },
      });
    } catch (error) {
      if (error.message === "Education not found") {
        return res.status(404).json({
          ok: false,
          error: {
            code: "EDUCATION_NOT_FOUND",
            message: "Education entry not found",
          },
        });
      }
      throw error;
    }
  });

  // Delete an education entry
  delete = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    try {
      await educationService.deleteEducation(id, userId);

      res.status(200).json({
        ok: true,
        data: {
          message: "Education entry deleted successfully",
        },
      });
    } catch (error) {
      if (error.message === "Education not found") {
        return res.status(404).json({
          ok: false,
          error: {
            code: "EDUCATION_NOT_FOUND",
            message: "Education entry not found",
          },
        });
      }
      throw error;
    }
  });
}

export default new EducationController();

