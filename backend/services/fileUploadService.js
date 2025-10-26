import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import database from "./database.js";

// Try to import Sharp, but make it optional for older Node.js versions
let sharp = null;
try {
  sharp = await import("sharp");
  sharp = sharp.default;
} catch (error) {
  console.warn("⚠️ Sharp not available - image processing will be disabled");
}

class FileUploadService {
  constructor() {
    this.uploadDir = path.join(process.cwd(), "uploads");
    this.maxFileSizes = {
      profilePic: 5 * 1024 * 1024, // 5MB
      document: 10 * 1024 * 1024, // 10MB
      resume: 5 * 1024 * 1024, // 5MB
    };
    this.allowedTypes = {
      profilePic: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
      document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ],
      resume: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    };
    this.imageDimensions = {
      profilePic: { width: 300, height: 300 },
      thumbnail: { width: 150, height: 150 },
    };
  }

  /**
   * Upload a profile picture with automatic resizing
   */
  async uploadProfilePicture(userId, file) {
    try {
      // Validate file
      this.validateFile(file, "profilePic");

      // Generate unique filename
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const fileName = `profile_${fileId}${fileExtension}`;
      const filePath = path.join(this.uploadDir, "profile-pics", fileName);

      // Process and resize image
      await this.processImage(
        file.buffer,
        filePath,
        this.imageDimensions.profilePic
      );

      // Create thumbnail (only if Sharp is available)
      let thumbnailPath = null;
      if (sharp) {
        thumbnailPath = path.join(
          this.uploadDir,
          "profile-pics",
          `thumb_${fileName}`
        );
        await this.processImage(
          file.buffer,
          thumbnailPath,
          this.imageDimensions.thumbnail
        );
      }

      // Save file record to database
      const fileRecord = await this.saveFileRecord({
        fileId,
        userId,
        fileName,
        originalName: file.originalname,
        filePath: `/uploads/profile-pics/${fileName}`,
        thumbnailPath: thumbnailPath
          ? `/uploads/profile-pics/thumb_${fileName}`
          : null,
        fileType: "profile_pic",
        fileSize: file.size,
        mimeType: file.mimetype,
      });

      // Update user profile with new picture link
      await this.updateProfilePicture(userId, fileRecord.filePath);

      return {
        fileId: fileRecord.fileId,
        fileName: fileRecord.fileName,
        filePath: fileRecord.filePath,
        thumbnailPath: fileRecord.thumbnailPath,
        fileSize: fileRecord.fileSize,
        message: "Profile picture uploaded successfully",
      };
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
      throw error;
    }
  }

  /**
   * Upload a professional document
   */
  async uploadDocument(userId, file, documentType = "general") {
    try {
      // Validate file
      this.validateFile(file, "document");

      // Generate unique filename
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const fileName = `doc_${fileId}${fileExtension}`;
      const filePath = path.join(this.uploadDir, "documents", fileName);

      // Save file to disk
      await fs.writeFile(filePath, file.buffer);

      // Save file record to database
      const fileRecord = await this.saveFileRecord({
        fileId,
        userId,
        fileName,
        originalName: file.originalname,
        filePath: `/uploads/documents/${fileName}`,
        fileType: documentType,
        fileSize: file.size,
        mimeType: file.mimetype,
      });

      return {
        fileId: fileRecord.fileId,
        fileName: fileRecord.fileName,
        filePath: fileRecord.filePath,
        fileSize: fileRecord.fileSize,
        documentType: fileRecord.fileType,
        message: "Document uploaded successfully",
      };
    } catch (error) {
      console.error("❌ Error uploading document:", error);
      throw error;
    }
  }

  /**
   * Upload a resume
   */
  async uploadResume(userId, file) {
    try {
      // Validate file
      this.validateFile(file, "resume");

      // Generate unique filename
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const fileName = `resume_${fileId}${fileExtension}`;
      const filePath = path.join(this.uploadDir, "resumes", fileName);

      // Save file to disk
      await fs.writeFile(filePath, file.buffer);

      // Save file record to database
      const fileRecord = await this.saveFileRecord({
        fileId,
        userId,
        fileName,
        originalName: file.originalname,
        filePath: `/uploads/resumes/${fileName}`,
        fileType: "resume",
        fileSize: file.size,
        mimeType: file.mimetype,
      });

      return {
        fileId: fileRecord.fileId,
        fileName: fileRecord.fileName,
        filePath: fileRecord.filePath,
        fileSize: fileRecord.fileSize,
        message: "Resume uploaded successfully",
      };
    } catch (error) {
      console.error("❌ Error uploading resume:", error);
      throw error;
    }
  }

  /**
   * Get user's files by type
   */
  async getUserFiles(userId, fileType = null) {
    try {
      let query = `
        SELECT file_id, file_data, file_path
        FROM files
        WHERE file_data::jsonb->>'u' = $1
      `;
      const params = [userId];

      if (fileType) {
        query += ` AND file_data::jsonb->>'t' = $2`;
        params.push(fileType);
      }

      query += ` ORDER BY (file_data::jsonb->>'c') DESC`;

      const result = await database.query(query, params);
      return result.rows.map(this.mapFileFields);
    } catch (error) {
      console.error("❌ Error getting user files:", error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId, userId) {
    try {
      const query = `
        SELECT file_id, file_data, file_path
        FROM files
        WHERE file_id = $1 AND file_data::jsonb->>'u' = $2
      `;
      const result = await database.query(query, [fileId, userId]);

      if (result.rows.length === 0) {
        throw new Error("File not found");
      }

      return this.mapFileFields(result.rows[0]);
    } catch (error) {
      console.error(`❌ Error getting file by ID ${fileId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId, userId) {
    try {
      // Get file info first
      const file = await this.getFileById(fileId, userId);

      // Delete file from disk
      const fullPath = path.join(process.cwd(), file.filePath);
      try {
        await fs.unlink(fullPath);
      } catch (fsError) {
        console.warn(`⚠️ Could not delete file from disk: ${fsError.message}`);
      }

      // Delete thumbnail if exists
      if (file.thumbnailPath) {
        const thumbnailFullPath = path.join(process.cwd(), file.thumbnailPath);
        try {
          await fs.unlink(thumbnailFullPath);
        } catch (fsError) {
          console.warn(
            `⚠️ Could not delete thumbnail from disk: ${fsError.message}`
          );
        }
      }

      // Delete file record from database
      const query = `
        DELETE FROM files
        WHERE file_id = $1 AND file_data::jsonb->>'u' = $2
        RETURNING *
      `;
      const result = await database.query(query, [fileId, userId]);

      if (result.rows.length === 0) {
        throw new Error("File not found");
      }

      // If this was a profile picture, reset to default
      if (file.fileType === "profile_pic") {
        await this.resetProfilePicture(userId);
      }

      return { message: "File deleted successfully" };
    } catch (error) {
      console.error(`❌ Error deleting file ${fileId}:`, error);
      throw error;
    }
  }

  /**
   * Get file statistics for a user
   */
  async getFileStatistics(userId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_files,
          COUNT(CASE WHEN file_data::jsonb->>'t' = 'profile_pic' THEN 1 END) as profile_pics,
          COUNT(CASE WHEN file_data::jsonb->>'t' = 'resume' THEN 1 END) as resumes,
          COUNT(CASE WHEN file_data::jsonb->>'t' != 'profile_pic' AND file_data::jsonb->>'t' != 'resume' THEN 1 END) as documents,
          SUM((file_data::jsonb->>'s')::int) as total_size
        FROM files
        WHERE file_data::jsonb->>'u' = $1
      `;
      const result = await database.query(query, [userId]);
      const stats = result.rows[0];

      return {
        totalFiles: parseInt(stats.total_files, 10),
        profilePics: parseInt(stats.profile_pics, 10),
        resumes: parseInt(stats.resumes, 10),
        documents: parseInt(stats.documents, 10),
        totalSize: parseInt(stats.total_size || 0, 10),
      };
    } catch (error) {
      console.error("❌ Error getting file statistics:", error);
      throw error;
    }
  }

  /**
   * Validate file based on type and requirements
   */
  validateFile(file, fileCategory) {
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file size
    const maxSize = this.maxFileSizes[fileCategory];
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(
        `File size exceeds maximum allowed size of ${maxSizeMB}MB`
      );
    }

    // Check file type
    const allowedTypes = this.allowedTypes[fileCategory];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        `File type ${file.mimetype} is not allowed for ${fileCategory}`
      );
    }

    // Additional validation for images
    if (fileCategory === "profilePic") {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("Invalid image file");
      }
    }
  }

  /**
   * Process and resize image using Sharp (if available)
   */
  async processImage(buffer, outputPath, dimensions) {
    try {
      if (sharp) {
        await sharp(buffer)
          .resize(dimensions.width, dimensions.height, {
            fit: "cover",
            position: "center",
          })
          .jpeg({ quality: 90 })
          .toFile(outputPath);
      } else {
        // Fallback: just save the original image without processing
        console.warn(
          "⚠️ Sharp not available - saving original image without processing"
        );
        await fs.writeFile(outputPath, buffer);
      }
    } catch (error) {
      console.error("❌ Error processing image:", error);
      throw new Error("Failed to process image");
    }
  }

  /**
   * Save file record to database
   * Note: Using existing files table schema with limited columns
   */
  async saveFileRecord(fileData) {
    try {
      // Store minimal metadata in file_data as JSON (keeping under 255 chars)
      const metadata = {
        u: fileData.userId, // userId
        n: fileData.fileName, // fileName
        o: fileData.originalName, // originalName
        t: fileData.fileType, // fileType
        s: fileData.fileSize, // fileSize
        m: fileData.mimeType, // mimeType
        c: new Date().toISOString().split("T")[0], // createdAt (date only)
      };

      // Add thumbnail path only if it exists
      if (fileData.thumbnailPath) {
        metadata.th = fileData.thumbnailPath;
      }

      const query = `
        INSERT INTO files (file_id, file_data, file_path)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const result = await database.query(query, [
        fileData.fileId,
        JSON.stringify(metadata),
        fileData.filePath,
      ]);

      return this.mapFileFields(result.rows[0]);
    } catch (error) {
      console.error("❌ Error saving file record:", error);
      throw error;
    }
  }

  /**
   * Update user profile with new picture link
   */
  async updateProfilePicture(userId, picturePath) {
    try {
      const query = `
        UPDATE profiles
        SET pfp_link = $1
        WHERE user_id = $2
      `;
      await database.query(query, [picturePath, userId]);
    } catch (error) {
      console.error("❌ Error updating profile picture:", error);
      throw error;
    }
  }

  /**
   * Reset profile picture to default
   */
  async resetProfilePicture(userId) {
    try {
      const defaultPicture =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
      const query = `
        UPDATE profiles
        SET pfp_link = $1
        WHERE user_id = $2
      `;
      await database.query(query, [defaultPicture, userId]);
    } catch (error) {
      console.error("❌ Error resetting profile picture:", error);
      throw error;
    }
  }

  /**
   * Map database fields to service response format
   */
  mapFileFields(row) {
    const metadata = JSON.parse(row.file_data || "{}");
    return {
      fileId: row.file_id,
      userId: metadata.u,
      fileName: metadata.n,
      originalName: metadata.o,
      filePath: row.file_path,
      thumbnailPath: metadata.th,
      fileType: metadata.t,
      fileSize: metadata.s,
      mimeType: metadata.m,
      createdAt: metadata.c,
    };
  }

  /**
   * Get file content for serving
   */
  async getFileContent(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      return await fs.readFile(fullPath);
    } catch (error) {
      console.error(`❌ Error reading file ${filePath}:`, error);
      throw new Error("File not found");
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      await fs.access(fullPath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new FileUploadService();
