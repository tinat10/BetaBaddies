import fileUploadService from "../services/fileUploadService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import multer from "multer";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

class FileUploadController {
  /**
   * Upload profile picture
   */
  uploadProfilePicture = [
    upload.single("profilePicture"),
    asyncHandler(async (req, res) => {
      const userId = req.session.userId;

      console.log("📸 Profile picture upload request received");
      console.log("   User ID:", userId);
      console.log("   File received:", req.file ? "Yes" : "No");

      if (!req.file) {
        return res.status(400).json({
          ok: false,
          error: {
            code: "NO_FILE",
            message: "No file provided",
          },
        });
      }

      console.log("   File name:", req.file.originalname);
      console.log("   File size:", req.file.size, "bytes");
      console.log("   File type:", req.file.mimetype);

      try {
        const result = await fileUploadService.uploadProfilePicture(
          userId,
          req.file
        );

        console.log("✅ Profile picture uploaded successfully");
        console.log("   File path:", result.filePath);

        res.status(201).json({
          ok: true,
          data: {
            ...result,
            message: "Profile picture uploaded successfully",
          },
        });
      } catch (error) {
        console.error("❌ Profile picture upload failed:", error);
        console.error("   Error stack:", error.stack);
        
        if (
          error.message.includes("File size exceeds") ||
          error.message.includes("File type") ||
          error.message.includes("not allowed")
        ) {
          return res.status(400).json({
            ok: false,
            error: {
              code: "VALIDATION_ERROR",
              message: error.message,
            },
          });
        }
        
        // Return a more specific error message
        return res.status(500).json({
          ok: false,
          error: {
            code: "UPLOAD_ERROR",
            message: error.message || "An unexpected error occurred during upload",
          },
        });
      }
    }),
  ];

  /**
   * Upload professional document
   */
  uploadDocument = [
    upload.single("document"),
    asyncHandler(async (req, res) => {
      const userId = req.session.userId;
      const { documentType } = req.body;

      if (!req.file) {
        return res.status(400).json({
          ok: false,
          error: {
            code: "NO_FILE",
            message: "No file provided",
          },
        });
      }

      try {
        const result = await fileUploadService.uploadDocument(
          userId,
          req.file,
          documentType || "general"
        );

        res.status(201).json({
          ok: true,
          data: {
            ...result,
            message: "Document uploaded successfully",
          },
        });
      } catch (error) {
        if (
          error.message.includes("File size exceeds") ||
          error.message.includes("File type") ||
          error.message.includes("not allowed")
        ) {
          return res.status(400).json({
            ok: false,
            error: {
              code: "VALIDATION_ERROR",
              message: error.message,
            },
          });
        }
        throw error;
      }
    }),
  ];

  /**
   * Upload resume
   */
  uploadResume = [
    upload.single("resume"),
    asyncHandler(async (req, res) => {
      const userId = req.session.userId;

      if (!req.file) {
        return res.status(400).json({
          ok: false,
          error: {
            code: "NO_FILE",
            message: "No file provided",
          },
        });
      }

      try {
        const result = await fileUploadService.uploadResume(userId, req.file);

        res.status(201).json({
          ok: true,
          data: {
            ...result,
            message: "Resume uploaded successfully",
          },
        });
      } catch (error) {
        if (
          error.message.includes("File size exceeds") ||
          error.message.includes("File type") ||
          error.message.includes("not allowed")
        ) {
          return res.status(400).json({
            ok: false,
            error: {
              code: "VALIDATION_ERROR",
              message: error.message,
            },
          });
        }
        throw error;
      }
    }),
  ];

  /**
   * Get user's files
   */
  getUserFiles = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { fileType } = req.query;

    const files = await fileUploadService.getUserFiles(userId, fileType);

    res.status(200).json({
      ok: true,
      data: {
        files,
        count: files.length,
      },
    });
  });

  /**
   * Get file by ID
   */
  getFileById = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { fileId } = req.params;

    try {
      const file = await fileUploadService.getFileById(fileId, userId);

      res.status(200).json({
        ok: true,
        data: {
          file,
        },
      });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          ok: false,
          error: {
            code: "FILE_NOT_FOUND",
            message: "File not found",
          },
        });
      }
      throw error;
    }
  });

  /**
   * Serve file content
   */
  serveFile = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { fileId } = req.params;

    try {
      const file = await fileUploadService.getFileById(fileId, userId);

      // Check if file exists on disk
      const fileExists = await fileUploadService.fileExists(file.filePath);
      if (!fileExists) {
        return res.status(404).json({
          ok: false,
          error: {
            code: "FILE_NOT_FOUND",
            message: "File not found on disk",
          },
        });
      }

      // Get file content
      const fileContent = await fileUploadService.getFileContent(file.filePath);

      // Set appropriate headers
      res.set({
        "Content-Type": file.mimeType,
        "Content-Length": file.fileSize,
        "Content-Disposition": `inline; filename="${file.originalName}"`,
      });

      res.send(fileContent);
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          ok: false,
          error: {
            code: "FILE_NOT_FOUND",
            message: "File not found",
          },
        });
      }
      throw error;
    }
  });

  /**
   * Delete file
   */
  deleteFile = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { fileId } = req.params;

    try {
      const result = await fileUploadService.deleteFile(fileId, userId);

      res.status(200).json({
        ok: true,
        data: {
          ...result,
        },
      });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          ok: false,
          error: {
            code: "FILE_NOT_FOUND",
            message: "File not found",
          },
        });
      }
      throw error;
    }
  });

  /**
   * Get file statistics
   */
  getFileStatistics = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const statistics = await fileUploadService.getFileStatistics(userId);

    res.status(200).json({
      ok: true,
      data: {
        statistics,
      },
    });
  });

  /**
   * Get user's profile picture
   */
  getProfilePicture = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    try {
      const files = await fileUploadService.getUserFiles(userId, "profile_pic");

      if (files.length === 0) {
        // Return default profile picture
        return res.status(200).json({
          ok: true,
          data: {
            profilePicture: {
              filePath:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
              thumbnailPath: null,
              isDefault: true,
            },
          },
        });
      }

      // Get the most recent profile picture
      const profilePicture = files[0];

      res.status(200).json({
        ok: true,
        data: {
          profilePicture: {
            fileId: profilePicture.fileId,
            filePath: profilePicture.filePath,
            thumbnailPath: profilePicture.thumbnailPath,
            fileSize: profilePicture.fileSize,
            createdAt: profilePicture.createdAt,
            isDefault: false,
          },
        },
      });
    } catch (error) {
      console.error("❌ Error getting profile picture:", error);
      throw error;
    }
  });

  /**
   * Get user's resumes
   */
  getResumes = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const resumes = await fileUploadService.getUserFiles(userId, "resume");

    res.status(200).json({
      ok: true,
      data: {
        resumes,
        count: resumes.length,
      },
    });
  });

  /**
   * Get user's documents
   */
  getDocuments = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { documentType } = req.query;

    let documents;
    if (documentType) {
      documents = await fileUploadService.getUserFiles(userId, documentType);
    } else {
      // Get all documents except profile pics and resumes
      const allFiles = await fileUploadService.getUserFiles(userId);
      documents = allFiles.filter(
        (file) => file.fileType !== "profile_pic" && file.fileType !== "resume"
      );
    }

    res.status(200).json({
      ok: true,
      data: {
        documents,
        count: documents.length,
      },
    });
  });
}

export default new FileUploadController();
