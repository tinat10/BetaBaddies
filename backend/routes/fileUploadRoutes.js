import express from "express";
import fileUploadController from "../controllers/fileUploadController.js";
import { isAuthenticated, csrfProtection } from "../middleware/auth.js";
import { validateFileId } from "../middleware/validation.js";

const router = express.Router();

// All file upload routes require authentication
router.use(isAuthenticated);

// Profile Picture Routes
router.post(
  "/profile-picture",
  csrfProtection,
  fileUploadController.uploadProfilePicture
);

router.get("/profile-picture", fileUploadController.getProfilePicture);

// Document Routes
router.post("/document", csrfProtection, fileUploadController.uploadDocument);

router.get("/documents", fileUploadController.getDocuments);

// Resume Routes
router.post("/resume", csrfProtection, fileUploadController.uploadResume);

router.get("/resumes", fileUploadController.getResumes);

// General File Routes
router.get("/", fileUploadController.getUserFiles);

router.get("/statistics", fileUploadController.getFileStatistics);

router.get("/:fileId", validateFileId, fileUploadController.getFileById);

router.get("/:fileId/content", validateFileId, fileUploadController.serveFile);

router.delete(
  "/:fileId",
  csrfProtection,
  validateFileId,
  fileUploadController.deleteFile
);

export default router;
