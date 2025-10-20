import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import database from "./database.js";

class UserService {
  constructor() {
    this.saltRounds = 12;
  }

  // Create a new user
  async createUser(userData) {
    const { email, password, firstName, lastName } = userData;

    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);
      const userId = uuidv4();

      // Create user in database
      const userQuery = `
        INSERT INTO users (u_id, email, password, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING u_id, email, created_at, updated_at
      `;

      const userResult = await database.query(userQuery, [
        userId,
        email,
        hashedPassword,
      ]);

      // Create profile entry
      const profileQuery = `
        INSERT INTO profiles (user_id, first_name, last_name, state)
        VALUES ($1, $2, $3, 'CA')
        RETURNING *
      `;

      await database.query(profileQuery, [userId, firstName, lastName]);

      return {
        id: userResult.rows[0].u_id,
        email: userResult.rows[0].email,
        createdAt: userResult.rows[0].created_at,
        updatedAt: userResult.rows[0].updated_at,
      };
    } catch (error) {
      console.error("❌ Error creating user:", error);
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const query = `
        SELECT u.u_id, u.email, u.password, u.created_at, u.updated_at,
               p.first_name, p.last_name, p.phone, p.city, p.state, 
               p.job_title, p.bio, p.industry, p.exp_level, p.pfp_link
        FROM users u
        LEFT JOIN profiles p ON u.u_id = p.user_id
        WHERE u.email = $1
      `;

      const result = await database.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error getting user by email:", error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const query = `
        SELECT u.u_id, u.email, u.created_at, u.updated_at,
               p.first_name, p.last_name, p.middle_name, p.phone, p.city, p.state, 
               p.job_title, p.bio, p.industry, p.exp_level, p.pfp_link
        FROM users u
        LEFT JOIN profiles p ON u.u_id = p.user_id
        WHERE u.u_id = $1
      `;

      const result = await database.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error getting user by ID:", error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const {
        firstName,
        middleName,
        lastName,
        phone,
        city,
        state,
        jobTitle,
        bio,
        industry,
        expLevel,
        pfpLink,
      } = profileData;

      const query = `
        UPDATE profiles 
        SET first_name = COALESCE($2, first_name),
            middle_name = COALESCE($3, middle_name),
            last_name = COALESCE($4, last_name),
            phone = COALESCE($5, phone),
            city = COALESCE($6, city),
            state = COALESCE($7, state),
            job_title = COALESCE($8, job_title),
            bio = COALESCE($9, bio),
            industry = COALESCE($10, industry),
            exp_level = COALESCE($11, exp_level),
            pfp_link = COALESCE($12, pfp_link)
        WHERE user_id = $1
        RETURNING *
      `;

      const result = await database.query(query, [
        userId,
        firstName,
        middleName,
        lastName,
        phone,
        city,
        state,
        jobTitle,
        bio,
        industry,
        expLevel,
        pfpLink,
      ]);

      if (result.rows.length === 0) {
        throw new Error("Profile not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error updating user profile:", error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error("❌ Error verifying password:", error);
      throw error;
    }
  }

  // Hash password
  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      console.error("❌ Error hashing password:", error);
      throw error;
    }
  }

  // Update password
  async updatePassword(userId, newPassword) {
    try {
      const hashedPassword = await this.hashPassword(newPassword);

      const query = `
        UPDATE users 
        SET password = $2, updated_at = NOW()
        WHERE u_id = $1
        RETURNING u_id, email, updated_at
      `;

      const result = await database.query(query, [userId, hashedPassword]);

      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error updating password:", error);
      throw error;
    }
  }

  // Delete user account
  async deleteUser(userId) {
    try {
      await database.transaction(async (client) => {
        // Delete related records first (due to foreign key constraints)
        await client.query("DELETE FROM certifications WHERE user_id = $1", [
          userId,
        ]);
        await client.query("DELETE FROM projects WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM skills WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM educations WHERE user_id = $1", [
          userId,
        ]);
        await client.query("DELETE FROM jobs WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM profiles WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM users WHERE u_id = $1", [userId]);
      });

      return { success: true, message: "User account deleted successfully" };
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      throw error;
    }
  }

  // Get user dashboard overview
  async getUserDashboard(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Get counts for each section
      const [
        jobsResult,
        educationResult,
        skillsResult,
        certificationsResult,
        projectsResult,
      ] = await Promise.all([
        database.query(
          "SELECT COUNT(*) as count FROM jobs WHERE user_id = $1",
          [userId]
        ),
        database.query(
          "SELECT COUNT(*) as count FROM educations WHERE user_id = $1",
          [userId]
        ),
        database.query(
          "SELECT COUNT(*) as count FROM skills WHERE user_id = $1",
          [userId]
        ),
        database.query(
          "SELECT COUNT(*) as count FROM certifications WHERE user_id = $1",
          [userId]
        ),
        database.query(
          "SELECT COUNT(*) as count FROM projects WHERE user_id = $1",
          [userId]
        ),
      ]);

      return {
        user: {
          id: user.u_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          jobTitle: user.job_title,
          industry: user.industry,
          pfpLink: user.pfp_link,
        },
        counts: {
          jobs: parseInt(jobsResult.rows[0].count),
          education: parseInt(educationResult.rows[0].count),
          skills: parseInt(skillsResult.rows[0].count),
          certifications: parseInt(certificationsResult.rows[0].count),
          projects: parseInt(projectsResult.rows[0].count),
        },
        profileCompleteness: this.calculateProfileCompleteness(user, {
          jobs: parseInt(jobsResult.rows[0].count),
          education: parseInt(educationResult.rows[0].count),
          skills: parseInt(skillsResult.rows[0].count),
          certifications: parseInt(certificationsResult.rows[0].count),
          projects: parseInt(projectsResult.rows[0].count),
        }),
      };
    } catch (error) {
      console.error("❌ Error getting user dashboard:", error);
      throw error;
    }
  }

  // Calculate profile completeness percentage
  calculateProfileCompleteness(user, counts) {
    let score = 0;
    let totalFields = 0;

    // Basic profile fields (40% weight)
    const basicFields = [
      "firstName",
      "lastName",
      "phone",
      "city",
      "state",
      "jobTitle",
      "bio",
      "industry",
      "expLevel",
    ];

    basicFields.forEach((field) => {
      totalFields++;
      if (user[field] && user[field].trim() !== "") {
        score++;
      }
    });

    // Profile picture (10% weight)
    totalFields++;
    if (
      user.pfpLink &&
      user.pfpLink !==
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
    ) {
      score++;
    }

    // Content sections (50% weight)
    const contentSections = [
      "jobs",
      "education",
      "skills",
      "certifications",
      "projects",
    ];
    contentSections.forEach((section) => {
      totalFields++;
      if (counts[section] > 0) {
        score++;
      }
    });

    return Math.round((score / totalFields) * 100);
  }
}

export default new UserService();
