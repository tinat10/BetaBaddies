import app from "./server.js";
import dotenv from "dotenv";
import database from "./services/database.js";

async function main() {
  dotenv.config();
  const port = process.env.SERVER_PORT || 3001;

  try {
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
