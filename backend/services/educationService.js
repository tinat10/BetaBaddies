import { v4 as uuidv4 } from "uuid";
import database from "./database.js";

class EducationService {
  // Create a new education entry
  async createEducation(userId, educationData) {
    const {
      school,
      degreeType,
      field,
      gpa,
      isEnrolled,
      honors,
      startDate,
      endDate,
    } = educationData;

    try {
      const educationId = uuidv4();

      const query = `
        INSERT INTO educations (
          id, user_id, school, degree_type, field,
          gpa, is_enrolled, honors, startdate, graddate
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const result = await database.query(query, [
        educationId,
        userId,
        school,
        degreeType,
        field || null,
        gpa || null,
        isEnrolled,
        honors || null,
        startDate || null,
        endDate || null,
      ]);

      return {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        school: result.rows[0].school,
        degreeType: result.rows[0].degree_type,
        field: result.rows[0].field,
        gpa: result.rows[0].gpa ? parseFloat(result.rows[0].gpa) : null,
        isEnrolled: result.rows[0].is_enrolled,
        honors: result.rows[0].honors,
        startDate: result.rows[0].startdate,
        endDate: result.rows[0].graddate,
      };
    } catch (error) {
      console.error("❌ Error creating education:", error);
      throw error;
    }
  }

  // Get all education entries for a user
  async getEducationsByUserId(userId) {
    try {
      const query = `
        SELECT *
        FROM educations
        WHERE user_id = $1
        ORDER BY 
          CASE WHEN is_enrolled = true THEN 0 ELSE 1 END,
          COALESCE(graddate, '9999-12-31'::date) DESC,
          COALESCE(startdate, '1900-01-01'::date) DESC
      `;

      const result = await database.query(query, [userId]);
      return result.rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        school: row.school,
        degreeType: row.degree_type,
        field: row.field,
        gpa: row.gpa ? parseFloat(row.gpa) : null,
        isEnrolled: row.is_enrolled,
        honors: row.honors,
        startDate: row.startdate,
        endDate: row.graddate,
      }));
    } catch (error) {
      console.error("❌ Error getting educations:", error);
      throw error;
    }
  }

  // Get education by ID
  async getEducationById(educationId, userId) {
    try {
      const query = `
        SELECT *
        FROM educations
        WHERE id = $1 AND user_id = $2
      `;

      const result = await database.query(query, [educationId, userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        userId: row.user_id,
        school: row.school,
        degreeType: row.degree_type,
        field: row.field,
        gpa: row.gpa ? parseFloat(row.gpa) : null,
        isEnrolled: row.is_enrolled,
        honors: row.honors,
        startDate: row.startdate,
        endDate: row.graddate,
      };
    } catch (error) {
      console.error("❌ Error getting education by ID:", error);
      throw error;
    }
  }

  // Update education entry
  async updateEducation(educationId, userId, educationData) {
    const {
      school,
      degreeType,
      field,
      gpa,
      isEnrolled,
      honors,
      startDate,
      endDate,
    } = educationData;

    try {
      // First, verify the education belongs to the user
      const existing = await this.getEducationById(educationId, userId);
      if (!existing) {
        throw new Error("Education not found");
      }

      const query = `
        UPDATE educations
        SET 
          school = COALESCE($3, school),
          degree_type = COALESCE($4, degree_type),
          field = $5,
          gpa = $6,
          is_enrolled = COALESCE($7, is_enrolled),
          honors = $8,
          startdate = $9,
          graddate = $10
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;

      const result = await database.query(query, [
        educationId,
        userId,
        school,
        degreeType,
        field,
        gpa,
        isEnrolled,
        honors,
        startDate,
        endDate,
      ]);

      if (result.rows.length === 0) {
        throw new Error("Failed to update education");
      }

      const row = result.rows[0];
      return {
        id: row.id,
        userId: row.user_id,
        school: row.school,
        degreeType: row.degree_type,
        field: row.field,
        gpa: row.gpa ? parseFloat(row.gpa) : null,
        isEnrolled: row.is_enrolled,
        honors: row.honors,
        startDate: row.startdate,
        endDate: row.graddate,
      };
    } catch (error) {
      console.error("❌ Error updating education:", error);
      throw error;
    }
  }

  // Delete education entry
  async deleteEducation(educationId, userId) {
    try {
      // First, verify the education belongs to the user
      const existing = await this.getEducationById(educationId, userId);
      if (!existing) {
        throw new Error("Education not found");
      }

      const query = `
        DELETE FROM educations
        WHERE id = $1 AND user_id = $2
      `;

      await database.query(query, [educationId, userId]);

      return { success: true, message: "Education deleted successfully" };
    } catch (error) {
      console.error("❌ Error deleting education:", error);
      throw error;
    }
  }
}

export default new EducationService();

