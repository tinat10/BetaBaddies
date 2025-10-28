import userService from "../services/userService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import emailService from "../services/emailService.js";
import passport from "../config/passport.js";

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

  // Forgot password - send reset email
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
      // Check if user exists
      const user = await userService.getUserByEmail(email);

      if (user) {
        // Generate reset token
        const resetToken = await userService.generateResetToken(user.u_id);

        // Send reset email
        await emailService.sendPasswordResetEmail(email, resetToken);
      }

      // Always return success message for security
      res.status(200).json({
        ok: true,
        data: {
          message:
            "If an account with that email exists, we've sent a password reset link.",
        },
      });
    } catch (error) {
      console.error("❌ Error in forgot password:", error);
      // Still return success for security
      res.status(200).json({
        ok: true,
        data: {
          message:
            "If an account with that email exists, we've sent a password reset link.",
        },
      });
    }
  });

  // Reset password with token
  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      // Verify token and reset password
      await userService.resetPasswordWithToken(token, newPassword);

      res.status(200).json({
        ok: true,
        data: {
          message:
            "Password has been reset successfully. You can now log in with your new password.",
        },
      });
    } catch (error) {
      if (error.message.includes("Invalid or expired token")) {
        return res.status(400).json({
          ok: false,
          error: {
            code: "INVALID_TOKEN",
            message:
              "Invalid or expired reset token. Please request a new password reset.",
          },
        });
      }
      throw error;
    }
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

  // Google OAuth - initiate authentication
  googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
  });

  // Google OAuth - handle callback
  googleCallback = passport.authenticate("google", { session: false });

  // Handle Google OAuth callback and create session
  handleGoogleCallback = asyncHandler(async (req, res, next) => {
    // After passport authenticates, req.user is populated
    if (!req.user) {
      return res.redirect("/login?error=oauth_failed");
    }

    // Create session
    req.session.userId = req.user.id;
    req.session.userEmail = req.user.email;

    // Redirect to frontend
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`
    );
  });

  // LinkedIn OAuth - initiate authentication
  linkedinAuth = passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  });

  // LinkedIn OAuth - handle callback
  linkedinCallback = passport.authenticate("linkedin", { session: false });

  // Handle LinkedIn OAuth callback and create session
  handleLinkedInCallback = asyncHandler(async (req, res, next) => {
    // After passport authenticates, req.user is populated
    if (!req.user) {
      return res.redirect("/login?error=oauth_failed");
    }

    // Create session
    req.session.userId = req.user.id;
    req.session.userEmail = req.user.email;

    // Redirect to frontend
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`
    );
  });

  // Fallback handler for LinkedIn OAuth when not configured
  linkedinAuthFallback = asyncHandler(async (req, res) => {
    res.status(503).json({
      ok: false,
      error: {
        code: "OAUTH_NOT_CONFIGURED",
        message:
          "LinkedIn OAuth is not configured. Please add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to your environment variables.",
      },
    });
  });
}

export default new UserController();
