import fs from "fs/promises";
import path from "path";

/**
 * Ensure all required upload directories exist
 * Creates them if they don't exist
 */
export async function setupUploadDirectories() {
  const baseUploadDir = path.join(process.cwd(), "uploads");

  const directories = [
    baseUploadDir,
    path.join(baseUploadDir, "profile-pics"),
    path.join(baseUploadDir, "documents"),
    path.join(baseUploadDir, "resumes"),
  ];

  console.log("📁 Setting up upload directories...");

  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`   ✓ Created/verified: ${path.relative(process.cwd(), dir)}`);
    } catch (error) {
      console.error(`   ❌ Failed to create directory ${dir}:`, error.message);
      throw error;
    }
  }

  console.log("✅ Upload directories ready");
}

/**
 * Create a .gitkeep file in a directory to ensure it's tracked by git
 * but ignore the actual uploaded files
 */
export async function createGitkeepFiles() {
  const directories = [
    path.join(process.cwd(), "uploads", "profile-pics"),
    path.join(process.cwd(), "uploads", "documents"),
    path.join(process.cwd(), "uploads", "resumes"),
  ];

  for (const dir of directories) {
    try {
      const gitkeepPath = path.join(dir, ".gitkeep");
      await fs.writeFile(gitkeepPath, "");
    } catch (error) {
      // Silently fail - not critical
    }
  }
}

