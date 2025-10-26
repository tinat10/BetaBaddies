import { v4 as uuidv4 } from "uuid";
import database from "./database.js";

class JobService {
  constructor() {
    this.maxDescriptionLength = 1000;
    this.maxTitleLength = 255;
    this.maxCompanyLength = 255;
    this.maxLocationLength = 255;
  }

  // Create a new job entry
  async createJob(userId, jobData) {
    const {
      title,
      company,
      location,
      startDate,
      endDate,
      isCurrent,
      description,
    } = jobData;

    try {
      // Validate required fields
      if (!title || !company || !startDate) {
        throw new Error("Title, company, and start date are required");
      }

      // Validate field lengths
      this.validateFieldLengths(jobData);

      // Validate dates
      this.validateDates(startDate, endDate, isCurrent);

      // If setting as current, ensure no other current jobs exist
      if (isCurrent) {
        await this.ensureOnlyOneCurrentJob(userId);
      }

      const jobId = uuidv4();

      // Create job in database
      const jobQuery = `
        INSERT INTO jobs (id, user_id, title, company, location, start_date, end_date, is_current, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, title, company, location, start_date, end_date, is_current, description
      `;

      const jobResult = await database.query(jobQuery, [
        jobId,
        userId,
        title,
        company,
        location || null,
        startDate,
        endDate || null,
        isCurrent || false,
        description || null,
      ]);

      return {
        id: jobResult.rows[0].id,
        title: jobResult.rows[0].title,
        company: jobResult.rows[0].company,
        location: jobResult.rows[0].location,
        startDate: jobResult.rows[0].start_date,
        endDate: jobResult.rows[0].end_date,
        isCurrent: jobResult.rows[0].is_current,
        description: jobResult.rows[0].description,
      };
    } catch (error) {
      console.error("❌ Error creating job:", error);
      throw error;
    }
  }

