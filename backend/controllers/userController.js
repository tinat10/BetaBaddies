import userService from "../services/userService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import emailService from "../services/emailService.js";

class UserController {
  // Register a new user
  register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await userService.createUser({
        email,
        password,
      });

      // Set session
      req.session.userId = user.id;
      req.session.userEmail = user.email;

      res.status(201).json({
        ok: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
          },
          message: "User registered successfully",
        },
      });
    } catch (error) {
      if (error.message.includes("already exists")) {
        return res.status(409).json({
          ok: false,
          error: {
            code: "CONFLICT",
            message: "User with this email already exists",
          },
        });
      }
      throw error;
    }
  });

  // Login user
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        ok: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    const isValidPassword = await userService.verifyPassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        ok: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    // Set session
    req.session.userId = user.u_id;
    req.session.userEmail = user.email;

    res.status(200).json({
      ok: true,
      data: {
        user: {
          id: user.u_id,
          email: user.email,
        },
        message: "Login successful",
      },
    });
  });

  // Logout user
  logout = asyncHandler(async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Error destroying session:", err);
        return res.status(500).json({
          ok: false,
          error: {
            code: "LOGOUT_ERROR",
            message: "Failed to logout",
          },
        });
      }

      res.clearCookie("connect.sid");
      res.status(200).json({
        ok: true,
        data: {
          message: "Logout successful",
        },
      });
    });
  });

  // Get current user info (authentication only)
  getProfile = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        user: {
          id: user.u_id,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      },
    });
  });

  // Change password
  changePassword = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { currentPassword, newPassword } = req.body;

    // Get user with password for verification
    const user = await userService.getUserByEmail(req.session.userEmail);
    if (!user) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    const isValidPassword = await userService.verifyPassword(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        ok: false,
        error: {
          code: "INVALID_PASSWORD",
          message: "Current password is incorrect",
        },
      });
    }

    // Update password
    await userService.updatePassword(userId, newPassword);

    res.status(200).json({
      ok: true,
      data: {
        message: "Password updated successfully",
      },
    });
  });

  // Delete user account (UC-009)
  deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { password, confirmationText } = req.body;

    // Validate required fields
    if (!password) {
      return res.status(400).json({
        ok: false,
        error: {
          code: "PASSWORD_REQUIRED",
          message: "Password is required to delete account",
        },
      });
    }

    if (confirmationText !== "DELETE MY ACCOUNT") {
      return res.status(400).json({
        ok: false,
        error: {
          code: "CONFIRMATION_REQUIRED",
          message: 'You must type "DELETE MY ACCOUNT" to confirm deletion',
        },
      });
    }

    try {
      // Delete account (includes password verification)
      const result = await userService.deleteUser(userId, password);

      // Send confirmation email
      await emailService.sendAccountDeletionConfirmation(result.email);

      // Destroy session (logout user)
      req.session.destroy((err) => {
        if (err) {
          console.error("❌ Error destroying session:", err);
        }
      });

      // Clear session cookie
      res.clearCookie("connect.sid");

      // Send success response
      res.status(200).json({
        ok: true,
        data: {
          message: "Account deleted successfully",
          deletedAt: result.deletedAt,
        },
      });
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes("Invalid password")) {
        return res.status(401).json({
          ok: false,
          error: {
            code: "INVALID_PASSWORD",
            message: error.message,
          },
        });
      }
      throw error;
    }
  });
}

export default new UserController();
