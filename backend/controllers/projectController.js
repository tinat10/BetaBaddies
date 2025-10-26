import projectService from "../services/projectService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class ProjectController {
  // Create a new project
  create = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const projectData = req.body;

    const project = await projectService.createProject(userId, projectData);

    res.status(201).json({
      ok: true,
      data: {
        project,
        message: "Project created successfully",
      },
    });
  });

  // Get all projects for the current user
  getAll = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    // Extract query parameters for filtering and sorting
    const filters = {
      status: req.query.status,
      industry: req.query.industry,
      technology: req.query.technology,
      startDateFrom: req.query.startDateFrom,
      startDateTo: req.query.startDateTo,
    };

    const sortOptions = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const projects = await projectService.getProjectsByUserId(
      userId,
      filters,
      sortOptions
    );

    res.status(200).json({
      ok: true,
      data: {
        projects,
        count: projects.length,
        filters: Object.keys(filters).length > 0 ? filters : null,
      },
    });
  });

  // Get a specific project by ID
  getById = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const project = await projectService.getProjectById(id, userId);

    if (!project) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "PROJECT_NOT_FOUND",
          message: "Project not found",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        project,
      },
    });
  });

  // Search projects
  search = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        ok: false,
        error: {
          code: "INVALID_SEARCH_QUERY",
          message: "Search query is required",
        },
      });
    }

    const projects = await projectService.searchProjects(userId, q);

    res.status(200).json({
      ok: true,
      data: {
        projects,
        count: projects.length,
        query: q,
      },
    });
  });

  // Get project statistics
  statistics = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const stats = await projectService.getProjectStatistics(userId);

    res.status(200).json({
      ok: true,
      data: {
        statistics: stats,
      },
    });
  });

  // Update a project
  update = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    const projectData = req.body;

    try {
      const project = await projectService.updateProject(
        id,
        userId,
        projectData
      );

      res.status(200).json({
        ok: true,
        data: {
          project,
          message: "Project updated successfully",
        },
      });
    } catch (error) {
      if (error.message === "Project not found") {
        return res.status(404).json({
          ok: false,
          error: {
            code: "PROJECT_NOT_FOUND",
            message: "Project not found",
          },
        });
      }
      throw error;
    }
  });

  // Delete a project
  delete = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    try {
      await projectService.deleteProject(id, userId);

      res.status(200).json({
        ok: true,
        data: {
          message: "Project deleted successfully",
        },
      });
    } catch (error) {
      if (error.message === "Project not found") {
        return res.status(404).json({
          ok: false,
          error: {
            code: "PROJECT_NOT_FOUND",
            message: "Project not found",
          },
        });
      }
      throw error;
    }
  });
}

export default new ProjectController();