  // Get job by ID (with user ownership validation)
  async getJobById(jobId, userId) {
    try {
      const query = `
        SELECT id, title, company, location, start_date, end_date, is_current, description
        FROM jobs
        WHERE id = $1 AND user_id = $2
      `;

      const result = await database.query(query, [jobId, userId]);
      const job = result.rows[0];

      if (!job) {
        return null;
      }

      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        startDate: job.start_date,
        endDate: job.end_date,
        isCurrent: job.is_current,
        description: job.description,
      };
    } catch (error) {
      console.error("❌ Error getting job by ID:", error);
      throw error;
    }
  }

  // Get all jobs for a user
  async getJobsByUserId(userId, options = {}) {
    try {
      const { sort = "-start_date", limit = 50, offset = 0 } = options;

      // Validate limit
      const validLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
      const validOffset = Math.max(parseInt(offset) || 0, 0);

      // Build sort clause
      let sortClause = "ORDER BY start_date DESC";
      if (sort === "start_date") {
        sortClause = "ORDER BY start_date ASC";
      }

      const query = `
        SELECT id, title, company, location, start_date, end_date, is_current, description
        FROM jobs
        WHERE user_id = $1
        ${sortClause}
        LIMIT $2 OFFSET $3
      `;

      const result = await database.query(query, [
        userId,
        validLimit,
        validOffset,
      ]);

      return result.rows.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        startDate: job.start_date,
        endDate: job.end_date,
        isCurrent: job.is_current,
        description: job.description,
      }));
    } catch (error) {
      console.error("❌ Error getting jobs by user ID:", error);
      throw error;
    }
  }

  // Get current job for a user
  async getCurrentJob(userId) {
    try {
      const query = `
        SELECT id, title, company, location, start_date, end_date, is_current, description
        FROM jobs
        WHERE user_id = $1 AND is_current = true
        LIMIT 1
      `;

      const result = await database.query(query, [userId]);
      const job = result.rows[0];

      if (!job) {
        return null;
      }

      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        startDate: job.start_date,
        endDate: job.end_date,
        isCurrent: job.is_current,
        description: job.description,
      };
    } catch (error) {
      console.error("❌ Error getting current job:", error);
      throw error;
    }
  }

  // Get job history (chronological order)
  async getJobHistory(userId) {
    try {
      const query = `
        SELECT id, title, company, location, start_date, end_date, is_current, description
        FROM jobs
        WHERE user_id = $1
        ORDER BY start_date DESC, end_date DESC NULLS LAST
      `;

      const result = await database.query(query, [userId]);

      return result.rows.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        startDate: job.start_date,
        endDate: job.end_date,
        isCurrent: job.is_current,
        description: job.description,
      }));
    } catch (error) {
      console.error("❌ Error getting job history:", error);
      throw error;
    }
  }

  // Update job
  async updateJob(jobId, userId, updateData) {
    try {
      // First, verify job exists and belongs to user
      const existingJob = await this.getJobById(jobId, userId);

      if (!existingJob) {
        throw new Error("Job not found or does not belong to user");
      }

      // Validate field lengths if provided
      this.validateFieldLengths(updateData);

      // Validate dates if provided
      if (updateData.startDate || updateData.endDate) {
        this.validateDates(
          updateData.startDate || existingJob.startDate,
          updateData.endDate !== undefined
            ? updateData.endDate
            : existingJob.endDate,
          updateData.isCurrent !== undefined
            ? updateData.isCurrent
            : existingJob.isCurrent
        );
      }

      // If setting as current, ensure no other current jobs exist
      if (updateData.isCurrent === true) {
        await this.ensureOnlyOneCurrentJob(userId, jobId);
      }

      // Build dynamic update query
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      if (updateData.title !== undefined) {
        updateFields.push(`title = $${paramCount++}`);
        updateValues.push(updateData.title);
      }
      if (updateData.company !== undefined) {
        updateFields.push(`company = $${paramCount++}`);
        updateValues.push(updateData.company);
      }
      if (updateData.location !== undefined) {
        updateFields.push(`location = $${paramCount++}`);
        updateValues.push(updateData.location);
      }
      if (updateData.startDate !== undefined) {
        updateFields.push(`start_date = $${paramCount++}`);
        updateValues.push(updateData.startDate);
      }
      if (updateData.endDate !== undefined) {
        updateFields.push(`end_date = $${paramCount++}`);
        updateValues.push(updateData.endDate);
      }
      if (updateData.isCurrent !== undefined) {
        updateFields.push(`is_current = $${paramCount++}`);
        updateValues.push(updateData.isCurrent);
      }
      if (updateData.description !== undefined) {
        updateFields.push(`description = $${paramCount++}`);
        updateValues.push(updateData.description);
      }

      if (updateFields.length === 0) {
        throw new Error("No fields to update");
      }

      // Add job ID and user ID to parameters
      updateValues.push(jobId, userId);

      const query = `
        UPDATE jobs 
        SET ${updateFields.join(", ")}
        WHERE id = $${paramCount++} AND user_id = $${paramCount++}
        RETURNING id, title, company, location, start_date, end_date, is_current, description
      `;

      const result = await database.query(query, updateValues);

      if (result.rows.length === 0) {
        throw new Error("Job not found or does not belong to user");
      }

      const job = result.rows[0];
      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        startDate: job.start_date,
        endDate: job.end_date,
        isCurrent: job.is_current,
        description: job.description,
      };
    } catch (error) {
      console.error("❌ Error updating job:", error);
      throw error;
    }
  }

  // Delete job
  async deleteJob(jobId, userId) {
    try {
      const query = `
        DELETE FROM jobs 
        WHERE id = $1 AND user_id = $2
        RETURNING id, title, company
      `;

      const result = await database.query(query, [jobId, userId]);

      if (result.rows.length === 0) {
        throw new Error("Job not found or does not belong to user");
      }

      return {
        id: result.rows[0].id,
        title: result.rows[0].title,
        company: result.rows[0].company,
      };
    } catch (error) {
      console.error("❌ Error deleting job:", error);
      throw error;
    }
  }

  // Get job statistics for a user
  async getJobStatistics(userId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_jobs,
          COUNT(CASE WHEN is_current = true THEN 1 END) as current_jobs,
          COUNT(CASE WHEN is_current = false THEN 1 END) as past_jobs,
          MIN(start_date) as earliest_start,
          MAX(CASE WHEN is_current = false THEN end_date END) as latest_end
        FROM jobs
        WHERE user_id = $1
      `;

      const result = await database.query(query, [userId]);
      const stats = result.rows[0];

      return {
        totalJobs: parseInt(stats.total_jobs),
        currentJobs: parseInt(stats.current_jobs),
        pastJobs: parseInt(stats.past_jobs),
        earliestStart: stats.earliest_start,
        latestEnd: stats.latest_end,
      };
    } catch (error) {
      console.error("❌ Error getting job statistics:", error);
      throw error;
    }
  }

  // Helper method to validate field lengths
  validateFieldLengths(jobData) {
    if (jobData.title && jobData.title.length > this.maxTitleLength) {
      throw new Error(
        `Title must be ${this.maxTitleLength} characters or less`
      );
    }
    if (jobData.company && jobData.company.length > this.maxCompanyLength) {
      throw new Error(
        `Company must be ${this.maxCompanyLength} characters or less`
      );
    }
    if (jobData.location && jobData.location.length > this.maxLocationLength) {
      throw new Error(
        `Location must be ${this.maxLocationLength} characters or less`
      );
    }
    if (
      jobData.description &&
      jobData.description.length > this.maxDescriptionLength
    ) {
      throw new Error(
        `Description must be ${this.maxDescriptionLength} characters or less`
      );
    }
  }

  // Helper method to validate dates
  validateDates(startDate, endDate, isCurrent) {
    // Validate start date
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new Error("Invalid start date format");
      }
    }

    // Validate end date
    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw new Error("Invalid end date format");
      }

      // If both dates exist, end must be after start
      if (startDate) {
        const start = new Date(startDate);
        if (end <= start) {
          throw new Error("End date must be after start date");
        }
      }
    }

    // If current job, end date must be null
    if (isCurrent && endDate) {
      throw new Error("Current job cannot have an end date");
    }
  }

  // Helper method to ensure only one current job per user
  async ensureOnlyOneCurrentJob(userId, excludeJobId = null) {
    try {
      let query = "UPDATE jobs SET is_current = false WHERE user_id = $1";
      const params = [userId];

      if (excludeJobId) {
        query += " AND id != $2";
        params.push(excludeJobId);
      }

      await database.query(query, params);
    } catch (error) {
      console.error("❌ Error ensuring only one current job:", error);
      throw error;
    }
  }
}

export default new JobService();
