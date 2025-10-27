import profileService from "../services/profileService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class ProfileController {
  // Get current user's profile
  getProfile = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const profile = await profileService.getProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "NOT_FOUND",
          message: "Profile not found",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        profile,
      },
    });
  });

  // Create or update profile
  createOrUpdateProfile = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
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
    } = req.body;

    const profile = await profileService.createOrUpdateProfile(userId, {
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
    });

    const isNewProfile = !profile._alreadyExists;

    res.status(isNewProfile ? 201 : 200).json({
      ok: true,
      data: {
        profile,
        message: isNewProfile
          ? "Profile created successfully"
          : "Profile updated successfully",
      },
    });
  });

  // Update profile
  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
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
    } = req.body;

    const profile = await profileService.updateProfile(userId, {
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
    });

    res.status(200).json({
      ok: true,
      data: {
        profile,
        message: "Profile updated successfully",
      },
    });
  });

  // Update profile picture
  updateProfilePicture = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    // This would typically be called by the file upload service
    // after the file is successfully uploaded
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "File path is required",
        },
      });
    }

    const profile = await profileService.updateProfilePicture(userId, filePath);

    res.status(200).json({
      ok: true,
      data: {
        profile,
        message: "Profile picture updated successfully",
      },
    });
  });

  // Get profile picture path
  getProfilePicture = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const picturePath = await profileService.getProfilePicturePath(userId);

    if (!picturePath) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "NOT_FOUND",
          message: "Profile picture not found",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        picturePath,
      },
    });
  });

  // Get profile statistics
  getProfileStatistics = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const statistics = await profileService.getProfileStatistics(userId);

    res.status(200).json({
      ok: true,
      data: {
        statistics,
      },
    });
  });
}

export default new ProfileController();
