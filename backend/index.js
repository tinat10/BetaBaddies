// Load environment variables FIRST, before any other imports
import dotenv from "dotenv";
dotenv.config();

import app from "./server.js";
import database from "./services/database.js";
import {
  setupUploadDirectories,
  createGitkeepFiles,
} from "./utils/setupDirectories.js";

async function main() {
  const port = process.env.SERVER_PORT || 3001;

  try {
    // Setup upload directories
    await setupUploadDirectories();
    await createGitkeepFiles();

    // Test database connection
    await database.query("SELECT NOW()");
    console.log("✅ Success: Connected to PostgreSQL database");

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(
        `📊 Health check available at http://localhost:${port}/health`
      );
      console.log(`🔗 API base URL: http://localhost:${port}/api/v1`);
      console.log(`👤 User endpoints: http://localhost:${port}/api/v1/users`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Received SIGINT. Graceful shutdown...");
      await database.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("Received SIGTERM. Graceful shutdown...");
      await database.close();
      process.exit(0);
    });
  } catch (error) {
    console.error(
      "❌ Error: Could not connect to PostgreSQL database:",
      error.message
    );
    process.exit(1);
  }
}

main().catch(console.error);
