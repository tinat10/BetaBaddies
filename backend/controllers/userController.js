import userService from "../services/userService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class UserController {
  // Register a new user
  register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const user = await userService.createUser({
      firstName,
      lastName,
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
          firstName,
          lastName,
          createdAt: user.createdAt,
        },
        message: "User registered successfully",
      },
    });
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
          firstName: user.first_name,
          lastName: user.last_name,
          jobTitle: user.job_title,
          industry: user.industry,
          pfpLink: user.pfp_link,
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

  // Get current user profile
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
          firstName: user.first_name,
          middleName: user.middle_name,
          lastName: user.last_name,
          phone: user.phone,
          city: user.city,
          state: user.state,
          jobTitle: user.job_title,
          bio: user.bio,
          industry: user.industry,
          expLevel: user.exp_level,
          pfpLink: user.pfp_link,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      },
    });
  });

  // Update user profile
  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const profileData = req.body;

    const updatedProfile = await userService.updateUserProfile(
      userId,
      profileData
    );

    res.status(200).json({
      ok: true,
      data: {
        profile: updatedProfile,
        message: "Profile updated successfully",
      },
    });
  });

  // Change password
  changePassword = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { currentPassword, newPassword } = req.body;

    // Verify current password
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

  // Get user dashboard
  getDashboard = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const dashboard = await userService.getUserDashboard(userId);

    res.status(200).json({
      ok: true,
      data: dashboard,
    });
  });

  // Delete user account
  deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    await userService.deleteUser(userId);

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Error destroying session:", err);
      }
    });

    res.clearCookie("connect.sid");
    res.status(204).json({
      ok: true,
      data: {
        message: "Account deleted successfully",
      },
    });
  });

  // Get CSRF token
  getCSRFToken = asyncHandler(async (req, res) => {
    res.status(200).json({
      ok: true,
      data: {
        csrfToken: req.session.csrfToken,
      },
    });
  });
}

export default new UserController();
