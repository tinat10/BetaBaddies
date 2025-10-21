import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import database from "./database.js";

class UserService {
  constructor() {
    this.saltRounds = 12;
  }

  // Create a new user (authentication only)
  async createUser(userData) {
    const { email, password } = userData;

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

  // Get user by email (authentication only)
  async getUserByEmail(email) {
    try {
      const query = `
        SELECT u_id, email, password, created_at, updated_at
        FROM users
        WHERE email = $1
      `;

      const result = await database.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error getting user by email:", error);
      throw error;
    }
  }

  // Get user by ID (authentication only)
  async getUserById(userId) {
    try {
      const query = `
        SELECT u_id, email, created_at, updated_at
        FROM users
        WHERE u_id = $1
      `;

      const result = await database.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error getting user by ID:", error);
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
}

export default new UserService();
