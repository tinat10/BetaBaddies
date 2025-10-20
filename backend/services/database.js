import pkg from "pg";
const { Pool } = pkg;
import dbConfig from "../config/db.config.js";

class DatabaseService {
  constructor() {
    this.pool = new Pool(dbConfig);
    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });
    console.log("✅ DatabaseService initialized");
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log("📊 Executed query", {
        text: text.substring(0, 100) + "...",
        duration: `${duration}ms`,
        rows: res.rowCount,
      });
      return res;
    } catch (error) {
      console.error("❌ Database query error", {
        text: text.substring(0, 100) + "...",
        error: error.message,
      });
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async transaction(callback) {
    const client = await this.getClient();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async close() {
    console.log("🔄 Closing database pool...");
    await this.pool.end();
    console.log("✅ Database pool closed");
  }
}

export default new DatabaseService();
