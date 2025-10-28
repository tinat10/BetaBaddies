// File upload related types

export interface FileData {
  fileId: string;
  userId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  thumbnailPath?: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface ProfilePictureData {
  fileId?: string;
  filePath: string;
  thumbnailPath?: string | null;
  fileSize?: number;
  createdAt?: string;
  isDefault: boolean;
}

export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  filePath: string;
  thumbnailPath?: string;
  fileSize: number;
  message: string;
}

export interface FileStatistics {
  totalFiles: number;
  profilePics: number;
  resumes: number;
  documents: number;
  totalSize: number;
}

