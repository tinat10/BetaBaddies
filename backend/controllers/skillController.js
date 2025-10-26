import skillService from "../services/skillService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class SkillController {
  // Create a new skill
  create = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const skillData = req.body;

    const skill = await skillService.createSkill(userId, skillData);

    res.status(201).json({
      ok: true,
      data: {
        skill,
        message: "Skill created successfully",
      },
    });
  });

  // Get all skills for the current user
  getAll = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { category } = req.query;

    const skills = await skillService.getSkillsByUserId(userId, category);

    res.status(200).json({
      ok: true,
      data: {
        skills,
      },
    });
  });

  // Get skills grouped by category
  getByCategory = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const { skillsByCategory, categoryCounts } =
      await skillService.getSkillsByCategory(userId);

    res.status(200).json({
      ok: true,
      data: {
        skillsByCategory,
        categoryCounts,
      },
    });
  });

  // Get a specific skill by ID
  getById = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const skill = await skillService.getSkillById(id, userId);

    if (!skill) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "SKILL_NOT_FOUND",
          message: "Skill not found",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        skill,
      },
    });
  });

  // Update a skill
  update = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    const skillData = req.body;

    try {
      const skill = await skillService.updateSkill(id, userId, skillData);

      res.status(200).json({
        ok: true,
        data: {
          skill,
          message: "Skill updated successfully",
        },
      });
    } catch (error) {
      if (error.message === "Skill not found") {
        return res.status(404).json({
          ok: false,
          error: {
            code: "SKILL_NOT_FOUND",
            message: "Skill not found",
          },
        });
      }
      if (error.message === "DUPLICATE_SKILL") {
        return res.status(409).json({
          ok: false,
          error: {
            code: "DUPLICATE_SKILL",
            message: "You already have this skill",
          },
        });
      }
      throw error;
    }
  });

  // Delete a skill
  delete = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    try {
      await skillService.deleteSkill(id, userId);

      res.status(200).json({
        ok: true,
        data: {
          message: "Skill deleted successfully",
        },
      });
    } catch (error) {
      if (error.message === "Skill not found") {
        return res.status(404).json({
          ok: false,
          error: {
            code: "SKILL_NOT_FOUND",
            message: "Skill not found",
          },
        });
      }
      throw error;
    }
  });
}

export default new SkillController();

