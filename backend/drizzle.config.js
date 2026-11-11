const path = require("path");
const dotenv = require("dotenv");
const { defineConfig } = require("drizzle-kit");

// Load shared .env from project root, with optional local fallback
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const projectName = process.env.PROJECT_NAME || "fullstack";
const defaultHost =
  process.env.NODE_ENV === "production" ? `${projectName}-mysql` : "localhost";
const dbHost = process.env.DB_HOST || defaultHost;
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASSWORD || "password";
const dbName = process.env.DB_NAME || "express_drizzle_db";

const dbUrl =
  process.env.DATABASE_URL ||
  `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

module.exports = defineConfig({
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: dbUrl,
  },
});
