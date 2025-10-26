import dotenv from "dotenv";
dotenv.config();

export default {
  user: process.env.DB_USER || "ats_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ats_tracker",
  password: process.env.DB_PASS || "ats_password",
  port: process.env.DB_PORT || 5432,
};
