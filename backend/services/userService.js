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
        INSERT INTO users (u_id, email, password, created_at, updated_at, auth_provider)
        VALUES ($1, $2, $3, NOW(), NOW(), 'local')
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

  // Create a new OAuth user (Google)
  async createOAuthUser(userData) {
    const { email, firstName, lastName, googleId } = userData;

    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const userId = uuidv4();

      // Create OAuth user in database (no password)
      const userQuery = `
        INSERT INTO users (u_id, email, password, created_at, updated_at, google_id, auth_provider)
        VALUES ($1, $2, NULL, NOW(), NOW(), $3, 'google')
        RETURNING u_id, email, created_at, updated_at, google_id, auth_provider
      `;

      const userResult = await database.query(userQuery, [
        userId,
        email,
        googleId,
      ]);

      return {
        id: userResult.rows[0].u_id,
        email: userResult.rows[0].email,
        googleId: userResult.rows[0].google_id,
        authProvider: userResult.rows[0].auth_provider,
        createdAt: userResult.rows[0].created_at,
        updatedAt: userResult.rows[0].updated_at,
      };
    } catch (error) {
      console.error("❌ Error creating OAuth user:", error);
      throw error;
    }
  }

  // Link Google account to existing user
  async linkGoogleAccount(userId, googleId) {
    try {
      const query = `
        UPDATE users 
        SET google_id = $2, updated_at = NOW()
        WHERE u_id = $1
        RETURNING u_id, email, google_id, auth_provider
      `;

      const result = await database.query(query, [userId, googleId]);

      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("❌ Error linking Google account:", error);
      throw error;
    }
  }

  // Get user by Google ID
  async getUserByGoogleId(googleId) {
    try {
      const query = `
        SELECT u_id, email, google_id, auth_provider, created_at, updated_at
        FROM users
        WHERE google_id = $1
      `;

      const result = await database.query(query, [googleId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error getting user by Google ID:", error);
      throw error;
    }
  }

  // Get user by email (authentication only)
  async getUserByEmail(email) {
    try {
      const query = `
        SELECT u_id, email, password, created_at, updated_at, google_id, auth_provider
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

  // Delete user account with password verification
  async deleteUser(userId, password) {
    try {
      // 1. Get user with password for verification
      const userQuery = `
        SELECT u_id, email, password
        FROM users
        WHERE u_id = $1
      `;
      const userResult = await database.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        throw new Error("User not found");
      }

      const user = userResult.rows[0];

      // 2. Verify password before deletion
      const isPasswordValid = await this.verifyPassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error(
          "Invalid password. Please check your password and try again."
        );
      }

      // 3. Delete user and all related records
      // Note: CASCADE DELETE is configured in database, so this will automatically
      // remove all related records (profiles, educations, skills, certifications, etc.)
      const deleteQuery = "DELETE FROM users WHERE u_id = $1 RETURNING email";
      const deleteResult = await database.query(deleteQuery, [userId]);

      if (deleteResult.rowCount === 0) {
        throw new Error("Failed to delete account");
      }

      // 4. Return user email for confirmation email
      return {
        email: user.email,
        deletedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      throw error;
    }
  }
}

export default new UserService();
