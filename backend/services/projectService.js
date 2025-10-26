import { v4 as uuidv4 } from "uuid";
import database from "./database.js";

class ProjectService {
  // Create a new project
  async createProject(userId, projectData) {
    const {
      name,
      link,
      description,
      startDate,
      endDate,
      technologies,
      collaborators,
      status,
      industry,
    } = projectData;

    try {
      const projectId = uuidv4();

      const query = `
        INSERT INTO projects (
          id, user_id, name, link, description, start_date, end_date,
          technologies, collaborators, status, industry
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const result = await database.query(query, [
        projectId,
        userId,
        name,
        link || null,
        description || null,
        startDate,
        endDate || null,
        technologies || null,
        collaborators || null,
        status,
        industry || null,
      ]);

      return this.mapRowToProject(result.rows[0]);
    } catch (error) {
      console.error("❌ Error creating project:", error);
      throw error;
    }
  }

  // Get all projects for a user with optional filtering and sorting
  async getProjectsByUserId(userId, filters = {}, sortOptions = {}) {
    try {
      let query = `
        SELECT *
        FROM projects
        WHERE user_id = $1
      `;

      const params = [userId];
      let paramCount = 1;

      // Apply filters
      if (filters.status) {
        paramCount++;
        query += ` AND status = $${paramCount}`;
        params.push(filters.status);
      }

      if (filters.industry) {
        paramCount++;
        query += ` AND industry = $${paramCount}`;
        params.push(filters.industry);
      }

      if (filters.technology) {
        paramCount++;
        query += ` AND technologies ILIKE $${paramCount}`;
        params.push(`%${filters.technology}%`);
      }

      if (filters.startDateFrom) {
        paramCount++;
        query += ` AND start_date >= $${paramCount}`;
        params.push(filters.startDateFrom);
      }

      if (filters.startDateTo) {
        paramCount++;
        query += ` AND start_date <= $${paramCount}`;
        params.push(filters.startDateTo);
      }

      // Apply sorting
      const sortBy = sortOptions.sortBy || "start_date";
      const sortOrder = sortOptions.sortOrder || "DESC";

      const validSortFields = [
        "start_date",
        "end_date",
        "name",
        "status",
        "industry",
      ];
      const validSortOrders = ["ASC", "DESC"];

      if (
        validSortFields.includes(sortBy) &&
        validSortOrders.includes(sortOrder.toUpperCase())
      ) {
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
      } else {
        query += ` ORDER BY start_date DESC`;
      }

      const result = await database.query(query, params);
      return result.rows.map(this.mapRowToProject);
    } catch (error) {
      console.error("❌ Error getting projects:", error);
      throw error;
    }
  }

  // Get project by ID
  async getProjectById(projectId, userId) {
    try {
      const query = `
        SELECT *
        FROM projects
        WHERE id = $1 AND user_id = $2
      `;

      const result = await database.query(query, [projectId, userId]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToProject(result.rows[0]);
    } catch (error) {
      console.error("❌ Error getting project by ID:", error);
      throw error;
    }
  }

  // Search projects by text
  async searchProjects(userId, searchTerm) {
    try {
      const query = `
        SELECT *
        FROM projects
        WHERE user_id = $1
          AND (
            name ILIKE $2
            OR description ILIKE $2
            OR technologies ILIKE $2
            OR industry ILIKE $2
          )
        ORDER BY start_date DESC
      `;

      const searchPattern = `%${searchTerm}%`;
      const result = await database.query(query, [userId, searchPattern]);
      return result.rows.map(this.mapRowToProject);
    } catch (error) {
      console.error("❌ Error searching projects:", error);
      throw error;
    }
  }

  // Get projects grouped by status with counts
  async getProjectStatistics(userId) {
    try {
      const query = `
        SELECT 
          status,
          COUNT(*) as count
        FROM projects
        WHERE user_id = $1
        GROUP BY status
      `;

      const result = await database.query(query, [userId]);

      // Get total count
      const totalQuery = `
        SELECT COUNT(*) as total
        FROM projects
        WHERE user_id = $1
      `;

      const totalResult = await database.query(totalQuery, [userId]);
      const totalCount = parseInt(totalResult.rows[0].total);

      // Get unique technologies count (approximate)
      const techQuery = `
        SELECT technologies
        FROM projects
        WHERE user_id = $1 AND technologies IS NOT NULL
      `;

      const techResult = await database.query(techQuery, [userId]);
      const uniqueTechnologies = new Set();

      techResult.rows.forEach((row) => {
        if (row.technologies) {
          const techs = row.technologies
            .split(",")
            .map((t) => t.trim().toLowerCase());
          techs.forEach((tech) => uniqueTechnologies.add(tech));
        }
      });

      const statusCounts = {};
      result.rows.forEach((row) => {
        statusCounts[row.status] = parseInt(row.count);
      });

      return {
        total: totalCount,
        byStatus: statusCounts,
        uniqueTechnologies: uniqueTechnologies.size,
      };
    } catch (error) {
      console.error("❌ Error getting project statistics:", error);
      throw error;
    }
  }

  // Update project
  async updateProject(projectId, userId, projectData) {
    const {
      name,
      link,
      description,
      startDate,
      endDate,
      technologies,
      collaborators,
      status,
      industry,
    } = projectData;

    try {
      // First, verify the project belongs to the user
      const existing = await this.getProjectById(projectId, userId);
      if (!existing) {
        throw new Error("Project not found");
      }

      const query = `
        UPDATE projects
        SET 
          name = COALESCE($3, name),
          link = $4,
          description = $5,
          start_date = COALESCE($6, start_date),
          end_date = $7,
          technologies = $8,
          collaborators = $9,
          status = COALESCE($10, status),
          industry = $11
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;

      const result = await database.query(query, [
        projectId,
        userId,
        name,
        link,
        description,
        startDate,
        endDate,
        technologies,
        collaborators,
        status,
        industry,
      ]);

      if (result.rows.length === 0) {
        throw new Error("Failed to update project");
      }

      return this.mapRowToProject(result.rows[0]);
    } catch (error) {
      console.error("❌ Error updating project:", error);
      throw error;
    }
  }

  // Delete project
  async deleteProject(projectId, userId) {
    try {
      // First, verify the project belongs to the user
      const existing = await this.getProjectById(projectId, userId);
      if (!existing) {
        throw new Error("Project not found");
      }

      const query = `
        DELETE FROM projects
        WHERE id = $1 AND user_id = $2
      `;

      await database.query(query, [projectId, userId]);

      return { success: true, message: "Project deleted successfully" };
    } catch (error) {
      console.error("❌ Error deleting project:", error);
      throw error;
    }
  }

  // Helper method to map database row to project object
  mapRowToProject(row) {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      link: row.link,
      description: row.description,
      startDate: row.start_date,
      endDate: row.end_date,
      technologies: row.technologies,
      collaborators: row.collaborators,
      status: row.status,
      industry: row.industry,
    };
  }
}

export default new ProjectService();

